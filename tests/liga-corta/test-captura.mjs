/* Prueba el OTRO lado: capturarOrigen() del cuestionario, tal como quedo tras el
   cambio R41. Lo que se verifica: que el lead que paso por la liga corta quede
   registrado con el origen REAL (instagram.com) y no con el rebote. */
import { readFileSync } from "node:fs";
import vm from "node:vm";

const HTML = readFileSync("/Users/a./aurum-experiencia/index.html", "utf8");
const i = HTML.indexOf("function capturarOrigen()");
const j = HTML.indexOf("\ncapturarOrigen();", i);
if (i < 0 || j < 0) { console.error("No encontre capturarOrigen()"); process.exit(1); }
const FN = HTML.slice(i, j);

const HOST = "aurumarquitectos.github.io";

function correr({ search, referrer }) {
  const S = {};
  const ctx = {
    URLSearchParams, S,
    sessionStorage: { getItem: () => null, setItem: () => {} },
    document: { referrer },
    location: { host: HOST, search },
    window: { matchMedia: () => ({ matches: false }) },
  };
  vm.createContext(ctx);
  vm.runInContext(FN + "\ncapturarOrigen();", ctx);
  return S;
}

const IG = "https://l.instagram.com/";
const REBOTE = "https://aurumarquitectos.github.io/r/?ig260908";
const UTM = "?utm_source=instagram&utm_medium=social&utm_campaign=ig-2026-09-08";

const CASOS = [
  {
    n: "Via liga corta: guarda instagram.com, NO el rebote",
    e: { search: UTM + "&ro=" + encodeURIComponent(IG), referrer: REBOTE },
    campo: "referrer", espera: IG,
  },
  {
    n: "Via liga corta: la campana llega intacta",
    e: { search: UTM + "&ro=" + encodeURIComponent(IG), referrer: REBOTE },
    campo: "utm_campaign", espera: "ig-2026-09-08",
  },
  {
    n: "Via liga corta: fbclid llega intacto",
    e: { search: UTM + "&fbclid=IwAR_PRUEBA_123&ro=" + encodeURIComponent(IG), referrer: REBOTE },
    campo: "fbclid", espera: "IwAR_PRUEBA_123",
  },
  {
    n: "Liga LARGA de siempre: sin cambio de comportamiento",
    e: { search: UTM, referrer: IG },
    campo: "referrer", espera: IG,
  },
  {
    n: "Entrada directa: referrer vacio, sin romperse",
    e: { search: "", referrer: "" },
    campo: "referrer", espera: "",
  },
  {
    n: "HALLAZGO EN VIVO: sin 'ro', el rebote NO se registra como origen",
    e: { search: UTM, referrer: REBOTE },
    campo: "referrer", espera: "",
  },
  {
    n: "Ruta fija /r/bio tampoco se registra como origen",
    e: { search: UTM, referrer: "https://aurumarquitectos.github.io/r/bio" },
    campo: "referrer", espera: "",
  },
  {
    n: "Navegacion interna del cuestionario NO se borra",
    e: { search: UTM, referrer: "https://aurumarquitectos.github.io/experiencia/aviso-privacidad.html" },
    campo: "referrer", espera: "https://aurumarquitectos.github.io/experiencia/aviso-privacidad.html",
  },
];

let fallas = 0;
for (const c of CASOS) {
  const real = correr(c.e)[c.campo];
  const ok = real === c.espera;
  if (!ok) fallas++;
  console.log(`${ok ? "OK  " : "FALLA"}  ${c.n}`);
  if (!ok) console.log(`        ${c.campo} esperaba: ${JSON.stringify(c.espera)}\n        ${c.campo} obtuvo:   ${JSON.stringify(real)}`);
}
console.log(`\n${CASOS.length - fallas}/${CASOS.length} pasaron.`);
process.exit(fallas ? 1 : 0);
