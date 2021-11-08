<script lang="ts">
    import type { Endpoint } from "./data";

    export let points: Record<string, Endpoint[]> = {};
    export let active: string;
</script>

    <div class="map">
        <img src="/worlds_edge.jpg" />

        {#each Object.entries(points) as [region, ps]}
            {#each ps as { pointX, pointY, circleX, circleY, description, color }, i}
                {#if circleX != null}
                    <div
                        class="final-circle"
                        style="left: {circleX}px; top: {circleY}px; border: 3px solid {color};"
                        class:active-circle={active === description}
                    >
                        <span class="description">{description}</span>
                    </div>
                {/if}
                {#if pointX != null}
                    <div
                        class="final-point"
                        style="left: {pointX}px; top: {pointY}px; background-color: {color};"
                        class:active-point={active === description}
                    />
                {/if}
            {/each}
        {/each}
    </div>

<style>

    .map {
        width: 100%;
        height: 100%;
    }

    .final-circle {
        position: absolute;
        border-radius: 50%;
        height: 191px;
        width: 191px;
        border: 3px solid blue;
        transform: translate(-50%, -50%);
        color: white;
        box-sizing: border-box;
        padding-top: 16px;
        text-align: center;
        pointer-events: none;
    }

    /* .description {
        visibility: hidden;
    }
    
    .final-circle:hover .description {
        visibility: visible;
    } */

    .final-point {
        position: absolute;
        border-radius: 50%;
        height: 16px;
        width: 16px;
        background-color: blue;
        transform: translate(-50%, -50%);
        pointer-events: none;
    }

    .active-circle {
        background-color: rgba(255, 255, 255, 0.308);
    }

    .active-point {
        background-color: rgb(255, 0, 221);
    }
</style>
