<script setup>
// ReservaItem.vue — Una reserva de la lista. No cambia datos: avisa al padre con eventos ($emit).
import { formatoCOP } from "../utils/formato.js";

defineProps({
  reserva: { type: Object, required: true },
});
const emit = defineEmits(["confirmar", "cancelar"]);
</script>

<template>
  <li class="reserva">
    <strong>{{ reserva.cancha }}</strong>
    <span>{{ reserva.fecha }} · {{ reserva.inicio }} a {{ reserva.fin }} · {{ reserva.jugadores }} jugadores · {{ formatoCOP(reserva.total) }}</span>
    <span :class="['etiqueta', `etiqueta--${reserva.estado}`]">
      {{ reserva.estado === "confirmada" ? "Confirmada" : "Pendiente" }}
    </span>
    <button v-if="reserva.estado === 'pendiente'" type="button" class="btn btn-sm" @click="emit('confirmar', reserva.id)">
      Confirmar
    </button>
    <button type="button" class="btn btn-sm btn-outline" @click="emit('cancelar', reserva)">Cancelar</button>
  </li>
</template>
