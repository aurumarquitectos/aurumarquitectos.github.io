# Pruebas de la liga corta

Qué protegen: que acortar la liga **no cambie ni un carácter** de lo que llega al
Sheet. Si alguien toca la convención en uno solo de los tres lugares donde vive
—el rebote (`public/r/`), la captura del cuestionario, o el generador del
`aurum-board`— estas pruebas lo cazan antes de que el board muestre la campaña
partida en dos.

    node tests/liga-corta/correr.mjs

Leen los archivos reales de los tres repos, no copias. Esperan los clones
hermanos en el home; si falta alguno lo dicen y salen con código 2.

| Suite | Qué vigila |
|---|---|
| `test-rebote` | Las UTM que arma el rebote desde cada forma de código, que el `fbclid` sobreviva (sin él se rompe el match del Pixel) y que un código inválido mande al lead al cuestionario en vez de inventarle campaña. |
| `test-captura` | El otro lado: que el cuestionario registre el origen real y no el rebote, y que el tráfico sin origen cuente como directo. |
| `test-bio` | Que las rutas fijas `/r/bio` y `/r/fb` den exactamente lo mismo que `liga_bio()` de `yod_audit/liga.py`. |
| `test-ida-vuelta` | Board → liga corta → rebote → destino, comparado contra la liga larga de antes. |
| `test-canales` | QR, WhatsApp, correo, TikTok… y un canal fuera de la tabla. |
| `test-embudo` | Lo mismo que ida-vuelta pero por todos los canales y en las dos formas (con fecha y permanente). |
| `test-ligapy` | La tercera copia: que `liga.py` dé lo mismo que el rebote y que el board, incluidas las ligas fijas y la del perfil. |

## Las tres tablas que deben decir lo mismo

`CANALES` (rebote) · `LG_UTM` (aurum-board) · `CANALES` (yod_audit/liga.py).
Si divergen, el mismo canal cae en dos `utm_source` distintos según quién generó
la liga. `test-embudo` es el que lo detecta.
