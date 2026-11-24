# Zona Gol

Plataforma web para reservar canchas sintéticas en Sahagún, Córdoba.
Proyecto de Desarrollo Web I, Universidad de Córdoba.

**Aplicación en producción:** https://jesusavilaribon.github.io/zona-gol/

En la entrega final el proyecto pasó de páginas HTML separadas a una **Single Page Application (SPA) con Vue.js 3**. Ahora la navegación entre vistas ocurre sin recargar la página.

## Tecnologías
- **Vue 3** (Composition API, `<script setup>`) con componentes de archivo único (`.vue`)
- **Vite**: servidor de desarrollo y build de producción
- **Vue Router**: navegación SPA
- **Pinia**: estado centralizado compartido entre vistas
- HTML5 semántico y CSS3 (Grid, Flexbox y 3 breakpoints: 600, 900 y 1200 px)
- Fetch + `async/await`, `localStorage`
- Google Fonts y Font Awesome por CDN

## Instalación local
Requiere [Node.js](https://nodejs.org/) 20 o superior.

```bash
git clone https://github.com/JesusAvilaRibon/zona-gol.git
cd zona-gol
npm install      # instala las dependencias
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # genera el paquete optimizado en dist/
npm run preview  # sirve dist/ para probar el build
```

## Arquitectura de carpetas
```
zona-gol/
├── index.html                  # única página HTML: ahí se monta la app (#app)
├── vite.config.js
├── public/
│   ├── data.json               # datos de las canchas (se consumen con fetch)
│   └── img/logo.png            # favicon
├── .github/workflows/deploy.yml  # despliegue automático a GitHub Pages
└── src/
    ├── main.js                 # crea la app y conecta Router y Pinia
    ├── App.vue                 # estructura fija: header + <RouterView> + footer
    ├── router/index.js         # definición de rutas
    ├── stores/                 # estado centralizado (Pinia)
    │   ├── canchas.js          #   lista de canchas, carga y errores
    │   ├── reservas.js         #   reservas del usuario (persisten en localStorage)
    │   └── avisos.js           #   aviso temporal (toast)
    ├── views/                  # vistas principales (una por ruta)
    │   ├── InicioView.vue
    │   ├── CanchasView.vue
    │   ├── CanchaDetalleView.vue
    │   ├── ReservaView.vue
    │   ├── MisReservasView.vue
    │   ├── NosotrosView.vue
    │   ├── ContactoView.vue
    │   └── NoEncontradaView.vue
    ├── components/             # elementos reutilizables
    │   ├── AppHeader.vue       #   barra de navegación + menú móvil
    │   ├── AppFooter.vue
    │   ├── CanchaCard.vue      #   tarjeta de cancha
    │   ├── ListaHoras.vue      #   chips de horas disponibles
    │   ├── FiltrosCanchas.vue  #   barra de filtros (v-model)
    │   ├── ReservaItem.vue     #   reserva en lista
    │   ├── ReservasTabla.vue   #   tabla de reservas
    │   ├── ModalConfirmar.vue  #   ventana modal
    │   ├── EstadoCarga.vue     #   loader / error con "Reintentar"
    │   └── AvisoToast.vue
    ├── composables/
    │   └── useFormulario.js    # validación en tiempo real y borradores
    ├── services/
    │   ├── api.js              # peticiones HTTP y manejo de errores
    │   └── storage.js          # lectura/escritura en localStorage
    ├── utils/
    │   ├── formato.js          # precios, fechas, fotos
    │   └── validaciones.js     # reglas de negocio de los formularios
    └── assets/                 # styles.css e imágenes
```

## Rutas
| Ruta | Vista | Descripción |
|---|---|---|
| `#/` | InicioView | Portada y canchas destacadas |
| `#/canchas` | CanchasView | Catálogo con filtros en tiempo real |
| `#/canchas/:id` | CanchaDetalleView | Detalle de una cancha (el `id` llega como prop) |
| `#/reservar` | ReservaView | Formulario de reserva (`?cancha=2` la deja seleccionada) |
| `#/mis-reservas` | MisReservasView | Gestión de reservas en tabla |
| `#/nosotros` | NosotrosView | Quiénes somos |
| `#/contacto` | ContactoView | Formulario de contacto |
| cualquier otra | NoEncontradaView | Página 404 |

Se usa `createWebHashHistory` (URLs con `#`) para que al recargar cualquier ruta en GitHub Pages no aparezca un error 404 del servidor. Las vistas, excepto Inicio, se cargan bajo demanda (*lazy loading*), así el build las separa en archivos pequeños.

## Requisitos de la entrega final
1. **Arquitectura basada en componentes**
   - Vistas en `src/views/` y componentes reutilizables en `src/components/`, todos como Single File Components.
   - **Props (padre → hijo):** `CanchaCard` recibe `cancha`, `ReservasTabla` recibe `reservas`, `ModalConfirmar` recibe `abierto` y `titulo`, y `CanchaDetalleView` recibe el `id` desde el router.
   - **Eventos `$emit` (hijo → padre):** `ReservaItem` y `ReservasTabla` emiten `confirmar` y `cancelar`, `ModalConfirmar` emite `confirmar` y `cerrar`, y `EstadoCarga` emite `reintentar`.
   - **Comunicación bidireccional:** `FiltrosCanchas` se usa con `v-model="filtros"`: recibe `modelValue` y emite `update:modelValue`.
2. **Vue Router:** 7 rutas más la 404, una ruta con parámetro (`/canchas/:id`), query (`/reservar?cancha=2`), enlaces activos y título de pestaña por ruta.
3. **Estado y formularios reactivos**
   - Directivas: `v-model` (con `.number` y `.trim`), `v-for`, `v-if` / `v-else-if` / `v-else`, `v-bind` (`:class`, `:to` y `v-bind="campo('nombre')"`) y `v-on` (`@submit.prevent`, `@click`, `@input`, `@change`).
   - **Estado centralizado con Pinia:** la lista de canchas se descarga una sola vez y la usan Inicio, Canchas, Detalle y Reservar. Las reservas son el mismo estado en el formulario, en la tabla de "Mis reservas" y en el contador del menú: si confirmas o cancelas una, todo se actualiza al instante.
   - Las validaciones del Avance 2 se mantienen: en tiempo real, con borde rojo o verde y mensaje en línea. La fecha no puede ser pasada, los jugadores no pueden superar el cupo de la cancha, el horario es de 7:00 AM a 11:00 PM con reservas de 1 a 3 horas, y no se puede reservar una cancha ya ocupada.
   - Persistencia en `localStorage` (reservas, mensajes y borradores de formularios).
4. **Despliegue:** `npm run build` genera `dist/`. El workflow `.github/workflows/deploy.yml` compila y publica en GitHub Pages en cada push a `main`.

## Versiones anteriores
- Primera entrega y Avance 2 (HTML, CSS y JavaScript nativo): etiqueta [`avance-2`](https://github.com/JesusAvilaRibon/zona-gol/tree/avance-2).

## Autor
Jesus David Avila Ribon
