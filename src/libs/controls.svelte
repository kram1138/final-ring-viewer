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
        <span>
            <input
                class="checkbox"
                type="checkbox"
                id="edit"
                bind:checked={allowEdit}
            />
            <label for="edit"> Allow edit</label><br /></span
        >
    {/if}
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
