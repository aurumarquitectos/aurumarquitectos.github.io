"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import siteData from "@/content/site-content.json";

type ContentEntry = { text: string; href: string; image: string; active: boolean };
const content = siteData.content as Record<string, ContentEntry>;
const entry = (key: string) => content[key] ?? { text: "", href: "", image: "", active: false };
const text = (key: string) => entry(key).text;
const href = (key: string) => entry(key).href;
const image = (key: string) => entry(key).image;
// Claves nuevas: si la fila existe en el Sheet manda el Sheet (texto vacío = ocultar); si no existe, aplica el respaldo aprobado.
const textOr = (key: string, fallback: string) => (key in content ? content[key].text : fallback);
const hrefOr = (key: string, fallback: string) => (key in content && content[key].href ? content[key].href : fallback);

const whatsappFallback =
  "https://wa.me/526622000340?text=" +
  encodeURIComponent("Hola, Arq. Sayri Fraijo. Vengo del sitio de Aurum Arquitectos y me gustaría agendar una Sesión de Claridad. Mi caso: ");

const profileStack = [
  textOr("profile.stack1", "Tu Perfil de Vida: carácter, estilo y atmósferas que definen tu residencia"),
  textOr("profile.stack2", "Una lectura escrita de cómo quieres sentir, usar y proyectar tu casa — revisada personalmente por un arquitecto del estudio"),
  textOr("profile.stack3", "Un estimado inicial de alcance e inversión, preparado en privado para tu correo"),
].filter(Boolean);
const profileTimeframe = textOr("profile.timeframe", "90 segundos hoy · tu lectura completa en tu correo al día siguiente");
const profilePromise = textOr(
  "profile.deliveryPromise",
  "Tu lectura llega a tu correo al día siguiente, revisada personalmente por un arquitecto del estudio.",
);
const profileScarcity = textOr(
  "profile.scarcity",
  "Tomamos 6 proyectos residenciales por año para proteger la profundidad de cada uno. La agenda se abre por compatibilidad, no por orden de llegada.",
);
const methodCredentials = textOr(
  "method.credentials",
  "Estudio de autor en Hermosillo · 10 años diseñando residencias · arquitectura, interiores y comercial bajo una misma intención",
);
const sessionNote = textOr("contact.sessionNote", "La Sesión es ideal si ya tienes tu lectura del Perfil de Vida.");
const guaranteeLabel = textOr("contact.guaranteeLabel", "Nuestra garantía");
const guaranteeText = textOr(
  "contact.guarantee",
  "La Sesión de Claridad termina donde tú decidas. Si eliges no avanzar, las conclusiones son tuyas — sin seguimiento insistente y sin compromiso.",
);
const contactUrgency = textOr("contact.urgency", "La agenda de Sesiones de Claridad se abre y se cierra con la capacidad real del estudio.");
const whatsappLabel = textOr("contact.whatsapp", "Escribir al estudio");
const whatsappHref = hrefOr("contact.whatsapp", whatsappFallback);

const nav = siteData.lists
  .filter((item) => item.active && item.group === "navegación")
  .sort((a, b) => a.order - b.order);
const principles = siteData.lists.filter((item) => item.active && item.group === "principios").sort((a, b) => a.order - b.order);
const patrimonyPoints = siteData.lists.filter((item) => item.active && item.group === "patrimonio").sort((a, b) => a.order - b.order);
const fitYes = siteData.lists.filter((item) => item.active && item.group === "encajamos").sort((a, b) => a.order - b.order);
const fitNo = siteData.lists.filter((item) => item.active && item.group === "no_encajamos").sort((a, b) => a.order - b.order);
const services = siteData.services.filter((item) => item.active).sort((a, b) => a.order - b.order);
const method = siteData.method.filter((item) => item.active).sort((a, b) => a.order - b.order);
const faqs = siteData.faq.filter((item) => item.active).sort((a, b) => a.order - b.order);
const projects = siteData.projects.filter((item) => item.active).sort((a, b) => a.rank - b.rank || a.order - b.order);
const featuredProject = projects.find((item) => item.featured) ?? projects[0];
const projectCards = projects.filter((item) => item.id !== featuredProject?.id);
const deepCaseProjects = projects.filter((item) => item.detailLevel === "deep" && item.id !== featuredProject?.id);
const socialGridCount = Number(siteData.system["ranking.social_grid_count"] || 8);
const socialPosts = siteData.social
  .filter((item) => item.active && item.image && item.href)
  .sort((a, b) => b.score - a.score)
  .filter((item) => item.featured || item.type === "reel")
  .slice(0, socialGridCount);
const storyHighlights = siteData.stories.filter((item) => item.active && item.href);
const projectSources = (projectId: string) => [
  ...siteData.social
    .filter((item) => item.active && item.projectId === projectId)
    .sort((a, b) => b.score - a.score)
    .map((item) => ({ id: item.id, type: item.type, title: item.title, href: item.href })),
  ...storyHighlights
    .filter((item) => item.projectId === projectId)
    .map((item) => ({ id: item.id, type: "historia", title: item.name, href: item.href })),
];

// Anti-prueba: nunca mostrar contadores en cero ni estados internos en crudo.
const projectLocation = (location: string) =>
  location && !/no publicada/i.test(location) ? location : textOr("work.locationFallback", "Ubicación reservada");
const relatedPostsLabel = (count: number) =>
  count === 1 ? "1 publicación relacionada" : `${count} publicaciones relacionadas`;
const projectMetaLine = (project: (typeof projects)[number]) =>
  [
    project.socialPosts > 0 ? relatedPostsLabel(project.socialPosts) : null,
    projectLocation(project.location),
    project.year,
  ]
    .filter(Boolean)
    .join(" · ");

const themeStyle = {
  "--ink": siteData.theme["color.ink"] || "#171714",
  "--cream": siteData.theme["color.cream"] || "#f2eee6",
  "--gold": siteData.theme["color.gold"] || "#ad7c45",
} as CSSProperties;

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function SourceLinks({ projectId }: { projectId: string }) {
  const sources = projectSources(projectId);
  if (!sources.length) return null;

  return (
    <div className="project-source-links" aria-label="Fuentes verificadas del proyecto">
      {sources.map((source, index) => (
        <a href={source.href} target="_blank" rel="noreferrer" key={source.id}>
          {source.type === "historia" ? "Historia destacada" : `${source.type} ${index + 1}`} <Arrow />
        </a>
      ))}
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    // Beacon de medición (1 por sesión, sin cookies): la visita a la landing cae a la
    // pestaña ACTIVIDAD del CRM como lp:vista y el aurum-board la dibuja antes de "Inicio".
    try {
      if (sessionStorage.getItem("aurum-lp-beacon")) return;
      sessionStorage.setItem("aurum-lp-beacon", "1");
      const fuente = document.referrer ? new URL(document.referrer).hostname : "(directo)";
      navigator.sendBeacon(
        "https://script.google.com/macros/s/AKfycbztAKA7K5QwO6k45PqjixYLNppLypzCpoz2KvNIkML8kciBLZVKKoais8__0DnYuEQQOg/exec",
        JSON.stringify({ tipo: "actividad", origen: "landing", fuente })
      );
    } catch {
      /* la medición jamás rompe la página */
    }
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main style={themeStyle}>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label={`${text("brand.name")}, inicio`}>
          <span className="brand-mark">Au</span>
          <span className="brand-name">{text("brand.name")}</span>
        </a>

        <nav className="desktop-nav" aria-label="Navegación principal">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.text}
            </a>
          ))}
        </nav>

        <a className="header-cta" href={href("header.cta")}>
          {text("header.cta")} <Arrow />
        </a>

        <button
          className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </header>

      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-meta">{text("header.location")}</div>
        <nav aria-label="Navegación móvil">
          {nav.map((item, index) => (
            <a key={item.href} href={item.href} onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
              <span>0{index + 1}</span>
              {item.text}
            </a>
          ))}
          <a href="#contacto" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
            <span>05</span>
            {text("nav.contactLabel") || "Contacto"}
          </a>
        </nav>
        <a
          className="mobile-menu-cta"
          href={href("hero.primaryCta")}
          target="_blank"
          rel="noreferrer"
          tabIndex={menuOpen ? 0 : -1}
        >
          {text("contact.primaryCta")} <Arrow />
        </a>
      </div>

      <section className="hero" id="inicio">
        <a className="hero-image-source" href={href("hero.imageLink")} target="_blank" rel="noreferrer" aria-label="Ver publicación fuente de la imagen principal">
          <img className="hero-image" src={image("hero.image")} alt={text("hero.imageAlt")} />
        </a>
        <div className="hero-shade" />
        <div className="hero-rail">
          <span>{text("hero.rail1")}</span>
          <span>{text("hero.rail2")}</span>
          <span>{text("hero.rail3")}</span>
        </div>
        <div className="hero-content">
          <p className="eyebrow light">{text("hero.eyebrow")}</p>
          <h1>
            {text("hero.title")}
            <em>{text("hero.titleAccent")}</em>
          </h1>
          <p className="hero-copy">
            {text("hero.copy")}
          </p>
          <div className="hero-actions">
            <a className="button button-gold" href={href("hero.primaryCta")} target="_blank" rel="noreferrer">
              {text("hero.primaryCta")} <Arrow />
            </a>
            <a className="text-link light-link" href={href("hero.secondaryCta")}>
              {text("hero.secondaryCta")} <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <div className="hero-index">{text("hero.index")}</div>
      </section>

      <section className="principles" aria-label="Principios Aurum">
        {principles.map((item) => (
          <article key={`${item.group}-${item.order}`}>
            <span>{String(item.order).padStart(2, "0")}</span>
            <p>
              {item.text}
              <br />
              <em>{item.detail}</em>
            </p>
          </article>
        ))}
      </section>

      <section className="intro section-pad" id="estudio">
        <div className="section-label">
          <span>01</span>
          <p>{text("intro.label")}</p>
        </div>
        <div className="intro-statement">
          <p className="display-kicker">{text("intro.kicker")}</p>
          <h2>
            {text("intro.title")}
            <em>{text("intro.titleAccent")}</em>
          </h2>
          <div className="intro-copy">
            <p>
              {text("intro.copy1")}
            </p>
            <p>
              {text("intro.copy2")}
            </p>
          </div>
        </div>
      </section>

      <section className="work" id="obra">
        <div className="work-heading section-pad">
          <div className="section-label light-label">
            <span>02</span>
            <p>{text("work.label")}</p>
          </div>
          <h2>
            {text("work.title")}
            <em>{text("work.titleAccent")}</em>
          </h2>
        </div>

        {featuredProject && <article className="project project-featured">
          <a
            className="project-image-wrap"
            href={featuredProject.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${text("work.projectCta") || "Ver proyecto"}: ${featuredProject.name}`}
          >
            <img src={featuredProject.image} alt={featuredProject.alt} />
            <span className="image-cursor">{text("work.projectCta") || "Ver proyecto"} <Arrow /></span>
          </a>
          <div className="project-copy">
            <div className="project-number">{String(featuredProject.rank).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} · selección por interés</div>
            <p className="eyebrow">{featuredProject.category}</p>
            <h3>{featuredProject.name}</h3>
            <p className="project-thesis">{featuredProject.description}</p>
            <dl>
              <div>
                <dt>{text("work.challengeLabel") || "El reto"}</dt>
                <dd>{featuredProject.challenge}</dd>
              </div>
              <div>
                <dt>{text("work.responseLabel") || "La respuesta"}</dt>
                <dd>{featuredProject.response}</dd>
              </div>
              <div>
                <dt>{text("work.resultLabel") || "El resultado"}</dt>
                <dd>{featuredProject.result}</dd>
              </div>
            </dl>
            <p className="project-source-note">{projectMetaLine(featuredProject)}</p>
            <SourceLinks projectId={featuredProject.id} />
          </div>
        </article>}

        <div className="project-pair section-pad">
          {projectCards.map((project, index) => {
            const isDeepCase = project.detailLevel === "deep";
            return (
              <article key={project.id} className={`project-card ${index % 2 === 0 ? "project-card-tall" : "project-card-wide"}`}>
                <a
                  href={isDeepCase ? `#caso-${project.id}` : project.href}
                  {...(!isDeepCase ? { target: "_blank", rel: "noreferrer" } : {})}
                  aria-label={`${isDeepCase ? "Leer caso" : text("work.projectCta") || "Ver proyecto"}: ${project.name}`}
                >
                  <img src={project.image} alt={project.alt} loading="lazy" />
                </a>
                <div className="project-card-head">
                  <span>{String(project.rank).padStart(2, "0")} / {project.category}</span>
                  <Arrow />
                </div>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </article>
            );
          })}
        </div>

        {deepCaseProjects.length > 0 && <div className="case-library section-pad">
          <div className="case-library-heading">
            <p className="eyebrow light">{text("work.libraryLabel")}</p>
            <h2>{text("work.libraryTitle")}</h2>
            <p>{text("work.libraryCopy")}</p>
          </div>
          {deepCaseProjects.map((project) => (
            <article className="case-study" id={`caso-${project.id}`} key={`case-${project.id}`}>
              <a className="case-study-media" href={project.href} target="_blank" rel="noreferrer">
                <img src={project.image} alt={project.alt} loading="lazy" />
                <span>{text("work.sourceLabel") || "Ver publicación fuente"} <Arrow /></span>
              </a>
              <div className="case-study-copy">
                <div className="case-study-meta">
                  <span>{String(project.rank).padStart(2, "0")} · {project.category}</span>
                  <span>{projectLocation(project.location)} · {project.year}</span>
                </div>
                <h3>{project.name}</h3>
                <p className="case-study-thesis">{project.description}</p>
                <dl>
                  <div>
                    <dt>{text("work.challengeLabel") || "El reto"}</dt>
                    <dd>{project.challenge}</dd>
                  </div>
                  <div>
                    <dt>{text("work.responseLabel") || "La respuesta"}</dt>
                    <dd>{project.response}</dd>
                  </div>
                  <div>
                    <dt>{text("work.resultLabel") || "El resultado"}</dt>
                    <dd>{project.result}</dd>
                  </div>
                </dl>
                {project.socialPosts > 0 && (
                  <p className="case-study-source">
                    {relatedPostsLabel(project.socialPosts)} {project.socialPosts === 1 ? "guió" : "guiaron"} la profundidad editorial de este caso.
                  </p>
                )}
                <SourceLinks projectId={project.id} />
              </div>
            </article>
          ))}
        </div>}
      </section>

      {socialPosts.length > 0 && <section className="social-radar section-pad" id="redes">
        <div className="social-radar-heading">
          <div className="section-label">
            <span>IG</span>
            <p>{text("social.label")}</p>
          </div>
          <div>
            <h2>
              {text("social.title")}
              <em>{text("social.titleAccent")}</em>
            </h2>
            <p>{text("social.copy")}</p>
          </div>
        </div>
        <div className="social-grid">
          {socialPosts.map((post, index) => (
            <article className={`social-card ${index === 0 ? "social-card-lead" : ""}`} key={post.id}>
              <a href={post.href} target="_blank" rel="noreferrer" aria-label={`${text("social.cta")}: ${post.title}`}>
                <img src={post.image} alt={post.title} loading="lazy" />
              </a>
              <div className="social-card-meta">
                <span>{String(index + 1).padStart(2, "0")} · {post.type}</span>
                <span>Interés verificado</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.text}</p>
              <a className="social-card-link" href={post.href} target="_blank" rel="noreferrer">
                {text("social.cta")} <Arrow />
              </a>
            </article>
          ))}
        </div>
      </section>}

      {storyHighlights.length > 0 && <section className="story-sources section-pad" id="historias">
        <div className="story-sources-heading">
          <div className="section-label light-label">
            <span>ST</span>
            <p>{text("stories.label")}</p>
          </div>
          <div>
            <h2>
              {text("stories.title")}
              <em>{text("stories.titleAccent")}</em>
            </h2>
            <p>{text("stories.copy")}</p>
          </div>
        </div>
        <div className="story-source-grid">
          {storyHighlights.map((story, index) => (
            <a className={`story-source-card ${story.image ? "has-image" : ""}`} href={story.href} target="_blank" rel="noreferrer" key={story.id}>
              {story.image && <img src={story.image} alt={`Historia destacada de ${story.name}`} loading="lazy" />}
              <div className="story-source-overlay" />
              <div className="story-source-copy">
                <span>{String(index + 1).padStart(2, "0")} · {story.type}</span>
                <h3>{story.name}</h3>
                <p>{story.text}</p>
                <strong>{text("stories.cta")} <Arrow /></strong>
              </div>
            </a>
          ))}
        </div>
      </section>}

      <section className="services section-pad" id="servicios">
        <div className="section-label">
          <span>03</span>
          <p>{text("services.title")}</p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <article key={service.number}>
              <span>{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <div className="service-arrow" aria-hidden="true">↗</div>
            </article>
          ))}
        </div>
      </section>

      <section className="fit section-pad">
        <div className="section-label">
          <span>04</span>
          <p>{text("fit.label")}</p>
        </div>
        <h2>{text("fit.title")}</h2>
        <div className="fit-grid">
          <article>
            <span className="fit-symbol">+</span>
            <h3>{text("fit.yesTitle")}</h3>
            <ul>
              {fitYes.map((item) => <li key={`${item.group}-${item.order}`}>{item.text}</li>)}
            </ul>
          </article>
          <article>
            <span className="fit-symbol">−</span>
            <h3>{text("fit.noTitle")}</h3>
            <ul>
              {fitNo.map((item) => <li key={`${item.group}-${item.order}`}>{item.text}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <section className="profile-bridge section-pad">
        <div className="profile-orbit-col">
          <div className="profile-orbit" aria-hidden="true">
            <span>{text("profile.badgeValue")}</span>
            <small>{text("profile.badgeLabel")}</small>
          </div>
          {profileTimeframe && <p className="profile-timeframe">{profileTimeframe}</p>}
        </div>
        <div className="profile-copy">
          <p className="eyebrow light">{text("profile.eyebrow")}</p>
          <h2>
            {text("profile.title")}
            <em>{text("profile.titleAccent")}</em>
          </h2>
          <p>
            {text("profile.copy")}
          </p>
          {profileStack.length > 0 && (
            <ul className="profile-stack">
              {profileStack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          <div className="profile-actions">
            <a className="button button-cream" href={href("profile.cta")} target="_blank" rel="noreferrer">
              {text("profile.cta")} <Arrow />
            </a>
            <span>{text("profile.note")}</span>
          </div>
          {profilePromise && <p className="profile-promise">{profilePromise}</p>}
          {profileScarcity && <p className="profile-scarcity">{profileScarcity}</p>}
        </div>
      </section>

      <section className="method section-pad" id="metodo">
        <div className="method-intro">
          <div className="section-label">
            <span>05</span>
            <p>{text("method.label")}</p>
          </div>
          <h2>{text("method.title")}</h2>
        </div>
        <ol className="method-list">
          {method.map((item) => (
            <li key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
        {methodCredentials && <p className="method-credentials">{methodCredentials}</p>}
      </section>

      <section className="patrimony">
        <a className="patrimony-image-source" href={href("patrimony.imageLink")} target="_blank" rel="noreferrer" aria-label="Ver publicación fuente de Casa Alysa">
          <img src={image("patrimony.image")} alt={text("patrimony.imageAlt")} />
        </a>
        <div className="patrimony-shade" />
        <div className="patrimony-content section-pad">
          <p className="eyebrow light">{text("patrimony.eyebrow")}</p>
          <h2>
            {text("patrimony.title")}
            <em>{text("patrimony.titleAccent")}</em>
          </h2>
          <p>
            {text("patrimony.copy")}
          </p>
          <ul>
            {patrimonyPoints.map((item) => <li key={`${item.group}-${item.order}`}>{item.text}</li>)}
          </ul>
        </div>
      </section>

      <section className="faq section-pad">
        <div className="faq-heading">
          <div className="section-label">
            <span>06</span>
            <p>{text("faq.label")}</p>
          </div>
          <h2>{text("faq.title")}</h2>
        </div>
        <div className="faq-list">
          {faqs.map((item, index) => (
            <details key={item.question}>
              <summary>
                <span>0{index + 1}</span>
                {item.question}
                <i aria-hidden="true">+</i>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="contact section-pad" id="contacto">
        <div className="contact-monogram" aria-hidden="true">Au</div>
        <div className="contact-content">
          <p className="eyebrow light">{text("contact.eyebrow")}</p>
          <h2>
            {text("contact.title")}
            <em>{text("contact.titleAccent")}</em>
          </h2>
          <p>{text("contact.copy")}</p>
          <div className="contact-actions">
            <a className="button button-cream" href={href("contact.primaryCta")} target="_blank" rel="noreferrer">
              {text("contact.primaryCta")} <Arrow />
            </a>
            <a className="text-link light-link" href={href("contact.secondaryCta")} target="_blank" rel="noreferrer">
              {text("contact.secondaryCta")} <Arrow />
            </a>
          </div>
          {sessionNote && <p className="contact-session-note">{sessionNote}</p>}
          {guaranteeText && (
            <div className="contact-guarantee">
              <span>{guaranteeLabel}</span>
              <p>{guaranteeText}</p>
            </div>
          )}
          {contactUrgency && <p className="contact-urgency">{contactUrgency}</p>}
          {whatsappLabel && (
            <a className="contact-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer">
              {whatsappLabel} <Arrow />
            </a>
          )}
        </div>
      </section>

      <footer className="footer section-pad">
        <div className="footer-brand">
          <span className="brand-mark">Au</span>
          <div>
            <strong>{text("brand.name")}</strong>
            <p>{text("footer.claim")}</p>
          </div>
        </div>
        <nav aria-label="Navegación del pie de página">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>{item.text}</a>
          ))}
          <a href={href("footer.instagram")} target="_blank" rel="noreferrer">{text("footer.instagram")}</a>
        </nav>
        <div className="footer-meta">
          <span>{text("footer.location")}</span>
          <span>{text("footer.copyright")}</span>
          <span>{text("footer.code")}</span>
        </div>
      </footer>
    </main>
  );
}
