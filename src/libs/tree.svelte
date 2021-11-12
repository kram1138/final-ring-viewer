<script lang="ts">
    import type { GroupInfo, MatchInfo } from "./data";

    export let groups: GroupInfo[];

    export let selection: GroupInfo[];

    $: selection = groups;

    let expanded = true;

    function toggleExpand(event: MouseEvent) {
        const element = event.target as HTMLElement;
        element.parentElement
            .querySelector(".nested-list")
            .classList.toggle("active");
    }

    function selectAll() {
        selection = groups;
    }

    function selectGroup(group: GroupInfo) {
        selection = [group];
    }

    function selectMatch(group: GroupInfo, match: MatchInfo) {
        selection = [{ ...group, matches: [match] }];
    }
</script>

<div class:collapsed={!expanded}>
    <button class="expand-button" on:click={() => (expanded = !expanded)}>
        {#if expanded}&#8592;{:else}&#8594;{/if}
    </button>
    {#if expanded}
        <button on:click={selectAll}>Select all</button>
        <ul class="active top-level">
            {#each groups as group}
                <li style="color: {group.color}">
                    <span class="caret" on:click={toggleExpand} />
                    <span
                        class="select-item"
                        on:click={() => selectGroup(group)}
                    >
                        {group.description}
                    </span>
                    <ul class="nested-list">
                        {#each group.matches as match}
                            <li>
                                <span class="caret" on:click={toggleExpand} />
                                <span
                                    class="select-item"
                                    on:click={() => selectMatch(group, match)}
                                >
                                    {match.description}
                                </span>
                                <ul class="nested-list">
                                    {#each match.games as games, i}
                                        <li>Game {i + 1}</li>
                                    {/each}
                                </ul>
                            </li>
                        {/each}
                    </ul>
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .top-level {
        width: 200px;
    }

    .caret {
        cursor: pointer;
        user-select: none;
    }

    .select-item {
        cursor: pointer;
        user-select: none;
    }

    .caret::before {
        content: "\25B6";
        color: black;
        display: inline-block;
        margin-right: 6px;
    }

    ul {
        list-style-type: none;
    }

    .nested-list {
        display: none;
    }

    .active {
        display: block;
    }

    .expand-button {
        float: right;
    }

    .collapsed {
        width: 56px;
    }
</style>
