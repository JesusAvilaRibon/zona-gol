<script setup>
// MisReservasView.vue — Gestión de reservas en tabla. Lee el MISMO store que el formulario de reserva.
import { ref, computed } from "vue";
import { useReservasStore } from "../stores/reservas.js";
import { useAvisosStore } from "../stores/avisos.js";
import { formatoCOP } from "../utils/formato.js";
import ReservasTabla from "../components/ReservasTabla.vue";
import ModalConfirmar from "../components/ModalConfirmar.vue";

const reservas = useReservasStore();
const { avisar } = useAvisosStore();

const filtro = ref("todas");
const opciones = [
  { valor: "todas", texto: "Todas" },
  { valor: "pendiente", texto: "Pendientes" },
  { valor: "confirmada", texto: "Confirmadas" },
];
const visibles = computed(() =>
  [...reservas.lista]
    .filter((r) => filtro.value === "todas" || r.estado === filtro.value)
    .sort((a, b) => (a.fecha + a.inicio).localeCompare(b.fecha + b.inicio))
);

const porCancelar = ref(null);
function cancelar() {
  reservas.cancelar(porCancelar.value.id);
  porCancelar.value = null;
  avisar("Reserva cancelada.");
}
</script>

<template>
  <section aria-labelledby="mis-titulo">
    <header class="section-head">
      <p class="kicker">Gestión</p>
      <h1 id="mis-titulo">Mis reservas</h1>
    </header>

    <div v-if="reservas.lista.length">
      <ul class="stats resumen-reservas">
        <li class="stat"><strong>{{ reservas.lista.length }}</strong><p>Reservas en total</p></li>
        <li class="stat"><strong>{{ reservas.pendientes }}</strong><p>Pendientes</p></li>
        <li class="stat"><strong>{{ formatoCOP(reservas.totalConfirmado) }}</strong><p>Total confirmado</p></li>
      </ul>

      <fieldset class="toolbar filtro-estado">
        <legend class="sr-only">Filtrar por estado</legend>
        <label v-for="o in opciones" :key="o.valor" :class="['chip-radio', { activo: filtro === o.valor }]">
          <input v-model="filtro" type="radio" name="estado" :value="o.valor" class="sr-only">
          {{ o.texto }}
        </label>
      </fieldset>

      <ReservasTabla v-if="visibles.length" :reservas="visibles" @confirmar="reservas.confirmar" @cancelar="porCancelar = $event" />
      <p v-else class="estado">No hay reservas {{ filtro === "pendiente" ? "pendientes" : "confirmadas" }}.</p>
    </div>

    <div v-else class="vacio panel">
      <p>Aún no tienes reservas guardadas.</p>
      <RouterLink class="btn" to="/reservar">Hacer mi primera reserva</RouterLink>
    </div>

    <ModalConfirmar :abierto="Boolean(porCancelar)" titulo="¿Cancelar la reserva?" texto-confirmar="Sí, cancelar" @cerrar="porCancelar = null" @confirmar="cancelar">
      <p v-if="porCancelar">{{ porCancelar.cancha }} · {{ porCancelar.fecha }} de {{ porCancelar.inicio }} a {{ porCancelar.fin }}. Esta acción no se puede deshacer.</p>
    </ModalConfirmar>
  </section>
</template>
