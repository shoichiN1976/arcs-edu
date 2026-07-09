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

// フォーム送信（Formspree・サイト内で完了表示）
(function () {
  document.querySelectorAll('form[action*="formspree.io"]').forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var btn = form.querySelector('button[type="submit"], button');
      if (btn) { btn.disabled = true; btn.textContent = "送信中…"; }
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (res) {
        if (res.ok) {
          var msg = document.createElement("p");
          msg.textContent = "送信されました。ありがとうございます。";
          msg.style.cssText = "margin-top:1rem;color:var(--color-accent);letter-spacing:0.05em;";
          form.replaceWith(msg);
        } else { throw new Error("bad status"); }
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = "送信する"; }
        alert("送信できませんでした。時間をおいてもう一度お試しください。");
      });
    });
  });
})();
