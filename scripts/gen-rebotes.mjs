#!/usr/bin/env node
/* gen-rebotes.mjs — genera las ligas cortas FIJAS a partir de public/r/index.html
 *
 * Por que existe: las ligas de publicacion llevan fecha y se generan al vuelo
 * (/r/?ig260908), pero las permanentes (el bio del perfil, el QR de una lona)
 * merecen una direccion limpia y memorizable: /r/bio en vez de /r/?igbio.
 * GitHub Pages solo sirve archivos, asi que cada liga fija necesita su carpeta.
 *
 * En vez de mantener copias a mano —que se desincronizan en cuanto tocas la
 * logica del rebote— cada copia se estampa desde la MISMA plantilla, con el
 * codigo inyectado en window.__C. Una sola fuente de verdad.
 *
 * Se corre a mano al agregar una liga fija, no en cada build:
 *     node scripts/gen-rebotes.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const base = join(raiz, "public", "r");

/* ruta -> codigo que entiende el rebote (ver la tabla en public/r/index.html)
 * El sufijo "-bio" no sobra: es el utm_content=bio que ya emitia liga_bio() de
 * yod_audit/liga.py. Sin el, la liga corta del perfil caeria en una campana
 * ligeramente distinta a la larga y partiria el historico en dos. */
const FIJAS = {
  bio: "igbio-bio",   // aurumarquitectos.github.io/r/bio  — bio de Instagram
  fb: "fbbio-bio",    // aurumarquitectos.github.io/r/fb   — bio/about de Facebook
};

const plantilla = readFileSync(join(base, "index.html"), "utf8");
const ANCLA = "<script>";
if (!plantilla.includes(ANCLA)) {
  console.error("No encontre el <script> del rebote en public/r/index.html");
  process.exit(1);
}

for (const [ruta, codigo] of Object.entries(FIJAS)) {
  const html = plantilla.replace(
    ANCLA,
    `<script>window.__C=${JSON.stringify(codigo)};</script>\n${ANCLA}`
  );
  const dir = join(base, ruta);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
  console.log(`  /r/${ruta}  ->  ${codigo}`);
}
console.log(`\n${Object.keys(FIJAS).length} ligas fijas generadas.`);
