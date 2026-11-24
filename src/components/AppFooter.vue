<script setup>
// AppFooter.vue — Pie de página con enlaces, contacto y redes
const anio = new Date().getFullYear();
const redes = [
  { nombre: "Instagram", url: "https://www.instagram.com/", icono: "fa-instagram" },
  { nombre: "Facebook", url: "https://www.facebook.com/", icono: "fa-facebook-f" },
  { nombre: "TikTok", url: "https://www.tiktok.com/", icono: "fa-tiktok" },
];
</script>

<template>
  <footer class="site-footer">
    <section class="footer__brand" aria-label="Zona Gol">
      <RouterLink class="brand" to="/">
        <img src="../assets/img/logo.png" alt="Logo Zona Gol" width="40" height="40" loading="lazy">
        <span>Zona <em>Gol</em></span>
      </RouterLink>
      <p>La plataforma de reservas de canchas sintéticas en Sahagún, Córdoba.</p>
    </section>
    <nav aria-label="Pie de página">
      <h2>Navegación</h2>
      <ul>
        <li><RouterLink to="/">Inicio</RouterLink></li>
        <li><RouterLink to="/canchas">Canchas</RouterLink></li>
        <li><RouterLink to="/mis-reservas">Mis reservas</RouterLink></li>
        <li><RouterLink to="/nosotros">Nosotros</RouterLink></li>
        <li><RouterLink to="/contacto">Contacto</RouterLink></li>
      </ul>
    </nav>
    <section aria-label="Contacto y redes">
      <h2>Contacto</h2>
      <address>
        <a href="tel:+573001234567"><i class="fa-solid fa-phone" aria-hidden="true"></i> +57 300 123 4567</a>
        <span><i class="fa-solid fa-location-dot" aria-hidden="true"></i> Sahagún, Córdoba</span>
      </address>
      <ul class="social">
        <li v-for="red in redes" :key="red.nombre">
          <a :href="red.url" :aria-label="red.nombre" target="_blank" rel="noopener noreferrer">
            <i :class="['fa-brands', red.icono]" aria-hidden="true"></i>
          </a>
        </li>
      </ul>
    </section>
    <p class="footer__legal"><small>© {{ anio }} Zona Gol. Todos los derechos reservados. Sahagún, Córdoba · Colombia</small></p>
  </footer>
</template>
