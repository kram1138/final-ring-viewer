<script lang="ts">
    import { browser } from "$app/env";
    import { createEventDispatcher } from "svelte";
    import type { GroupInfo } from "./data";
    import Modal, { getModal } from "./modal.svelte";

    const dispatch = createEventDispatcher();

    export let groups: GroupInfo[];
    export let allowEdit = false;

    export let selectedGroup: number | "all" = "all";
    export let selectedMatch: number | "all" = "all";
    export let selectedGame: number | "all" = "all";

    let matchDescription = "";
    let groupDescription = "";
    let color = "";

    let expanded = true;

    function toggleExpand(event: MouseEvent) {
        const element = event.target as HTMLElement;
        element.parentElement
            .querySelector(".nested-list")
            .classList.toggle("active");
    }

    function selectAll() {
        selectedGroup = "all";
        selectedMatch = "all";
        selectedGame = "all";
    }

    function selectGroup(index: number) {
        selectedGroup = index;
        selectedMatch = "all";
        selectedGame = "all";
    }

    function selectMatch(groupIndex: number, index: number) {
        selectedGroup = groupIndex;
        selectedMatch = index;
        selectedGame = "all";
    }

    function selectGame(groupIndex: number, matchIndex: number, index: number) {
        if (allowEdit) {
            selectedGroup = groupIndex;
            selectedMatch = matchIndex;
            selectedGame = index;
        }
    }
</script>

<div class:collapsed={!expanded}>
    <button class="expand-button" on:click={() => (expanded = !expanded)}>
        {#if expanded}&#8592;{:else}&#8594;{/if}
    </button>
    {#if expanded}
        <button on:click={selectAll}>Select all</button>
        <ul class="active top-level">
            {#each groups as group, groupIndex}
                <li style="color: {group.color}">
                    <span class="caret" on:click={toggleExpand} />
                    <span
                        class="select-item"
                        class:selected={selectedGroup === "all" ||
                            groupIndex === selectedGroup}
                        on:click={() => selectGroup(groupIndex)}
                    >
                        {group.description}
                    </span>
                    <ul class="nested-list">
                        {#each group.matches as match, matchIndex}
                            <li>
                                <span class="caret" on:click={toggleExpand} />
                                <span
                                    class="select-item"
                                    class:selected={(selectedGroup === "all" ||
                                        groupIndex === selectedGroup) &&
                                        (selectedMatch === "all" ||
                                            matchIndex === selectedMatch)}
                                    on:click={() =>
                                        selectMatch(groupIndex, matchIndex)}
                                >
                                    {match.description}
                                </span>
                                <ul class="nested-list">
                                    {#each match.games as _, i}
                                        <li
                                            class:selected={groupIndex ===
                                                selectedGroup &&
                                                matchIndex === selectedMatch &&
                                                i === selectedGame}
                                            on:click={() =>
                                                selectGame(
                                                    groupIndex,
                                                    matchIndex,
                                                    i
                                                )}
                                        >
                                            Game {i + 1}
                                        </li>
                                    {/each}
                                    {#if allowEdit}
                                        <li>
                                            <button
                                                class="add-button"
                                                on:click={() =>
                                                    dispatch("addGame", {
                                                        group,
                                                        match,
                                                    })}>+ Add game</button
                                            >
                                        </li>
                                    {/if}
                                </ul>
                            </li>
                        {/each}
                        {#if allowEdit}
                            <li>
                                <button
                                    on:click={() =>
                                        getModal("match").open((description) =>
                                            dispatch("addMatch", {
                                                group,
                                                description,
                                            })
                                        )}
                                    class="add-button">+ Add match</button
                                >
                            </li>
                        {/if}
                    </ul>
                </li>
            {/each}
            {#if allowEdit}
                <li>
                    <button
                        on:click={() =>
                            getModal("group").open(({ description, color }) =>
                                dispatch("addGroup", {
                                    color,
                                    description,
                                })
                            )}
                        class="add-button">+ Add group</button
                    >
                </li>
            {/if}
        </ul>
    {/if}
    <slot />
</div>

{#if browser}
    <Modal id="group">
        <span>Description</span>
        <input bind:value={groupDescription} />
        <span>Color</span>
        <input bind:value={color} />
        <button
            disabled={!groupDescription?.length || !color.length}
            on:click={() =>
                getModal("group").close({
                    description: groupDescription,
                    color,
                })}
        >
            Ok
        </button>
    </Modal>
    <Modal id="match">
        <span>Description</span>
        <input bind:value={matchDescription} />
        <button
            disabled={!matchDescription?.length}
            on:click={() => getModal("match").close(matchDescription)}
        >
            Ok
        </button>
    </Modal>
{/if}

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

    .selected {
        border-bottom: 1px solid gray;
    }

    .add-button {
        height: 24px;
        padding: 0;
        margin: 0;
        display: flex;
        background-color: transparent;
    }

    .add-button:hover {
        background-color: rgb(175, 175, 175);
    }
</style>
