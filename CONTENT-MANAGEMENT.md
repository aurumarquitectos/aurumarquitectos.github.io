# Aurum · edición, revisión y publicación

## Fuente editorial

La landing obtiene su contenido del Google Sheet **Aurum · Centro Editorial Web**.

- `CONTENIDO`: textos, botones, enlaces e imágenes principales.
- `PROYECTOS`: casos del portafolio, fotografías, reto, respuesta y resultado.
- `SISTEMA_AGENTE`: contrato editorial que el agente debe leer antes de integrar contenido.
- `REVISION`: bandeja que llena el agente; Sayri sólo decide y comenta.
- `PUBLICACIONES`: base técnica aprobada de Instagram. La mantiene el agente.
- `SERVICIOS`, `METODO`, `FAQ`: bloques repetibles.
- `LISTAS`: navegación, principios y listas editoriales.
- `TEMA`: colores y tipografías aprobadas.

La columna `activo` permite publicar u ocultar una fila. En `PROYECTOS`, el orden público se calcula con la conversación que genera cada caso en redes.

## Ranking y profundidad de casos

Cada publicación recibe un puntaje editorial. Los pesos viven en `SISTEMA_AGENTE`; la configuración inicial es:

`likes + (comentarios × 4) + (reposts × 6)`

El puntaje de un proyecto es la suma de sus publicaciones relacionadas. La página ordena primero los proyectos con mayor puntaje y desarrolla con más detalle los primeros cuatro. La columna `profundidad` de `PROYECTOS` permite cambiar ese criterio por caso:

- `auto`: sigue el ranking; los primeros cuatro se muestran como casos amplios.
- `amplia`: siempre muestra reto, respuesta y resultado.
- `compacta`: conserva una ficha breve y dirige a Instagram.

Este puntaje funciona como señal editorial, no como una afirmación de calidad arquitectónica. Sirve para decidir qué conversación ampliar primero.

## Integrar contenido nuevo

Sayri no administra filas técnicas. El agente sigue este flujo:

1. Lee `SISTEMA_AGENTE` completo y audita la fuente oficial.
2. Detecta publicaciones que no existan en `PUBLICACIONES` usando `publicación_id` como llave única.
3. Agrupa por proyecto arquitectónico, no por formato de post.
4. Prepara título, copy, fotografía, vínculo, métricas y, cuando corresponda, reto, respuesta y resultado.
5. Registra la propuesta y su validación en `REVISION` con `decision_sayri = pendiente`.
6. Sayri únicamente selecciona `aprobar`, `ajustar` o `no_publicar` y puede escribir comentarios.
7. Sólo después de `aprobar`, el agente materializa el registro en `PUBLICACIONES` con `aprobación = aprobado`.
8. La sincronización valida IDs, relaciones, enlaces, imágenes y copy antes de generar la página.

Si una validación falla, el despliegue se detiene y la última versión aprobada permanece en línea.

## Flujo de publicación

1. El agente incorpora únicamente decisiones aprobadas desde `REVISION`.
2. GitHub Actions valida y lee las pestañas y `SISTEMA_AGENTE` cada 15 minutos.
3. Si los datos son válidos, genera una nueva versión estática y la publica en GitHub Pages.
4. Si Sheets falla o falta un campo obligatorio, la publicación se detiene y la versión anterior continúa en línea.

También puede publicarse al momento desde **Actions → Deploy GitHub Pages → Run workflow**.

La detección y actualización completamente autónoma de métricas requiere conectar la cuenta profesional de Instagram mediante la API oficial de Meta y guardar sus credenciales como secretos de GitHub; nunca deben colocarse tokens en el Sheet. Mientras esa conexión no exista, un agente puede realizar la auditoría periódica y aplicar exactamente el mismo contrato editorial.

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
