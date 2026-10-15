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

// ==========================
// MODO CLARO / OSCURO
// ==========================

const botonTema = document.querySelector(".boton-tema");
const metaTema = document.querySelector('meta[name="theme-color"]');

function aplicarTema(tema) {
    const claro = tema === "light";
    if (claro) {
        document.documentElement.setAttribute("data-theme", "light");
    } else {
        document.documentElement.removeAttribute("data-theme");
    }
    if (botonTema) {
        // El ícono muestra el modo al que se pasa al tocarlo
        botonTema.querySelector("i").className = claro ? "fa-solid fa-moon" : "fa-solid fa-sun";
        botonTema.setAttribute("aria-label", claro ? "Cambiar a modo oscuro" : "Cambiar a modo claro");
    }
    if (metaTema) {
        metaTema.setAttribute("content", claro ? "#f7f5fc" : "#150f24");
    }
}

if (botonTema) {
    aplicarTema(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");

    botonTema.addEventListener("click", () => {
        const nuevo = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
        aplicarTema(nuevo);
        try {
            localStorage.setItem("tema", nuevo);
        } catch (e) {}
    });
}
