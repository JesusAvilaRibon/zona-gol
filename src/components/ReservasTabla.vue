<script setup>
// ReservasTabla.vue — Tabla reutilizable de reservas. Recibe los datos por props y emite las acciones.
import { formatoCOP } from "../utils/formato.js";

defineProps({
  reservas: { type: Array, required: true },
});
const emit = defineEmits(["confirmar", "cancelar"]);
</script>

<template>
  <div class="tabla-scroll">
    <table class="tabla">
      <thead>
        <tr>
          <th scope="col">Cancha</th>
          <th scope="col">Fecha</th>
          <th scope="col">Horario</th>
          <th scope="col">Jugadores</th>
          <th scope="col">Total</th>
          <th scope="col">Estado</th>
          <th scope="col"><span class="sr-only">Acciones</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in reservas" :key="r.id">
          <th scope="row">
            <RouterLink :to="{ name: 'cancha', params: { id: r.canchaId } }">{{ r.cancha }}</RouterLink>
          </th>
          <td>{{ r.fecha }}</td>
          <td>{{ r.inicio }} – {{ r.fin }}</td>
          <td>{{ r.jugadores }}</td>
          <td>{{ formatoCOP(r.total) }}</td>
          <td><span :class="['etiqueta', `etiqueta--${r.estado}`]">{{ r.estado === "confirmada" ? "Confirmada" : "Pendiente" }}</span></td>
          <td class="acciones">
            <button v-if="r.estado === 'pendiente'" type="button" class="btn btn-sm" @click="emit('confirmar', r.id)">Confirmar</button>
            <button type="button" class="btn btn-sm btn-outline" @click="emit('cancelar', r)">Cancelar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
