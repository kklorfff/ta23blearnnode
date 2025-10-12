
<script setup>
import { ref } from 'vue';
import LeafletMap from '../components/Map.vue';

let coords = ref([59.42691, 24.74344]);
let coords_p = ref([59.42691, 24.74344]);
let zoom = ref(19);
</script>
<template>
    <button class="button is-primary mr-3" @click="coords_p=[59.436574, 24.754919]">Go to Viru Keskus</button>
    <button class="button is-primary" @click="coords=[58.378003935892494, 26.727245723399832]">Go to Tartu Kaubamaja</button>
    <input type="range" min="1" max="19" step="1" v-model="zoom">
    <LeafletMap :center="coords" :zoom="zoom"></LeafletMap>
    <LeafletMap :center="coords_p" :zoom="zoom"></LeafletMap>
</template>
