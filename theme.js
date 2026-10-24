// Gemeinsamer Hell/Dunkel-Modus für alle Kartenkosmos-Apps.
// Gespeichert wird "auto", "light" oder "dark"; <html data-theme> bekommt immer "light" oder "dark".
(function () {
  var KEY = "kartenkosmos-theme";
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function get() {
    try { return localStorage.getItem(KEY) || "auto"; } catch (e) { return "auto"; }
  }

  function apply() {
    var mode = get();
    var dark = mode === "dark" || (mode === "auto" && (!media || media.matches));
    var root = document.documentElement;
    root.setAttribute("data-theme", dark ? "dark" : "light");
    root.style.colorScheme = dark ? "dark" : "light";
    // Statusleiste in der Home-Bildschirm-App an die Hintergrundfarbe anpassen
    var meta = document.querySelector('meta[name="theme-color"]');
    var bg = getComputedStyle(root).getPropertyValue("--bg").trim();
    if (meta && bg) meta.setAttribute("content", bg);
  }

  function set(mode) {
    try { localStorage.setItem(KEY, mode); } catch (e) {}
    apply();
  }

  apply();
  if (media && media.addEventListener) media.addEventListener("change", apply);
  window.addEventListener("storage", function (e) { if (e.key === KEY) apply(); });
  // beim Zurückkehren aus dem Startmenü (Seiten-Cache) neu anwenden
  window.addEventListener("pageshow", apply);
  window.kkTheme = { get: get, set: set };
})();
