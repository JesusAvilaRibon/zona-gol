<script setup>
// InicioView.vue — Portada con hero y canchas destacadas
import { onMounted } from "vue";
import { useCanchasStore } from "../stores/canchas.js";
import CanchaCard from "../components/CanchaCard.vue";
import EstadoCarga from "../components/EstadoCarga.vue";

const canchas = useCanchasStore();
onMounted(() => canchas.cargar());
</script>

<template>
  <section class="hero" aria-labelledby="hero-titulo">
    <picture class="hero__bg">
      <img src="../assets/img/hero.jpg" alt="Cancha sintética de Zona Gol en Sahagún" width="1600" height="900" fetchpriority="high">
    </picture>
    <p class="hero__place"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> Sahagún, Córdoba</p>
    <h1 id="hero-titulo">Juega en <span>Grande.</span></h1>
    <p class="hero__text">Canchas sintéticas disponibles. Busca, compara y reserva en minutos.</p>
    <RouterLink class="btn btn-lg" to="/canchas">Buscar canchas <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></RouterLink>
  </section>

  <section aria-labelledby="canchas-titulo">
    <header class="section-head">
      <p class="kicker">Disponibles hoy</p>
      <h2 id="canchas-titulo">Canchas en Sahagún</h2>
    </header>
    <EstadoCarga :cargando="canchas.cargando" :error="canchas.error" texto="Cargando canchas…" @reintentar="canchas.cargar(true)" />
    <div v-if="canchas.lista.length" class="cards">
      <CanchaCard v-for="cancha in canchas.lista" :key="cancha.id" :cancha="cancha" />
    </div>
  </section>
</template>
