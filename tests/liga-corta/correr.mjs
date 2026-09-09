#!/usr/bin/env node
/* Corre las 6 suites de la liga corta y devuelve 1 si alguna falla.
 *     node tests/liga-corta/correr.mjs
 *
 * Las pruebas leen los archivos REALES de los tres repos (el rebote de aquí, el
 * cuestionario y el aurum-board), no copias: si alguien cambia la convencion en
 * uno solo, la suite lo caza antes de que el Sheet muestre la campaña partida.
 * Por eso esperan los tres clones hermanos en el home; si falta alguno, lo dice
 * en vez de fallar por otra razon.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
const REPOS = ["/Users/a./aurum-experiencia/index.html", "/Users/a./aurum-board/index.html"];
const faltan = REPOS.filter((p) => !existsSync(p));
if (faltan.length) {
  console.error("Faltan los clones hermanos que estas pruebas leen:\n  " + faltan.join("\n  "));
  process.exit(2);
}

const SUITES = ["test-rebote", "test-captura", "test-bio", "test-ida-vuelta", "test-canales", "test-embudo"];
let total = 0, fallaron = 0;
for (const s of SUITES) {
  let salida = "", ok = true;
  try { salida = execFileSync("node", [join(aqui, s + ".mjs")], { encoding: "utf8" }); }
  catch (e) { salida = (e.stdout || "") + (e.stderr || ""); ok = false; fallaron++; }
  const linea = (salida.match(/^\d+\/\d+ pasaron\./m) || ["(sin resumen)"])[0];
  total += parseInt(linea, 10) || 0;
  console.log(`  ${ok ? "OK  " : "FALLA"}  ${s.padEnd(16)} ${linea}`);
  if (!ok) console.log(salida.split("\n").filter((l) => l.startsWith("FALLA") || l.startsWith("        ")).join("\n"));
}
console.log(`\n  ${total} pruebas en verde${fallaron ? `, ${fallaron} suite(s) con fallas` : ", todas pasaron"}.`);
process.exit(fallaron ? 1 : 0);
