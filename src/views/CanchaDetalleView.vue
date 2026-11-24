<script setup>
// CanchaDetalleView.vue — Detalle de una cancha. El router le pasa el id como prop (/canchas/2).
import { computed, onMounted, watchEffect } from "vue";
import { useCanchasStore } from "../stores/canchas.js";
import EstadoCarga from "../components/EstadoCarga.vue";
import ListaHoras from "../components/ListaHoras.vue";
import { formatoCOP, foto } from "../utils/formato.js";

const props = defineProps({
  id: { type: Number, required: true },
});

const canchas = useCanchasStore();
onMounted(() => canchas.cargar());

const cancha = computed(() => canchas.porId(props.id));
const noExiste = computed(() => !canchas.cargando && !canchas.error && canchas.lista.length > 0 && !cancha.value);

watchEffect(() => {
  if (cancha.value) document.title = `${cancha.value.nombre} | Zona Gol`;
});
</script>

<template>
  <section aria-live="polite">
    <RouterLink class="volver" to="/canchas"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Volver</RouterLink>

    <EstadoCarga :cargando="canchas.cargando" :error="canchas.error" texto="Cargando cancha…" @reintentar="canchas.cargar(true)" />

    <p v-if="noExiste" class="estado estado--error" role="alert">
      No encontramos la cancha #{{ id }} (código 404).
      <RouterLink class="btn btn-sm" to="/canchas">Ver todas las canchas</RouterLink>
    </p>

    <template v-else-if="cancha">
      <figure class="detalle__foto">
        <img :src="foto(cancha, 1200, 600)" :alt="cancha.nombre" width="1200" height="600">
      </figure>
      <div class="detalle">
        <article class="detalle__info">
          <h1>{{ cancha.nombre }}</h1>
          <ul class="datos">
            <li><i class="fa-solid fa-location-dot" aria-hidden="true"></i> {{ cancha.direccion }}</li>
            <li><i class="fa-solid fa-user" aria-hidden="true"></i> {{ cancha.propietario }} <small>({{ cancha.rol }})</small></li>
            <li>{{ cancha.capacidad }}</li>
          </ul>
          <p>{{ cancha.descripcion }}</p>
          <p class="horario"><strong>Horario</strong> {{ cancha.horario }}</p>
          <h2>Características</h2>
          <ul class="features">
            <li v-for="c in cancha.caracteristicas" :key="c">{{ c }}</li>
          </ul>
          <h2>Horas disponibles hoy</h2>
          <ListaHoras :horas="cancha.horas" />
        </article>
        <aside class="panel" aria-label="Reservar esta cancha">
          <p class="price"><strong>{{ formatoCOP(cancha.precio) }}</strong> <small>/hora</small></p>
          <RouterLink class="btn btn-lg" :to="{ name: 'reservar', query: { cancha: cancha.id } }">Reservar cancha</RouterLink>
          <p class="note">Confirmación en menos de 1 hora</p>
        </aside>
      </div>
    </template>
  </section>
</template>
