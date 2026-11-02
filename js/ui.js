// ui.js — Creación y actualización de elementos del DOM

// Crea un elemento: crear("p", { className: "x", textContent: "Hola" }, hijo1, hijo2)
export function crear(etiqueta, atributos = {}, ...hijos) {
  const { dataset, ...resto } = atributos;
  const el = Object.assign(document.createElement(etiqueta), resto);
  if (dataset) Object.assign(el.dataset, dataset);
  el.append(...hijos.filter(Boolean));
  return el;
}

export const formatoCOP = (n) => "$" + n.toLocaleString("es-CO");

// ---------- Estados: cargando / error / éxito ----------
export function mostrarCargando(cont, texto = "Cargando…") {
  cont.className = "estado";
  cont.setAttribute("role", "status");
  cont.replaceChildren(crear("span", { className: "spinner" }), texto);
}

export function describirError(error) {
  if (error.estado) return `${error.message} (código ${error.estado})`;
  if (error instanceof TypeError) return "No hay conexión con el servidor. Revisa tu internet.";
  if (error instanceof SyntaxError) return "Los datos recibidos no tienen un formato válido.";
  return error.message;
}

export function mostrarError(cont, error, reintentar) {
  console.error(error);
  cont.className = "estado estado--error";
  cont.setAttribute("role", "alert");
  cont.replaceChildren(describirError(error));
  if (reintentar) {
    const boton = crear("button", { type: "button", className: "btn btn-sm", textContent: "Reintentar" });
    boton.addEventListener("click", reintentar);
    cont.append(boton);
  }
}

export function mostrarExito(cont, texto) {
  cont.className = "estado estado--ok";
  cont.setAttribute("role", "status");
  cont.replaceChildren(texto);
}

export function limpiar(cont) {
  cont.className = "estado";
  cont.replaceChildren();
}

// Aviso temporal que aparece y se elimina solo
export function avisar(texto) {
  const aviso = crear("p", { className: "toast", role: "status", textContent: texto });
  document.body.append(aviso);
  setTimeout(() => aviso.remove(), 4000);
}

// ---------- Plantillas de canchas (datos propios de data.json, no del usuario) ----------
const foto = (c, w, h) => `https://images.unsplash.com/${c.imagen}?w=${w}&h=${h}&fit=crop&auto=format`;

const chips = (horas, max = horas.length) =>
  horas.slice(0, max).map((h) => `<li><time datetime="${h}">${h}</time></li>`).join("") +
  (horas.length > max ? `<li class="chip--more">+${horas.length - max}</li>` : "");

export function tarjetaCancha(c) {
  const tarjeta = crear("article", { className: "card" });
  tarjeta.innerHTML = `
    <figure>
      <img src="${foto(c, 800, 520)}"
           srcset="${foto(c, 480, 312)} 480w, ${foto(c, 800, 520)} 800w"
           sizes="(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw"
           alt="${c.nombre}" width="800" height="520" loading="lazy">
      <figcaption class="badge">${c.capacidad}</figcaption>
    </figure>
    <div class="card__body">
      <header class="card__head">
        <h3>${c.nombre}</h3>
        <p class="price"><strong>${formatoCOP(c.precio)}</strong> <small>/hora</small></p>
      </header>
      <h4>Horas disponibles</h4>
      <ul class="chips">${chips(c.horas, 5)}</ul>
      <a class="btn btn-outline" href="cancha.html?id=${c.id}">Ver cancha</a>
    </div>`;
  return tarjeta;
}

// Contenido de cancha.html según el mockup
export function vistaDetalle(c) {
  const plantilla = document.createElement("template");
  plantilla.innerHTML = `
    <a class="volver" href="canchas.html"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Volver</a>
    <figure class="detalle__foto">
      <img src="${foto(c, 1200, 600)}" alt="${c.nombre}" width="1200" height="600">
    </figure>
    <div class="detalle">
      <article class="detalle__info">
        <h1 id="detalle-titulo">${c.nombre}</h1>
        <ul class="datos">
          <li><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${c.direccion}</li>
          <li><i class="fa-solid fa-user" aria-hidden="true"></i> ${c.propietario} <small>(${c.rol})</small></li>
          <li>${c.capacidad}</li>
        </ul>
        <p>${c.descripcion}</p>
        <p class="horario"><strong>Horario</strong> ${c.horario}</p>
        <h2>Características</h2>
        <ul class="features">${c.caracteristicas.map((x) => `<li>${x}</li>`).join("")}</ul>
        <h2>Horas disponibles hoy</h2>
        <ul class="chips">${chips(c.horas)}</ul>
      </article>
      <aside class="panel" aria-label="Reservar esta cancha">
        <p class="price"><strong>${formatoCOP(c.precio)}</strong> <small>/hora</small></p>
        <a class="btn btn-lg" href="reserva.html?cancha=${c.id}">Reservar cancha</a>
        <p class="note">Confirmación en menos de 1 hora</p>
      </aside>
    </div>`;
  return plantilla.content;
}