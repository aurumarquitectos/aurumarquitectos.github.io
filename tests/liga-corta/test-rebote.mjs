/* Prueba del rebote corto: ejecuta el <script> real de public/r/index.html
   contra un location/document simulados y compara la URL de salida.
   Lo que se esta protegiendo: fbclid, utm_campaign y el referrer original. */
import { readFileSync } from "node:fs";
import vm from "node:vm";

const HTML = readFileSync("/Users/a./aurumarquitectos.github.io/public/r/index.html", "utf8");
const SCRIPT = HTML.match(/<script>([\s\S]*?)<\/script>/)[1];
const HOST = "aurumarquitectos.github.io";

function correr({ search = "", referrer = "", codigo = null }) {
  let destino = null;
  const ctx = { URLSearchParams, URL,
    window: codigo ? { __C: codigo } : {},
    document: { referrer },
    location: {
      host: HOST,
      search,
      replace: (u) => { destino = u; },
      set href(u) { destino = u; },
    },
  };
  ctx.window.location = ctx.location;
  vm.createContext(ctx);
  vm.runInContext(SCRIPT, ctx);
  return destino;
}

const BASE = "https://aurumarquitectos.github.io/experiencia/";
const IG = "https://l.instagram.com/";

const CASOS = [
  {
    n: "Publicacion de IG con fecha",
    e: { search: "?ig260908" },
    espera: BASE + "?utm_source=instagram&utm_medium=social&utm_campaign=ig-2026-09-08",
  },
  {
    n: "Publicacion de FB con pieza",
    e: { search: "?fb260908-pub3" },
    espera: BASE + "?utm_source=facebook&utm_medium=social&utm_campaign=fb-2026-09-08&utm_content=pub3",
  },
  {
    n: "fbclid SOBREVIVE (match del Pixel)",
    e: { search: "?ig260908&fbclid=IwAR_PRUEBA_123" },
    espera: BASE + "?utm_source=instagram&utm_medium=social&utm_campaign=ig-2026-09-08&fbclid=IwAR_PRUEBA_123",
  },
  {
    n: "referrer real de IG viaja en 'ro' (solo el origen, sin ruta)",
    e: { search: "?ig260908", referrer: IG },
    espera: BASE + "?utm_source=instagram&utm_medium=social&utm_campaign=ig-2026-09-08&ro=" + encodeURIComponent("https://l.instagram.com"),
  },
  {
    n: "Bio de IG (sin fecha, medium=bio)",
    e: { codigo: "igbio" },
    espera: BASE + "?utm_source=instagram&utm_medium=bio&utm_campaign=ig-bio",
  },
  {
    n: "Bio de FB",
    e: { codigo: "fbbio" },
    espera: BASE + "?utm_source=facebook&utm_medium=bio&utm_campaign=fb-bio",
  },
  {
    n: "Codigo basura -> llega igual, sin UTM",
    e: { search: "?zzz999" },
    espera: BASE,
  },
  {
    n: "Sin codigo -> llega igual",
    e: { search: "" },
    espera: BASE,
  },
  {
    n: "referrer propio NO se reenvia (no hay bucle)",
    e: { search: "?ig260908", referrer: "https://aurumarquitectos.github.io/r/" },
    espera: BASE + "?utm_source=instagram&utm_medium=social&utm_campaign=ig-2026-09-08",
  },
  {
    n: "UTM explicita gana sobre la del codigo",
    e: { search: "?ig260908&utm_content=lona" },
    espera: BASE + "?utm_source=instagram&utm_medium=social&utm_campaign=ig-2026-09-08&utm_content=lona",
  },
  {
    n: "Post ya publicado (shortid)",
    e: { search: "?fb_1809876543" },
    espera: BASE + "?utm_source=facebook&utm_medium=social&utm_campaign=fb-1809876543",
  },
  {
    n: "shortid conserva mayusculas (cruce exacto con Meta)",
    e: { search: "?ig_AbC123xyZ" },
    espera: BASE + "?utm_source=instagram&utm_medium=social&utm_campaign=ig-AbC123xyZ",
  },
  {
    n: "shortid NO se confunde con fecha",
    e: { search: "?fb_260908" },
    espera: BASE + "?utm_source=facebook&utm_medium=social&utm_campaign=fb-260908",
  },
  {
    n: "referrer con ruta y query: solo viaja el origen (cero PII)",
    e: { search: "?ig260908", referrer: "https://ejemplo.com/panel/secreto?token=ABC123" },
    espera: BASE + "?utm_source=instagram&utm_medium=social&utm_campaign=ig-2026-09-08&ro=" + encodeURIComponent("https://ejemplo.com"),
  },
  {
    n: "canal en MAYUSCULAS igual se mide",
    e: { search: "?REVISTA260908-EXPO" },
    espera: BASE + "?utm_source=revista&utm_medium=otro&utm_campaign=revista-2026-09-08&utm_content=expo",
  },
  {
    n: "shortid conserva mayusculas aunque el canal venga en mayusculas",
    e: { search: "?FB_AbC123xyZ" },
    espera: BASE + "?utm_source=facebook&utm_medium=social&utm_campaign=fb-AbC123xyZ",
  },
];

let fallas = 0;
for (const c of CASOS) {
  const real = correr(c.e);
  const ok = real === c.espera;
  if (!ok) fallas++;
  console.log(`${ok ? "OK  " : "FALLA"}  ${c.n}`);
  if (!ok) console.log(`        esperaba: ${c.espera}\n        obtuvo:   ${real}`);
}
console.log(`\n${CASOS.length - fallas}/${CASOS.length} pasaron.`);
process.exit(fallas ? 1 : 0);
