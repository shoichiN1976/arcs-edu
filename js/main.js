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

// 新着表示（NEWラベル＝公開14日以内／ナビ赤丸＝未読の新着があるとき）
(function () {
  // 1) 一覧の日付（YYYY.MM.DD）から14日以内の記事にNEWラベル
  document.querySelectorAll(".index-list a").forEach(function (a) {
    var d = a.querySelector(".date");
    var t = a.querySelector(".title");
    if (!d || !t) return;
    var m = d.textContent.match(/(\d{4})\.(\d{2})\.(\d{2})/);
    if (!m) return;
    var published = new Date(+m[1], +m[2] - 1, +m[3]);
    if (Date.now() - published.getTime() < 14 * 86400000) {
      var b = document.createElement("span");
      b.className = "new-badge";
      b.textContent = "NEW";
      t.appendChild(b);
    }
  });

  // 2) ナビ「ニュース」の赤丸（最新記事を見たかをlocalStorageで記憶）
  var KEY = "arcsNewsSeen";
  var inNews = /\/news\//.test(location.pathname);
  if (inNews) {
    // ニュース側に入ったら、一覧の先頭記事を「既読の最新」として記録
    var first = document.querySelector(".index-list a");
    var latest = first ? first.getAttribute("href") : location.pathname.split("/").pop();
    try { localStorage.setItem(KEY, latest); } catch (e) {}
    return;
  }
  var navNews = document.querySelector('nav.site a[href$="news/index.html"]');
  if (!navNews || !window.fetch) return;
  fetch(navNews.getAttribute("href")).then(function (r) { return r.text(); }).then(function (html) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    var a = doc.querySelector(".index-list a");
    if (!a) return;
    var latest = a.getAttribute("href");
    var seen = null;
    try { seen = localStorage.getItem(KEY); } catch (e) {}
    if (latest && latest !== seen) {
      var s = document.createElement("span");
      s.className = "nav-dot";
      navNews.appendChild(s);
    }
  }).catch(function () {});
})();
