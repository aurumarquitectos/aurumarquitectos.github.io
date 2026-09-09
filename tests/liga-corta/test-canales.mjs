/* Canales mas alla de FB/IG, incluido el QR impreso y un canal que NO esta en
   la tabla (la prueba de que el dia que aparezca uno nuevo no hay que desplegar). */
import { readFileSync } from "node:fs";
import vm from "node:vm";
const HTML = readFileSync("/Users/a./aurumarquitectos.github.io/public/r/index.html", "utf8");
const SCRIPT = HTML.match(/<script>([\s\S]*?)<\/script>/)[1];
const HOST = "aurumarquitectos.github.io";
const BASE = "https://aurumarquitectos.github.io/experiencia/";
function rebotar(search) {
  let d = null;
  const ctx = { URLSearchParams, URL, window: {}, document: { referrer: "" },
    location: { host: HOST, search, replace: (x) => { d = x; }, set href(x) { d = x; } } };
  ctx.window.location = ctx.location;
  vm.createContext(ctx); vm.runInContext(SCRIPT, ctx); return d;
}
const C = [
  { n: "QR de lona (sin fecha: vive meses)", s: "?qr-lona-obra",
    e: BASE + "?utm_source=qr&utm_medium=impreso&utm_campaign=qr-lona-obra&utm_content=lona-obra" },
  { n: "QR de tarjeta de presentacion", s: "?qr-tarjeta",
    e: BASE + "?utm_source=qr&utm_medium=impreso&utm_campaign=qr-tarjeta&utm_content=tarjeta" },
  { n: "QR de campana con fecha", s: "?qr260908-volante",
    e: BASE + "?utm_source=qr&utm_medium=impreso&utm_campaign=qr-2026-09-08&utm_content=volante" },
  { n: "WhatsApp (firma permanente)", s: "?wa-firma",
    e: BASE + "?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=wa-firma&utm_content=firma" },
  { n: "Correo", s: "?em-newsletter",
    e: BASE + "?utm_source=correo&utm_medium=email&utm_campaign=em-newsletter&utm_content=newsletter" },
  { n: "TikTok con fecha", s: "?tt260908",
    e: BASE + "?utm_source=tiktok&utm_medium=social&utm_campaign=tt-2026-09-08" },
  { n: "YouTube bio", s: "?ytbio",
    e: BASE + "?utm_source=youtube&utm_medium=bio&utm_campaign=yt-bio" },
  { n: "Canal NUEVO fuera de la tabla (sin desplegar)", s: "?revista-expo",
    e: BASE + "?utm_source=revista&utm_medium=otro&utm_campaign=revista-expo&utm_content=expo" },
  { n: "Canal a secas (sin campana) -> sin UTM, no inventa", s: "?wa", e: BASE },
  { n: "Canal a secas ig -> sin UTM", s: "?ig", e: BASE },
];
let f = 0;
for (const c of C) {
  const r = rebotar(c.s); const ok = r === c.e; if (!ok) f++;
  console.log(`${ok ? "OK  " : "FALLA"}  ${c.n}`);
  if (!ok) console.log(`        esperaba: ${c.e}\n        obtuvo:   ${r}`);
}
console.log(`\n${C.length - f}/${C.length} pasaron.`);
process.exit(f ? 1 : 0);
