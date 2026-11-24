<script setup>
// EstadoCarga.vue — Muestra el loader o el error de una petición, con botón "Reintentar"
import { computed } from "vue";
import { describirError } from "../services/api.js";

const props = defineProps({
  cargando: { type: Boolean, default: false },
  error: { type: [Object, Error], default: null },
  texto: { type: String, default: "Cargando…" },
});
const emit = defineEmits(["reintentar"]);
const mensaje = computed(() => describirError(props.error));
</script>

<template>
  <p v-if="cargando" class="estado" role="status">
    <span class="spinner"></span> {{ texto }}
  </p>
  <p v-else-if="error" class="estado estado--error" role="alert">
    {{ mensaje }}
    <button type="button" class="btn btn-sm" @click="emit('reintentar')">Reintentar</button>
  </p>
</template>
