<script setup>
// CanchasView.vue — Catálogo con filtros en tiempo real (sin recargar)
import { ref, computed, onMounted } from "vue";
import { useCanchasStore } from "../stores/canchas.js";
import CanchaCard from "../components/CanchaCard.vue";
import FiltrosCanchas from "../components/FiltrosCanchas.vue";
import EstadoCarga from "../components/EstadoCarga.vue";

const canchas = useCanchasStore();
onMounted(() => canchas.cargar());

const filtros = ref({ buscar: "", modalidad: "", precio: null });

// computed: se recalcula solo cuando cambian los filtros o la lista
const visibles = computed(() => {
  const { buscar, modalidad, precio } = filtros.value;
  const texto = buscar.trim().toLowerCase();
  return canchas.lista.filter(
    (c) =>
      c.nombre.toLowerCase().includes(texto) &&
      (!modalidad || c.capacidad === modalidad) &&
      (!precio || c.precio <= precio)
  );
});
</script>

<template>
  <section aria-labelledby="canchas-titulo">
    <header class="section-head">
      <p class="kicker">Sahagún, Córdoba</p>
      <h1 id="canchas-titulo">Canchas en Sahagún</h1>
    </header>

    <FiltrosCanchas v-model="filtros" :modalidades="canchas.modalidades" />

    <EstadoCarga :cargando="canchas.cargando" :error="canchas.error" texto="Cargando canchas…" @reintentar="canchas.cargar(true)" />

    <template v-if="!canchas.cargando && !canchas.error">
      <p class="estado" aria-live="polite">
        {{ visibles.length ? `${visibles.length} cancha(s) encontrada(s)` : "No hay canchas con esos filtros." }}
      </p>
      <div class="cards">
        <CanchaCard v-for="cancha in visibles" :key="cancha.id" :cancha="cancha" />
      </div>
    </template>
  </section>
</template>
