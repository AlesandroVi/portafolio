// ==========================
// MENÚ DESPLEGABLE (celulares y tablets)
// ==========================

const botonMenu = document.querySelector(".menu-toggle");
const menu = document.getElementById("menu-principal");
const MEDIDA_MOVIL = 860;

function cerrarMenu() {
    if (!menu || !botonMenu) return;
    menu.classList.remove("activo");
    botonMenu.setAttribute("aria-expanded", "false");
    botonMenu.setAttribute("aria-label", "Abrir menú");
    botonMenu.querySelector("i").className = "fa-solid fa-bars";
}

function abrirMenu() {
    menu.classList.add("activo");
    botonMenu.setAttribute("aria-expanded", "true");
    botonMenu.setAttribute("aria-label", "Cerrar menú");
    botonMenu.querySelector("i").className = "fa-solid fa-xmark";
}

if (botonMenu && menu) {
    botonMenu.addEventListener("click", () => {
        menu.classList.contains("activo") ? cerrarMenu() : abrirMenu();
    });

    // Cierra al elegir una sección
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", cerrarMenu));

    // Cierra al tocar fuera del menú o con Escape
    document.addEventListener("click", (e) => {
        if (menu.classList.contains("activo") && !menu.contains(e.target) && !botonMenu.contains(e.target)) {
            cerrarMenu();
        }
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && menu.classList.contains("activo")) {
            cerrarMenu();
            botonMenu.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > MEDIDA_MOVIL) cerrarMenu();
    });
}

// ==========================
// SECCIÓN ACTUAL EN EL MENÚ
// ==========================

const enlacesMenu = document.querySelectorAll(".menu a");
const secciones = [...enlacesMenu]
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

if ("IntersectionObserver" in window && secciones.length) {
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return;
            enlacesMenu.forEach((a) => {
                const actual = a.getAttribute("href") === "#" + entrada.target.id;
                if (actual) a.setAttribute("aria-current", "true");
                else a.removeAttribute("aria-current");
            });
        });
    }, { rootMargin: "-40% 0px -55% 0px" });

    secciones.forEach((s) => observador.observe(s));
}

// ==========================
// VISOR DE CAPTURAS (con anterior / siguiente dentro de cada proyecto)
// ==========================

const visor = document.getElementById("visor");

if (visor) {
    const imagenVisor = visor.querySelector("img");
    const textoVisor = visor.querySelector("figcaption");
    const botonCerrar = visor.querySelector(".visor-cerrar");
    const botonAnterior = visor.querySelector(".visor-anterior");
    const botonSiguiente = visor.querySelector(".visor-siguiente");

    let grupo = [];
    let indice = 0;
    let ultimoFoco = null;

    function mostrar(i) {
        indice = (i + grupo.length) % grupo.length;
        const img = grupo[indice];
        imagenVisor.src = img.src;
        imagenVisor.alt = img.alt;
        textoVisor.textContent = img.alt + (grupo.length > 1 ? `  (${indice + 1} de ${grupo.length})` : "");
        const varias = grupo.length > 1;
        botonAnterior.hidden = !varias;
        botonSiguiente.hidden = !varias;
    }

    function abrirVisor(img) {
        const contenedor = img.closest(".proyecto, .hero-captura");
        grupo = contenedor ? [...contenedor.querySelectorAll("img.captura, .ventana img")] : [img];
        ultimoFoco = img;
        mostrar(grupo.indexOf(img));
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

    document.querySelectorAll("img.captura, .ventana img").forEach((img) => {
        img.tabIndex = 0;
        img.setAttribute("role", "button");
        img.setAttribute("aria-label", "Ampliar: " + img.alt);
        img.style.cursor = "zoom-in";
        img.addEventListener("click", () => abrirVisor(img));
        img.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                abrirVisor(img);
            }
        });
    });

    botonCerrar.addEventListener("click", cerrarVisor);
    botonAnterior.addEventListener("click", () => mostrar(indice - 1));
    botonSiguiente.addEventListener("click", () => mostrar(indice + 1));

    visor.addEventListener("click", (e) => {
        if (e.target === visor || e.target.tagName === "FIGURE") cerrarVisor();
    });

    document.addEventListener("keydown", (e) => {
        if (visor.hidden) return;
        if (e.key === "Escape") cerrarVisor();
        if (e.key === "ArrowLeft" && grupo.length > 1) mostrar(indice - 1);
        if (e.key === "ArrowRight" && grupo.length > 1) mostrar(indice + 1);
        // Mantiene el foco dentro del visor
        if (e.key === "Tab") {
            const botones = [...visor.querySelectorAll("button:not([hidden])")];
            const primero = botones[0];
            const ultimo = botones[botones.length - 1];
            if (e.shiftKey && document.activeElement === primero) {
                e.preventDefault();
                ultimo.focus();
            } else if (!e.shiftKey && document.activeElement === ultimo) {
                e.preventDefault();
                primero.focus();
            }
        }
    });

    // Deslizar con el dedo en el celular
    let inicioX = null;
    visor.addEventListener("touchstart", (e) => { inicioX = e.touches[0].clientX; }, { passive: true });
    visor.addEventListener("touchend", (e) => {
        if (inicioX === null || grupo.length < 2) return;
        const distancia = e.changedTouches[0].clientX - inicioX;
        if (Math.abs(distancia) > 50) mostrar(indice + (distancia < 0 ? 1 : -1));
        inicioX = null;
    });
}

// ==========================
// AÑO DEL PIE
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
    if (claro) document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");

    if (botonTema) {
        botonTema.querySelector("i").className = claro ? "fa-solid fa-moon" : "fa-solid fa-sun";
        botonTema.setAttribute("aria-label", claro ? "Cambiar a modo oscuro" : "Cambiar a modo claro");
    }
    if (metaTema) metaTema.setAttribute("content", claro ? "#f7f5fb" : "#16121f");
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
