// validacion.js — Validación en tiempo real con retroalimentación visual

import { crear } from ".js/ui.js";

export const hoy = () => new Date().toLocaleDateString("en-CA"); // AAAA-MM-DD en hora local
const minutos = (h) => { const [hh, mm] = h.split(":").map(Number); return hh * 60 + mm; };
export const duracionHoras = (inicio, fin) => (minutos(fin) - minutos(inicio)) / 60;

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{3,60}$/;
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CELULAR = /^(\+57\s?)?3\d{2}\s?\d{3}\s?\d{4}$/;

// Reglas de negocio de la reserva
function choque(form, ctx) {
  const { cancha, fecha, inicio, fin } = Object.fromEntries(new FormData(form));
  if (!cancha || !fecha) return "";
  const r = (ctx.reservas?.() ?? []).find(
    (x) => x.canchaId === Number(cancha) && x.fecha === fecha && inicio < x.fin && fin > x.inicio
  );
  return r ? `Esa cancha ya está reservada de ${r.inicio} a ${r.fin} ese día.` : "";
}

// Cada regla devuelve "" si el valor es válido, o el mensaje de error.
// (Los campos vacíos se revisan antes, en mensajeDe)
const reglas = {
  nombre: (v) => (SOLO_LETRAS.test(v.trim()) ? "" : "Usa solo letras y espacios (entre 3 y 60 caracteres)."),
  correo: (v) => (CORREO.test(v.trim()) ? "" : "Escribe un correo válido. Ej: nombre@correo.com"),
  telefono: (v) => (CELULAR.test(v.trim()) ? "" : "Escribe un celular colombiano. Ej: 300 123 4567"),
  asunto: (v) => (v.trim().length >= 3 ? "" : "El asunto debe tener al menos 3 caracteres."),
  mensaje: (v) =>
    v.trim().length < 10 ? "El mensaje debe tener al menos 10 caracteres." : v.length > 500 ? "Máximo 500 caracteres." : "",
  fecha: (v) => (v < hoy() ? "La fecha no puede ser anterior a hoy." : ""),
  jugadores: (v, f, ctx) => {
    const n = Number(v);
    if (!Number.isInteger(n) || n < 2) return "Mínimo 2 jugadores.";
    const c = (ctx.canchas ?? []).find((x) => String(x.id) === f.elements.cancha.value);
    const max = c ? parseInt(c.capacidad) * 2 : 22;
    return n > max ? `La ${c.nombre} admite máximo ${max} jugadores.` : "";
  },
  inicio: (v, f) => {
    if (v < "07:00" || v > "22:00") return "Atendemos de 7:00 AM a 11:00 PM. La última hora de inicio es 10:00 PM.";
    if (f.elements.fecha.value === hoy() && v <= new Date().toTimeString().slice(0, 5))
      return "Esa hora ya pasó. Elige una posterior a la actual.";
    return "";
  },
  fin: (v, f, ctx) => {
    if (v < "08:00" || v > "23:00") return "Atendemos hasta las 11:00 PM.";
    const inicio = f.elements.inicio.value;
    if (!inicio) return "";
    const horas = duracionHoras(inicio, v);
    if (horas <= 0) return "La hora final debe ser posterior a la de inicio.";
    if (horas > 3) return "Máximo 3 horas por reserva.";
    return choque(f, ctx);
  },
};

function mensajeDe(campo, ctx) {
  const vacio = campo.type === "checkbox" ? !campo.checked : !campo.value.trim();
  if (vacio) {
    if (!campo.required) return "";
    return campo.type === "checkbox" ? "Debes aceptar para continuar." : "Este campo es obligatorio.";
  }
  return reglas[campo.name]?.(campo.value, campo.form, ctx) ?? "";
}

// Muestra u oculta el error en línea y cambia el borde del campo
function pintar(campo, mensaje) {
  const caja = campo.closest("label") ?? campo.parentElement;
  let aviso = caja.querySelector(".error");
  if (mensaje) {
    if (!aviso) {
      aviso = crear("small", { className: "error", id: `error-${campo.name}` });
      caja.append(aviso);
    }
    aviso.textContent = mensaje;
    campo.setAttribute("aria-describedby", aviso.id);
  } else {
    aviso?.remove();
    campo.removeAttribute("aria-describedby");
  }
  campo.setAttribute("aria-invalid", String(Boolean(mensaje)));
  campo.classList.toggle("invalido", Boolean(mensaje));
  campo.classList.toggle("valido", !mensaje && campo.type !== "checkbox" && campo.value !== "");
}

const CRUZADOS = ["cancha", "fecha", "jugadores", "inicio", "fin"]; // dependen unos de otros

// Activa la validación mientras el usuario escribe (input) y al salir del campo (focusout)
export function activarValidacion(form, ctx = {}) {
  const revisar = (campo) => pintar(campo, mensajeDe(campo, ctx));

  form.addEventListener("input", (e) => {
    if (!e.target.name) return;
    revisar(e.target);
    if (CRUZADOS.includes(e.target.name)) {
      for (const nombre of CRUZADOS) {
        const otro = form.elements[nombre];
        if (otro && otro !== e.target && otro.value) revisar(otro);
      }
    }
  });
  form.addEventListener("focusout", (e) => e.target.name && revisar(e.target));
}

// Valida todo el formulario antes de enviar. Devuelve true si no hay errores.
export function validarFormulario(form, ctx = {}) {
  let primero = null;
  for (const campo of form.elements) {
    if (!campo.name) continue;
    const mensaje = mensajeDe(campo, ctx);
    pintar(campo, mensaje);
    if (mensaje && !primero) primero = campo;
  }
  primero?.focus();
  return !primero;
}

// Quita los estilos y mensajes de validación (después de enviar o resetear)
export function limpiarValidacion(form) {
  form.querySelectorAll(".error").forEach((e) => e.remove());
  form.querySelectorAll(".valido, .invalido").forEach((c) => {
    c.classList.remove("valido", "invalido");
    c.removeAttribute("aria-invalid");
    c.removeAttribute("aria-describedby");
  });
}