// stores/avisos.js — Aviso temporal (toast) que cualquier vista puede mostrar
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAvisosStore = defineStore("avisos", () => {
  const texto = ref("");
  let temporizador;

  function avisar(mensaje, ms = 4000) {
    texto.value = mensaje;
    clearTimeout(temporizador);
    temporizador = setTimeout(() => (texto.value = ""), ms);
  }

  return { texto, avisar };
});
