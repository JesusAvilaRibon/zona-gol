// api.js — Peticiones HTTP con Fetch + async/await y manejo de códigos de estado

const URL_CANCHAS = "data.json";                                   // archivo local estructurado
const URL_CONTACTO = "https://jsonplaceholder.typicode.com/posts"; // API REST pública (simulada)
const RETARDO_MS = 600; // simula una red lenta para que se vea el loader. Ponlo en 0 al final.

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

// Error propio que guarda el código HTTP (404, 500...)
export class ErrorHTTP extends Error {
  constructor(estado) {
    const textos = {
      400: "La solicitud no es válida.",
      404: "No encontramos lo que buscas.",
      500: "El servidor tuvo un problema. Inténtalo más tarde.",
    };
    super(textos[estado] ?? "No se pudo completar la solicitud.");
    this.estado = estado;
  }
}

// Función base: lanza ErrorHTTP si el código no es 2xx.
// Si no hay red, fetch lanza un TypeError (lo captura quien la llame con try/catch).
async function pedir(url, opciones) {
  const respuesta = await fetch(url, opciones);
  if (!respuesta.ok) throw new ErrorHTTP(respuesta.status);
  return respuesta.json();
}

export async function obtenerCanchas() {
  await esperar(RETARDO_MS);
  return pedir(URL_CANCHAS);
}

export async function obtenerCancha(id) {
  const canchas = await obtenerCanchas();
  const cancha = canchas.find((c) => c.id === id);
  if (!cancha) throw new ErrorHTTP(404);
  return cancha;
}

// POST con JSON. JSONPlaceholder responde 201 y no guarda nada de verdad.
export function enviarContacto(datos) {
  return pedir(URL_CONTACTO, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ title: datos.asunto, body: datos.mensaje, userId: 1 }),
  });
}