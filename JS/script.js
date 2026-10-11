// ==========================
// MENÚ HAMBURGUESA
// ==========================

// Seleccionamos el botón del menú y el nav
const botonMenu = document.querySelector(".menu-toggle");
const menu = document.querySelector("nav");

// Si no existen, no continuamos
if (botonMenu && menu) {
    botonMenu.addEventListener("click", function () {
        menu.classList.toggle("activo");
        const abierto = menu.classList.contains("activo");
        botonMenu.setAttribute("aria-expanded", String(abierto));
    });

    // Cierra el menú al clickear un enlace
    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                menu.classList.remove("activo");
                botonMenu.setAttribute("aria-expanded", "false");
            }
        });
    });

    // Si se pasa a desktop, asegura que el menú quede visible
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            menu.classList.remove("activo");
            botonMenu.setAttribute("aria-expanded", "false");
        }
    });
}

// ==========================
// VISOR DE CAPTURAS
// ==========================

const visor = document.getElementById("visor");

if (visor) {
    const imagenVisor = visor.querySelector("img");
    const botonCerrar = visor.querySelector(".visor-cerrar");
    let ultimoFoco = null;

    function abrirVisor(img) {
        ultimoFoco = img;
        imagenVisor.src = img.src;
        imagenVisor.alt = img.alt;
        visor.hidden = false;
        document.body.style.overflow = "hidden";
        botonCerrar.focus();
    }

    function cerrarVisor() {
        visor.hidden = true;
        imagenVisor.src = "";
        document.body.style.overflow = "";
        if (ultimoFoco) ultimoFoco.focus();
    }

    document.querySelectorAll(".proyecto-demo img, .proyecto-galeria img").forEach((img) => {
        // Permite abrir la imagen también con el teclado (Tab + Enter)
        img.tabIndex = 0;
        img.addEventListener("click", () => abrirVisor(img));
        img.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                abrirVisor(img);
            }
        });
    });

    // Se cierra con la X, tocando fuera de la imagen o con Escape
    botonCerrar.addEventListener("click", cerrarVisor);
    visor.addEventListener("click", (e) => {
        if (e.target === visor) cerrarVisor();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !visor.hidden) cerrarVisor();
    });
}

// ==========================
// AÑO DEL PIE DE PÁGINA
// ==========================

const anio = document.getElementById("anio");
if (anio) anio.textContent = new Date().getFullYear();
