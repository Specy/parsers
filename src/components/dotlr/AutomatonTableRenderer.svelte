<script lang="ts">
    import type {AtomicPattern, Automaton} from "@specy/dotlr/types";
    import {stringifyItem, stringifyLookahead, stringifyToken} from "$lib/dotlr/dotlrUtils";

    export let table: Automaton
    export let nonTerminals: string[]
    export let terminals: string[]
    export let regexes: string[]
    export let large = true
    export let noApos = false
    let selectedState = -1
    $: normalizedItems = [
        ...nonTerminals,
        ...terminals.map(t => `'${t}'`),
        ...regexes.map(r => `%${r}`)
    ]

    function normalizeTransition(transition: Map<AtomicPattern, number>) {
        const entries = transition.entries()
        const normalized = new Array(normalizedItems.length).fill("")
        for (const [pattern, id] of entries) {
            if (pattern.type === "Symbol") {
                const index = normalizedItems.findIndex(i => i === pattern.value)
                normalized[index] = id
            } else if (pattern.type === "Token") {
                const val = stringifyToken(pattern.value)
                if (val === undefined) continue
                const index = normalizedItems.findIndex(i => i === val)
                normalized[index] = id
            }
        }
        return normalized
    }

    const randomId = Math.floor(Math.random() * 1000)

    function highlightState(state: number) {
        const id = `state-${randomId}-${state}`
        const el = document.getElementById(id)
        if (!el) return
        el.scrollIntoView({behavior: 'smooth', block: 'center'})
        el.animate([
                {filter: 'brightness(1.1)'},
                {filter: 'brightness(0.5)'},
                {filter: 'brightness(1.1)'},
            ],
            {
                duration: 500,
                iterations: 3
            }
        )
    }

    function selectState(id: number) {
        if (selectedState === id) selectedState = -1
        else selectedState = id
    }
</script>

{#if large}
    <div
            class="table"
            style:--cols={nonTerminals.length + terminals.length + regexes.length + 3}
    >
        <div class="header-cell">State</div>
        <div class="header-cell">Items</div>
        <div class="header-cell">Lookaheads</div>
        {#each nonTerminals as nt}
            <div class="header-cell">{nt}</div>
        {/each}
        {#each terminals.map(i => noApos ? i : `'${i}'`)  as t}
            <div class="header-cell">{t}</div>
        {/each}
        {#each regexes as r}
            <div class="header-cell">%{r}</div>
        {/each}
        {#each table.states as state}
            <button
                    class:highlighted-item={selectedState === state.id}
                    on:click={() => selectState(state.id)}
                    class="header-cell hoverable-item state"
                    id="state-{randomId}-{state.id}"
            >
                {state.id}
            </button>
            <div class="body-cell-col">
                {#each state.items as item}
                    <div class="item" style="align-items: center">
                        {stringifyItem(item, noApos)}
                    </div>
                {/each}
            </div>
            <div class="body-cell-col">
                {#each state.items as item}
                    <div class="item">
                        {stringifyLookahead(item.lookahead, true)}
                    </div>
                {/each}
            </div>
            {#each normalizeTransition(state.transitions) as item}
                <button
                        class:highlighted-item={item === selectedState}
                        class:hoverable-item={item !== ''}
                        class="body-cell item-centered "
                        style="font-size: 1.2rem; align-items: center"
                        on:click={() => highlightState(item)}
                >
                    {item}
                </button>
            {/each}
        {/each}
    </div>
{:else}

{/if}


<style>
    .table {
        display: grid;
        width: fit-content;
        grid-template-columns: repeat(var(--cols), minmax(min-content, max-content));
        border: var(--background-5) solid 0.1rem;
        gap: 0.1rem;
        background: var(--background-5);
        border-radius: 0.5rem;
        overflow-x: auto;
    }


    .header-cell {
        text-align: center;
        padding: 0.2rem 2rem;
        font-weight: bold;
        background: var(--secondary-10);
        color: var(--secondary-text);
    }


    .body-cell, .body-cell-col {
        background: var(--secondary-10);
        color: var(--secondary-text);
        gap: 0.1rem;
        display: flex;
    }

    .body-cell-col {
        flex-direction: column;
    }

    .item, .item-centered {
        display: flex;
        flex: 1;
        gap: 0.1rem;
        padding: 0.3rem 1rem;
        background: var(--secondary);
        color: var(--secondary-text);
    }

    .item-centered {
        justify-content: center;

    }


    .hoverable-item {
        transition: background-color 0.3s;
        font-family: Rubik;
        cursor: pointer;
        font-size: 1rem;
    }


    .state {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
        padding: 0;
        border: solid 0.2rem transparent;
    }

    .hoverable-item:hover {
        background-color: var(--secondary-5);
    }

    .body-cell, .item, .header-cell {
        text-wrap: nowrap;
    }

    .highlighted-item {
        border: solid 0.2rem var(--accent);
        border-radius: 0.2rem;
    }
</style>