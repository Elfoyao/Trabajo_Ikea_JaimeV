"use strict";

// Animaciones sencillas para todas las páginas del dossier.
// Si el usuario pide menos movimiento en su sistema, no se anima nada.
const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!sinMovimiento && "IntersectionObserver" in window) {
  // Esta clase activa los estados iniciales del CSS (si no hay JS, todo se ve normal).
  document.documentElement.classList.add("js-anim");

  // 1. Aparición al hacer scroll: los elementos suben y se hacen visibles.
  const selector = ".section-space .section-title, .section-space .intro, .section-space .card," +
    " .table-wrap, .section-space .fact-list, .timeline li, .step-card, .figure-frame, .note," +
    " .accordion-item, .video-frame, .source-list li";

  const elementos = [...document.querySelectorAll(selector)]
    // Si un elemento está dentro de otro que ya se anima, no lo animamos dos veces.
    .filter((el) => !el.parentElement.closest(selector));

  elementos.forEach((el) => {
    el.classList.add("reveal");
    // Pequeño retraso en cascada entre hermanos (tarjetas en fila, pasos, etc.).
    const caja = el.closest(".col") || el;
    const posicion = [...caja.parentElement.children].indexOf(caja);
    el.style.transitionDelay = `${(posicion % 5) * 90}ms`;
  });

  // 2. Barras de progreso: empiezan en 0 y crecen hasta su valor.
  const barras = document.querySelectorAll(".region-bar .progress-bar");
  barras.forEach((barra) => {
    barra.dataset.ancho = barra.style.width;
    barra.style.width = "0";
  });

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      const el = entrada.target;
      if (el.classList.contains("progress-bar")) {
        el.style.width = el.dataset.ancho;
      } else {
        el.classList.add("is-visible");
      }
      observador.unobserve(el);
    });
  }, { threshold: 0.15 });

  elementos.forEach((el) => observador.observe(el));
  barras.forEach((barra) => observador.observe(barra));

  // 3. Contador en las cifras del hero (1943, 411, 41.451 M€, 31).
  document.querySelectorAll(".stat strong").forEach((cifra) => {
    const texto = cifra.textContent;
    const coincidencia = texto.match(/[\d.]+/);
    if (!coincidencia) return;

    const final = Number(coincidencia[0].replace(/\./g, ""));
    const usarPuntos = coincidencia[0].includes(".");
    const duracion = 1400;
    let inicio = null;

    const paso = (tiempo) => {
      inicio ??= tiempo;
      const progreso = Math.min((tiempo - inicio) / duracion, 1);
      const suave = 1 - Math.pow(1 - progreso, 3); // easeOutCubic
      const valor = Math.round(final * suave);
      const numero = usarPuntos ? valor.toLocaleString("es-ES") : String(valor);
      cifra.textContent = texto.replace(coincidencia[0], numero);
      if (progreso < 1) requestAnimationFrame(paso);
    };

    // Arranca cuando la tarjeta ya ha entrado con su animación CSS.
    setTimeout(() => requestAnimationFrame(paso), 500);
  });
}
