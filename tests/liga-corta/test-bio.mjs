/* Las rutas fijas /r/bio y /r/fb deben producir EXACTAMENTE la misma URL que
   liga_bio() de yod_audit/liga.py generaba antes (utm_content=bio incluido). */
import { readFileSync } from "node:fs";
import vm from "node:vm";

const HOST = "aurumarquitectos.github.io";
function rebotarArchivo(ruta) {
  const html = readFileSync(ruta, "utf8");
  let destino = null;
  const ctx = { URLSearchParams, URL, window: {}, document: { referrer: "" },
    location: { host: HOST, search: "", replace: (x) => { destino = x; }, set href(x) { destino = x; } } };
  ctx.window.location = ctx.location;
  vm.createContext(ctx);
  /* las copias fijas traen dos <script>: el de window.__C y el del rebote */
  for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) vm.runInContext(m[1], ctx);
  return destino;
}

const BASE = "https://aurumarquitectos.github.io/experiencia/";
const P = "/Users/a./aurumarquitectos.github.io/public/r/";
const CASOS = [
  { n: "/r/bio  (bio de Instagram)", f: P + "bio/index.html",
    espera: BASE + "?utm_source=instagram&utm_medium=bio&utm_campaign=ig-bio&utm_content=bio" },
  { n: "/r/fb   (bio de Facebook)",  f: P + "fb/index.html",
    espera: BASE + "?utm_source=facebook&utm_medium=bio&utm_campaign=fb-bio&utm_content=bio" },
];
let fallas = 0;
for (const c of CASOS) {
  const real = rebotarArchivo(c.f);
  const ok = real === c.espera;
  if (!ok) fallas++;
  console.log(`${ok ? "OK  " : "FALLA"}  ${c.n}`);
  if (!ok) console.log(`        esperaba: ${c.espera}\n        obtuvo:   ${real}`);
}
console.log(`\n${CASOS.length - fallas}/${CASOS.length} pasaron.`);
process.exit(fallas ? 1 : 0);
