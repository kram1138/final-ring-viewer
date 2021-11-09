<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { dev } from "$app/env";

    export let allowEdit: boolean;
    export let regions: string[];
    export let points: string[];
    export let selectedRegion: string;
    export let selectedPoint: string;
    const dispatch = createEventDispatcher();
</script>

<div class="controls">
    <select
        bind:value={selectedRegion}
        on:change={() => dispatch("regionChange", selectedRegion)}
    >
        {#each regions as region}
            <option value={region}>
                {region}
            </option>
        {/each}
    </select>
    <select
        bind:value={selectedPoint}
        placeholder="Description"
        on:change={() => dispatch("descriptionChange", selectedPoint)}
    >
        {#each points as description}
            <option value={description}>
                {description}
            </option>
        {/each}
    </select>
    {#if dev}
        <button
            disabled={selectedRegion === "All"}
            on:click={() => dispatch("save")}>Save</button
        >
        <input
            class="checkbox"
            type="checkbox"
            id="edit"
            bind:checked={allowEdit}
        />
        <label for="edit"> Allow edit</label><br />
    {/if}
</div>

<style>
    .controls {
        display: flex;
        height: 50px;
        z-index: 1;
        position: absolute;
        top: 0;
        color: white;
        align-items: stretch;
    }

    .controls > * {
        font-size: 25px;
    }

    .checkbox {
        height: 100%;
        width: 50px;
        margin: 0;
    }
</style>
