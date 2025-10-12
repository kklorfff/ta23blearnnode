<script setup>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { onMounted, useId, watch } from 'vue';

let { center, zoom } = defineProps(['center', 'zoom']);

let id = 'map-' + useId();
let map;
let rectangle;

onMounted(() => {
    map = L.map(id).setView(center, zoom);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    rectangle = L.polygon([
        [59.436574, 24.754919],
        [59.436574, 24.75500],
        [59.4701, 24.83300],
        [59.4701, 24.82800]
    ], {color: 'red', weight: 2}).addTo(map);
    L.circleMarker([59.4780, 24.8355], {radius: 15}).addTo(map)
});

watch(() => center, (newCenter) => {
    map.panTo(newCenter);
});

watch(() => zoom, (newZoom) => {
    map.setZoom(newZoom);
});
</script>

<template>
    <div :id="id"></div>
</template>

<style scoped>
div {
    height: 40vh;
}
</style>