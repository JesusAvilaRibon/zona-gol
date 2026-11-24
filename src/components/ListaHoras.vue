<script setup>
// ListaHoras.vue — Chips con las horas disponibles (se usa en la tarjeta y en el detalle)
import { computed } from "vue";

const props = defineProps({
  horas: { type: Array, required: true },
  max: { type: Number, default: Infinity }, // cuántas mostrar antes del "+N"
});
const visibles = computed(() => props.horas.slice(0, props.max));
const restantes = computed(() => props.horas.length - visibles.value.length);
</script>

<template>
  <ul class="chips">
    <li v-for="hora in visibles" :key="hora"><time :datetime="hora">{{ hora }}</time></li>
    <li v-if="restantes > 0" class="chip--more">+{{ restantes }}</li>
  </ul>
</template>
