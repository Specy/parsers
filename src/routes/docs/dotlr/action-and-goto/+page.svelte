<script>
    import Page from "$cmp/layout/Page.svelte";
    import Card from "$cmp/layout/Card.svelte";
    import SyntaxHighlighter from "$cmp/SyntaxHighlighter.svelte";
</script>

<svelte:head>
    <title>
        Action & Goto
    </title>
    <meta name="description" content="The documentation of Tokeko: Action & Goto"/>
</svelte:head>


<Page cropped="70ch" padding='1rem' mobilePadding='1rem'>
    <p>The <b>ACTION</b> and <b>GOTO</b> tables
        are essential data structures that guide the parser through the parsing process. These tables are precomputed
        based on the grammar and the states of the LR(1) automaton. Together, they tell the parser whether to shift,
        reduce, accept, or transition to a new state based on the current state and input.</p>

    <h1>Action table</h1>
    <p>The <b>ACTION</b> table dictates how the parser should act based on the current state and the next
        input token (the lookahead). The possible actions include:</p>
    <ol>
        <li><b>Shift:</b> The parser reads the next token from the input and transitions to a new state.</li>
        <li><b>Reduce:</b> The parser recognizes a complete production (right-hand side of a grammar rule) and
            applies a reduction to substitute the rule&#39;s left-hand side.
        </li>
        <li><b>Accept:</b> The parser successfully recognizes the entire input and ends the parsing process.
        </li>
        <li><b>Error:</b> If no valid action is found, it indicates a syntax error in the input.</li>
    </ol>
    <p style="margin-top: 1rem">The <b>ACTION</b> table is indexed by a combination of:</p>
    <ul>
        <li><b>Current state</b> (which reflects the parser&#39;s current position in the input)</li>
        <li><b>Lookahead token</b> (the next token in the input)</li>
    </ul>
    <h2>Conditions for an ACTION in the table</h2>
    <ol>
        <li><p><b>Shift Action:</b></p>
            <p>If a state contains an item of the form <code>Anything -&gt; ... . token ...</code> (where the dot
                is before a token) and the token is in the input, the parser <b>shifts</b> to the next
                state specified by the transition for that token. This means the parser reads the token and moves
                forward.
            </p>
        </li>
        <li><p><b>Accept Action:</b></p>
            <p>If a state contains an item like <code>S -&gt; ... .</code> (where the dot is at the end of the
                rule), and the token is the end-of-input symbol (<code>$</code>), and the current item corresponds
                to the start symbol of the grammar, the parser <b>accepts</b> the input, indicating that
                it has successfully parsed the input string.
            </p>
        </li>
        <li><p><b>Reduce Action:</b></p>
            <p>If a state contains an item like <code>A -&gt; ... .</code> (where the dot is at the end of a rule),
                and the lookahead token matches the expected token, the parser <b>reduces</b> by applying
                the grammar rule. This involves replacing the right-hand side of the rule with its left-hand side
                (non-terminal) in the input stack.
            </p>
        </li>
    </ol>
    <h2>GOTO table</h2>
    <p>The <b>GOTO</b> table controls transitions between states based on non-terminal symbols. After a
        <b>reduce</b> operation (where a rule&#39;s right-hand side is reduced to its left-hand side
        non-terminal), the parser needs to transition to a new state based on the non-terminal that was just reduced.
    </p>
    <p style="margin-top: 1rem">The <b>GOTO</b> table is indexed by:</p>
    <ul>
        <li><b>Current state</b> (which reflects where the parser is after the reduction)</li>
        <li><b>Non-terminal symbol</b> (the left-hand side of the rule that was just reduced)</li>
    </ul>
    <h2>Conditions for a GOTO in the table</h2>
    <p>If a state contains an item of the form <code>Anything -&gt; ... . Symbol ...</code> (where the dot
        is before a non-terminal symbol), the parser follows the <b>GOTO</b> transition to the
        next state based on that non-terminal. This happens after a reduction, when the parser has
        recognized the non-terminal and needs to decide what to parse next.
    </p>

    <h2>Constructing the ACTION and GOTO tables</h2>
    <Card padding="1rem" style="overflow-x: auto;">
        <SyntaxHighlighter
                language="python"
                source={`# Initialize empty action tables
action_table = {}
goto_table = {}

# For each state in the automaton
for state in automaton.states:
    # Iterate over the items of the state
    for item in state.items:
        # If dot is at the end of the item
        if item.dot == len(item.rule.pattern):
            # S -> ... . <==> We can either reduce the rule or accept if S is a start symbol
            # ------------------------------------------------------------------------------

            # We can only perform actions for the tokens in the follow set of the symbol of the rule
            for following_token in follow_sets[item.rule.symbol]:
                # And only if the token is also in the lookahead of the item
                if following_token in item.lookahead:
                    # Finally, if the token is $ and matching rule is a start symbol
                    if following_token == $ and item.rule.symbol == grammar.start_symbol:
                        # We should accept
                        action_table[state, following_token].push(Accept(item.rule))
                    # Otherwise
                    else:
                        # We should reduce the matching rule
                        action_table[state, following_token].push(Reduce(item.rule))
        else:
            # We get the last atomic pattern
            atomic_pattern_after_dot = item.rule.pattern[item.dot]

            # And the transition on the atomic pattern from the automaton
            transition = state.transitions[atomic_pattern_after_dot]

            if atomic_pattern_after_dot.is_token:
                # S -> ... . '+' ... <==> We should shift and transition to another state
                #                         if the dot precedes a token
                # -------------------------------------------------------------------
                action_table[state, atomic_pattern_after_dot].push(Shift(transition))

            elif atomic_pattern_after_dot.is_symbol:
                # S -> ... . E ... <==> We should update GOTO table if the dot precedes a symbol
                #                       This can only happen after a reduction, and the parser
                #                       would look to GOTO table to determine the next state
                # --------------------------------------------------------------------------------
                goto_table[state, atomic_pattern_after_dot] = transition`}
        />
    </Card>
    <p style="margin-top: 1rem">
        For more info visit the <a href="https://github.com/umut-sahin/dotlr?tab=readme-ov-file#table-of-contents">dotlr</a> library docs
    </p>
</Page>

<style lang="scss">
  @import "../common.scss";
</style>