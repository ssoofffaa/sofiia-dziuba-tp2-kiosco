/* ==========================================================================
   KIOSCO - principal.js
   Comportamiento compartido en las 3 paginas:
     1. Fade-in al hacer scroll (IntersectionObserver)
     2. Toggle de tema claro/oscuro (persistente en localStorage)
   Sin dependencias mas alla del DOM. Bootstrap aporta su propio JS.
   ========================================================================== */
(function () {
  "use strict";

  /* -- 1. Fade-in: revela elementos .k-reveal cuando entran en viewport -- */
  function iniciarReveal() {
    var elementos = document.querySelectorAll(".k-reveal");
    if (!elementos.length) return;

    // Sin soporte de IntersectionObserver: mostrar todo (sin romper nada)
    if (!("IntersectionObserver" in window)) {
      elementos.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observador = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          obs.unobserve(entrada.target);   // animar una sola vez
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    elementos.forEach(function (el) { observador.observe(el); });
  }

  /* -- 2. Tema claro/oscuro -- */
  var CLAVE_TEMA = "kiosco-tema";

  function aplicarTema(tema) {
    if (tema === "oscuro") {
      document.documentElement.setAttribute("data-tema", "oscuro");
    } else {
      document.documentElement.removeAttribute("data-tema");
    }
  }

  function iniciarTema() {
    var guardado = localStorage.getItem(CLAVE_TEMA);
    if (guardado) aplicarTema(guardado);

    // Puede haber varios botones de tema (desktop + dentro del menu burger).
    var botones = document.querySelectorAll("[data-toggle-tema]");
    if (!botones.length) return;

    function sincronizar() {
      var esOscuro = document.documentElement.getAttribute("data-tema") === "oscuro";
      botones.forEach(function (b) { b.setAttribute("aria-pressed", String(esOscuro)); });
    }
    sincronizar();

    botones.forEach(function (boton) {
      boton.addEventListener("click", function () {
        var esOscuro = document.documentElement.getAttribute("data-tema") === "oscuro";
        var nuevo = esOscuro ? "claro" : "oscuro";
        aplicarTema(nuevo);
        localStorage.setItem(CLAVE_TEMA, nuevo);
        sincronizar();
      });
    });
  }

  /* -- 3. Filtro de galeria por tipo (data-filtro / data-tipo) -- */
  function iniciarFiltro() {
    var botones = document.querySelectorAll("[data-filtro]");
    var items = document.querySelectorAll("#galeria [data-tipo]");
    if (!botones.length || !items.length) return;

    var vacio = document.getElementById("galeria-vacio");

    function aplicar(filtro) {
      var visibles = 0;
      items.forEach(function (item) {
        var coincide = filtro === "todos" || item.getAttribute("data-tipo") === filtro;
        item.hidden = !coincide;
        if (coincide) visibles++;
      });
      if (vacio) vacio.hidden = visibles !== 0;
    }

    botones.forEach(function (boton) {
      boton.addEventListener("click", function () {
        botones.forEach(function (b) {
          b.classList.remove("is-activo");
          b.setAttribute("aria-pressed", "false");
        });
        boton.classList.add("is-activo");
        boton.setAttribute("aria-pressed", "true");
        aplicar(boton.getAttribute("data-filtro"));
      });
    });
  }

  /* -- 4. Test de tipaje (determina tu tipo) -- */
  function iniciarTest() {
    var test = document.querySelector("[data-test]");
    if (!test) return;

    var TIPOS = {
      estructurado: {
        nombre: "Noir Estructurado",
        desc: "Lineas rectas y negro absoluto. Te sienta la sastreria cruda y los volumenes secos. Tu momento es la noche.",
        enlace: "secciones/productos.html"
      },
      natural: {
        nombre: "Lino y Tierra",
        desc: "Tonos crudos y fibras naturales. Vistes el dia sin esfuerzo, con lino, algodon y calma. Luz de tarde.",
        enlace: "secciones/productos.html"
      },
      crudo: {
        nombre: "Crudo Urbano",
        desc: "Cuero, denim y capas de ciudad. Mezclas lo de trabajo con lo de salir y aguantas el dia entero.",
        enlace: "secciones/productos.html"
      }
    };

    var opciones = test.querySelectorAll(".k-test__op");
    var resultado = test.querySelector("[data-test-resultado]");
    var nombre = test.querySelector("[data-test-nombre]");
    var desc = test.querySelector("[data-test-desc]");
    var enlace = test.querySelector("[data-test-enlace]");

    opciones.forEach(function (op) {
      op.addEventListener("click", function () {
        opciones.forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        op.setAttribute("aria-pressed", "true");

        var t = TIPOS[op.getAttribute("data-tipo")];
        if (!t) return;
        if (nombre) nombre.textContent = t.nombre;
        if (desc) desc.textContent = t.desc;
        if (enlace) enlace.setAttribute("href", t.enlace);
        if (resultado) {
          resultado.hidden = false;
          resultado.classList.add("is-visible");
        }
      });
    });
  }

  /* -- 5. Carrusel de tendencias: flechas que avanzan una tarjeta -- */
  function iniciarTrend() {
    var track = document.querySelector("[data-trend-track]");
    if (!track) return;
    var prev = document.querySelector("[data-trend-prev]");
    var next = document.querySelector("[data-trend-next]");

    function paso() {
      var item = track.querySelector(".k-trend__item");
      if (!item) return track.clientWidth;
      var gap = parseInt(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "0", 10) || 0;
      return item.getBoundingClientRect().width + gap;
    }

    if (next) next.addEventListener("click", function () { track.scrollBy({ left: paso(), behavior: "smooth" }); });
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -paso(), behavior: "smooth" }); });
  }

  /* -- 6. Catalogo: filtros multiseleccion REALES + busqueda (productos.html) --
     Lee los checkboxes del offcanvas de filtros y oculta cada card que no
     encaje. Es generico: los ejes salen del atributo "name" de cada checkbox,
     asi que no hay lista de filtros codificada a mano. Regla de coincidencia:
       - dentro de un eje (p.ej. ocasion) las opciones marcadas suman (OR)
       - entre ejes distintos se exige cumplir todos (AND)
     Cada card declara sus valores en data-<eje> (separados por espacios), de
     modo que un look puede pertenecer a varias categorias a la vez. */
  function iniciarCatalogo() {
    var form = document.querySelector("[data-filtros]");
    var grid = document.querySelector("[data-catalogo]");
    if (!form || !grid) return;

    var prods = grid.querySelectorAll("[data-prod]");
    var numeros = document.querySelectorAll("[data-cat-count]");   // numero crudo (boton del panel)
    var resumen = document.querySelector("[data-cat-resumen]");    // texto del total (barra)
    var chipsBox = document.querySelector("[data-cat-chips]");     // chips de filtros activos
    var vacio = document.querySelector("[data-cat-vacio]");
    var entrada = document.querySelector('input[name="q"]');

    // Texto buscado: llega por ?q= (la barra envia a la propia pagina).
    var query = (new URLSearchParams(window.location.search).get("q") || "").trim().toLowerCase();
    if (query && entrada) entrada.value = query;

    function marcados() {
      return Array.prototype.slice.call(form.querySelectorAll('input[type="checkbox"]:checked'));
    }

    // Texto legible de un filtro = texto de su <label> contenedor.
    function etiqueta(check) {
      var lab = check.closest("label");
      return lab ? lab.textContent.trim() : check.value;
    }

    function pintarChips(checks) {
      if (!chipsBox) return;
      chipsBox.innerHTML = "";
      if (!checks.length) return;
      checks.forEach(function (c) {
        var chip = document.createElement("span");
        chip.className = "k-chip";
        chip.textContent = etiqueta(c);
        var x = document.createElement("button");
        x.type = "button";
        x.className = "k-chip__x";
        x.setAttribute("aria-label", "Quitar filtro: " + etiqueta(c));
        x.innerHTML = "&times;";
        x.addEventListener("click", function () { c.checked = false; aplicar(); });
        chip.appendChild(x);
        chipsBox.appendChild(chip);
      });
      var limpiar = document.createElement("button");
      limpiar.type = "button";
      limpiar.className = "k-chip k-chip--limpiar";
      limpiar.textContent = "Limpiar todo";
      limpiar.addEventListener("click", function () {
        checks.forEach(function (c) { c.checked = false; });
        aplicar();
      });
      chipsBox.appendChild(limpiar);
    }

    function aplicar() {
      var checks = marcados();
      var sel = {};
      checks.forEach(function (c) { (sel[c.name] = sel[c.name] || []).push(c.value); });
      var ejes = Object.keys(sel);
      var visibles = 0;

      prods.forEach(function (prod) {
        var pasaFiltros = ejes.every(function (eje) {
          var valores = (prod.getAttribute("data-" + eje) || "").split(/\s+/);
          return sel[eje].some(function (v) { return valores.indexOf(v) !== -1; });
        });
        var pasaBusqueda = !query || prod.textContent.toLowerCase().indexOf(query) !== -1;
        var ok = pasaFiltros && pasaBusqueda;
        prod.hidden = !ok;
        if (ok) visibles++;
      });

      var hayFiltro = ejes.length > 0 || !!query;
      numeros.forEach(function (n) { n.textContent = visibles; });
      // Resumen: imitamos un catalogo enorme; al filtrar mostramos lo encontrado.
      if (resumen) {
        resumen.textContent = hayFiltro
          ? (visibles + (visibles === 1 ? " look encontrado" : " looks encontrados"))
          : "+200.000 looks · mostrando 16 por pagina";
      }
      pintarChips(checks);
      if (vacio) vacio.hidden = visibles !== 0;
    }

    form.addEventListener("change", aplicar);
    // El reset limpia las casillas DESPUES del evento: reaplicar en el siguiente tick.
    form.addEventListener("reset", function () { window.setTimeout(aplicar, 0); });
    aplicar();
  }

  /* -- 7. Detalle del look (detalle.html): galeria + pedido por piezas --
     - La galeria de la izquierda se rearma con los angulos de la pieza activa
       (look completo o una prenda concreta). Tiene flechas para ciclar y
       puntos como indicador de pagina.
     - Cada pieza tiene casilla de pago y talla. El total se recalcula con lo
       marcado. "Anadir" / "Comprar" mandan las piezas marcadas (con talla) a la
       cesta (window.KioscoTienda, definido en tienda.js).
     - En "looks similares" se resaltan en rojo los tags que coinciden con este
       look (mismas etiquetas = por que se parece). */
  function iniciarDetalle() {
    var cont = document.querySelector("[data-detalle]");
    if (!cont) return;

    var galeria = document.querySelector("[data-galeria]");
    var grande = document.querySelector("[data-foto-grande]");
    var angulosBox = galeria && galeria.querySelector("[data-galeria-angulos]");
    var dotsBox = galeria && galeria.querySelector("[data-galeria-dots]");
    var flechaPrev = galeria && galeria.querySelector("[data-galeria-prev]");
    var flechaNext = galeria && galeria.querySelector("[data-galeria-next]");

    var filas = cont.querySelectorAll("[data-pieza]");      // filas con precio (piezas)
    var totalEl = cont.querySelector("[data-detalle-total]");
    var maestro = cont.querySelector("[data-detalle-todo]"); // casilla "seleccionar todo"

    function pesos(n) { return "$" + Number(n).toLocaleString("es-AR"); }

    /* -- Galeria dinamica: la lista cambia segun la pieza activa -- */
    var coleccion = [];      // array de URLs
    var indice = 0;
    var altActual = "";
    var filaActiva = null;

    function pintarAngulos() {
      if (!angulosBox) return;
      angulosBox.innerHTML = "";
      coleccion.forEach(function (url, i) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "k-galeria__ang" + (i === indice ? " is-activa" : "");
        btn.setAttribute("aria-label", "Ver foto " + (i + 1) + " de " + coleccion.length);
        btn.addEventListener("click", function () { irA(i); });
        var img = document.createElement("img");
        img.className = "img-fluid";
        img.src = url;
        img.alt = "";
        btn.appendChild(img);
        angulosBox.appendChild(btn);
      });
    }

    function pintarDots() {
      if (!dotsBox) return;
      dotsBox.innerHTML = "";
      if (coleccion.length <= 1) { dotsBox.hidden = true; return; }
      dotsBox.hidden = false;
      coleccion.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "k-galeria__dot" + (i === indice ? " is-activa" : "");
        dot.setAttribute("aria-label", "Ver foto " + (i + 1));
        dot.addEventListener("click", function () { irA(i); });
        dotsBox.appendChild(dot);
      });
    }

    function pintarFlechas() {
      var visible = coleccion.length > 1;
      if (flechaPrev) flechaPrev.hidden = !visible;
      if (flechaNext) flechaNext.hidden = !visible;
    }

    function pintarGrande() {
      if (!grande || !coleccion[indice]) return;
      grande.src = coleccion[indice];
      grande.removeAttribute("srcset");
      if (altActual) grande.alt = altActual;
    }

    function irA(i) {
      if (!coleccion.length) return;
      if (i < 0) i = coleccion.length - 1;
      if (i >= coleccion.length) i = 0;
      indice = i;
      pintarGrande();
      pintarAngulos();
      pintarDots();
    }

    function activarFila(fila) {
      if (!fila) return;
      filaActiva = fila;
      var lista = (fila.getAttribute("data-angulos") || fila.getAttribute("data-img") || "").split("|").filter(Boolean);
      coleccion = lista;
      altActual = fila.getAttribute("data-alt-foto") || "";
      indice = 0;
      pintarGrande();
      pintarAngulos();
      pintarDots();
      pintarFlechas();
      // marcar la mini activa en el panel de pedido
      cont.querySelectorAll(".k-pedido__mini").forEach(function (m) {
        var p = m.closest(".k-pedido");
        m.classList.toggle("is-activa", p === fila);
      });
    }

    // Click en una mini del panel: activa la coleccion de su fila
    cont.querySelectorAll(".k-pedido__mini").forEach(function (mini) {
      mini.addEventListener("click", function () {
        var fila = mini.closest(".k-pedido");
        if (fila) activarFila(fila);
      });
    });

    if (flechaPrev) flechaPrev.addEventListener("click", function () { irA(indice - 1); });
    if (flechaNext) flechaNext.addEventListener("click", function () { irA(indice + 1); });

    // Estado inicial: foto del look completo
    var filaTodo = cont.querySelector(".k-pedido--todo");
    if (filaTodo) activarFila(filaTodo);

    /* -- Pago: total de las piezas marcadas + casilla maestra -- */
    function casillas() {
      return Array.prototype.slice.call(filas)
        .map(function (f) { return f.querySelector(".k-pedido__check"); })
        .filter(Boolean);
    }
    function marcadas() {
      return Array.prototype.slice.call(filas).filter(function (f) {
        var c = f.querySelector(".k-pedido__check");
        return c && c.checked;
      });
    }
    function recalcular() {
      var t = marcadas().reduce(function (s, f) { return s + Number(f.getAttribute("data-precio")); }, 0);
      if (totalEl) totalEl.textContent = pesos(t);
      if (maestro) {
        var cs = casillas();
        maestro.checked = cs.length > 0 && cs.every(function (c) { return c.checked; });
      }
    }
    cont.addEventListener("change", function (e) {
      if (maestro && e.target === maestro) {
        casillas().forEach(function (c) { c.checked = maestro.checked; });
      }
      recalcular();
    });
    recalcular();

    /* -- Anadir las piezas marcadas (con su talla) a la cesta -- */
    function anadir() {
      var sel = marcadas();
      if (!window.KioscoTienda || !sel.length) return;
      sel.forEach(function (f) {
        var talla = f.querySelector(".k-pedido__talla");
        var t = talla ? talla.value : "";
        window.KioscoTienda.addCesta({
          key: "prenda:" + f.getAttribute("data-look") + ":" + t,
          tipo: "prenda",
          look: f.getAttribute("data-look"),
          nombre: f.getAttribute("data-nombre") + (t ? " · Talla " + t : ""),
          precio: Number(f.getAttribute("data-precio")),
          img: f.getAttribute("data-img")
        });
      });
      var panel = document.getElementById("panelCesta");
      if (panel && window.bootstrap) {
        window.bootstrap.Offcanvas.getOrCreateInstance(panel).show();
      }
    }
    var add = cont.querySelector("[data-detalle-add]");
    var comprar = cont.querySelector("[data-detalle-comprar]");
    if (add) add.addEventListener("click", anadir);
    if (comprar) comprar.addEventListener("click", anadir);

    /* -- Looks similares: resaltar los tags que coinciden con este look -- */
    var ref = {};
    document.querySelectorAll("[data-look-tags] .k-tag").forEach(function (t) {
      ref[t.textContent.trim().toLowerCase()] = true;
    });
    document.querySelectorAll("[data-similares] .k-tag").forEach(function (t) {
      if (ref[t.textContent.trim().toLowerCase()]) t.classList.add("k-tag--match");
    });
  }

  /* -- 8. Responsive images: inyecta srcset/sizes en cada <img> que apunte
     a /multimedia/. Se generaron 3 variantes por archivo (-480.jpg, -768.jpg,
     -1440.jpg) en multimedia/. El navegador elige la mejor segun viewport. */
  function iniciarResponsiveImg() {
    var imgs = document.querySelectorAll('img[src*="multimedia/"]');
    imgs.forEach(function (img) {
      var src = img.getAttribute("src");
      if (!src || !/\.jpg$/i.test(src)) return;
      if (img.hasAttribute("srcset")) return;
      // Excluye los archivos ya redimensionados o el favicon
      if (/-(?:480|768|1440)\.jpg$/i.test(src)) return;
      var base = src.replace(/\.jpg$/i, "");
      img.setAttribute("srcset",
        base + "-480.jpg 480w, " +
        base + "-768.jpg 768w, " +
        base + "-1440.jpg 1440w"
      );
      if (!img.hasAttribute("sizes")) {
        img.setAttribute("sizes",
          "(min-width: 1200px) 33vw, (min-width: 768px) 50vw, 100vw"
        );
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    iniciarResponsiveImg();
    iniciarReveal();
    iniciarTema();
    iniciarFiltro();
    iniciarTest();
    iniciarTrend();
    iniciarCatalogo();
    iniciarDetalle();
  });
})();
