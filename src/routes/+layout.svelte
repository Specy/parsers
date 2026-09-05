<script lang="ts">
    import ThemeProvider from '$cmp/theme/ThemeProvider.svelte';
    import {currentTheme, themeStorage} from '$stores/themeStore';
    import ErrorLogger from '$cmp/ErrorLogger.svelte';
    import PageTransition from '$cmp/PageTransition.svelte';
    import {page} from '$app/stores';
    import '../global.css';
    import {onMount} from 'svelte';
    import NoiseOverlay from '$cmp/layout/NoiseOverlay.svelte';
    import PromptProvider from '$cmp/PromptProvider.svelte';
    import {registerServiceWorker} from '$src/lib/register-sw';
    import {toAbsoluteUrl} from '$lib/seo';

    onMount(() => {
        registerServiceWorker();
        themeStorage.load();
    });
</script>

<svelte:head>
    <link rel="canonical" href={toAbsoluteUrl($page.url.pathname)} />
    <meta property="og:url" content={toAbsoluteUrl($page.url.pathname)} />
    <meta property="og:site_name" content="Tokeko" />
    <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<ThemeProvider
        theme={currentTheme}
        style="color: var(--primary-text); flex: 1; background-color: var(--background);"
>
    <ErrorLogger>
        <PromptProvider>
            <PageTransition refresh={$page.url.pathname}/>
            <slot/>
        </PromptProvider>
    </ErrorLogger>
</ThemeProvider>
<NoiseOverlay opacity={0.08}/>
