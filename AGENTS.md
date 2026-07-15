# Contrato editorial de Aurum

Estas reglas aplican a cualquier agente que integre contenido en la landing.

## Fuente de verdad

- Sheet: `1Mtk5uJ5i7GXqctZzxjb9RbWZ9FPBmgiO8dE6tGcSFN0`
- Instagram: `https://www.instagram.com/aurumarquitectos/`
- Antes de proponer o publicar, leer completa la pestaña `SISTEMA_AGENTE`.
- `SISTEMA_AGENTE` decide pesos, profundidad, límites y controles. No dupliques esas decisiones en prompts temporales.

## Responsabilidades

- El agente detecta publicaciones nuevas, crea IDs, obtiene métricas, clasifica proyectos, redacta propuestas, valida enlaces y mantiene la base técnica.
- Sayri no crea filas ni edita IDs, fórmulas, métricas o relaciones.
- Sayri sólo actúa en `REVISION`, columnas `decision_sayri` y `comentarios_sayri`.

## Flujo obligatorio

1. Leer `SISTEMA_AGENTE` y `PUBLICACIONES`.
2. Auditar la fuente y comparar por `publicación_id`; nunca duplicar una publicación.
3. Agrupar contenido por proyecto arquitectónico. Una publicación no equivale automáticamente a un proyecto.
4. Confirmar el nombre del proyecto en el caption, un hashtag oficial o una historia destacada. Una frase editorial nunca se convierte en nombre propio.
5. Preparar una propuesta coherente: imagen, enlace, título, copy y proyecto deben explicar la misma decisión.
6. No inventar datos. Si falta ubicación, año, cliente, material o resultado, usar `bloqueado` y pedir confirmación.
7. Registrar la propuesta completa en `REVISION` y dejar `decision_sayri = pendiente`.
8. No modificar `PUBLICACIONES` hasta que `decision_sayri = aprobar`.
9. Al aprobar, materializar el contenido, marcar `aprobación = aprobado`, ejecutar la sincronización y validar la compilación.
10. Si se solicita `ajustar`, conservar la trazabilidad, atender comentarios y devolver la propuesta a revisión.
11. Si se decide `no_publicar`, conservar la decisión en `REVISION` y no activarla en la web.

## Controles técnicos

- `publicación_id` es único.
- `proyecto_id` debe existir en `PROYECTOS` o proponerse como proyecto nuevo.
- Toda imagen debe cargar por HTTPS sin autenticación.
- La imagen visible debe enlazar a la publicación exacta que la originó; no se permite usar el enlace de otra pieza del mismo proyecto.
- Los reels se conservan como fuentes de proyecto y las historias destacadas se registran en `HISTORIAS`.
- Todo enlace fuente debe pertenecer al handle principal o a una cuenta listada en `fuente.approved_collaboration_handles`.
- Usa `editorial.standalone_project_id` para insights, método o colaboraciones que no describen un proyecto arquitectónico.
- El ranking se calcula con los pesos de `SISTEMA_AGENTE`; no se ordenan filas manualmente para cambiarlo.
- Si falla una validación, no publicar. Conservar la última versión estable.

## Entrega al equipo

Explica decisiones en lenguaje editorial. Nunca entregues a Sayri una instrucción del tipo “crea una fila”, “asigna un ID” o “edita la fórmula”. El agente traduce su aprobación a la estructura técnica.
