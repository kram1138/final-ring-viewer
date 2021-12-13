<script context="module">
    export async function load({ fetch }) {
        const allGroups = dev ? await loadAll(fetch) : endpoints;
        return {
            props: {
                allGroups,
            },
        };
    }
</script>

<script lang="ts">
    import { dev } from "$app/env";
    import { uniq } from "lodash-es";
    import {
        EndpointMarker,
        GroupInfo,
        groupsToPoints,
        loadAll,
        MatchInfo,
        Point,
        saveAll,
        toMarker,
        updateGroupInGroups,
        updateMatchInGroups,
    } from "../libs/data";
    import Map from "../libs/map.svelte";
    import { endpoints } from "../libs/points";
    import Tree from "../libs/tree.svelte";

    export let allGroups: GroupInfo[];

    let allowEdit = false;

    let points: EndpointMarker[] = [];
    let selectedGroup: number | "all" = "all";
    let selectedMatch: number | "all" = "all";
    let selectedGame: number | "all" = "all";
    let selectedWinner = "All";

    $: availableWinners = [
        "All",
        ...uniq(
            allGroups
                .flatMap((group) =>
                    group.matches.flatMap((match) =>
                        match.games.map((game) => game.winner)
                    )
                )
                .filter((winner) => winner?.length)
                .sort()
        ),
    ];

    $: if (selectedGroup === "all") {
        points = groupsToPoints(allGroups, selectedWinner);
    } else if (selectedMatch === "all") {
        points = groupsToPoints([allGroups[selectedGroup]], selectedWinner);
    } else {
        const group = allGroups[selectedGroup];
        const match = group.matches[selectedMatch];
        points = match.games
        .filter(game => selectedWinner === "All" || selectedWinner === game.winner)
        .map((point, i) =>
            toMarker(
                selectedGame === "all" || i !== selectedGame
                    ? group.color
                    : "white",
                group.description,
                match.description
            )(point, i)
        );
    }

    function mapClicked({ detail: { x, y } }: CustomEvent<Point>) {
        if (
            allowEdit &&
            selectedGame !== "all" &&
            selectedGroup !== "all" &&
            selectedMatch !== "all"
        ) {
            const game =
                allGroups[selectedGroup].matches[selectedMatch].games[
                    selectedGame
                ];
            game.pointX = x;
            game.pointY = y;
            allGroups = allGroups;
        }
    }

    function mapRightClicked({ detail: { x, y } }: CustomEvent<Point>) {
        if (
            allowEdit &&
            selectedGame !== "all" &&
            selectedGroup !== "all" &&
            selectedMatch !== "all"
        ) {
            const game =
                allGroups[selectedGroup].matches[selectedMatch].games[
                    selectedGame
                ];
            game.circleX = x;
            game.circleY = y;
            allGroups = allGroups;
        }
    }

    function addGroup({
        detail,
    }: CustomEvent<{ description: string; color: string }>) {
        const newGroup = {
            description: detail.description,
            color: detail.color,
            matches: [],
        };
        allGroups = [...allGroups, newGroup];
        selectedGroup = allGroups.length - 1;
        selectedMatch = "all";
        selectedGame = "all";
    }

    function addMatch({
        detail: { group, description },
    }: CustomEvent<{ group: GroupInfo; description: string }>) {
        const newMatch = {
            description,
            games: [],
        };
        allGroups = updateGroupInGroups(allGroups)({
            ...group,
            matches: [...group.matches, newMatch],
        });
        const groupIndex = allGroups.findIndex(
            (g) => g.description === group.description
        );
        selectedGroup = groupIndex;
        selectedMatch = group.matches.length;
        selectedGame = "all";
    }

    function addGame({
        detail: { match, group },
    }: CustomEvent<{ match: MatchInfo; group: GroupInfo }>) {
        allGroups = updateMatchInGroups(allGroups)(group, {
            ...match,
            games: [...match.games, {}],
        });

        const groupIndex = allGroups.findIndex(
            (g) => g.description === group.description
        );
        const matchIndex = group.matches.findIndex(
            (m) => m.description === match.description
        );
        selectedGroup = groupIndex;
        selectedMatch = matchIndex;
        selectedGame = match.games.length;
    }

    function keydown(event: KeyboardEvent) {
        if (allowEdit && selectedGame !== "all") {
            if (event.key === "ArrowDown") {
                selectedGame++;
            }
            if (event.key === "ArrowUp" && selectedGame > 0) {
                selectedGame--;
            }
        }
    }

    function save() {
        saveAll(fetch, allGroups);
    }
</script>

<svelte:window on:keydown={keydown} />
<div class="page-container">
    <Tree
        groups={allGroups}
        {allowEdit}
        bind:selectedGroup
        bind:selectedMatch
        bind:selectedGame
        on:addGroup={addGroup}
        on:addGame={addGame}
        on:addMatch={addMatch}
    >
        <label for="winner">Filter by winner:</label>

        <select bind:value={selectedWinner} name="winner" id="winner">
            {#each availableWinners as winner}
                <option value={winner}>{winner}</option>
            {/each}
        </select>
        {#if dev}
            <span>
                <input
                    class="checkbox"
                    type="checkbox"
                    id="edit"
                    bind:checked={allowEdit}
                />
                <label for="edit">Allow editing points</label>
            </span>
            <button on:click={save}>Save</button>
        {/if}
    </Tree>
    <Map
        {points}
        allowKeyboardNav={!allowEdit}
        on:mapClick={mapClicked}
        on:mapRightClick={mapRightClicked}
    />
</div>

<style>
    .page-container {
        display: flex;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        position: relative;
    }
</style>
