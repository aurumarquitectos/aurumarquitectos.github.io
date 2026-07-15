# Contrato editorial de Aurum

Estas reglas aplican a cualquier agente que integre contenido en la landing.

## Fuente de verdad

- Sheet: `1Mtk5uJ5i7GXqctZzxjb9RbWZ9FPBmgiO8dE6tGcSFN0`
- Instagram: `https://www.instagram.com/aurumarquitectos/`
- Antes de integrar o publicar, leer completa la pestaña `SISTEMA_AGENTE`.
- `SISTEMA_AGENTE` decide pesos, profundidad, límites y controles. No dupliques esas decisiones en prompts temporales.

## Responsabilidades

- La automatización detecta publicaciones nuevas, crea IDs, obtiene métricas, clasifica proyectos, redacta contenido, valida enlaces, actualiza el Sheet y publica la página.
- Sayri no tiene tareas, aprobaciones ni revisiones obligatorias.
- Sayri puede editar `CONTENIDO`, `PROYECTOS`, `SERVICIOS`, `METODO`, `FAQ` o `LISTAS` cuando quiera intervenir.

## Flujo obligatorio

1. Leer `SISTEMA_AGENTE` y `PUBLICACIONES`.
2. Auditar la fuente y comparar por `publicación_id`; nunca duplicar una publicación.
3. Agrupar contenido por proyecto arquitectónico. Una publicación no equivale automáticamente a un proyecto.
4. Confirmar el nombre del proyecto en el caption, un hashtag oficial o una historia destacada. Una frase editorial nunca se convierte en nombre propio.
5. Preparar contenido coherente: imagen, enlace, título, copy y proyecto deben explicar la misma decisión.
6. No inventar datos. Si un campo es ambiguo, bloquear sólo ese campo o registro y continuar con todo lo verificable.
7. Integrar directamente los registros que pasen los controles, marcar `validación = validado` y `activo = sí`.
8. Ejecutar la sincronización, compilar, publicar y verificar la URL pública en la misma ejecución.
9. Registrar fecha, cambios, validaciones, commit, URL e incidencias en `BITACORA_AUTOMATICA`.
10. Nunca esperar una aprobación humana para continuar con contenido verificable.

## Controles técnicos

- `publicación_id` es único.
- `proyecto_id` debe existir en `PROYECTOS` o proponerse como proyecto nuevo.
- Toda imagen debe cargar por HTTPS sin autenticación.
- La imagen visible debe enlazar a la publicación exacta que la originó; no se permite usar el enlace de otra pieza del mismo proyecto.
- Los reels se conservan como fuentes de proyecto y las historias destacadas se registran en `HISTORIAS`.
- Todo enlace fuente debe pertenecer al handle principal o a una cuenta listada en `fuente.approved_collaboration_handles`.
- Usa `editorial.standalone_project_id` para insights, método o colaboraciones que no describen un proyecto arquitectónico.
- El ranking se calcula con los pesos de `SISTEMA_AGENTE`; no se ordenan filas manualmente para cambiarlo.
- Si falla una validación, bloquear sólo el elemento afectado y conservar la última versión estable del resto.

## Entrega al equipo

Entrega un resumen breve de lo ejecutado. Nunca asignes a Sayri tareas técnicas ni solicites aprobación; su intervención es opcional.
