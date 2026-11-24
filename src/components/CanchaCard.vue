<script setup>
// CanchaCard.vue — Tarjeta reutilizable de una cancha. Recibe la cancha por props.
import ListaHoras from "./ListaHoras.vue";
import { formatoCOP, foto } from "../utils/formato.js";

defineProps({
  cancha: { type: Object, required: true },
});
</script>

<template>
  <article class="card">
    <figure>
      <img
        :src="foto(cancha, 800, 520)"
        :srcset="`${foto(cancha, 480, 312)} 480w, ${foto(cancha, 800, 520)} 800w`"
        sizes="(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw"
        :alt="cancha.nombre"
        width="800"
        height="520"
        loading="lazy"
      >
      <figcaption class="badge">{{ cancha.capacidad }}</figcaption>
    </figure>
    <div class="card__body">
      <header class="card__head">
        <h3>{{ cancha.nombre }}</h3>
        <p class="price"><strong>{{ formatoCOP(cancha.precio) }}</strong> <small>/hora</small></p>
      </header>
      <h4>Horas disponibles</h4>
      <ListaHoras :horas="cancha.horas" :max="5" />
      <RouterLink class="btn btn-outline" :to="{ name: 'cancha', params: { id: cancha.id } }">Ver cancha</RouterLink>
    </div>
  </article>
</template>
