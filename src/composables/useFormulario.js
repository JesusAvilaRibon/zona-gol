// composables/useFormulario.js — Lógica reutilizable de formularios reactivos:
// validación en tiempo real, errores por campo y borrador guardado en localStorage.
import { reactive, computed, watch } from "vue";
import { leer, guardar, borrar } from "../services/storage.js";

export function useFormulario({ inicial, reglas, contexto = () => ({}), borrador }) {
  const datos = reactive({ ...inicial, ...(borrador ? leer(borrador, {}) : {}) });
  const tocados = reactive({}); // campos que el usuario ya tocó

  // Se recalcula solo cada vez que cambia un dato (reactividad)
  const errores = computed(() => {
    const ctx = contexto();
    return Object.fromEntries(Object.keys(reglas).map((campo) => [campo, reglas[campo](datos[campo], datos, ctx)]));
  });

  const esValido = computed(() => Object.values(errores.value).every((e) => !e));
  const errorDe = (campo) => (tocados[campo] ? errores.value[campo] : "");
  const tocar = (campo) => (tocados[campo] = true);

  // Clases para el borde verde / rojo
  const clase = (campo) => ({
    invalido: Boolean(errorDe(campo)),
    valido: tocados[campo] && !errores.value[campo] && datos[campo] !== "" && typeof datos[campo] !== "boolean",
  });

  // Atributos y eventos de un campo, para usar con v-bind="campo('nombre')"
  const campo = (nombre) => ({
    name: nombre,
    class: clase(nombre),
    "aria-invalid": Boolean(errorDe(nombre)),
    "aria-describedby": errorDe(nombre) ? `error-${nombre}` : undefined,
    onInput: () => tocar(nombre),  // valida mientras escribe
    onChange: () => tocar(nombre), // select, fecha, checkbox
    onBlur: () => tocar(nombre),   // al salir del campo
  });

  // Marca todos los campos y devuelve true si no hay errores
  function validar() {
    Object.keys(reglas).forEach(tocar);
    return esValido.value;
  }

  function reiniciar() {
    Object.assign(datos, inicial);
    Object.keys(tocados).forEach((k) => delete tocados[k]);
    if (borrador) borrar(borrador);
  }

  // Borrador: lo que escribes se conserva si recargas (excepto casillas de aceptación)
  if (borrador) {
    watch(datos, (v) => {
      const { acepto, ...resto } = v;
      guardar(borrador, resto);
    }, { deep: true });
  }

  return { datos, errores, errorDe, tocar, clase, campo, validar, reiniciar, esValido };
}
