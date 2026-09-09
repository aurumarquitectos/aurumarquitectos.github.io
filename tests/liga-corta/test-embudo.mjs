/* Ida y vuelta del embudo COMPLETO: el board arma la liga corta, el rebote la
   desdobla, y el resultado debe ser identico a la liga larga que el board arma
   para el destino sin rebote. Si no coinciden, el mismo canal caeria en dos
   campanas distintas segun el destino. */
import { readFileSync } from "node:fs";
import vm from "node:vm";

const BOARD = readFileSync("/Users/a./aurum-board/index.html", "utf8");
const i = BOARD.indexOf("/* ESPEJO de la tabla CANALES");
const j = BOARD.indexOf("/* cambioCanal=true", i);
const SRC = 'var LG_DEST={pot:"https://yodesarrollomx.github.io/plan-potencial/",cuest:"https://aurumarquitectos.github.io/experiencia/"};'
  + 'var LG_CORTO={cuest:"https://aurumarquitectos.github.io/r/"};'
  + 'function lgSlug(s){return String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,48);}'
  + BOARD.slice(i, j)
  + "\nglobalThis.lgArma=lgArma;globalThis.lgArmaFija=lgArmaFija;";
const cb = { console }; vm.createContext(cb); vm.runInContext(SRC, cb);

const REBOTE = readFileSync("/Users/a./aurumarquitectos.github.io/public/r/index.html", "utf8");
const SCRIPT = REBOTE.match(/<script>([\s\S]*?)<\/script>/)[1];
function rebotar(url) {
  const u = new URL(url); let d = null;
  const ctx = { URLSearchParams, URL, window: {}, document: { referrer: "" },
    location: { host: "aurumarquitectos.github.io", search: u.search, replace: (x) => { d = x; }, set href(x) { d = x; } } };
  ctx.window.location = ctx.location; vm.createContext(ctx); vm.runInContext(SCRIPT, ctx); return d;
}
/* la liga larga del board para el MISMO caso, con el destino sin rebote,
   traida al dominio del cuestionario para poder comparar caracter por caracter */
const alCuest = (u) => u.replace("https://yodesarrollomx.github.io/plan-potencial/", "https://aurumarquitectos.github.io/experiencia/");

const CON_FECHA = [
  ["ig", "260908", "2026-09-08", ""], ["fb", "260908", "2026-09-08", "pub3"],
  ["tt", "260908", "2026-09-08", ""], ["yt", "261231", "2026-12-31", ""],
  ["qr", "260908", "2026-09-08", "volante"], ["wa", "270101", "2027-01-01", ""],
  ["revista", "260908", "2026-09-08", "expo"],
];
const FIJAS = [
  ["qr", "lona-obra"], ["qr", "tarjeta"], ["wa", "firma"], ["em", "newsletter"],
  ["ig", "bio"], ["fb", "bio"], ["we", "footer"], ["revista", "expo"],
];

let f = 0, n = 0;
for (const [canal, corto, campana, pieza] of CON_FECHA) {
  const c = cb.lgArma("cuest", canal, corto, campana, pieza);
  const llega = rebotar(c);
  const debe = alCuest(cb.lgArma("pot", canal, corto, campana, pieza));
  const ok = llega === debe; n++; if (!ok) f++;
  console.log(`${ok ? "OK  " : "FALLA"}  con fecha · ${canal}${pieza ? " · " + pieza : ""}  ->  ${c}`);
  if (!ok) console.log(`        llega: ${llega}\n        debia: ${debe}`);
}
for (const [canal, pieza] of FIJAS) {
  const c = cb.lgArmaFija("cuest", canal, pieza);
  const llega = rebotar(c);
  const debe = alCuest(cb.lgArmaFija("pot", canal, pieza));
  const ok = llega === debe; n++; if (!ok) f++;
  console.log(`${ok ? "OK  " : "FALLA"}  sin fecha · ${canal} · ${pieza}  ->  ${c}`);
  if (!ok) console.log(`        llega: ${llega}\n        debia: ${debe}`);
}
console.log(`\n${n - f}/${n} pasaron.`);
process.exit(f ? 1 : 0);
