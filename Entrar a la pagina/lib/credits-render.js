(function () {
  "use strict";
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function render() {
    var list = document.querySelector("[data-credits]");
    if (!list) return;
    fetch("assets/credits.json")
      .then(function (r) { return r.json(); })
      .then(function (credits) {
        var ids = Object.keys(credits);
        if (!ids.length) { list.innerHTML = "<li>No hay créditos externos.</li>"; return; }
        list.innerHTML = ids.map(function (id) {
          var c = credits[id];
          return (
            "<li><strong>" + esc(c.title || id) + "</strong> — " +
            (c.creator_url ? '<a href="' + esc(c.creator_url) + '" target="_blank" rel="noopener">' + esc(c.creator || "autor desconocido") + "</a>" : esc(c.creator || "autor desconocido")) +
            " (" + esc(c.source || "") + ") · " +
            '<a href="' + esc(c.license_url) + '" target="_blank" rel="noopener">' + esc((c.license || "").toUpperCase()) + " " + esc(c.license_version || "") + "</a> · " +
            '<a href="' + esc(c.foreign_landing_url) + '" target="_blank" rel="noopener">Ver original ↗</a></li>'
          );
        }).join("");
      })
      .catch(function () {
        list.innerHTML = "<li>No se pudieron cargar los créditos.</li>";
      });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
