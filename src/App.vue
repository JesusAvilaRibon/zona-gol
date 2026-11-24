<script setup>
// App.vue — Estructura fija (header, main, footer). RouterView cambia la vista sin recargar.
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import AvisoToast from "./components/AvisoToast.vue";
</script>

<template>
  <a class="skip-link" href="#contenido" @click.prevent="$refs.principal.focus()">Saltar al contenido</a>
  <AppHeader />
  <main id="contenido" ref="principal" tabindex="-1">
    <RouterView />
  </main>
  <AppFooter />
  <AvisoToast />
  <a class="fab" href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp">
    <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
  </a>
</template>
