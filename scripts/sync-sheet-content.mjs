import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const sheetId = process.env.AURUM_CONTENT_SHEET_ID?.trim();
const outputPath = path.resolve("content/site-content.json");

const gids = {
  content: process.env.AURUM_GID_CONTENT || "1148000214",
  projects: process.env.AURUM_GID_PROJECTS || "746865260",
  services: process.env.AURUM_GID_SERVICES || "1889524806",
  method: process.env.AURUM_GID_METHOD || "92008991",
  faq: process.env.AURUM_GID_FAQ || "1594220214",
  lists: process.env.AURUM_GID_LISTS || "717783492",
  theme: process.env.AURUM_GID_THEME || "67188492",
  social: process.env.AURUM_GID_SOCIAL || "1438801123",
  system: process.env.AURUM_GID_SYSTEM || "1805533101",
  stories: process.env.AURUM_GID_STORIES || "1805533103",
};

if (!sheetId) {
  console.log("AURUM_CONTENT_SHEET_ID no está configurado; se conserva el contenido aprobado del repositorio.");
  process.exit(0);
}

function parseCsv(input) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (quoted) {
      if (char === '"' && input[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell || row.length) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows.filter((values) => values.some((value) => value.trim() !== ""));
}

function normalize(value) {
  return String(value ?? "").trim();
}

function records(rows) {
  const [header, ...body] = rows;
  if (!header) return [];
  const names = header.map((value) => normalize(value).toLowerCase());
  return body.map((values) => Object.fromEntries(names.map((name, index) => [name, normalize(values[index])])));
}

function enabled(value) {
  return ["sí", "si", "true", "1", "yes"].includes(normalize(value).toLowerCase());
}

function order(value, fallback) {
  const parsed = Number.parseInt(normalize(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function metric(value) {
  const parsed = Number.parseFloat(normalize(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

async function load(gid, label) {
  const url = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheetId)}/export?format=csv&gid=${encodeURIComponent(gid)}`;
  const response = await fetch(url, { headers: { "user-agent": "aurum-content-sync/1.0" } });
  if (!response.ok) {
    throw new Error(`${label}: Google Sheets respondió HTTP ${response.status}. Confirma que la hoja permita lectura por enlace.`);
  }
  return records(parseCsv(await response.text()));
}

const [contentRows, projectRows, serviceRows, methodRows, faqRows, listRows, themeRows, socialRows, systemRows, storyRows] = await Promise.all([
  load(gids.content, "CONTENIDO"),
  load(gids.projects, "PROYECTOS"),
  load(gids.services, "SERVICIOS"),
  load(gids.method, "METODO"),
  load(gids.faq, "FAQ"),
  load(gids.lists, "LISTAS"),
  load(gids.theme, "TEMA"),
  load(gids.social, "PUBLICACIONES"),
  load(gids.system, "SISTEMA_AGENTE"),
  load(gids.stories, "HISTORIAS"),
]);

const system = Object.fromEntries(systemRows
  .filter((row) => row.grupo && row.clave)
  .map((row) => [`${row.grupo}.${row.clave}`, row.valor]));

function settingNumber(key, fallback) {
  const parsed = Number.parseFloat(system[key]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const likesWeight = settingNumber("ranking.likes_weight", 1);
const commentsWeight = settingNumber("ranking.comments_weight", 4);
const repostsWeight = settingNumber("ranking.reposts_weight", 6);
const deepCaseCount = settingNumber("ranking.deep_case_count", 4);
const standaloneProjectId = system["editorial.standalone_project_id"] || "_editorial";
const approvedInstagramHandles = new Set([
  system["fuente.instagram_handle"] || "aurumarquitectos",
  ...normalize(system["fuente.approved_collaboration_handles"]).split(",").map((handle) => handle.trim()).filter(Boolean),
]);

const content = Object.fromEntries(contentRows.filter((row) => row.clave).map((row) => [row.clave, {
  section: row["sección"] || row.seccion || "",
  field: row.campo || "",
  text: row.texto || "",
  href: row.enlace || "",
  image: row.imagen || "",
  active: enabled(row.activo),
}]));

const social = socialRows.filter((row) => row["publicación_id"] || row.publicacion_id).map((row) => {
  const likes = metric(row.likes);
  const comments = metric(row.comentarios);
  const reposts = metric(row.reposts);
  return {
    date: row.fecha || "",
    id: row["publicación_id"] || row.publicacion_id,
    projectId: row.proyecto_id || "",
    type: row.tipo || "publicación",
    title: row["título_web"] || row.titulo_web,
    text: row.copy_web || "",
    image: row.imagen || "",
    href: row.enlace || "",
    likes,
    comments,
    reposts,
    score: (likes * likesWeight) + (comments * commentsWeight) + (reposts * repostsWeight),
    approved: normalize(row["aprobación"] || row.aprobacion).toLowerCase() === "aprobado",
    active: enabled(row.activo) && normalize(row["aprobación"] || row.aprobacion).toLowerCase() === "aprobado",
    featured: enabled(row.destacado),
    notes: row.notas || "",
  };
});

const stories = storyRows.filter((row) => row.historia_id).map((row) => ({
  id: row.historia_id,
  projectId: row.proyecto_id || "",
  name: row.nombre || "",
  type: row.tipo || "destacado",
  image: row.imagen || "",
  href: row.enlace || "",
  text: row.contexto || "",
  active: enabled(row.activo) && normalize(row["aprobación"] || row.aprobacion).toLowerCase() === "aprobado",
  approved: normalize(row["aprobación"] || row.aprobacion).toLowerCase() === "aprobado",
  notes: row.notas || "",
}));

const socialByProject = new Map();
for (const post of social.filter((item) => item.active && item.projectId && item.projectId !== standaloneProjectId)) {
  const current = socialByProject.get(post.projectId) || { score: 0, likes: 0, comments: 0, reposts: 0, posts: 0 };
  current.score += post.score;
  current.likes += post.likes;
  current.comments += post.comments;
  current.reposts += post.reposts;
  current.posts += 1;
  socialByProject.set(post.projectId, current);
}

const rankedProjects = projectRows.filter((row) => row.id).map((row, index) => {
  const socialMetrics = socialByProject.get(row.id) || { score: 0, likes: 0, comments: 0, reposts: 0, posts: 0 };
  return {
    order: order(row.orden, index + 1), id: row.id, name: row.nombre, category: row["categoría"] || row.categoria,
    description: row["descripción"] || row.descripcion, image: row.imagen, alt: row.alt, href: row.enlace,
    active: enabled(row.activo), featured: enabled(row.destacado), challenge: row.reto, response: row.respuesta,
    result: row.resultado || "", location: row["ubicación"] || row.ubicacion || "", year: row["año"] || row.ano || "",
    detailPreference: normalize(row.profundidad).toLowerCase() || "auto",
    socialScore: socialMetrics.score, socialLikes: socialMetrics.likes, socialComments: socialMetrics.comments,
    socialReposts: socialMetrics.reposts, socialPosts: socialMetrics.posts,
  };
}).sort((a, b) => b.socialScore - a.socialScore || a.order - b.order).map((project, index) => ({
  ...project,
  rank: index + 1,
  detailLevel: project.detailPreference === "amplia" ? "deep" : project.detailPreference === "compacta" ? "compact" : index < deepCaseCount ? "deep" : "compact",
}));

const data = {
  version: 1,
  updatedAt: new Date().toISOString(),
  system,
  content,
  projects: rankedProjects,
  social,
  stories,
  services: serviceRows.filter((row) => row["título"] || row.titulo).map((row, index) => ({
    order: order(row.orden, index + 1), number: normalize(row["número"] || row.numero).padStart(2, "0"),
    title: row["título"] || row.titulo, text: row.texto, active: enabled(row.activo),
  })),
  method: methodRows.filter((row) => row["título"] || row.titulo).map((row, index) => ({
    order: order(row.orden, index + 1), number: normalize(row["número"] || row.numero).padStart(2, "0"),
    title: row["título"] || row.titulo, text: row.texto, active: enabled(row.activo),
  })),
  faq: faqRows.filter((row) => row.pregunta).map((row, index) => ({
    order: order(row.orden, index + 1), question: row.pregunta, answer: row.respuesta, active: enabled(row.activo),
  })),
  lists: listRows.filter((row) => row.grupo && row.texto).map((row, index) => ({
    group: row.grupo, order: order(row.orden, index + 1), text: row.texto, detail: row.detalle,
    href: row.enlace, active: enabled(row.activo),
  })),
  theme: Object.fromEntries(themeRows.filter((row) => row.clave && enabled(row.activo)).map((row) => [row.clave, row.valor])),
};

const required = ["brand.name", "hero.title", "hero.primaryCta", "contact.primaryCta"];
for (const key of required) {
  if (!data.content[key]?.text) throw new Error(`Falta contenido obligatorio: ${key}`);
}
if (!data.projects.some((project) => project.active)) throw new Error("Debe existir al menos un proyecto activo.");
if (!data.services.some((service) => service.active)) throw new Error("Debe existir al menos un servicio activo.");

const publicationIds = social.map((post) => post.id);
const duplicatePublicationIds = publicationIds.filter((id, index) => publicationIds.indexOf(id) !== index);
if (duplicatePublicationIds.length) throw new Error(`PUBLICACIONES contiene IDs duplicados: ${[...new Set(duplicatePublicationIds)].join(", ")}`);

const projectIds = new Set(rankedProjects.map((project) => project.id));
for (const post of social.filter((item) => item.approved)) {
  if (!post.projectId || (post.projectId !== standaloneProjectId && !projectIds.has(post.projectId))) {
    throw new Error(`La publicación ${post.id} no tiene un proyecto_id válido.`);
  }
  let sourceHandle = "";
  try {
    const sourceUrl = new URL(post.href);
    sourceHandle = sourceUrl.hostname === "www.instagram.com" ? sourceUrl.pathname.split("/").filter(Boolean)[0] || "" : "";
  } catch {
    sourceHandle = "";
  }
  if (!approvedInstagramHandles.has(sourceHandle)) throw new Error(`La publicación ${post.id} no pertenece a una fuente de Instagram aprobada.`);
  if (!post.image.startsWith("https://")) throw new Error(`La publicación ${post.id} no tiene una imagen HTTPS pública.`);
  if (!post.title || !post.text) throw new Error(`La publicación ${post.id} necesita título y copy web.`);
}

for (const story of stories.filter((item) => item.approved)) {
  if (!story.projectId || !projectIds.has(story.projectId)) {
    throw new Error(`La historia ${story.id} no tiene un proyecto_id válido.`);
  }
  let sourceHandle = "";
  try {
    const sourceUrl = new URL(story.href);
    sourceHandle = sourceUrl.hostname === "www.instagram.com" ? sourceUrl.pathname.split("/").filter(Boolean)[0] || "" : "";
  } catch {
    sourceHandle = "";
  }
  if (sourceHandle !== "stories") throw new Error(`La historia ${story.id} no enlaza a un destacado oficial de Instagram.`);
  if (!story.name || !story.text) throw new Error(`La historia ${story.id} necesita nombre y contexto web.`);
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Contenido sincronizado: ${data.projects.length} proyectos, ${data.social.length} publicaciones, ${data.stories.length} historias, ${data.services.length} servicios, ${data.faq.length} preguntas.`);
