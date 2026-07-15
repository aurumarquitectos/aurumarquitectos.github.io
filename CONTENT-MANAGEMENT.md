# Aurum · edición, revisión y publicación

## Fuente editorial

La landing obtiene su contenido del Google Sheet **Aurum · Centro Editorial Web**.

- `CONTENIDO`: textos, botones, enlaces e imágenes principales.
- `PROYECTOS`: casos del portafolio, fotografías, reto, respuesta y resultado.
- `PUBLICACIONES`: inventario editorial de Instagram, métricas, enlaces y relación con cada proyecto.
- `SERVICIOS`, `METODO`, `FAQ`: bloques repetibles.
- `LISTAS`: navegación, principios y listas editoriales.
- `TEMA`: colores y tipografías aprobadas.

La columna `activo` permite publicar u ocultar una fila. En `PROYECTOS`, el orden público se calcula con la conversación que genera cada caso en redes.

## Ranking y profundidad de casos

Cada publicación recibe un puntaje editorial con esta fórmula:

`likes + (comentarios × 4) + (reposts × 6)`

El puntaje de un proyecto es la suma de sus publicaciones relacionadas. La página ordena primero los proyectos con mayor puntaje y desarrolla con más detalle los primeros cuatro. La columna `profundidad` de `PROYECTOS` permite cambiar ese criterio por caso:

- `auto`: sigue el ranking; los primeros cuatro se muestran como casos amplios.
- `amplia`: siempre muestra reto, respuesta y resultado.
- `compacta`: conserva una ficha breve y dirige a Instagram.

Este puntaje funciona como señal editorial, no como una afirmación de calidad arquitectónica. Sirve para decidir qué conversación ampliar primero.

## Incorporar una publicación nueva

1. Agrega una fila en `PUBLICACIONES` y conserva un `publicación_id` único.
2. Pega fecha, tipo, título web, copy web, URL pública de imagen y enlace directo de Instagram.
3. Registra likes, comentarios y reposts visibles.
4. Asigna el `proyecto_id` correspondiente. Debe coincidir exactamente con el `id` de `PROYECTOS`.
5. Marca `activo` como `sí`. Usa `destacado` para incluirla en el radar visual de la página.

Si el proyecto todavía no existe, créalo primero en `PROYECTOS`. No cambies IDs que ya estén en uso: son la relación estable entre ambas pestañas.

## Flujo de publicación

1. Una persona con permiso de edición modifica el Sheet.
2. GitHub Actions valida y lee las pestañas cada 15 minutos.
3. Si los datos son válidos, genera una nueva versión estática y la publica en GitHub Pages.
4. Si Sheets falla o falta un campo obligatorio, la publicación se detiene y la versión anterior continúa en línea.

También puede publicarse al momento desde **Actions → Deploy GitHub Pages → Run workflow**.

La actualización de métricas es manual por ahora. La automatización completa requiere conectar la cuenta profesional de Instagram mediante la API oficial de Meta y guardar sus credenciales como secretos de GitHub; nunca deben colocarse tokens en el Sheet.

## Permisos recomendados

### Solo revisar contenido

Comparte el Google Sheet como **Lector** o **Comentador**. No necesita acceso a GitHub.

### Editar contenido sin tocar código

Comparte el Google Sheet como **Editor**. No necesita acceso de escritura al repositorio.

### Revisar cambios técnicos

Invita a la persona al repositorio de GitHub con rol **Triage** para comentar, o **Write** para crear ramas y pull requests. Mantén `main` protegido y solicita al menos una aprobación.

### Administrar publicación y permisos

Usa rol **Maintain**. Reserva **Admin** únicamente para propietarios de confianza.

## Imágenes

Las imágenes pueden permanecer en GitHub o Drive. Si se usa Drive, el archivo debe permitir lectura por enlace y la celda debe contener una URL HTTPS pública. Nunca guardes contraseñas, llaves o datos privados en este Sheet.

## Recuperación

El contenido aprobado queda como respaldo en `content/site-content.json`. Para regresar a una versión anterior, revierte el commit correspondiente o vuelve a ejecutar un despliegue estable desde GitHub Actions.
