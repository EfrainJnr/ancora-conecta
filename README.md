# Áncora Conecta

Portal Digital de Gestión de Bodas de **Áncora Bodas Destino**. Prototipo visual y navegable (sin servidor): todos los datos son de ejemplo.

## Páginas

- `index.html`: página inicial con header, etapas, cómo funciona, para quién y footer. El botón **Acceder al módulo** lleva al portal.
- `portal.html`: el portal, organizado por etapas y con pestañas internas en cada módulo.

## Etapas y módulos

| Etapa | Módulo | Subcategorías |
|---|---|---|
| 1 · Antes de la boda | Invitación y RSVP | Invitación, Confirmar asistencia, Lista de invitados |
| 1 · Antes de la boda | Agenda digital | Cronograma, Avisos y notificaciones |
| 2 · La ceremonia | Transmisión privada | En directo, Grabaciones, Acceso y privacidad |
| 3 · La recepción | Participación por QR | — |
| 3 · La recepción | Interacción en vivo | Votaciones, Canciones, Actividades |
| 3 · La recepción | Mensajes multimedia | Dejar un mensaje, Mensajes recibidos |
| 4 · Los recuerdos | Galería colaborativa | Filtros: todo, fotos, videos, dedicatorias |

## Identidad de marca

| Elemento | Valor |
|---|---|
| Logo | `logo.svg`: arco de boda con dos anillos entrelazados y una ola. `favicon.svg` |
| Rosa polvo | `#D9A39D` (botones: `#AD5752`) |
| Salvia | `#8BA593` (texto: `#4F6E5B`) |
| Arcilla | `#B5754F` |
| Arena | `#EBD9BF` |
| Fondo / texto | `#FAF6F0` / `#3B2E2A` |
| Títulos | Fraunces |
| Texto | DM Sans |

Incluye modo claro y oscuro (sigue el sistema y tiene botón de cambio).

## Estructura

```
index.html   Página inicial
portal.html  Portal por etapas (navegación por hash: #rsvp, #agenda...)
styles.css   Estilos y tokens de color (compartidos)
site.js      Menú móvil y tema de la página inicial
app.js       Interacciones de demostración del portal
logo.svg  favicon.svg  vercel.json
```

Es un sitio estático: no necesita instalación ni compilación.

## Desplegar en Vercel

1. Crea un repositorio en GitHub y sube estos archivos a la raíz (Add file → Upload files).
2. En Vercel: **Add New → Project → Import Git Repository** y elige el repositorio.
3. Deja *Framework Preset* en **Other**, sin comando de build ni carpeta de salida, y pulsa **Deploy**.

Cada cambio que subas a GitHub se vuelve a desplegar solo.

## Versión en inglés (pendiente)

El sitio está en español (`<html lang="es">`). En `app.js` los títulos y mensajes ya están agrupados en un objeto `I18N`. Para añadir inglés: mover los textos de los HTML a un diccionario, agregar `I18N.en` y activar el botón **EN**, que hoy muestra “próximamente”.

## Pendiente para una versión funcional

Autenticación por código de invitado, servicio de streaming, almacenamiento de archivos, base de datos de RSVP y actualizaciones en tiempo real. Los datos de contacto del footer y las páginas legales son de ejemplo.
