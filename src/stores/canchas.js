// stores/canchas.js — Estado compartido de las canchas (Pinia).
// Inicio, Canchas, Detalle y Reservar usan la MISMA lista: se descarga una sola vez.
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { obtenerCanchas } from "../services/api.js";

export const useCanchasStore = defineStore("canchas", () => {
  const lista = ref([]);
  const cargando = ref(false);
  const error = ref(null);

  const modalidades = computed(() => [...new Set(lista.value.map((c) => c.capacidad))]);
  const porId = (id) => lista.value.find((c) => c.id === Number(id));

  // forzar = true vuelve a pedir los datos (botón "Reintentar")
  async function cargar(forzar = false) {
    if (cargando.value || (lista.value.length && !forzar)) return;
    cargando.value = true;
    error.value = null;
    try {
      lista.value = await obtenerCanchas();
    } catch (e) {
      console.error(e);
      error.value = e;
    } finally {
      cargando.value = false;
    }
  }

  return { lista, cargando, error, modalidades, porId, cargar };
});
