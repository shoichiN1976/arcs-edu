// テーマ切替（ライト／ダーク）
// 初期テーマは <head> 内のインラインスクリプトが設定（FOUC防止）
(function () {
  var root = document.documentElement;
  document.querySelectorAll(".theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  });
})();
