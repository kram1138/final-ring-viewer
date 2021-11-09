<script context="module">
    export async function load({ fetch }) {
        const allPoints = dev ? await loadAll(fetch) : endpoints;
        return {
            props: {
                allPoints,
            },
        };
    }
</script>

<script lang="ts">
    import { browser, dev } from "$app/env";
    import { Endpoint, loadAll, regions } from "../libs/data";
    import Map from "../libs/map.svelte";
    import Controls from "../libs/controls.svelte";
    import { forIn } from "lodash-es";
    import { endpoints } from "src/libs/points";

    export let allPoints: Record<string, Endpoint[]> = {};

    const regionOptions = ["All", ...regions];
    let selectedRegion = "All";
    let points: Record<string, Endpoint[]> = {};
    let currentPoint: Endpoint;
    let selectablePoints: string[];
    let allowEdit = false;
    // points = {
    //     "A": Array(180).fill(null).map((_, i) => {
    //         const x = Math.random() * 3200 + 400;
    //         const y = Math.random() * 3200 + 400;
    //         return {
    //             description: `${i}`,
    //             circleX: x,
    //             circleY: y,
    //             pointX: x,
    //             pointY: y
    //         }
    //     })
    // }
    $: {
        points =
            selectedRegion === "All"
                ? allPoints
                : { [selectedRegion]: allPoints[selectedRegion] };
    }

    $: {
        selectablePoints = (
            selectedRegion === "All"
                ? Object.entries(allPoints).flatMap(([, points]) => points)
                : allPoints[selectedRegion]
        ).map((point) => point.description);
    }

    $: if (
        selectedRegion !== "All" &&
        (!currentPoint ||
            !points[selectedRegion].some(
                (point) => point.description === currentPoint.description
            ))
    ) {
        currentPoint = points[Object.keys(points)[0]][0];
    }

    function updateCurrent(update: (currentPoint: Endpoint) => Endpoint) {
        currentPoint = update(currentPoint);
        allPoints[selectedRegion] = allPoints[selectedRegion].map((point) =>
            point.description === currentPoint.description
                ? currentPoint
                : point
        );
        allPoints = allPoints;
    }

    function save() {
        if (
            browser &&
            currentPoint.circleX != null &&
            currentPoint.pointX != null
        ) {
            fetch(`/points/${selectedRegion}`, {
                method: "PUT",
                body: JSON.stringify(points[selectedRegion]),
            });
        }
    }

    function addCircle(event: MouseEvent) {
        if (selectedRegion === "All" || !allowEdit) {
            return;
        }
        event.preventDefault();
        updateCurrent((point) => ({
            ...point,
            circleX: event.offsetX,
            circleY: event.offsetY,
        }));
    }

    function addPoint(event: MouseEvent) {
        if (selectedRegion === "All" || !allowEdit) {
            return;
        }
        event.preventDefault();
        updateCurrent((point) => ({
            ...point,
            pointX: event.offsetX,
            pointY: event.offsetY,
        }));
    }

    function changeSelectedPoint({ detail }: CustomEvent<string>) {
        this.currentPoint = forIn(allPoints, (points) =>
            points.forEach((point) => {
                if (point.description === detail) {
                    currentPoint = point;
                }
            })
        );
    }

    function handleKeydown(event: KeyboardEvent) {
        if (selectedRegion === "All") {
            return;
        }

        if (event.key === "ArrowUp") {
            const current = allPoints[selectedRegion].indexOf(currentPoint);
            if (
                currentPoint.circleX != null &&
                currentPoint.pointX != null &&
                current < allPoints[selectedRegion].length - 1
            ) {
                currentPoint = allPoints[selectedRegion][current + 1];
            }
            event.preventDefault();
        }
        if (event.key === "ArrowDown") {
            const current = points[selectedRegion].indexOf(currentPoint);
            if (current > 0) {
                currentPoint = allPoints[selectedRegion][current - 1];
            }
            event.preventDefault();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />
<Controls
    bind:allowEdit
    regions={regionOptions}
    points={selectablePoints}
    selectedPoint={currentPoint?.description}
    on:descriptionChange={changeSelectedPoint}
    on:save={save}
    bind:selectedRegion
/>
<div class="container" on:click={addPoint} on:contextmenu={addCircle}>
    <Map {points} active={currentPoint?.description} />
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        overflow: auto;
        position: relative;
    }
</style>
