// utils/formato.js — Funciones pequeñas de formato y fechas

export const formatoCOP = (n) => "$" + Number(n).toLocaleString("es-CO");

// URL de la foto de una cancha (Unsplash) con el tamaño pedido
export const foto = (cancha, w, h) =>
  `https://images.unsplash.com/${cancha.imagen}?w=${w}&h=${h}&fit=crop&auto=format`;

export const hoy = () => new Date().toLocaleDateString("en-CA"); // AAAA-MM-DD en hora local

const minutos = (h) => {
  const [hh, mm] = h.split(":").map(Number);
  return hh * 60 + mm;
};
export const duracionHoras = (inicio, fin) => (minutos(fin) - minutos(inicio)) / 60;

// Máximo de jugadores según la modalidad: "5 vs 5" -> 10
export const cupoMaximo = (cancha) => parseInt(cancha.capacidad) * 2;
