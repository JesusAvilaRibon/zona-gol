<script setup>
// ContactoView.vue — Formulario de contacto: validación reactiva + POST asíncrono a JSONPlaceholder
import { ref } from "vue";
import { useFormulario } from "../composables/useFormulario.js";
import { reglasContacto } from "../utils/validaciones.js";
import { enviarContacto, describirError } from "../services/api.js";
import { leer, guardar } from "../services/storage.js";

const { datos, errorDe, campo, validar, reiniciar } = useFormulario({
  inicial: { nombre: "", correo: "", telefono: "", asunto: "", mensaje: "" },
  reglas: reglasContacto,
  borrador: "borrador-contacto",
});

const enviando = ref(false);
const resultado = ref(null); // { ok: true/false, texto }

async function enviar() {
  resultado.value = null;
  if (!validar()) return;
  enviando.value = true;
  try {
    const respuesta = await enviarContacto(datos); // POST con fetch + async/await
    guardar("mensajes", [...leer("mensajes"), { ...datos, id: Date.now(), idServidor: respuesta.id }]);
    reiniciar();
    resultado.value = { ok: true, texto: "¡Mensaje enviado! Te responderemos en un plazo máximo de 48 horas." };
  } catch (error) {
    console.error(error);
    resultado.value = { ok: false, texto: describirError(error) };
  } finally {
    enviando.value = false;
  }
}
</script>

<template>
  <section aria-labelledby="contacto-titulo">
    <header class="contact-header">
      <h1 id="contacto-titulo">Contacto</h1>
      <p>Si tienes preguntas, dudas o sugerencias, por favor, comunícate con nosotros.</p>
    </header>

    <div class="contact-content">
      <div class="contact-form">
        <h2>Queremos escucharte</h2>

        <form novalidate @submit.prevent="enviar">
          <div class="form-group">
            <label for="nombre">Nombre completo</label>
            <input id="nombre" v-model="datos.nombre" v-bind="campo('nombre')" type="text" placeholder="Nombres y apellidos" required>
            <small v-if="errorDe('nombre')" id="error-nombre" class="error">{{ errorDe("nombre") }}</small>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="correo">Correo electrónico</label>
              <input id="correo" v-model.trim="datos.correo" v-bind="campo('correo')" type="email" placeholder="zonagol@gmail.com" required>
              <small v-if="errorDe('correo')" id="error-correo" class="error">{{ errorDe("correo") }}</small>
            </div>
            <div class="form-group">
              <label for="telefono">Teléfono / WhatsApp <small>(opcional)</small></label>
              <input id="telefono" v-model="datos.telefono" v-bind="campo('telefono')" type="tel" placeholder="322 654 8921">
              <small v-if="errorDe('telefono')" id="error-telefono" class="error">{{ errorDe("telefono") }}</small>
            </div>
          </div>

          <div class="form-group">
            <label for="asunto">Asunto</label>
            <input id="asunto" v-model="datos.asunto" v-bind="campo('asunto')" type="text" placeholder="Asunto" required>
            <small v-if="errorDe('asunto')" id="error-asunto" class="error">{{ errorDe("asunto") }}</small>
          </div>

          <div class="form-group">
            <label for="mensaje">Mensaje <small>({{ datos.mensaje.length }}/500)</small></label>
            <textarea id="mensaje" v-model="datos.mensaje" v-bind="campo('mensaje')" placeholder="Escribe aquí tu mensaje" required></textarea>
            <small v-if="errorDe('mensaje')" id="error-mensaje" class="error">{{ errorDe("mensaje") }}</small>
          </div>

          <button type="submit" class="btn-submit" :disabled="enviando">
            <span v-if="enviando" class="spinner"></span>
            {{ enviando ? "Enviando…" : "Enviar" }}
          </button>

          <p v-if="resultado" :class="['estado', resultado.ok ? 'estado--ok' : 'estado--error']" :role="resultado.ok ? 'status' : 'alert'">
            {{ resultado.texto }}
            <button v-if="!resultado.ok" type="submit" class="btn btn-sm">Reintentar</button>
          </p>
        </form>

        <p class="contact-message">Gracias por comunicarte con nosotros. Nuestro equipo revisará tu mensaje y te responderá en un plazo no mayor a 48 horas a través de tu correo o número telefónico.</p>
      </div>

      <div class="contact-image">
        <img src="../assets/img/contacto.jpg" alt="Jugadores en una cancha sintética" loading="lazy">
      </div>
    </div>
  </section>
</template>
