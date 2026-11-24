// main.js — Punto de entrada: crea la app de Vue y le conecta el router y Pinia
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/styles.css";

createApp(App)
  .use(createPinia()) // estado centralizado
  .use(router)        // navegación SPA
  .mount("#app");
