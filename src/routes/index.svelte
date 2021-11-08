<script context="module">
    export async function load({ fetch }) {
        const na = await fetch(`/points/NA`).then((r) => r.json());
        const emea = await fetch(`/points/EMEA`).then((r) => r.json());
        const apacn = await fetch(`/points/APAC N`).then((r) => r.json());
        const apacs = await fetch(`/points/APAC S`).then((r) => r.json());
        const sa = await fetch(`/points/SA`).then((r) => r.json());
        return {
            props: {
                points: [...na, ...emea, ...apacn, ...apacs, ...sa],
            },
        };
    }
</script>

<script lang="ts">
    import { browser } from "$app/env";
    const regions = ["NA", "EMEA", "APAC N", "APAC S", "SA", "Other"];
    let region = "NA";

    type EndPoint = {
        pointX?: number;
        pointY?: number;
        circleX?: number;
        circleY?: number;
        color?: string;
        description: string;
    };
    export let points: EndPoint[] = [{ description: "" }];
    let current = 0;

    function updateCurrent(update: (currentPoint: EndPoint) => EndPoint) {
        points[current] = update(points[current]);
        points = points;
    }

    function loadRegion() {
        current = 0;
        fetch(`/points/${region}`)
            .then((r) => r.json())
            .then((p) => (points = p));
    }

    function updatePoints() {
        if (
            browser &&
            points[current].circleX != null &&
            points[current].pointX != null
        ) {
            fetch(`/points/${region}`, {
                method: "PUT",
                body: JSON.stringify(points),
            });
        }
    }

    function addCircle(event: MouseEvent) {
        event.preventDefault();
        updateCurrent((point) => ({
            ...point,
            circleX: event.offsetX,
            circleY: event.offsetY,
        }));
    }

    function addPoint(event: MouseEvent) {
        event.preventDefault();
        updateCurrent((point) => ({
            ...point,
            pointX: event.offsetX,
            pointY: event.offsetY,
        }));
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "ArrowUp") {
            if (
                points[current].circleX != null &&
                points[current].pointX != null
            ) {
                if (!points[current + 1]) {
                    points = [
                        ...points,
                        {
                            description: points[current].description,
                        },
                    ];
                }
                current++;
            }
            event.preventDefault();
        }
        if (event.key === "ArrowDown") {
            if (current > 0) {
                current--;
            }
            event.preventDefault();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />
<div class="container">
    <div class="controls">
        <select bind:value={region} on:change={loadRegion}>
            {#each regions as region}
                <option value={region}>
                    {region}
                </option>
            {/each}
        </select>
        <input
            type="number"
            bind:value={current}
            min="0"
            max={points.length + 1}
        />
        <input
            bind:value={points[current].description}
            placeholder="Description"
        />
        <button on:click={updatePoints}>Save</button>
    </div>
    <div class="map">
        <img src="/test.jpg" on:contextmenu={addCircle} on:click={addPoint} />

        {#each points as { pointX, pointY, circleX, circleY, description, color }, i}
            {#if circleX != null}
                <div
                    class="final-circle"
                    class:active-circle={i === current}
                    style="left: {circleX}px; top: {circleY}px; border: 3px solid {color};"
                >
                    <span class="description">{description}</span>
                </div>
            {/if}
            {#if pointX != null}
                <div
                    class="final-point"
                    class:active-point={i === current}
                    style="left: {pointX}px; top: {pointY}px; background-color: {color};"
                />
            {/if}
        {/each}
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
    }

    .controls {
        display: flex;
        height: 150px;
    }

    .controls > * {
        font-size: 100px;
    }

    .map {
        position: relative;
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
