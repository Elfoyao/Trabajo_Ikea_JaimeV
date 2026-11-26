"use strict";

// Ampliar las fotos de la línea del tiempo al hacer clic (visor con <dialog>).
const fotos = document.querySelectorAll(".t-photo img, .founder-photo img");

if (fotos.length && typeof HTMLDialogElement === "function") {
  const visor = document.createElement("dialog");
  visor.className = "visor";
  visor.setAttribute("aria-label", "Imagen ampliada");
  visor.innerHTML = `
    <button type="button" class="visor-cerrar" aria-label="Cerrar imagen">&times;</button>
    <img alt="">
    <p class="visor-texto"></p>`;
  document.body.append(visor);

  const imgGrande = visor.querySelector("img");
  const texto = visor.querySelector(".visor-texto");

  const cerrar = () => visor.close();
  visor.querySelector(".visor-cerrar").addEventListener("click", cerrar);
  // Clic fuera de la imagen (en el fondo oscuro) también cierra.
  visor.addEventListener("click", (e) => {
    if (e.target === visor) cerrar();
  });
  visor.addEventListener("close", () => document.body.classList.remove("visor-abierto"));

  fotos.forEach((foto) => {
    // Botón alrededor de la imagen para poder abrirla también con teclado.
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "t-zoom";
    boton.setAttribute("aria-label", `Ampliar imagen: ${foto.alt}`);
    foto.replaceWith(boton);
    boton.append(foto);

    boton.addEventListener("click", () => {
      imgGrande.src = foto.currentSrc || foto.src;
      imgGrande.alt = foto.alt;
      const pie = foto.closest("figure").querySelector("figcaption");
      texto.textContent = pie ? `${foto.alt} — ${pie.textContent.trim()}` : foto.alt;
      document.body.classList.add("visor-abierto");
      visor.showModal();
    });
  });
}
