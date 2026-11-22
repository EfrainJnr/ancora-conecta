/* Áncora Conecta — página inicial: menú móvil, tema y aviso de idioma. */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };

  var btn = $("#menu-btn"), nav = $("#site-nav");
  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
  });

  $("#theme").addEventListener("click", function () {
    var root = document.documentElement;
    var dark = root.getAttribute("data-theme") === "dark" ||
      (!root.getAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.setAttribute("data-theme", dark ? "light" : "dark");
  });

  var toast = $("#toast"), t;
  $("#lang-en").addEventListener("click", function () {
    toast.textContent = "La versión en inglés estará disponible próximamente.";
    toast.hidden = false; clearTimeout(t);
    t = setTimeout(function () { toast.hidden = true; }, 2600);
  });
})();
