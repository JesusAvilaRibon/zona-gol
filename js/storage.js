// storage.js — Persistencia en localStorage (colecciones en formato JSON)

// Recuperar una colección (o un valor por defecto si no existe / está dañada)
export function leer(clave, defecto = []) {
  try {
    return JSON.parse(localStorage.getItem(clave)) ?? defecto;
  } catch {
    return defecto;
  }
}

// Guardar
export const guardar = (clave, valor) => localStorage.setItem(clave, JSON.stringify(valor));

// Agregar un elemento a una colección
export function agregar(clave, item) {
  const lista = [...leer(clave), item];
  guardar(clave, lista);
  return lista;
}

// Actualizar un elemento por id
export function actualizar(clave, id, cambios) {
  const lista = leer(clave).map((i) => (i.id === id ? { ...i, ...cambios } : i));
  guardar(clave, lista);
  return lista;
}

// Eliminar un elemento por id
export function eliminar(clave, id) {
  const lista = leer(clave).filter((i) => i.id !== id);
  guardar(clave, lista);
  return lista;
}

// Borrador del formulario: lo que escribes se conserva si recargas la página
export function recordarBorrador(form, clave) {
  const guardado = leer(clave, {});
  for (const [nombre, valor] of Object.entries(guardado)) {
    const campo = form.elements[nombre];
    if (campo && campo.type !== "checkbox") campo.value = valor;
  }
  form.addEventListener("input", () => guardar(clave, Object.fromEntries(new FormData(form))));
}

export const borrarBorrador = (clave) => localStorage.removeItem(clave);