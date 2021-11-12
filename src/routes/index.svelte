<script context="module">
    export async function load({ fetch }) {
        const groupInfo = dev ? await loadAll(fetch) : endpoints;
        return {
            props: {
                groupInfo,
            },
        };
    }
</script>

<script lang="ts">
    import { dev } from "$app/env";
    import {
        Endpoint,
        EndpointMarker,
        GroupInfo,
        loadAll,
    } from "../libs/data";
    import Map from "../libs/map.svelte";
    import { endpoints } from "../libs/points";
    import Tree from "../libs/tree.svelte";

    export let groupInfo: GroupInfo[];

    let points: EndpointMarker[] = [];
    let selection: GroupInfo[] = [];

    function toMarker(color: string, group: string, match: string) {
        return (point: Endpoint, index: number): EndpointMarker => ({
            ...point,
            color,
            tooltip: `${group}, ${match}, Game ${index + 1}`,
        });
    }

    $: if (selection.length) {
        points = selection.flatMap(({ matches, description: group, color }) =>
            matches.flatMap(({ games, description: match }) =>
                games.map(toMarker(color, group, match))
            )
        );
    }
</script>

<div class="page-container">
    <Tree groups={groupInfo} bind:selection />
    <Map {points} />
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
