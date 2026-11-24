// stores/reservas.js — Reservas del usuario (Pinia + localStorage).
// Cualquier vista que las cambie actualiza al instante el contador del menú y "Mis reservas".
import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { leer, guardar } from "../services/storage.js";

export const useReservasStore = defineStore("reservas", () => {
  const lista = ref(leer("reservas")); // se recuperan al recargar el navegador

  const pendientes = computed(() => lista.value.filter((r) => r.estado === "pendiente").length);
  const totalConfirmado = computed(() =>
    lista.value.filter((r) => r.estado === "confirmada").reduce((suma, r) => suma + r.total, 0)
  );

  function agregar(reserva) {
    lista.value.push({ ...reserva, id: Date.now(), estado: "pendiente" });
  }
  function confirmar(id) {
    const r = lista.value.find((x) => x.id === id);
    if (r) r.estado = "confirmada";
  }
  function cancelar(id) {
    lista.value = lista.value.filter((x) => x.id !== id);
  }

  // Cada cambio se guarda en localStorage como JSON
  watch(lista, (valor) => guardar("reservas", valor), { deep: true });

  return { lista, pendientes, totalConfirmado, agregar, confirmar, cancelar };
});
