/* liga.py tiene que dar EXACTAMENTE lo mismo que el rebote y que el board.
   Es la tercera copia de la convencion: si se despega, una liga hecha desde la
   terminal cae en otra campana que la misma liga hecha desde el tablero. */
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import vm from "node:vm";

const LIGA_PY = "/Users/a./yod_audit/liga.py";
const REBOTE = readFileSync("/Users/a./aurumarquitectos.github.io/public/r/index.html", "utf8");
const SCRIPT = REBOTE.match(/<script>([\s\S]*?)<\/script>/)[1];

function py(expr) {
  return execFileSync("python3", ["-c",
    `import sys; sys.path.insert(0,"/Users/a./yod_audit"); import liga; print(${expr})`],
    /* stderr a "pipe": el caso que comprueba que liga.py se NIEGA lanza un
       traceback esperado, y heredarlo ensuciaria la salida de la suite. */
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}
function rebotar(url) {
  const u = new URL(url);
  /* Las rutas fijas (/r/bio, /r/fb) son carpetas propias con el codigo
     incrustado en window.__C, no un query: hay que correr ESE archivo, que es
     lo que sirve GitHub Pages. Simular solo el query las dejaria sin UTM. */
  const fija = u.pathname.match(/^\/r\/([a-z0-9-]+)\/?$/);
  const fuente = fija
    ? readFileSync(`/Users/a./aurumarquitectos.github.io/public/r/${fija[1]}/index.html`, "utf8")
    : REBOTE;
  let d = null;
  const ctx = { URLSearchParams, URL, window: {}, document: { referrer: "" },
    location: { host: "aurumarquitectos.github.io", search: u.search,
      replace: (x) => { d = x; }, set href(x) { d = x; } } };
  ctx.window.location = ctx.location;
  vm.createContext(ctx);
  for (const m of fuente.matchAll(/<script>([\s\S]*?)<\/script>/g)) vm.runInContext(m[1], ctx);
  return d;
}
const alCuest = (u) => u.replace("https://yodesarrollo.github.io/plan-potencial/",
                                 "https://aurumarquitectos.github.io/experiencia/");

/* Cada caso: la corta de liga.py, pasada por el rebote, debe dar lo mismo que
   la larga de liga.py — que es la referencia de siempre. */
const CASOS = [
  { n: "publicacion ig con fecha",
    corta: `liga.liga("ig","","2026-09-08","cuestionario")`,
    larga: `liga.liga("ig","","2026-09-08","potencial")` },
  { n: "publicacion fb con pieza",
    corta: `liga.liga("fb","semana-ppp-pub1","2026-09-08","cuestionario")`,
    larga: `liga.liga("fb","semana-ppp-pub1","2026-09-08","potencial")` },
  { n: "tiktok con fecha",
    corta: `liga.liga("tt","","2026-09-08","cuestionario")`,
    larga: `liga.liga("tt","","2026-09-08","potencial")` },
  { n: "canal fuera de la tabla",
    corta: `liga.liga("revista","expo","2026-09-08","cuestionario")`,
    larga: `liga.liga("revista","expo","2026-09-08","potencial")` },
  { n: "FIJA · QR de lona",
    corta: `liga.liga_fija("qr","lona obra","cuestionario")`,
    larga: `liga.liga_fija("qr","lona obra","potencial")` },
  { n: "FIJA · firma de WhatsApp",
    corta: `liga.liga_fija("wa","firma","cuestionario")`,
    larga: `liga.liga_fija("wa","firma","potencial")` },
  { n: "FIJA · correo",
    corta: `liga.liga_fija("em","newsletter","cuestionario")`,
    larga: `liga.liga_fija("em","newsletter","potencial")` },
  { n: "FIJA · pieza 'bio' cae en medium=bio",
    corta: `liga.liga_fija("ig","bio","cuestionario")`,
    larga: `liga.liga_fija("ig","bio","potencial")` },
  { n: "bio del perfil (ruta fija /r/bio)",
    corta: `liga.liga_bio("ig","cuestionario")`,
    larga: `liga.liga_bio("ig","potencial")` },
  { n: "bio de un canal sin carpeta publicada",
    corta: `liga.liga_bio("tt","cuestionario")`,
    larga: `liga.liga_bio("tt","potencial")` },
];

let fallas = 0;
for (const c of CASOS) {
  const corta = py(c.corta), debe = alCuest(py(c.larga));
  const llega = rebotar(corta);
  const ok = llega === debe;
  if (!ok) fallas++;
  console.log(`${ok ? "OK  " : "FALLA"}  ${c.n}  ->  ${corta}`);
  if (!ok) console.log(`        llega: ${llega}\n        debia: ${debe}`);
}

/* una liga sin fecha y sin nombre no identifica nada: debe negarse, no inventar */
let nego = false;
try { py(`liga.liga_fija("qr","","cuestionario")`); }
catch (e) { nego = true; }
if (!nego) fallas++;
console.log(`${nego ? "OK  " : "FALLA"}  fija sin pieza se niega (no inventa campana)`);

console.log(`\n${CASOS.length + 1 - fallas}/${CASOS.length + 1} pasaron.`);
process.exit(fallas ? 1 : 0);
