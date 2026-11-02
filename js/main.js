// main.js — Punto de entrada. Detecta en qué página estamos y activa lo que corresponde.

import { obtenerCanchas, obtenerCancha, enviarContacto } from "./api.js";
import { leer, agregar, actualizar, eliminar, recordarBorrador, borrarBorrador } from "./storage.js";
import { activarValidacion, validarFormulario, limpiarValidacion, hoy, duracionHoras } from "./validacion.js";
import {
  crear, formatoCOP, mostrarCargando, mostrarError, mostrarExito, limpiar, avisar, tarjetaCancha, vistaDetalle,
} from "./ui.js";

// ---------- Menú móvil y pie de página (en todas las páginas) ----------
function iniciarMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("menu");
  if (!toggle || !menu) return;
  const abrir = (si) => {
    menu.classList.toggle("is-open", si);
    toggle.setAttribute("aria-expanded", String(si));
    toggle.setAttribute("aria-label", si ? "Cerrar menú" : "Abrir menú");
  };
  toggle.addEventListener("click", () => abrir(!menu.classList.contains("is-open")));
  menu.addEventListener("click", (e) => e.target.closest("a") && abrir(false));
}

// ---------- index.html y canchas.html: listado con filtros ----------
async function iniciarListado() {
  const lista = document.getElementById("lista-canchas");
  const estado = document.getElementById("estado");
  const filtros = document.getElementById("filtros"); // solo existe en canchas.html

  mostrarCargando(estado, "Cargando canchas…");
  try {
    const canchas = await obtenerCanchas();
    limpiar(estado);

    const pintar = () => {
      const texto = filtros?.elements.buscar.value.trim().toLowerCase() ?? "";
      const modalidad = filtros?.elements.modalidad.value ?? "";
      const maximo = Number(filtros?.elements.precio.value) || Infinity;
      const visibles = canchas.filter(
        (c) => c.nombre.toLowerCase().includes(texto) && (!modalidad || c.capacidad === modalidad) && c.precio <= maximo
      );
      lista.replaceChildren(...visibles.map(tarjetaCancha));
      if (filtros) estado.textContent = visibles.length ? `${visibles.length} cancha(s) encontrada(s)` : "No hay canchas con esos filtros.";
    };

    pintar();
    filtros?.addEventListener("input", pintar); // input y change (el select también dispara input)
    filtros?.addEventListener("submit", (e) => e.preventDefault());
    filtros?.addEventListener("reset", () => setTimeout(pintar)); // espera a que se vacíen los campos
  } catch (error) {
    mostrarError(estado, error, iniciarListado);
  }
}

// ---------- cancha.html: detalle según ?id= ----------
async function iniciarDetalle() {
  const contenedor = document.getElementById("detalle-cancha");
  const estado = document.getElementById("estado");
  const id = Number(new URLSearchParams(location.search).get("id"));

  mostrarCargando(estado, "Cargando cancha…");
  try {
    const cancha = await obtenerCancha(id);
    document.title = `${cancha.nombre} | Zona Gol`;
    contenedor.replaceChildren(vistaDetalle(cancha));
  } catch (error) {
    mostrarError(estado, error, iniciarDetalle);
  }
}

// ---------- reserva.html ----------
async function iniciarReserva(form) {
  const estado = crear("p", { className: "estado" });
  form.before(estado);
  const select = form.elements.cancha;
  form.elements.fecha.min = hoy();

  mostrarCargando(estado, "Cargando canchas…");
  let canchas;
  try {
    canchas = await obtenerCanchas();
    limpiar(estado);
  } catch (error) {
    mostrarError(estado, error, () => location.reload());
    return;
  }

  // Elementos <option> creados dinámicamente a partir de los datos
  select.replaceChildren(
    crear("option", { value: "", textContent: "Selecciona una cancha" }),
    ...canchas.map((c) => crear("option", { value: c.id, textContent: `${c.nombre} (${c.capacidad}) · ${formatoCOP(c.precio)}/h` }))
  );

  const ctx = { canchas, reservas: () => leer("reservas") };
  activarValidacion(form, ctx);
  recordarBorrador(form, "borrador-reserva");
  const elegida = new URLSearchParams(location.search).get("cancha"); // viene de cancha.html
  if (elegida) select.value = elegida;
  pintarReservas();

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // evita recargar la página
    if (!validarFormulario(form, ctx)) return;

    const datos = Object.fromEntries(new FormData(form));
    delete datos.acepto;
    const cancha = canchas.find((c) => c.id === Number(datos.cancha));
    agregar("reservas", {
      ...datos,
      id: Date.now(),
      canchaId: cancha.id,
      cancha: cancha.nombre,
      jugadores: Number(datos.jugadores),
      total: cancha.precio * duracionHoras(datos.inicio, datos.fin),
      estado: "pendiente",
    });

    form.reset();
    limpiarValidacion(form);
    borrarBorrador("borrador-reserva");
    pintarReservas();
    avisar("Reserva guardada. Te contactaremos para confirmarla.");
  });

  // Un solo listener para todos los botones de la lista (delegación de eventos)
  document.getElementById("lista-reservas").addEventListener("click", (e) => {
    const boton = e.target.closest("button[data-accion]");
    if (!boton) return;
    const id = Number(boton.dataset.id);
    if (boton.dataset.accion === "confirmar") actualizar("reservas", id, { estado: "confirmada" });
    else if (confirm("¿Cancelar esta reserva?")) eliminar("reservas", id);
    pintarReservas();
  });
}

function pintarReservas() {
  const lista = document.getElementById("lista-reservas");
  const vacio = document.getElementById("sin-reservas");
  const reservas = leer("reservas");
  vacio.hidden = reservas.length > 0;
  lista.replaceChildren(...reservas.map(itemReserva));
}

// Se usa textContent (no innerHTML) porque estos datos los escribe el usuario
function itemReserva(r) {
  return crear(
    "li",
    { className: "reserva" },
    crear("strong", { textContent: r.cancha }),
    crear("span", { textContent: `${r.fecha} · ${r.inicio} a ${r.fin} · ${r.jugadores} jugadores · ${formatoCOP(r.total)}` }),
    crear("span", { className: `etiqueta etiqueta--${r.estado}`, textContent: r.estado === "confirmada" ? "Confirmada" : "Pendiente" }),
    r.estado === "pendiente" && crear("button", { type: "button", className: "btn btn-sm", textContent: "Confirmar", dataset: { accion: "confirmar", id: r.id } }),
    crear("button", { type: "button", className: "btn btn-sm btn-outline", textContent: "Cancelar", dataset: { accion: "cancelar", id: r.id } })
  );
}

// ---------- contacto.html ----------
function iniciarContacto(form) {
  const estado = crear("p", { className: "estado" });
  form.append(estado);
  activarValidacion(form);
  recordarBorrador(form, "borrador-contacto");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validarFormulario(form)) return;

    const boton = form.querySelector("[type=submit]");
    boton.disabled = true;
    mostrarCargando(estado, "Enviando mensaje…");
    try {
      const datos = Object.fromEntries(new FormData(form));
      const respuesta = await enviarContacto(datos); // POST con fetch
      agregar("mensajes", { ...datos, id: Date.now(), idServidor: respuesta.id });
      form.reset();
      limpiarValidacion(form);
      borrarBorrador("borrador-contacto");
      mostrarExito(estado, "¡Mensaje enviado! Te responderemos en un plazo máximo de 48 horas.");
    } catch (error) {
      mostrarError(estado, error, () => form.requestSubmit());
    } finally {
      boton.disabled = false;
    }
  });
}

// ---------- Arranque ----------
document.documentElement.classList.add("js");
iniciarMenu();
const anio = document.getElementById("anio");
if (anio) anio.textContent = new Date().getFullYear();

if (document.getElementById("lista-canchas")) iniciarListado();
if (document.getElementById("detalle-cancha")) iniciarDetalle();
const formReserva = document.getElementById("form-reserva");
if (formReserva) iniciarReserva(formReserva);
const formContacto = document.getElementById("form-contacto");
if (formContacto) iniciarContacto(formContacto);