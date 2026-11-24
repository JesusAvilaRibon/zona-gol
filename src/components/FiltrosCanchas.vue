<script setup>
// FiltrosCanchas.vue — Barra de filtros con comunicación bidireccional:
// el padre la usa con v-model="filtros"; el hijo recibe modelValue (prop) y emite update:modelValue.
const props = defineProps({
  modelValue: { type: Object, required: true },
  modalidades: { type: Array, default: () => [] },
});
const emit = defineEmits(["update:modelValue"]);

// Nunca se modifica la prop directamente: se emite una copia con el cambio
const cambiar = (campo, valor) => emit("update:modelValue", { ...props.modelValue, [campo]: valor });
const limpiar = () => emit("update:modelValue", { buscar: "", modalidad: "", precio: null });
</script>

<template>
  <form class="toolbar" role="search" aria-label="Filtrar canchas" @submit.prevent @reset.prevent="limpiar">
    <label class="field">
      <span>Buscar</span>
      <input
        type="search"
        placeholder="Nombre de la cancha"
        :value="modelValue.buscar"
        @input="cambiar('buscar', $event.target.value)"
      >
    </label>
    <label class="field">
      <span>Modalidad</span>
      <select :value="modelValue.modalidad" @change="cambiar('modalidad', $event.target.value)">
        <option value="">Todas</option>
        <option v-for="m in modalidades" :key="m" :value="m">{{ m }}</option>
      </select>
    </label>
    <label class="field">
      <span>Precio máximo</span>
      <input
        type="number"
        min="0"
        step="10000"
        placeholder="150000"
        :value="modelValue.precio"
        @input="cambiar('precio', $event.target.value === '' ? null : Number($event.target.value))"
      >
    </label>
    <button class="btn btn-outline" type="reset">Limpiar</button>
  </form>
</template>
