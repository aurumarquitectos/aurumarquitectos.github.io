# Automatización semanal de Aurum

## Horario

Cada lunes a las 08:00, zona `America/Hermosillo`.

## Fuentes resueltas

- Instagram: https://www.instagram.com/aurumarquitectos/
- Sheet: https://docs.google.com/spreadsheets/d/1Mtk5uJ5i7GXqctZzxjb9RbWZ9FPBmgiO8dE6tGcSFN0/edit
- Repositorio: https://github.com/aurumarquitectos/aurumarquitectos.github.io
- Landing: https://aurumarquitectos.github.io/

## Ejecución obligatoria

1. Leer completas `SISTEMA_AGENTE`, `PUBLICACIONES`, `HISTORIAS` y `PROYECTOS`.
2. Auditar el perfil, la cuadrícula, los reels y los destacados de Instagram.
3. Comparar por `publicación_id` e `historia_id`; actualizar registros existentes y crear sólo IDs nuevos.
4. Confirmar cada nombre de proyecto en caption, hashtag oficial o historia destacada. Si no existe nombre explícito, clasificar como `_editorial`.
5. Verificar que fotografía, título, copy, proyecto y enlace expliquen la misma pieza.
6. Descargar una imagen pública estable al repositorio cuando una nueva fuente deba mostrarse en la landing.
7. Actualizar métricas observables y recalcular el orden con los pesos de `SISTEMA_AGENTE`.
8. Marcar `validación = validado` y `activo = sí` únicamente cuando pasen todos los controles.
9. Sincronizar el Sheet, compilar la página y publicar en `main` sin esperar aprobación humana.
10. Verificar la landing pública y registrar el resultado en `BITACORA_AUTOMATICA`.

## Manejo de errores

- No inventar nombres, fechas, ubicaciones, clientes, materiales ni resultados.
- Bloquear únicamente el registro ambiguo o roto.
- Nunca borrar contenido estable por una falla temporal de Instagram, Sheets, GitHub o red.
- Continuar con todos los cambios verificables de la misma ejecución.
- Informar incidencias en la bitácora; no convertirlas en una tarea obligatoria para Sayri.

## Papel de Sayri

Sayri no aprueba ni mantiene la automatización. Si quiere intervenir, puede editar textos o prioridades en el Sheet. La sincronización programada publicará esas ediciones válidas.
