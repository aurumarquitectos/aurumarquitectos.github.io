/* LA prueba que importa: board -> liga corta -> rebote -> destino.
   Compara el resultado contra la liga LARGA que el board generaba antes del
   cambio. Si las dos no coinciden caracter por caracter, la atribucion cambio
   y pull_metrics.py dejaria de cruzar los leads con su publicacion. */
import { readFileSync } from "node:fs";
import vm from "node:vm";

/* ---- lado board: se extraen las piezas reales del index.html en vivo ---- */
const BOARD = readFileSync("/Users/a./aurum-board/index.html", "utf8");
function trozo(desde, hasta) {
  const i = BOARD.indexOf(desde);
  const j = BOARD.indexOf(hasta, i);
  if (i < 0 || j < 0) throw new Error("no encontre: " + desde);
  return BOARD.slice(i, j);
}
const SRC_BOARD =
  trozo("var LG_DEST=", "window.genLinkFB=") +
  "\nglobalThis.lgArma = lgArma;";
const ctxB = { console };
vm.createContext(ctxB);
vm.runInContext(SRC_BOARD, ctxB);
const lgArma = ctxB.lgArma;

/* ---- lado rebote ---- */
const REBOTE = readFileSync("/Users/a./aurumarquitectos.github.io/public/r/index.html", "utf8");
const SCRIPT = REBOTE.match(/<script>([\s\S]*?)<\/script>/)[1];
const HOST = "aurumarquitectos.github.io";
function rebotar(url) {
  const u = new URL(url);
  let destino = null;
  const ctx = { URLSearchParams, URL, window: {}, document: { referrer: "" },
    location: { host: HOST, search: u.search, replace: (x) => { destino = x; }, set href(x) { destino = x; } },
  };
  ctx.window.location = ctx.location;
  vm.createContext(ctx);
  vm.runInContext(SCRIPT, ctx);
  return destino;
}

/* la liga larga tal como la armaba el board ANTES (referencia congelada) */
const DEST = "https://aurumarquitectos.github.io/experiencia/";
const FUENTE = { fb: "facebook", ig: "instagram" };
const larga = (red, campana, pieza) =>
  DEST + "?utm_source=" + FUENTE[red] + "&utm_medium=social&utm_campaign=" + red + "-" + campana +
  (pieza ? "&utm_content=" + pieza : "");

const CASOS = [
  { n: "IG, publicacion nueva",        red: "ig", corto: "260908",      campana: "2026-09-08", pieza: "" },
  { n: "FB, publicacion nueva",        red: "fb", corto: "260908",      campana: "2026-09-08", pieza: "" },
  { n: "IG, con pieza de serie",       red: "ig", corto: "260908",      campana: "2026-09-08", pieza: "semana-ppp-pub1" },
  { n: "FB, post ya publicado",        red: "fb", corto: "_1809876543", campana: "1809876543", pieza: "" },
  { n: "IG, post ya publicado",        red: "ig", corto: "_1780123456", campana: "1780123456", pieza: "" },
  { n: "Fin de anio (31-dic)",         red: "ig", corto: "261231",      campana: "2026-12-31", pieza: "" },
  { n: "Inicio de anio (1-ene-2027)",  red: "fb", corto: "270101",      campana: "2027-01-01", pieza: "" },
];

let fallas = 0;
for (const c of CASOS) {
  const corta = lgArma("cuest", c.red, c.corto, c.campana, c.pieza);
  const llega = rebotar(corta);
  const debe = larga(c.red, c.campana, c.pieza);
  const ok = llega === debe;
  if (!ok) fallas++;
  console.log(`${ok ? "OK  " : "FALLA"}  ${c.n}`);
  console.log(`        corta (${corta.length} car.): ${corta}`);
  if (!ok) console.log(`        llega a: ${llega}\n        debia:   ${debe}`);
}

/* el Plan de Potencial NO debe acortarse: es otro dominio, otra marca */
const pot = lgArma("pot", "ig", "260908", "2026-09-08", "");
const potOK = pot.startsWith("https://yodesarrollomx.github.io/plan-potencial/?utm_source=");
if (!potOK) fallas++;
console.log(`${potOK ? "OK  " : "FALLA"}  Plan de Potencial sigue con liga larga (marca YOD intacta)`);

console.log(`\n${CASOS.length + 1 - fallas}/${CASOS.length + 1} pasaron.`);
process.exit(fallas ? 1 : 0);
