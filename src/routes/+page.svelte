<script lang="ts">
    import Nav from '$cmp/layout/Nav.svelte';
    import Page from '$cmp/layout/Page.svelte';
    import {onMount} from "svelte";
    import ButtonLink from "$cmp/inputs/ButtonLink.svelte";
    import Icon from "$cmp/layout/Icon.svelte";
    import Button from "$cmp/inputs/Button.svelte";
    import Download from '~icons/fa6-solid/download.svelte';
    import Donate from '~icons/fa/Heart.svelte';
    import Github from "~icons/fa-brands/Github.svelte";
    import Column from "$cmp/layout/Column.svelte";
    import Row from "$cmp/layout/Row.svelte";
    import {installEventStore} from "$stores/userInstallEventStore";

    onMount(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault()
            console.log('beforeinstallprompt', e)
            $installEventStore = e
        })
    })
    import { serializeJsonLd, softwareApplicationLd } from '$lib/seo';
</script>

<svelte:head>
    <title>Tokeko — learn LR(1) and LALR parsers interactively</title>
    <meta name="description" content="Write your own grammar and watch an LR(1) or LALR parser build its FIRST and FOLLOW sets, automaton and parse tables, then trace how it parses your input, step by step."/>
    <meta property="og:title" content="Tokeko — learn LR(1) and LALR parsers interactively"/>
    <meta property="og:description" content="Write your own grammar and watch an LR(1) or LALR parser build its FIRST and FOLLOW sets, automaton and parse tables, then trace how it parses your input, step by step."/>
    {@html `<script type="application/ld+json">${serializeJsonLd(softwareApplicationLd())}</script>`}
</svelte:head>

<Nav/>
<Page padding="0" gap="1rem">
    <div class="content row">
        <div class="preview-image"/>
        <div class="presentation">
            <div class="presentation-content">
                <Column gap="1rem">
                    <h1 class="welcome-title textShadow">
                        Tokeko
                    </h1>
                    <div style="max-width: 30rem" class="text">
                        An educational platform designed to help users understand and learn about different types of
                        parsers, grammar structures, and parsing techniques. With interactive features, you can explore
                        complex parsing concepts in a visual and intuitive way.
                    </div>
                    <ul style="max-width: 30rem;" class="text">
                        <li>Write your own grammar and parse a language with either LR(1) or LALR1 parsers</li>
                        <li><a href="/docs/dotlr" style="color: var(--accent-15); font-weight: bold">Learn</a> how the parser is constructed, viewing the FIRST & FOLLOW and automaton tables/graphs
                        </li>
                        <li>View the steps needed to parse a string and the resulting parse tree</li>
                        <li>Editor with text completion and error reporting, useful error messages and traces</li>
                        <li>Typescript code runner to use the parser you created directly in the app!</li>
                    </ul>
                    <Column gap="0.5rem">
                        <div class="buttons">
                            <ButtonLink
                                    color="accent"
                                    href="/projects"
                                    style={'box-shadow: 0 3px 10px rgb(0 0 0 / 0.2)'}
                                    title="Open the editor"
                            >
                                Go to your projects
                            </ButtonLink>
                            <Row gap="0.6rem">
                                <ButtonLink
                                        style={'box-shadow: 0 3px 10px rgb(0 0 0 / 0.2); font-size: 1.2rem'}
                                        color="secondary"
                                        href="https://github.com/Specy/tokeko"
                                        title="Open the project on github"
                                >
                                    <Github/>
                                </ButtonLink>
                                <ButtonLink
                                        style={'box-shadow: 0 3px 10px rgb(0 0 0 / 0.2); font-size: 1.2rem'}
                                        color="secondary"
                                        href="https://specy.app/donate"
                                        title="Donate to the project"
                                >
                                    <Donate/>
                                </ButtonLink>
                            </Row>

                        </div>

                        {#if $installEventStore}
                            <Button
                                    style="gap: 0.5rem;"
                                    color="secondary"
                                    on:click={async () => {
							try {
								// @ts-ignore
								await $installEventStore.prompt()
							} catch (e) {
								console.error(e)
							}
							$installEventStore = null
						}}
                            >
                                <Icon>
                                    <Download/>
                                </Icon>
                                Install WebApp
                            </Button>
                        {:else}
                            <div style="height: 2.6rem">

                            </div>
                        {/if}
                    </Column>

                </Column>
            </div>
        </div>
    </div>
</Page>

<style lang="scss">
  .buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .content {
    display: flex;
    flex: 1;
    overflow: hidden;
    position: relative;
    border-radius: 0.45rem;
  }

  .presentation-content {
    padding: 0 5vw;
  }

  .welcome-title {
    font-size: 3rem;
    color: var(--primary-text);
  }

  .text {
    text-shadow: 2px 2px 6px black;
  }

  .presentation {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: center;
    background-color: rgba(var(--RGB-primary), 0.9);
    z-index: 2;
  }

  ul {
    margin-left: 1rem;

  }

  li {
    margin: 0.5rem 0;
    text-shadow: 2px 2px 10px black;
  }

  .preview-image {
    display: flex;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    background-image: url('/images/tokeko-result-wide.webp');
    mask: linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.05) 70%);
    filter: blur(1px);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  .container {
    max-width: 20rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .logo {
    width: 100%;
    border-radius: 0.8rem;
    aspect-ratio: 1;
  }

  .textShadow {
    text-shadow: 2px 2px 12px rgb(36 36 36);
  }

  .sections-wrapper {
    padding: 4rem 0;
    background-color: var(--primary);
    color: var(--primary-text);
  }

  @media screen and (max-width: 650px) {
    .content {
      width: 100%;
    }
    .welcome-title {
      font-size: 2.4rem;
    }
    .presentation-content {
      padding: 0 1rem;
    }
    .preview-image {
      mask: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.05) 70%);
      background-image: url('/images/tokeko-editor-narrow.webp');

    }
  }

</style>
