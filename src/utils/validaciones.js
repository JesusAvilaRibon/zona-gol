// utils/validaciones.js — Reglas de validación (funciones puras, sin DOM).
// Cada regla recibe (valor, datos del formulario, contexto) y devuelve "" si es válido o el mensaje de error.

import { hoy, duracionHoras, cupoMaximo } from "./formato.js";

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{3,60}$/;
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CELULAR = /^(\+57\s?)?3\d{2}\s?\d{3}\s?\d{4}$/;

const obligatorio = (regla) => (v, d, ctx) =>
  v === true ? "" : v === false ? "Debes aceptar para continuar." : !String(v ?? "").trim() ? "Este campo es obligatorio." : regla(v, d, ctx);
const opcional = (regla) => (v, d, ctx) => (!String(v ?? "").trim() ? "" : regla(v, d, ctx));
const nada = () => "";

const nombre = (v) => (SOLO_LETRAS.test(v.trim()) ? "" : "Usa solo letras y espacios (entre 3 y 60 caracteres).");
const correo = (v) => (CORREO.test(v.trim()) ? "" : "Escribe un correo válido. Ej: nombre@correo.com");
const telefono = (v) => (CELULAR.test(v.trim()) ? "" : "Escribe un celular colombiano. Ej: 300 123 4567");

export const reglasContacto = {
  nombre: obligatorio(nombre),
  correo: obligatorio(correo),
  telefono: opcional(telefono),
  asunto: obligatorio((v) => (v.trim().length >= 3 ? "" : "El asunto debe tener al menos 3 caracteres.")),
  mensaje: obligatorio((v) =>
    v.trim().length < 10 ? "El mensaje debe tener al menos 10 caracteres." : v.length > 500 ? "Máximo 500 caracteres." : ""
  ),
};

// ctx = { canchas, reservas } (vienen de los stores)
export const reglasReserva = {
  cancha: obligatorio(nada),
  nombre: obligatorio(nombre),
  telefono: obligatorio(telefono),
  correo: obligatorio(correo),
  fecha: obligatorio((v) => (v < hoy() ? "La fecha no puede ser anterior a hoy." : "")),
  jugadores: obligatorio((v, d, ctx) => {
    const n = Number(v);
    if (!Number.isInteger(n) || n < 2) return "Mínimo 2 jugadores.";
    const c = ctx.canchas.find((x) => String(x.id) === String(d.cancha));
    const max = c ? cupoMaximo(c) : 22;
    return n > max ? `La ${c.nombre} admite máximo ${max} jugadores.` : "";
  }),
  inicio: obligatorio((v, d) => {
    if (v < "07:00" || v > "22:00") return "Atendemos de 7:00 AM a 11:00 PM. La última hora de inicio es 10:00 PM.";
    if (d.fecha === hoy() && v <= new Date().toTimeString().slice(0, 5)) return "Esa hora ya pasó. Elige una posterior a la actual.";
    return "";
  }),
  fin: obligatorio((v, d, ctx) => {
    if (v < "08:00" || v > "23:00") return "Atendemos hasta las 11:00 PM.";
    if (!d.inicio) return "";
    const horas = duracionHoras(d.inicio, v);
    if (horas <= 0) return "La hora final debe ser posterior a la de inicio.";
    if (horas > 3) return "Máximo 3 horas por reserva.";
    // Regla de negocio: no reservar una cancha ya ocupada en esa fecha y hora
    const choque = ctx.reservas.find(
      (r) => r.canchaId === Number(d.cancha) && r.fecha === d.fecha && d.inicio < r.fin && v > r.inicio
    );
    return choque ? `Esa cancha ya está reservada de ${choque.inicio} a ${choque.fin} ese día.` : "";
  }),
  comentarios: nada,
  acepto: obligatorio(nada),
};
