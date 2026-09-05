<script>
    import Page from "$cmp/layout/Page.svelte";
    import SyntaxHighlighter from "$cmp/SyntaxHighlighter.svelte";
    import Card from "$cmp/layout/Card.svelte";
</script>

<svelte:head>
    <title>
        First & Follow
    </title>
    <meta name="description" content="The documentation of Tokeko: First & Follow"/>
</svelte:head>

<Page cropped="70ch" padding='1rem' mobilePadding='1rem'>
    <h1>
        First set
    </h1>
    <p>The <b>FIRST set</b> of a symbol in a grammar is the set of tokens that can appear at the beginning of
        some string derived from that symbol. For each non-terminal symbol (e.g., <code>S</code>, <code>E</code>), the
        FIRST set includes:</p>
    <ol>
        <li><b>Terminal tokens</b> that appear first in any rule for that symbol.</li>
        <li><b>Tokens from the FIRST set of other symbols</b> if those symbols can appear first in the
            derivation.
        </li>
    </ol>
    <h2>
        Constructing the FIRST set
    </h2>
    <Card padding="1rem" style="overflow-x: auto;">
        <SyntaxHighlighter
                language="python"
                source={`# Start with FIRST(all_symbols) = {}
first_sets = {}

# Iterate until no more changes
while first_sets.has_changed():
    # Iterate over the rules of the grammar
    for rule in grammar:
        # If pattern of the rule starts with a token
        if rule.pattern[0].is_token:
            # S -> '+' ... <==> S can start with '+'
            # --------------------------------------
            # Add the matching token to the FIRST set of the symbol of the rule
            first_sets[rule.symbol].add(rule.pattern[0])

        # If pattern of the rule starts with a symbol
        elif rule.pattern[0].is_symbol:
            # S -> E ... <==> S can start with anything E can start with
            # ----------------------------------------------------------
            # Add every token in the FIRST set of the matching symbol
            # to the FIRST set of the symbol of the rule
            first_sets[rule.symbol].extend(first_sets[rule.pattern[0]])`}
        />
    </Card>

    <h2>
        Follow set
    </h2>

    <p>The <b>FOLLOW set</b> of a symbol in a grammar represents the set of tokens that can appear immediately
        after that symbol in some derivation of the grammar. This set is crucial for constructing parsers, particularly
        for handling situations like predictive parsing (LL parsers).</p>
    <ol>
        <li><b>End-of-input token (<code>$</code>)</b>: The start symbol always has <code>$</code> in its
            FOLLOW set since it should be followed by the end of the input.
        </li>
        <li><b>Tokens after a symbol</b>: If a symbol <code>S</code> is followed by some token <code>t</code>
            in a rule, <code>t</code> will be in the FOLLOW set of <code>S</code>.
        </li>
        <li><b>Tokens from FIRST sets</b>: If a symbol <code>S</code> is followed by another symbol
            <code>A</code>, and <code>A</code> can produce some token <code>t</code> (i.e., <code>t</code> is in the
            FIRST set of <code>A</code>), then <code>t</code> will also be in the FOLLOW set of <code>S</code>.
        </li>
        <li><b>Propagation from FOLLOW sets</b>: If a symbol <code>S</code> is followed by another symbol
            <code>A</code> at the end of a rule, then all tokens in the FOLLOW set of <code>A</code> are added to the
            FOLLOW set of <code>S</code>.
        </li>
    </ol>

    <h2>
        Constructing the FOLLOW set
    </h2>
    <Card padding="1rem" style="overflow-x: auto">
        <SyntaxHighlighter
                language="python"
                source={`# Start with just FOLLOW(grammar.start_symbol) = { $ }
follow_sets = { grammar.start_symbol: { $ } }

# Iterate until no more changes
while follow_sets.has_changed():
    # Iterate over the rules of the grammar
    for rule in grammar:
        # Iterate over the 2-windows of the pattern of the rule
        for i in range(len(rule.pattern) - 1):
            # If the first atomic pattern is a symbol
            if rule.pattern[i].is_symbol:
                # And if the second atomic pattern is a token
                if rule.pattern[i + 1].is_token:
                    # S -> ... E '+' ... <==> E can follow '+'
                    # ----------------------------------------
                    # Add the matching token to the FOLLOW set of the matching symbol
                    follow_sets[rule.pattern[i]].add(rule.pattern[i + 1])

                # Or if the second atomic pattern is a symbol
                elif rule.pattern[i + 1].is_symbol:
                    # S -> ... E F ... <==> E can follow anything F can start with
                    # ------------------------------------------------------------
                    # Add every token in the FIRST set of the second symbol
                    # to the FOLLOW set of the first symbol
                    follow_sets[rule.pattern[i]].extend(first_sets[rule.pattern[i + 1]])

        # If pattern of ends with a symbol
        if rule.pattern[-1].is_symbol:
            # S -> ... E <==> S can follow anything E can follow
            # --------------------------------------------------
            # Add every token in the FOLLOW set of the matching symbol
            # to the FOLLOW set of the symbol of the rule
            follow_sets[rule.symbol].extend(follow_sets[rule.patten[-1]])`}
        />
    </Card>
  <p style="margin-top: 1rem">
        For more info visit the <a href="https://github.com/umut-sahin/dotlr?tab=readme-ov-file#table-of-contents">dotlr</a> library docs
    </p>
</Page>

<style>
    @import "../common.scss";
</style>

