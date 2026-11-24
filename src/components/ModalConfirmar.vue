<script setup>
// ModalConfirmar.vue — Ventana modal reutilizable (reemplaza a window.confirm).
// Se muestra con la prop "abierto" y responde con los eventos "confirmar" o "cerrar".
import { ref, watch, nextTick, onBeforeUnmount } from "vue";

const props = defineProps({
  abierto: { type: Boolean, default: false },
  titulo: { type: String, default: "¿Estás seguro?" },
  textoConfirmar: { type: String, default: "Sí, continuar" },
});
const emit = defineEmits(["confirmar", "cerrar"]);
const botonCerrar = ref(null);

const alPresionarTecla = (e) => e.key === "Escape" && emit("cerrar");

watch(
  () => props.abierto,
  async (abierto) => {
    if (abierto) {
      document.addEventListener("keydown", alPresionarTecla);
      await nextTick();
      botonCerrar.value?.focus(); // el foco va al botón seguro
    } else {
      document.removeEventListener("keydown", alPresionarTecla);
    }
  }
);
onBeforeUnmount(() => document.removeEventListener("keydown", alPresionarTecla));
</script>

<template>
  <Teleport to="body">
    <div v-if="abierto" class="modal-fondo" @click.self="emit('cerrar')">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        <h2 id="modal-titulo">{{ titulo }}</h2>
        <div class="modal__cuerpo"><slot /></div>
        <footer class="modal__acciones">
          <button ref="botonCerrar" type="button" class="btn btn-outline" @click="emit('cerrar')">Volver</button>
          <button type="button" class="btn btn-peligro" @click="emit('confirmar')">{{ textoConfirmar }}</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>
