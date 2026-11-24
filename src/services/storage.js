// services/storage.js — Persistencia en localStorage (colecciones en formato JSON)

export function leer(clave, defecto = []) {
  try {
    return JSON.parse(localStorage.getItem(clave)) ?? defecto;
  } catch {
    return defecto; // dato dañado o localStorage bloqueado
  }
}

export function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* sin espacio o modo privado: la app sigue funcionando en memoria */
  }
}

export function borrar(clave) {
  try {
    localStorage.removeItem(clave);
  } catch {
    /* ignorado */
  }
}
