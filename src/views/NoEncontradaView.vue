<script setup>
// NoEncontradaView.vue — Ruta comodín para direcciones que no existen
</script>

<template>
  <section class="no-encontrada" aria-labelledby="titulo-404">
    <p class="kicker">Error 404</p>
    <h1 id="titulo-404">Fuera de juego</h1>
    <p>La página que buscas no existe o cambió de lugar.</p>
    <RouterLink class="btn" to="/">Volver al inicio</RouterLink>
  </section>
</template>
