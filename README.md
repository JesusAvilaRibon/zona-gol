# Zona Gol

Plataforma web para reservar canchas sintéticas en Sahagún, Córdoba.
Proyecto de Desarrollo Web I, Universidad de Córdoba. Primera entrega: semántica estructural, maquetación responsive y versionamiento.

## Páginas
- `index.html`: inicio
- `canchas.html`: listado de canchas
- `reserva.html`: formulario de reserva
- `nosotros.html`: quiénes somos
- `contacto.html`: formulario de contacto
- `cancha.html`: detalle de una cancha según el `id` de la URL

## Tecnologías
HTML5, CSS3 (Grid y Flexbox), JavaScript (módulos ES, Fetch, localStorage). Fuentes de Google Fonts e iconos de Font Awesome por CDN.

## Autor
Jesus David Avila Ribon

## Avance 2: lógica de interfaz, consumo de APIs y persistencia local

### Cómo ejecutarlo
Los módulos de JavaScript y `fetch` no funcionan abriendo el HTML con doble clic. Usa la extensión **Live Server** de VS Code (clic derecho sobre `index.html` > "Open with Live Server") o la versión publicada en GitHub Pages.

### Estructura
```
zona-gol/
├── index.html, canchas.html, cancha.html, reserva.html, nosotros.html, contacto.html
├── styles.css
├── data.json            # datos de las canchas
└── js/
    ├── main.js          # punto de entrada: activa lo que corresponde a cada página
    ├── api.js           # peticiones HTTP con fetch y async/await
    ├── storage.js       # persistencia en localStorage
    ├── validacion.js    # validaciones en tiempo real
    └── ui.js            # creación de elementos del DOM, loaders y errores
```

### Requisitos cubiertos
1. **DOM y eventos:** las tarjetas de canchas, las opciones del select y la lista de reservas se crean dinámicamente. Se usan los eventos `submit` (con `preventDefault`), `click`, `input` y `change`. Los filtros de `canchas.html` actualizan la vista sin recargar, y cancelar una reserva elimina el elemento del DOM.
2. **Consumo asíncrono:** `fetch` con `async/await` sobre `data.json` (GET) y sobre la API pública JSONPlaceholder (POST del formulario de contacto). Se manejan los códigos 404 y 500 y los errores de red con `try/catch`, con loader (spinner) y mensaje de error con botón "Reintentar".
3. **Persistencia:** `localStorage` guarda las colecciones `reservas` y `mensajes` en formato JSON (agregar, actualizar y eliminar) y un borrador de cada formulario, de modo que los datos siguen ahí tras recargar el navegador.
4. **Validaciones dinámicas:** se valida mientras el usuario escribe, con el borde del campo en rojo o verde y un mensaje en línea. Reglas de negocio de la reserva:
   - la fecha no puede ser anterior a hoy;
   - los jugadores no pueden superar el cupo de la cancha;
   - el horario es de 7:00 AM a 11:00 PM y la reserva dura entre 1 y 3 horas;
   - no se puede reservar una cancha ya ocupada en esa fecha y hora.

### Detalle de cancha
`cancha.html` es una sola plantilla: lee el parámetro `?id=` de la URL (por ejemplo `cancha.html?id=1`) y muestra la cancha correspondiente desde `data.json`. Para agregar una cancha nueva basta con añadir un objeto al archivo, sin crear otro HTML.