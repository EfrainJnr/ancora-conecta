/* Áncora Conecta — comportamiento de demostración (sin servidor).
   Todos los datos son de ejemplo. Para traducir al inglés en el futuro,
   mueve los textos a un diccionario I18N y cambia el atributo lang del <html>. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Textos (listos para i18n) ---------- */
  var I18N = {
    es: {
      titles: { inicio: "Portal", transmision: "Transmisión", agenda: "Agenda", mensajes: "Mensajes", qr: "Participación QR", galeria: "Galería", interaccion: "Interacción en vivo", rsvp: "Invitación y RSVP" },
      soonEn: "La versión en inglés estará disponible próximamente.",
      demo: "Demostración: no se guarda ni se envía nada."
    }
  };
  var T = I18N.es;

  /* ---------- Toast ---------- */
  var toastEl = $("#toast"), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 2600);
  }

  /* ---------- Navegación por hash ---------- */
  var VIEWS = Object.keys(T.titles);
  function route() {
    var h = location.hash.replace("#", "");
    if (VIEWS.indexOf(h) === -1) h = "inicio";
    var stage = "Portal";
    $$("[data-view]").forEach(function (v) {
      var on = v.getAttribute("data-view") === h;
      v.hidden = !on;
      if (on && v.getAttribute("data-stage")) stage = v.getAttribute("data-stage");
    });
    $$("[data-nav]").forEach(function (a) {
      var on = a.getAttribute("data-nav") === h;
      a.classList.toggle("on", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    $("#crumb-stage").textContent = stage;
    $("#crumb").textContent = T.titles[h];
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  window.addEventListener("hashchange", route);
  route();

  /* ---------- Subcategorías (pestañas internas de cada módulo) ---------- */
  function showSub(section, name) {
    $$("[data-subs] button", section).forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-sub") === name); });
    $$("[data-pane]", section).forEach(function (p) { p.hidden = p.getAttribute("data-pane") !== name; });
  }
  $$("[data-subs] button").forEach(function (b) {
    b.addEventListener("click", function () { showSub(b.closest("[data-view]"), b.getAttribute("data-sub")); });
  });
  $$("[data-go-sub]").forEach(function (b) {
    b.addEventListener("click", function () { showSub(b.closest("[data-view]"), b.getAttribute("data-go-sub")); });
  });
  $$(".switch").forEach(function (s) {
    s.addEventListener("click", function () { s.setAttribute("aria-pressed", s.getAttribute("aria-pressed") === "true" ? "false" : "true"); });
  });

  /* ---------- Tema y idioma ---------- */
  $("#theme").addEventListener("click", function () {
    var root = document.documentElement;
    var dark = root.getAttribute("data-theme") === "dark" ||
      (!root.getAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.setAttribute("data-theme", dark ? "light" : "dark");
  });
  $("#lang-en").addEventListener("click", function () { toast(T.soonEn); });

  /* ---------- Cuenta regresiva ---------- */
  var target = new Date("2027-03-13T17:00:00-05:00").getTime();
  function tick() {
    var ms = Math.max(0, target - Date.now());
    var d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
    $("#cd-d").textContent = String(d).padStart(3, "0");
    $("#cd-h").textContent = String(h).padStart(2, "0");
    $("#cd-m").textContent = String(m).padStart(2, "0");
  }
  tick(); setInterval(tick, 30000);

  /* ---------- Transmisión ---------- */
  $("#play").addEventListener("click", function () { toast("Demostración: aquí se reproduce la emisión privada."); });
  var chat = $("#chat");
  function addChat(who, text) {
    var li = document.createElement("li"), b = document.createElement("b");
    b.textContent = who; li.appendChild(b); li.appendChild(document.createTextNode(text));
    chat.appendChild(li); chat.scrollTop = chat.scrollHeight;
  }
  $("#chat-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var v = $("#chat-input").value.trim();
    if (!v) return;
    addChat("Tú", v); $("#chat-input").value = "";
  });
  var fake = [["Prima Daniela", "Vivan los novios 🥂"], ["Tío Hernán", "Se ve espectacular el mar"], ["Sofía (Miami)", "Les mandamos un abrazo enorme"]];
  var fi = 0;
  setInterval(function () {
    if (location.hash !== "#transmision") return;
    var f = fake[fi++ % fake.length]; addChat(f[0], f[1]);
    $("#viewers").textContent = (46 + (fi % 7)) + " conectados";
  }, 7000);

  /* ---------- Agenda ---------- */
  var AGENDA = [
    { day: "Viernes 12", note: "Llegada", ev: [["5:00 p. m.", "Bienvenida y cóctel en la playa", "Club de playa"]] },
    { day: "Sábado 13", note: "Día de la boda", ev: [
      ["9:00 a. m.", "Brunch de las familias", "Terraza del hotel"],
      ["4:30 p. m.", "Llegada de invitados", "Muelle"],
      ["5:00 p. m.", "Ceremonia frente al mar", "Transmisión en vivo", true],
      ["6:15 p. m.", "Cóctel al atardecer", "Horario actualizado"],
      ["7:30 p. m.", "Cena", "Salón de la laguna"],
      ["9:30 p. m.", "Primer baile y fiesta", "Pista en la arena"]
    ] },
    { day: "Domingo 14", note: "Despedida", ev: [["11:00 a. m.", "Almuerzo de despedida", "Terraza del hotel"]] }
  ];
  var tl = $("#timeline");
  AGENDA.forEach(function (d) {
    var sec = document.createElement("div"); sec.className = "day";
    var h = document.createElement("h3"); h.textContent = d.day;
    var s = document.createElement("small"); s.textContent = d.note; h.appendChild(s); sec.appendChild(h);
    d.ev.forEach(function (e) {
      var row = document.createElement("div"); row.className = "ev" + (e[3] ? " main" : "");
      var t = document.createElement("time"); t.textContent = e[0];
      var mid = document.createElement("div");
      var b = document.createElement("b"); b.textContent = e[1];
      var sm = document.createElement("small"); sm.textContent = e[2];
      mid.appendChild(b); mid.appendChild(sm);
      var bell = document.createElement("button");
      bell.type = "button"; bell.className = "bell"; bell.setAttribute("aria-pressed", e[3] ? "true" : "false");
      bell.setAttribute("aria-label", "Recordatorio: " + e[1]);
      bell.innerHTML = '<svg class="ic"><use href="#i-bell"/></svg>';
      bell.addEventListener("click", function () {
        var on = bell.getAttribute("aria-pressed") !== "true";
        bell.setAttribute("aria-pressed", on ? "true" : "false");
        toast(on ? "Recordatorio activado" : "Recordatorio desactivado");
      });
      row.appendChild(t); row.appendChild(mid); row.appendChild(bell); sec.appendChild(row);
    });
    tl.appendChild(sec);
  });

  /* ---------- Mensajes (grabadora simulada) ---------- */
  var wave = $("#wave"), bars = [], recTimer = null, secs = 0, recording = false;
  for (var i = 0; i < 48; i++) { var bar = document.createElement("i"); wave.appendChild(bar); bars.push(bar); }
  $$("#rec-kind button").forEach(function (b) {
    b.addEventListener("click", function () { $$("#rec-kind button").forEach(function (x) { x.classList.toggle("on", x === b); }); });
  });
  $("#rec-btn").addEventListener("click", function () {
    var btn = $("#rec-btn");
    recording = !recording;
    if (recording) {
      secs = 0; btn.textContent = "Detener y enviar";
      recTimer = setInterval(function () {
        secs++; $("#rec-time").textContent = "0" + Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0");
      }, 1000);
      wave._t = setInterval(function () {
        bars.forEach(function (b) { b.style.height = (12 + Math.random() * 80) + "%"; });
      }, 140);
    } else {
      clearInterval(recTimer); clearInterval(wave._t);
      bars.forEach(function (b) { b.style.height = ""; });
      btn.textContent = "Empezar a grabar"; $("#rec-time").textContent = "00:00";
      toast("Mensaje listo. " + T.demo);
    }
  });
  $$(".msgs .pill").forEach(function (p) { p.addEventListener("click", function () { toast("Demostración: aquí se reproduce el mensaje."); }); });

  /* ---------- QR de ejemplo (patrón decorativo, no escaneable) ---------- */
  (function () {
    var n = 25, svg = $("#qr"), seed = 7, out = "";
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    function finder(x, y) {
      return '<rect x="' + x + '" y="' + y + '" width="7" height="7" fill="#3B2E2A"/>' +
        '<rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="5" height="5" fill="#fff"/>' +
        '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3" fill="#AD5752"/>';
    }
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var inFinder = (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
      if (!inFinder && rnd() > 0.52) out += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="#3B2E2A"/>';
    }
    svg.innerHTML = out + finder(0, 0) + finder(n - 7, 0) + finder(0, n - 7);
  })();

  /* ---------- Galería ---------- */
  var GAL = [
    { t: "foto", c: "g1", by: "Tía Marcela" }, { t: "nota", q: "Que el amor los lleve siempre de vuelta a casa.", by: "Abuela Rosa" },
    { t: "video", c: "g2", by: "Camilo" }, { t: "foto", c: "g3", by: "Primos" },
    { t: "foto", c: "g4", by: "Sofía" }, { t: "nota", q: "Gracias por invitarnos a vivir este día con ustedes.", by: "Familia Restrepo" },
    { t: "video", c: "g5", by: "Daniela" }, { t: "foto", c: "g6", by: "Hernán" },
    { t: "foto", c: "g3", by: "Laura" }, { t: "foto", c: "g2", by: "Mesa 4" },
    { t: "nota", q: "Brindo por ustedes y por todo lo que viene.", by: "Padrinos" }, { t: "video", c: "g1", by: "Mesa 9" }
  ];
  var LABEL = { foto: "Foto", video: "Video", nota: "Dedicatoria" };
  function renderGal(f) {
    var g = $("#grid"); g.innerHTML = "";
    GAL.forEach(function (it) {
      if (f !== "all" && it.t !== f) return;
      var d = document.createElement("div");
      if (it.t === "nota") {
        d.className = "tile nota";
        var q = document.createElement("q"); q.textContent = it.q;
        var by = document.createElement("span"); by.className = "by"; by.textContent = it.by;
        d.appendChild(q); d.appendChild(by);
      } else {
        d.className = "tile " + it.c + (it.t === "video" ? " v" : "");
        var tag = document.createElement("span"); tag.className = "tag"; tag.textContent = LABEL[it.t];
        var by2 = document.createElement("span"); by2.className = "by"; by2.textContent = it.by;
        d.appendChild(tag); d.appendChild(by2);
      }
      g.appendChild(d);
    });
  }
  renderGal("all");
  $$("#gal-filter button").forEach(function (b) {
    b.addEventListener("click", function () {
      $$("#gal-filter button").forEach(function (x) { x.classList.toggle("on", x === b); });
      renderGal(b.getAttribute("data-f"));
    });
  });
  $("#upload").addEventListener("click", function () { toast(T.demo); });
  var drop = $("#drop");
  ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("over"); }); });
  ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("over"); if (ev === "drop") toast(T.demo); }); });

  /* ---------- Interacción: votación y canciones ---------- */
  var POLL = [{ n: "Islas del Rosario", v: 34 }, { n: "Ciudad de México", v: 21 }, { n: "Maldivas", v: 12 }, { n: "Patagonia", v: 9 }];
  var myVote = -1;
  function renderPoll() {
    var ul = $("#poll"); ul.innerHTML = "";
    var total = POLL.reduce(function (a, p) { return a + p.v; }, 0);
    POLL.forEach(function (p, i) {
      var li = document.createElement("li"), b = document.createElement("button");
      b.type = "button"; b.className = "opt-btn" + (i === myVote ? " me" : "");
      var fill = document.createElement("i"); fill.style.width = Math.round(p.v / total * 100) + "%";
      var l = document.createElement("span"); l.textContent = p.n;
      var r = document.createElement("span"); r.textContent = Math.round(p.v / total * 100) + "%";
      b.appendChild(fill); b.appendChild(l); b.appendChild(r);
      b.addEventListener("click", function () {
        if (myVote === i) { POLL[i].v--; myVote = -1; }
        else { if (myVote > -1) POLL[myVote].v--; POLL[i].v++; myVote = i; }
        renderPoll();
      });
      li.appendChild(b); ul.appendChild(li);
    });
    $("#poll-total").textContent = total + " votos · se actualiza al instante";
  }
  renderPoll();

  var SONGS = [{ n: "Valió la pena", a: "Marc Anthony", v: 18, me: false }, { n: "La Bachata", a: "Manuel Turizo", v: 14, me: false }, { n: "Vivir mi vida", a: "Marc Anthony", v: 11, me: false }];
  function renderSongs() {
    var ul = $("#songs"); ul.innerHTML = "";
    SONGS.sort(function (a, b) { return b.v - a.v; }).forEach(function (s) {
      var li = document.createElement("li"), d = document.createElement("div");
      var b = document.createElement("b"); b.textContent = s.n;
      var sm = document.createElement("small"); sm.textContent = s.a;
      d.appendChild(b); d.appendChild(sm);
      var up = document.createElement("button"); up.type = "button"; up.className = "up" + (s.me ? " me" : "");
      up.textContent = "▲ " + s.v; up.setAttribute("aria-label", "Votar " + s.n);
      up.addEventListener("click", function () { s.me = !s.me; s.v += s.me ? 1 : -1; renderSongs(); });
      li.appendChild(d); li.appendChild(up); ul.appendChild(li);
    });
  }
  renderSongs();
  $("#song-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var v = $("#song-input").value.trim(); if (!v) return;
    SONGS.push({ n: v, a: "Pedida por ti", v: 1, me: true }); $("#song-input").value = ""; renderSongs();
  });

  /* ---------- RSVP ---------- */
  $("#rsvp-form").addEventListener("submit", function (e) {
    e.preventDefault();
    $("#rsvp-ok").hidden = false;
    toast("¡Gracias! " + T.demo);
  });
})();
