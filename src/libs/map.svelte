<script lang="ts">
    import type { LeafletMouseEvent, Map } from "leaflet";
    import { createEventDispatcher, onMount } from "svelte";
    import type { EndpointMarker } from "./data";
    const dispatch = createEventDispatcher();

    export let points: EndpointMarker[] = [];
    export let allowKeyboardNav = true;

    let elements: L.Circle[] = [];
    let mapElement: HTMLDivElement;
    let map: Map;

    onMount(() => {
        map = L.map(mapElement, {
            crs: L.CRS.Simple,
            minZoom: -2,
            maxZoom: 0,
        });
        const bounds = [
            [0, 0],
            [4096, 4096],
        ] as any;
        L.imageOverlay("worlds_edge.jpg", bounds).addTo(map);
        map.fitBounds(bounds);
        map.on("click", (event: LeafletMouseEvent) =>
            dispatch("mapClick", {
                x: event.latlng.lng,
                y: 4096 - event.latlng.lat,
            })
        );
        map.on("contextmenu", (event: LeafletMouseEvent) =>
            dispatch("mapRightClick", {
                x: event.latlng.lng,
                y: 4096 - event.latlng.lat,
            })
        );
    });

    $: if (map) {
        elements.forEach((layer) => layer.remove());
        elements = points.flatMap(
            ({ circleX, circleY, pointX, pointY, color, tooltip }) => [
                ...(circleX != null && circleY != null
                    ? [
                          L.circle([4096 - circleY, circleX], {
                              color: color ?? "blue",
                              fillOpacity: 0.1,
                              radius: 191 / 2,
                              weight: 1,
                          }).bindTooltip(tooltip),
                      ]
                    : []),
                ...(pointX != null && pointY != null
                    ? [
                          L.circle([4096 - pointY, pointX], {
                              color: color ?? "blue",
                              radius: 2,
                          }),
                      ]
                    : []),
            ]
        );
        elements.forEach((layer) => layer.addTo(map));
    }

    $: if (map) {
        allowKeyboardNav ? map.keyboard.enable() : map.keyboard.disable();
    }
</script>

<div class="map" class:no-grab={!allowKeyboardNav} bind:this={mapElement} />

<style>
    .map {
        width: 100%;
        height: 100%;
    }

    .no-grab {
        cursor: initial;
    }
</style>
