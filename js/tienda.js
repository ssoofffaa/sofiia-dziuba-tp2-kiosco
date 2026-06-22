/* ==========================================================================
   KIOSCO - tienda.js
   Logica de e-commerce SIN servidor: todo el estado vive en localStorage
   (memoria del propio navegador). No es una base de datos ni un backend,
   pero los botones funcionan de verdad y recuerdan tras recargar.

   Estado guardado:
     kiosco-cesta : [{ key, tipo, look, nombre, precio, img }]
     kiosco-pines : [{ look, nombre, precio, img }]
     kiosco-likes : [ "look-01", ... ]

   La fuente de cada look son los atributos data-* de cada .k-card[data-look].
   Las acciones (like / guardar / cesta) se inyectan aqui, no se repiten en HTML.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Iconos (una sola definicion) ---- */
  var ICO = {
    like: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-4.6-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.4-9.5 9-9.5 9z"/></svg>',
    pin:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
    cesta:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>'
  };

  /* ---- Acceso a localStorage con tolerancia a fallos ---- */
  function leer(clave) {
    try { return JSON.parse(localStorage.getItem(clave)) || []; }
    catch (e) { return []; }
  }
  function guardar(clave, valor) {
    try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (e) {}
  }

  var Tienda = {
    cesta: leer("kiosco-cesta"),
    pines: leer("kiosco-pines"),
    likes: leer("kiosco-likes"),

    persistir: function () {
      guardar("kiosco-cesta", this.cesta);
      guardar("kiosco-pines", this.pines);
      guardar("kiosco-likes", this.likes);
    },

    /* -- Cesta -- */
    addCesta: function (item) {
      var existe = this.cesta.find(function (i) { return i.key === item.key; });
      if (!existe) this.cesta.push(item);
      this.persistir();
      pintarCesta();
      pintarBadge();
    },
    quitarCesta: function (key) {
      this.cesta = this.cesta.filter(function (i) { return i.key !== key; });
      this.persistir();
      pintarCesta();
      pintarBadge();
    },
    totalCesta: function () {
      return this.cesta.reduce(function (s, i) { return s + Number(i.precio); }, 0);
    },

    /* -- Likes -- */
    tieneLike: function (id) { return this.likes.indexOf(id) !== -1; },
    toggleLike: function (id) {
      var i = this.likes.indexOf(id);
      if (i === -1) this.likes.push(id); else this.likes.splice(i, 1);
      this.persistir();
      return this.tieneLike(id);
    },

    /* -- Pines / tableros -- */
    tienePin: function (look) { return this.pines.some(function (p) { return p.look === look; }); },
    togglePin: function (look, datos) {
      if (this.tienePin(look)) {
        this.pines = this.pines.filter(function (p) { return p.look !== look; });
      } else {
        this.pines.push(datos);
      }
      this.persistir();
      pintarPines();
      return this.tienePin(look);
    }
  };

  /* ---- Formato de precio en pesos argentinos (miles con punto) ---- */
  function pesos(n) {
    return "$" + Number(n).toLocaleString("es-AR");
  }

  /* ---- Ruta a la pagina de detalle segun donde estemos (raiz vs /secciones/) ---- */
  function rutaDetalle() {
    return window.location.pathname.indexOf("/secciones/") !== -1
      ? "detalle.html" : "secciones/detalle.html";
  }

  /* ---- Datos de un look desde su card ---- */
  function datosCard(card) {
    return {
      look: card.getAttribute("data-look"),
      nombre: card.getAttribute("data-nombre"),
      precio: Number(card.getAttribute("data-precio")),
      prendas: Number(card.getAttribute("data-prendas") || 1),
      img: card.getAttribute("data-img")
    };
  }

  /* ---- Inyeccion de acciones en cada card ---- */
  function botonAccion(tipo, etiqueta, presionado) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "k-accion";
    b.setAttribute("data-accion", tipo);
    b.setAttribute("aria-pressed", presionado ? "true" : "false");
    b.setAttribute("aria-label", etiqueta);
    b.setAttribute("title", etiqueta);
    b.innerHTML = ICO[tipo === "guardar" ? "pin" : tipo];
    return b;
  }

  function inyectarAcciones() {
    document.querySelectorAll(".k-card[data-look]").forEach(function (card) {
      if (card.querySelector(".k-acciones")) return;   // ya inyectado
      var d = datosCard(card);
      var media = card.querySelector(".k-card__media");
      if (!media) return;

      var cluster = document.createElement("div");
      cluster.className = "k-acciones";

      var bLike = botonAccion("like", "Me gusta " + d.nombre, Tienda.tieneLike(d.look));
      var bPin = botonAccion("guardar", "Guardar " + d.nombre + " en mis tableros", Tienda.tienePin(d.look));
      var bCesta = botonAccion("cesta", "Anadir " + d.nombre + " a la cesta", false);

      bLike.addEventListener("click", function (e) {
        e.preventDefault();
        var act = Tienda.toggleLike(d.look);
        bLike.setAttribute("aria-pressed", act ? "true" : "false");
      });
      bPin.addEventListener("click", function (e) {
        e.preventDefault();
        var act = Tienda.togglePin(d.look, { look: d.look, nombre: d.nombre, precio: d.precio, img: d.img });
        bPin.setAttribute("aria-pressed", act ? "true" : "false");
      });
      bCesta.addEventListener("click", function (e) {
        e.preventDefault();
        // Pieza suelta (p.ej. desglose del look en detalle.html): la card lo
        // declara con data-directo y se anade a la cesta sin pasar por el modal
        // (el modal "look completo o una prenda" no tiene sentido para 1 prenda).
        if (card.hasAttribute("data-directo")) {
          Tienda.addCesta({ key: "prenda:" + d.look, tipo: "prenda", look: d.look,
            nombre: d.nombre, precio: d.precio, img: d.img });
          abrirCesta();
        } else {
          abrirModalCesta(d);
        }
      });

      cluster.appendChild(bLike);
      cluster.appendChild(bPin);
      cluster.appendChild(bCesta);
      media.appendChild(cluster);

      // Card entera clicable hacia el detalle (salvo las piezas sueltas, que
      // llevan data-directo y se anaden a la cesta). Enlace "estirado" de
      // Bootstrap: cubre toda la tarjeta pero queda por DEBAJO del cluster de
      // acciones (z-index), que siguen siendo pulsables.
      if (!card.hasAttribute("data-directo") && !card.querySelector(".stretched-link")) {
        var enlace = document.createElement("a");
        enlace.className = "stretched-link";
        enlace.href = rutaDetalle();
        enlace.setAttribute("aria-label", "Ver el look " + d.nombre);
        card.appendChild(enlace);
      }
    });
  }

  /* ---- Abrir el panel de la cesta (offcanvas) para confirmar visualmente ---- */
  function abrirCesta() {
    var panel = document.getElementById("panelCesta");
    if (panel && window.bootstrap) {
      window.bootstrap.Offcanvas.getOrCreateInstance(panel).show();
    }
  }

  /* ---- Modal: elegir look completo o una prenda ---- */
  var pendiente = null;
  var modalRef = null;

  function abrirModalCesta(d) {
    pendiente = d;
    var et = document.querySelector("[data-modal-look]");
    if (et) et.textContent = d.nombre + " · " + pesos(d.precio) + " · " + d.prendas + " prendas";
    var nodo = document.getElementById("modalCesta");
    if (nodo && window.bootstrap) {
      modalRef = window.bootstrap.Modal.getOrCreateInstance(nodo);
      modalRef.show();
    }
  }

  function wireModal() {
    var nodo = document.getElementById("modalCesta");
    if (!nodo) return;
    nodo.querySelectorAll("[data-modal-anadir]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!pendiente) return;
        var d = pendiente;
        if (btn.getAttribute("data-modal-anadir") === "look") {
          Tienda.addCesta({ key: "look:" + d.look, tipo: "look", look: d.look,
            nombre: d.nombre, precio: d.precio, img: d.img });
        } else {
          var unidad = Math.round(d.precio / d.prendas);
          Tienda.addCesta({ key: "prenda:" + d.look, tipo: "prenda", look: d.look,
            nombre: "Prenda de " + d.nombre, precio: unidad, img: d.img });
        }
        if (modalRef) modalRef.hide();
        abrirCesta();
      });
    });
  }

  /* ---- Render: badge de la cesta ---- */
  function pintarBadge() {
    var badge = document.querySelector("[data-cesta-contador]");
    if (!badge) return;
    var n = Tienda.cesta.length;
    badge.textContent = n;
    badge.hidden = n === 0;
  }

  /* ---- Render: contenido de la cesta ---- */
  function lineaHTML(item, accionQuitar) {
    var li = document.createElement("div");
    li.className = "k-linea";
    li.innerHTML =
      '<img class="img-fluid" src="' + item.img + '" alt="' + item.nombre + '">' +
      '<div class="k-linea__info">' +
        '<p class="k-card-titulo mb-1">' + item.nombre + '</p>' +
        '<p class="k-mono k-apagado mb-0">' + (item.tipo === "prenda" ? "Prenda suelta" : "Look completo") + '</p>' +
      '</div>' +
      '<span class="k-mono k-linea__precio me-2">' + pesos(item.precio) + '</span>';
    var quitar = document.createElement("button");
    quitar.className = "k-linea__quitar";
    quitar.type = "button";
    quitar.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="m5 6 1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>';
    quitar.setAttribute("aria-label", "Quitar " + item.nombre);
    quitar.setAttribute("title", "Quitar de la cesta");
    quitar.addEventListener("click", accionQuitar);
    li.appendChild(quitar);
    return li;
  }

  function pintarCesta() {
    var lista = document.querySelector("[data-cesta-lista]");
    var vacio = document.querySelector("[data-cesta-vacio]");
    var pie = document.querySelector("[data-cesta-pie]");
    var total = document.querySelector("[data-cesta-total]");
    if (!lista) return;

    lista.innerHTML = "";
    if (Tienda.cesta.length === 0) {
      if (vacio) vacio.hidden = false;
      if (pie) pie.hidden = true;
      return;
    }
    if (vacio) vacio.hidden = true;
    if (pie) pie.hidden = false;

    Tienda.cesta.forEach(function (item) {
      lista.appendChild(lineaHTML(item, function () { Tienda.quitarCesta(item.key); }));
    });
    if (total) total.textContent = pesos(Tienda.totalCesta());
  }

  /* ---- Render: pines / tableros en la cuenta ---- */
  function pintarPines() {
    var lista = document.querySelector("[data-pines-lista]");
    var vacio = document.querySelector("[data-pines-vacio]");
    if (!lista) return;

    lista.innerHTML = "";
    if (Tienda.pines.length === 0) {
      if (vacio) vacio.hidden = false;
      return;
    }
    if (vacio) vacio.hidden = true;

    var titulo = document.createElement("p");
    titulo.className = "k-mono mb-2";
    titulo.textContent = "Tablero: Mis looks (" + Tienda.pines.length + ")";
    lista.appendChild(titulo);

    Tienda.pines.forEach(function (p) {
      var quitar = function () {
        Tienda.togglePin(p.look, p);
        // reflejar en la card si esta en pagina
        var card = document.querySelector('.k-card[data-look="' + p.look + '"] [data-accion="guardar"]');
        if (card) card.setAttribute("aria-pressed", "false");
      };
      lista.appendChild(lineaHTML(
        { img: p.img, nombre: p.nombre, precio: p.precio, tipo: "look" },
        quitar
      ));
    });
  }

  /* ---- Arranque ---- */
  document.addEventListener("DOMContentLoaded", function () {
    inyectarAcciones();
    wireModal();
    pintarBadge();
    pintarCesta();
    pintarPines();
  });

  // expone para depurar / reutilizar en otras paginas
  window.KioscoTienda = Tienda;
})();
