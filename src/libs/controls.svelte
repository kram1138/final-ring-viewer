<script lang="ts">
    import { browser } from "$app/env";
    import { createEventDispatcher } from "svelte";
    import Modal, { getModal } from "./modal.svelte";

    const dispatch = createEventDispatcher();

    export let allowEdit: boolean;
    export let allowAddMatch: boolean;
    export let allowAddGame: boolean;
    let groupDescription = "";
    let matchDescription = "";
    let color = "blue";
</script>

<div class="controls">
    <button
        on:click={() =>
            getModal("group").open((result) => dispatch("addGroup", result))}
    >
        Add group
    </button>
    <button
        disabled={!allowAddMatch}
        on:click={() =>
            getModal("match").open((result) => dispatch("addMatch", result))}
        >Add match</button
    >
    <button disabled={!allowAddGame} on:click={() => dispatch("addGame")}>
        Add game
    </button>
    <button on:click={() => dispatch("save")}>Save</button>
</div>


<style>
    .controls {
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    span {
        display: flex;
        align-items: center;
    }
</style>
