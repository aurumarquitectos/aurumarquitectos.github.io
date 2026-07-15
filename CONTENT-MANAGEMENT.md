# Aurum · edición, revisión y publicación

## Fuente editorial

La landing obtiene su contenido del Google Sheet **Aurum · Centro Editorial Web**.

- `CONTENIDO`: textos, botones, enlaces e imágenes principales.
- `PROYECTOS`: portafolio, orden, fotografías y enlaces.
- `SERVICIOS`, `METODO`, `FAQ`: bloques repetibles.
- `LISTAS`: navegación, principios y listas editoriales.
- `TEMA`: colores y tipografías aprobadas.

La columna `activo` permite publicar u ocultar una fila. La columna `orden` controla el acomodo.

## Flujo de publicación

1. Una persona con permiso de edición modifica el Sheet.
2. GitHub Actions valida y lee las pestañas cada 15 minutos.
3. Si los datos son válidos, genera una nueva versión estática y la publica en GitHub Pages.
4. Si Sheets falla o falta un campo obligatorio, la publicación se detiene y la versión anterior continúa en línea.

También puede publicarse al momento desde **Actions → Deploy GitHub Pages → Run workflow**.

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
