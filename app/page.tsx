"use client";

import { useEffect, useState } from "react";

const profileUrl =
  "https://alexpueblag.github.io/aurum-experiencia/?utm_source=sitio&utm_medium=web&utm_campaign=perfil_de_vida&utm_content=aurum_nuevo_sitio";
const clarityUrl =
  "https://calendar.app.google/Y11D7it7VmER9m1i8?utm_source=sitio&utm_medium=web&utm_campaign=sesion_claridad&utm_content=aurum_nuevo_sitio";

const nav = [
  ["Obra", "#obra"],
  ["Servicios", "#servicios"],
  ["Método", "#metodo"],
  ["Estudio", "#estudio"],
];

const services = [
  {
    n: "01",
    title: "Residencial",
    copy: "Casas concebidas alrededor de una forma específica de vivir, no de una tipología repetida.",
  },
  {
    n: "02",
    title: "Interiores",
    copy: "Material, iluminación y mobiliario construyen una sola atmósfera, desde la arquitectura.",
  },
  {
    n: "03",
    title: "Comercial",
    copy: "Espacios que hacen tangible el valor de una marca y convierten una visita en confianza.",
  },
];

const method = [
  ["01", "Perfil de vida", "Estilo, emociones, hábitos y momentos que importan."],
  ["02", "Sesión de claridad", "Escuchamos el contexto y definimos la decisión que sigue."],
  ["03", "Mapa de potencial", "Traducimos la conversación en prioridades y oportunidades."],
  ["04", "Arquitectura de autor", "Espacio, luz y materialidad responden a una intención."],
  ["05", "Materialización", "Protegemos la idea mientras se convierte en obra."],
];

const faqs = [
  [
    "¿Necesito tener terreno para empezar?",
    "No. Podemos comenzar antes de adquirirlo y convertir tu forma de vivir en criterios útiles para evaluar ubicación, orientación y potencial.",
  ],
  [
    "¿Aurum diseña también los interiores?",
    "Sí. Arquitectura e interiores se desarrollan como una sola experiencia para evitar decisiones fragmentadas al final del proceso.",
  ],
  [
    "¿Cuál es el primer paso formal?",
    "El Perfil de Vida es una entrada breve. Si existe compatibilidad, seguimos con una Sesión de Claridad para entender contexto, alcance y horizonte.",
  ],
  [
    "¿Trabajan fuera de Hermosillo?",
    "Sí, cuando el proyecto y la forma de colaboración permiten proteger el criterio de diseño y la calidad de la ejecución.",
  ],
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Aurum Arquitectos, inicio">
          <span className="brand-mark">Au</span>
          <span className="brand-name">Aurum Arquitectos</span>
        </a>

        <nav className="desktop-nav" aria-label="Navegación principal">
          {nav.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>

        <a className="header-cta" href="#contacto">
          Comenzar <Arrow />
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
        <div className="mobile-menu-meta">Hermosillo · Sonora</div>
        <nav aria-label="Navegación móvil">
          {nav.map(([label, href], index) => (
            <a key={href} href={href} onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
              <span>0{index + 1}</span>
              {label}
            </a>
          ))}
          <a href="#contacto" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
            <span>05</span>
            Contacto
          </a>
        </nav>
        <a
          className="mobile-menu-cta"
          href={profileUrl}
          target="_blank"
          rel="noreferrer"
          tabIndex={menuOpen ? 0 : -1}
        >
          Crear mi Perfil de Vida <Arrow />
        </a>
      </div>

      <section className="hero" id="inicio">
        <img className="hero-image" src="/aurum/hero.jpg" alt="Residencia de piedra diseñada por Aurum Arquitectos" />
        <div className="hero-shade" />
        <div className="hero-rail">
          <span>Hermosillo · Sonora</span>
          <span>Residencias de autor · arquitectura e interiores</span>
          <span>Proyectos por compatibilidad</span>
        </div>
        <div className="hero-content">
          <p className="eyebrow light">Arquitectura para la vida detrás de ella</p>
          <h1>
            Tu forma de vivir.
            <em>Hecha arquitectura.</em>
          </h1>
          <p className="hero-copy">
            Diseñamos residencias con identidad, claridad y valor que permanece. Cada decisión empieza en la vida que quieres construir.
          </p>
          <div className="hero-actions">
            <a className="button button-gold" href={profileUrl} target="_blank" rel="noreferrer">
              Crear mi Perfil · 90 s <Arrow />
            </a>
            <a className="text-link light-link" href="#obra">
              Ver obra selecta <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <div className="hero-index">AU — 001</div>
      </section>

      <section className="principles" aria-label="Principios Aurum">
        {[
          ["01", "La vida", "antes que los metros."],
          ["02", "Identidad", "antes que tendencia."],
          ["03", "Intención", "antes que exceso."],
          ["04", "Valor que permanece,", "no un elefante blanco."],
        ].map(([n, lead, rest]) => (
          <article key={n}>
            <span>{n}</span>
            <p>
              {lead}
              <br />
              <em>{rest}</em>
            </p>
          </article>
        ))}
      </section>

      <section className="intro section-pad" id="estudio">
        <div className="section-label">
          <span>01</span>
          <p>La idea Aurum</p>
        </div>
        <div className="intro-statement">
          <p className="display-kicker">Architecture for the life behind it.</p>
          <h2>
            Una casa no debería parecerse a ti.
            <em>Debería sentirse como tú.</em>
          </h2>
          <div className="intro-copy">
            <p>
              La forma más costosa de diseñar es empezar por respuestas prestadas. La más inteligente es construir una intención propia.
            </p>
            <p>
              Por eso nuestro trabajo comienza con tus rituales, tus tensiones y la emoción que quieres encontrar al volver.
            </p>
          </div>
        </div>
      </section>

      <section className="work" id="obra">
        <div className="work-heading section-pad">
          <div className="section-label light-label">
            <span>02</span>
            <p>Obra selecta · retos de diseño</p>
          </div>
          <h2>
            No mostramos espacios.
            <em>Mostramos decisiones.</em>
          </h2>
        </div>

        <article className="project project-featured">
          <a
            className="project-image-wrap"
            href="https://www.instagram.com/aurumarquitectos/p/DZn9u4CjfMP/"
            target="_blank"
            rel="noreferrer"
            aria-label="Conocer Casa Zara en Instagram"
          >
            <img src="/aurum/casa-zara.jpg" alt="Cocina cálida abierta al jardín, Casa Zara" />
            <span className="image-cursor">Ver proyecto <Arrow /></span>
          </a>
          <div className="project-copy">
            <div className="project-number">01 / 03</div>
            <p className="eyebrow">Residencia · familia de cinco</p>
            <h3>Casa Zara</h3>
            <p className="project-thesis">Estar juntos, sin dejar de tener un mundo propio.</p>
            <dl>
              <div>
                <dt>El reto</dt>
                <dd>Un gran espacio para recibir y lugares íntimos para cada integrante.</dd>
              </div>
              <div>
                <dt>La respuesta</dt>
                <dd>Una arquitectura que cambia de escala con la vida familiar.</dd>
              </div>
            </dl>
          </div>
        </article>

        <div className="project-pair section-pad">
          <article className="project-card project-card-tall">
            <a href="https://www.instagram.com/aurumarquitectos/p/DYBdTd9FQbH/" target="_blank" rel="noreferrer">
              <img src="/aurum/interior.jpg" alt="Sala contemporánea con vista al jardín, Casa Mona" />
            </a>
            <div className="project-card-head">
              <span>02 / Residencial</span>
              <Arrow />
            </div>
            <h3>Casa Mona</h3>
            <p>Privacidad real y apertura hacia la mejor vista.</p>
          </article>

          <article className="project-card project-card-wide">
            <a href="https://www.instagram.com/aurumarquitectos/" target="_blank" rel="noreferrer">
              <img src="/aurum/terraza.jpg" alt="Terraza y comedor exterior de una residencia Aurum" />
            </a>
            <div className="project-card-head">
              <span>03 / Residencial</span>
              <Arrow />
            </div>
            <h3>Casa de autor</h3>
            <p>Tener carácter, sin depender de una moda.</p>
          </article>
        </div>
      </section>

      <section className="services section-pad" id="servicios">
        <div className="section-label">
          <span>03</span>
          <p>Tres escalas · una intención</p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <article key={service.n}>
              <span>{service.n}</span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
              <div className="service-arrow" aria-hidden="true">↗</div>
            </article>
          ))}
        </div>
      </section>

      <section className="profile-bridge section-pad">
        <div className="profile-orbit" aria-hidden="true">
          <span>90</span>
          <small>segundos</small>
        </div>
        <div className="profile-copy">
          <p className="eyebrow light">Oferta inicial · Perfil de Vida Aurum</p>
          <h2>
            Antes de invertir en metros,
            <em>define una dirección propia.</em>
          </h2>
          <p>
            Seis decisiones sencillas convierten referencias dispersas en una lectura inicial de cómo quieres sentir, usar y proyectar tu residencia.
          </p>
          <div className="profile-actions">
            <a className="button button-cream" href={profileUrl} target="_blank" rel="noreferrer">
              Obtener mi lectura inicial <Arrow />
            </a>
            <span>Sin costo · sin compromiso</span>
          </div>
        </div>
      </section>

      <section className="method section-pad" id="metodo">
        <div className="method-intro">
          <div className="section-label">
            <span>04</span>
            <p>Método Aurum</p>
          </div>
          <h2>De una intuición privada a una obra capaz de defender cada decisión.</h2>
        </div>
        <ol className="method-list">
          {method.map(([n, title, copy]) => (
            <li key={n}>
              <span>{n}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="patrimony">
        <img src="/aurum/terraza.jpg" alt="Terraza exterior con materialidad cálida" />
        <div className="patrimony-shade" />
        <div className="patrimony-content section-pad">
          <p className="eyebrow light">Diseño con inteligencia patrimonial</p>
          <h2>
            Obra de autor.
            <em>No un elefante blanco.</em>
          </h2>
          <p>
            Una residencia puede ser profundamente personal sin volverse sobredimensionada o desconectada de su contexto. El lujo más serio está en saber qué merece permanecer.
          </p>
          <ul>
            <li>Identidad sin capricho</li>
            <li>Amplitud sin desperdicio</li>
            <li>Materialidad con permanencia</li>
            <li>Valor más allá de la primera foto</li>
          </ul>
        </div>
      </section>

      <section className="fit section-pad">
        <div className="section-label">
          <span>05</span>
          <p>Compatibilidad antes que presión</p>
        </div>
        <h2>Una buena relación de proyecto también se diseña.</h2>
        <div className="fit-grid">
          <article>
            <span className="fit-symbol">+</span>
            <h3>Probablemente encajamos si…</h3>
            <ul>
              <li>Quieres una casa propia, no una colección de referencias.</li>
              <li>Valoras el proceso y la calidad de las decisiones.</li>
              <li>Buscas integrar arquitectura, interiores y experiencia.</li>
            </ul>
          </article>
          <article>
            <span className="fit-symbol">−</span>
            <h3>Quizá no somos la firma correcta si…</h3>
            <ul>
              <li>La única variable de decisión es el menor honorario.</li>
              <li>Necesitas copiar una casa existente sin reinterpretarla.</li>
              <li>Buscas velocidad a costa de criterio y coordinación.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="faq section-pad">
        <div className="faq-heading">
          <div className="section-label">
            <span>06</span>
            <p>Antes de conversar</p>
          </div>
          <h2>Preguntas que vale la pena resolver.</h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <details key={question}>
              <summary>
                <span>0{index + 1}</span>
                {question}
                <i aria-hidden="true">+</i>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="contact section-pad" id="contacto">
        <div className="contact-monogram" aria-hidden="true">Au</div>
        <div className="contact-content">
          <p className="eyebrow light">El siguiente proyecto empieza con una pregunta correcta</p>
          <h2>
            ¿Cómo quieres
            <em>vivir de verdad?</em>
          </h2>
          <p>Puedes descubrirlo en 90 segundos o abrir una conversación directa con el estudio.</p>
          <div className="contact-actions">
            <a className="button button-cream" href={profileUrl} target="_blank" rel="noreferrer">
              Crear mi Perfil de Vida <Arrow />
            </a>
            <a className="text-link light-link" href={clarityUrl} target="_blank" rel="noreferrer">
              Agendar Sesión de Claridad <Arrow />
            </a>
          </div>
        </div>
      </section>

      <footer className="footer section-pad">
        <div className="footer-brand">
          <span className="brand-mark">Au</span>
          <div>
            <strong>Aurum Arquitectos</strong>
            <p>Arquitectura que vuelve visible una forma de vivir.</p>
          </div>
        </div>
        <nav aria-label="Navegación del pie de página">
          {nav.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
          <a href="https://www.instagram.com/aurumarquitectos/" target="_blank" rel="noreferrer">Instagram</a>
        </nav>
        <div className="footer-meta">
          <span>Hermosillo · Sonora · México</span>
          <span>© 2026 Aurum Arquitectos</span>
          <span>AU — ARCH / 005</span>
        </div>
      </footer>
    </main>
  );
}
