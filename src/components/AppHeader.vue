<script setup>
// AppHeader.vue — Barra de navegación con menú móvil y contador de reservas pendientes
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useReservasStore } from "../stores/reservas.js";

const reservas = useReservasStore(); // estado compartido: se actualiza desde cualquier vista
const abierto = ref(false);
const ruta = useRoute();

// Cierra el menú móvil al cambiar de página
watch(() => ruta.fullPath, () => (abierto.value = false));

const enlaces = [
  { to: "/", texto: "Inicio" },
  { to: "/canchas", texto: "Canchas" },
  { to: "/nosotros", texto: "Nosotros" },
  { to: "/contacto", texto: "Contacto" },
];
</script>

<template>
  <header class="site-header">
    <RouterLink class="brand" to="/">
      <img src="../assets/img/logo.png" alt="Logo Zona Gol" width="40" height="40">
      <span>Zona <em>Gol</em></span>
    </RouterLink>

    <button
      class="menu-toggle"
      type="button"
      aria-controls="menu"
      :aria-expanded="abierto"
      :aria-label="abierto ? 'Cerrar menú' : 'Abrir menú'"
      @click="abierto = !abierto"
    >
      <i :class="['fa-solid', abierto ? 'fa-xmark' : 'fa-bars']" aria-hidden="true"></i>
    </button>

    <nav id="menu" class="main-nav" :class="{ 'is-open': abierto }" aria-label="Principal">
      <ul>
        <li v-for="enlace in enlaces" :key="enlace.to">
          <!-- exact-active solo en Inicio, para que "/" no quede marcado en todas las rutas -->
          <RouterLink :to="enlace.to" :exact-active-class="enlace.to === '/' ? 'activo' : ''" :active-class="enlace.to === '/' ? '' : 'activo'">
            {{ enlace.texto }}
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/mis-reservas" class="mis-reservas-link">
            Mis reservas
            <span v-if="reservas.pendientes" class="contador" :aria-label="`${reservas.pendientes} pendientes`">{{ reservas.pendientes }}</span>
          </RouterLink>
        </li>
        <li><RouterLink class="btn btn-sm" to="/reservar">Reservar</RouterLink></li>
      </ul>
    </nav>
  </header>
</template>
