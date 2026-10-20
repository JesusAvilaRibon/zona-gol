document.documentElement.classList.add("js");

// Menú móvil (solo si existen los elementos)
const toggle = document.querySelector(".menu-toggle");
const menu = document.getElementById("menu");

if (toggle && menu) {
  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }
  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
}

// Fechas (solo si existen)
const fechaReserva = document.getElementById("fecha-reserva");
const fechaApertura = document.getElementById("fecha-apertura");
const hoy = new Date().toLocaleDateString("en-CA");
if (fechaReserva) fechaReserva.min = hoy;
if (fechaApertura) fechaApertura.max = hoy;

// Año del pie de página (solo si existe)
const anio = document.getElementById("anio");
if (anio) anio.textContent = new Date().getFullYear();