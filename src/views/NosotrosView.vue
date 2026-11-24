<script setup>
// NosotrosView.vue — Quiénes somos. Los beneficios y cifras se pintan con v-for.
const beneficios = [
  { titulo: "Reserva 24/7", texto: "Confirma tu cancha a cualquier hora desde tu celular." },
  { titulo: "Disponibilidad en tiempo real", texto: "Olvídate de esperar respuestas por mensaje." },
  { titulo: "Las mejores canchas", texto: "Selección de los mejores complejos deportivos de Sahagún." },
];
const cifras = [
  { valor: "+10", texto: "Canchas registradas" },
  { valor: "+100", texto: "Reservas realizadas con éxito" },
  { valor: "100%", texto: "Digital y sin comisiones ocultas" },
];
</script>

<template>
  <section aria-labelledby="nosotros-titulo">
    <header class="section-head">
      <p class="kicker">Nosotros</p>
      <h1 id="nosotros-titulo">Fútbol en Sahagún</h1>
    </header>
    <div class="split">
      <article class="prose">
        <p>Zona Gol es la plataforma de reservas de canchas sintéticas en Sahagún, Córdoba. Conectamos a los jugadores con las mejores canchas de la ciudad para que solo se preocupen por jugar.</p>
        <p>Reserva fácil, rápido y sin complicaciones. Solo busca, elige tu cancha y confirma tu hora.</p>
      </article>
      <RouterLink class="btn" to="/canchas">Ver canchas disponibles <span aria-hidden="true">→</span></RouterLink>
    </div>

    <aside class="why-us" aria-labelledby="why-title">
      <h2 id="why-title">¿Por qué elegir Zona Gol?</h2>
      <article v-for="b in beneficios" :key="b.titulo" class="benefit">
        <h3>{{ b.titulo }}</h3>
        <p>{{ b.texto }}</p>
      </article>
    </aside>
  </section>

  <section class="stats" aria-label="Estadísticas de Zona Gol">
    <article v-for="c in cifras" :key="c.texto" class="stat">
      <strong>{{ c.valor }}</strong>
      <p>{{ c.texto }}</p>
    </article>
  </section>
</template>
