<script setup>
// ReservaView.vue — Formulario reactivo de reserva + lista de "Mis reservas"
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useCanchasStore } from "../stores/canchas.js";
import { useReservasStore } from "../stores/reservas.js";
import { useAvisosStore } from "../stores/avisos.js";
import { useFormulario } from "../composables/useFormulario.js";
import { reglasReserva } from "../utils/validaciones.js";
import { formatoCOP, hoy, duracionHoras, cupoMaximo } from "../utils/formato.js";
import EstadoCarga from "../components/EstadoCarga.vue";
import ReservaItem from "../components/ReservaItem.vue";
import ModalConfirmar from "../components/ModalConfirmar.vue";

const canchas = useCanchasStore();
const reservas = useReservasStore();
const { avisar } = useAvisosStore();
const ruta = useRoute();
const formulario = ref(null);

const { datos, errorDe, campo, validar, reiniciar } = useFormulario({
  inicial: { cancha: "", nombre: "", telefono: "", correo: "", fecha: "", jugadores: 10, inicio: "", fin: "", comentarios: "", acepto: false },
  reglas: reglasReserva,
  contexto: () => ({ canchas: canchas.lista, reservas: reservas.lista }),
  borrador: "borrador-reserva",
});

// Si viene desde el detalle (/reservar?cancha=2) la cancha queda seleccionada
watch(() => ruta.query.cancha, (id) => id && (datos.cancha = String(id)), { immediate: true });
onMounted(() => canchas.cargar());

const elegida = computed(() => canchas.porId(datos.cancha));
const horas = computed(() => (datos.inicio && datos.fin ? duracionHoras(datos.inicio, datos.fin) : 0));
const total = computed(() => (elegida.value && horas.value > 0 ? elegida.value.precio * horas.value : 0));
const recientes = computed(() => [...reservas.lista].reverse());

async function enviar() {
  if (!validar()) {
    await nextTick();
    formulario.value.querySelector(".invalido")?.focus(); // lleva al primer error
    return;
  }
  const { acepto, cancha, ...resto } = datos;
  reservas.agregar({
    ...resto,
    canchaId: elegida.value.id,
    cancha: elegida.value.nombre,
    jugadores: Number(datos.jugadores),
    total: total.value,
  });
  reiniciar();
  avisar("Reserva guardada. Te contactaremos para confirmarla.");
}

// Modal de cancelación
const porCancelar = ref(null);
function cancelar() {
  reservas.cancelar(porCancelar.value.id);
  porCancelar.value = null;
  avisar("Reserva cancelada.");
}
</script>

<template>
  <section class="alt" aria-labelledby="reservar-titulo">
    <header class="section-head">
      <p class="kicker">Solicitud de reserva</p>
      <h1 id="reservar-titulo">Reserva tu cancha</h1>
    </header>

    <EstadoCarga :cargando="canchas.cargando" :error="canchas.error" texto="Cargando canchas…" @reintentar="canchas.cargar(true)" />

    <div class="split">
      <form ref="formulario" class="form" novalidate @submit.prevent="enviar">
        <label class="field field--full">
          <span>Cancha</span>
          <select v-model="datos.cancha" v-bind="campo('cancha')" required>
            <option value="">Selecciona una cancha</option>
            <option v-for="c in canchas.lista" :key="c.id" :value="String(c.id)">
              {{ c.nombre }} ({{ c.capacidad }}) · {{ formatoCOP(c.precio) }}/h
            </option>
          </select>
          <small v-if="errorDe('cancha')" id="error-cancha" class="error">{{ errorDe("cancha") }}</small>
        </label>

        <label class="field field--full">
          <span>Nombre completo</span>
          <input v-model="datos.nombre" v-bind="campo('nombre')" type="text" placeholder="Tu nombre" required maxlength="60" autocomplete="name">
          <small v-if="errorDe('nombre')" id="error-nombre" class="error">{{ errorDe("nombre") }}</small>
        </label>

        <label class="field">
          <span>Teléfono / WhatsApp</span>
          <input v-model="datos.telefono" v-bind="campo('telefono')" type="tel" placeholder="+57 300 000 0000" required autocomplete="tel">
          <small v-if="errorDe('telefono')" id="error-telefono" class="error">{{ errorDe("telefono") }}</small>
        </label>

        <label class="field">
          <span>Correo electrónico</span>
          <input v-model.trim="datos.correo" v-bind="campo('correo')" type="email" placeholder="correo@ejemplo.com" required autocomplete="email">
          <small v-if="errorDe('correo')" id="error-correo" class="error">{{ errorDe("correo") }}</small>
        </label>

        <label class="field">
          <span>Fecha</span>
          <input v-model="datos.fecha" v-bind="campo('fecha')" type="date" :min="hoy()" max="2027-12-31" required>
          <small v-if="errorDe('fecha')" id="error-fecha" class="error">{{ errorDe("fecha") }}</small>
        </label>

        <label class="field">
          <span>Número de jugadores</span>
          <input v-model.number="datos.jugadores" v-bind="campo('jugadores')" type="number" min="2" :max="elegida ? cupoMaximo(elegida) : 22" required>
          <small v-if="errorDe('jugadores')" id="error-jugadores" class="error">{{ errorDe("jugadores") }}</small>
        </label>

        <fieldset class="field--full times">
          <legend>Horario (entre 7:00 AM y 11:00 PM)</legend>
          <label class="field">
            <span>Hora de inicio</span>
            <input v-model="datos.inicio" v-bind="campo('inicio')" type="time" min="07:00" max="22:00" step="3600" required>
            <small v-if="errorDe('inicio')" id="error-inicio" class="error">{{ errorDe("inicio") }}</small>
          </label>
          <label class="field">
            <span>Hora de finalización</span>
            <input v-model="datos.fin" v-bind="campo('fin')" type="time" min="08:00" max="23:00" step="3600" required>
            <small v-if="errorDe('fin')" id="error-fin" class="error">{{ errorDe("fin") }}</small>
          </label>
        </fieldset>

        <label class="field field--full">
          <span>Comentarios (opcional)</span>
          <textarea v-model="datos.comentarios" name="comentarios" rows="3" maxlength="300" placeholder="¿Algo que debamos saber?"></textarea>
        </label>

        <label class="check field--full">
          <input v-model="datos.acepto" v-bind="campo('acepto')" type="checkbox" required>
          <span>Acepto que me contacten para confirmar la disponibilidad.</span>
          <small v-if="errorDe('acepto')" id="error-acepto" class="error">{{ errorDe("acepto") }}</small>
        </label>

        <!-- Resumen reactivo: cambia mientras el usuario llena el formulario -->
        <p v-if="total" class="resumen field--full">
          {{ horas }} hora(s) en {{ elegida.nombre }} · <strong>Total: {{ formatoCOP(total) }}</strong>
        </p>

        <button class="btn btn-lg field--full" type="submit" :disabled="canchas.cargando">Solicitar reserva</button>
        <p class="note field--full"><i class="fa-regular fa-clock" aria-hidden="true"></i> Confirmación en menos de 1 hora.</p>
      </form>

      <aside class="panel" aria-labelledby="mis-reservas-titulo">
        <h2 id="mis-reservas-titulo" class="panel__titulo">Mis reservas</h2>
        <ul v-if="recientes.length" class="reservas">
          <ReservaItem
            v-for="r in recientes"
            :key="r.id"
            :reserva="r"
            @confirmar="reservas.confirmar"
            @cancelar="porCancelar = $event"
          />
        </ul>
        <p v-else>Aún no tienes reservas guardadas.</p>
        <RouterLink v-if="recientes.length" class="volver" to="/mis-reservas">Ver todas en tabla →</RouterLink>
      </aside>
    </div>

    <ModalConfirmar :abierto="Boolean(porCancelar)" titulo="¿Cancelar la reserva?" texto-confirmar="Sí, cancelar" @cerrar="porCancelar = null" @confirmar="cancelar">
      <p v-if="porCancelar">{{ porCancelar.cancha }} · {{ porCancelar.fecha }} de {{ porCancelar.inicio }} a {{ porCancelar.fin }}. Esta acción no se puede deshacer.</p>
    </ModalConfirmar>
  </section>
</template>
