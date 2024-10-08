import {browser} from '$app/environment';
import {generateTheme} from '$lib/theme/editorTheme';
import type monaco from 'monaco-editor'
import {
    createDotlrCompletion,
    createDotlrFormatter,
    createDotlrHoverProvider,
    createDotlrRuntimeDiagnostics,
    DotlrLanguage
} from "$lib/dotlr/DotlrLanguage";
import {Grammar} from "@specy/dotlr";
import {DOTLR_TYPES_STRING, getTsGlobal} from "$lib/dotlr/dotlrTypesString";


export type MonacoType = typeof monaco

class MonacoLoader {
    private monaco: MonacoType;
    loading: Promise<{
        monaco: MonacoType,
    }>;
    toDispose: monaco.IDisposable[] = [];

    constructor() {
        if (browser) this.load()
    }

    dispose = () => {
        this.toDispose.forEach(d => d.dispose())
    }

    async typescriptToJavascript(code: string) {
        const model = this.monaco.editor.createModel(code, 'typescript')
        const worker = await this.monaco.languages.typescript.getTypeScriptWorker()
        return worker(model.uri).then((client) => {
            return client.getEmitOutput(model.uri.toString()).then((result) => {
                model.dispose()
                return result.outputFiles[0].text
            })
        })
    }


    async load(): Promise<{ monaco: MonacoType }> {
        if (this.loading) return this.loading
        this.loading = new Promise(async res => {
            const [monaco] = await Promise.all([
                import('monaco-editor'),
            ])
            res({monaco})
        })
        const {monaco} = await this.loading
        this.monaco = monaco
        monaco.editor.defineTheme('custom-theme', generateTheme())
        monaco.languages.register({id: 'dotlr'})
        monaco.languages.register({id: 'dotlr-result'})
        this.monaco = monaco
        monaco.languages.typescript.typescriptDefaults.addExtraLib(getTsGlobal(), 'global.d.ts')
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            strict: true,
            noImplicitAny: true,
            strictNullChecks: true,
            strictFunctionTypes: true,
        });
        this.registerLanguages()
        self.MonacoEnvironment = {
            getWorker: async function (_, label) {
                if (label === 'typescript' || label === 'javascript') {
                    const worker = await import('monaco-editor/esm/vs/language/typescript/ts.worker?worker')
                    return new worker.default()
                }
                const worker = await import('monaco-editor/esm/vs/editor/editor.worker?worker')
                return new worker.default()
            }
        }
        return {monaco}
    }

    setRuntimeGrammar(grammar: string) {
        const libs = this.monaco.languages.typescript.typescriptDefaults.getExtraLibs()
        const ts = getTsGlobal(grammar)
        if(libs['global.d.ts']?.content !== ts){
            this.monaco.languages.typescript.typescriptDefaults.addExtraLib(ts, 'global.d.ts')
        }
    }

    setTheme = (theme: string) => {
        this.monaco.editor.setTheme(theme)
    }
    setCustomTheme = (theme: monaco.editor.IStandaloneThemeData) => {
        this.monaco.editor.defineTheme('custom-theme', theme)
        this.monaco.editor.setTheme('custom-theme')
    }
    registerLanguages = () => {
        this.dispose()
        const {monaco} = this
        if (!monaco) return
        //@ts-expect-error - Language works
        this.toDispose.push(monaco.languages.setMonarchTokensProvider('dotlr', DotlrLanguage))
        this.toDispose.push(monaco.languages.registerDocumentFormattingEditProvider('dotlr', createDotlrFormatter()))
        this.toDispose.push(monaco.languages.registerHoverProvider('dotlr', createDotlrHoverProvider()))
        this.toDispose.push(monaco.languages.registerCompletionItemProvider('dotlr', createDotlrCompletion()))

    }

    registerRuntimePushers = (language: 'dotlr' | 'dotlr-result' | "typescript", instance: monaco.editor.ITextModel) => {
        if (language === 'dotlr') {
            const disposer = createDotlrRuntimeDiagnostics(instance)
            return () => disposer.dispose()
        }
        return () => {
        }
    }


    async get() {
        if (this.monaco) return this.monaco
        await this.load()
        return this.monaco
    }
}





export const Monaco = new MonacoLoader()