<script setup>
// AvisoToast.vue — Muestra el aviso guardado en el store de avisos
import { useAvisosStore } from "../stores/avisos.js";
const avisos = useAvisosStore();
</script>

<template>
  <Transition name="aparecer">
    <p v-if="avisos.texto" class="toast" role="status">{{ avisos.texto }}</p>
  </Transition>
</template>
