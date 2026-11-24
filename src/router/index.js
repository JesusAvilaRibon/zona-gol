// router/index.js — Rutas de la SPA (Vue Router)
import { createRouter, createWebHashHistory } from "vue-router";
import InicioView from "../views/InicioView.vue";

const routes = [
  { path: "/", name: "inicio", component: InicioView, meta: { titulo: "Inicio" } },
  // Las demás vistas se cargan bajo demanda (lazy loading): el build las separa en archivos pequeños
  { path: "/canchas", name: "canchas", component: () => import("../views/CanchasView.vue"), meta: { titulo: "Canchas" } },
  {
    path: "/canchas/:id(\\d+)", // solo números
    name: "cancha",
    component: () => import("../views/CanchaDetalleView.vue"),
    props: (ruta) => ({ id: Number(ruta.params.id) }), // el id llega como prop a la vista
    meta: { titulo: "Detalle de cancha" },
  },
  { path: "/reservar", name: "reservar", component: () => import("../views/ReservaView.vue"), meta: { titulo: "Reservar" } },
  { path: "/mis-reservas", name: "mis-reservas", component: () => import("../views/MisReservasView.vue"), meta: { titulo: "Mis reservas" } },
  { path: "/nosotros", name: "nosotros", component: () => import("../views/NosotrosView.vue"), meta: { titulo: "Nosotros" } },
  { path: "/contacto", name: "contacto", component: () => import("../views/ContactoView.vue"), meta: { titulo: "Contacto" } },
  { path: "/:ruta(.*)*", name: "no-encontrada", component: () => import("../views/NoEncontradaView.vue"), meta: { titulo: "Página no encontrada" } },
];

const router = createRouter({
  // Hash history (#/canchas): funciona en GitHub Pages sin configurar el servidor
  history: createWebHashHistory(),
  routes,
  linkActiveClass: "activo",
  scrollBehavior: () => ({ top: 0 }),
});

// Cambia el título de la pestaña en cada navegación
router.afterEach((ruta) => {
  document.title = ruta.name === "inicio" ? "Zona Gol" : `${ruta.meta.titulo} | Zona Gol`;
});

export default router;
