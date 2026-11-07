/**
 * Tong's Knowledge Base — Favorites page
 */
(function () {
  function $(id) {
    return document.getElementById(id);
  }

  function formatText(text) {
    return String(text || "").replace(/\n/g, "<br>");
  }

  function renderMath(root) {
    if (!root) return;
    root.classList.add("kb-math", "arithmatex");
    setTimeout(function () {
      if (window.kbTypeset) window.kbTypeset(root);
      else if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([root]).catch(function () {});
      }
    }, 40);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function refresh() {
    var root = $("fav-app");
    if (!root || !window.KBAuth) return;

    var user = KBAuth.currentUser();
    var prompt = $("fav-login-prompt");
    var content = $("fav-content");

    if (!user) {
      if (prompt) prompt.hidden = false;
      if (content) content.hidden = true;
      return;
    }

    if (prompt) prompt.hidden = true;
    if (content) content.hidden = false;
    if ($("fav-user")) $("fav-user").textContent = user;

    await KBAuth.loadFavorites();
    var list = KBAuth.getFavorites();
    if ($("fav-count")) $("fav-count").textContent = String(list.length);

    var empty = $("fav-empty");
    var box = $("fav-list");
    if (!list.length) {
      if (empty) empty.hidden = false;
      if (box) box.innerHTML = "";
      return;
    }
    if (empty) empty.hidden = true;

    box.innerHTML = list
      .map(function (item) {
        var linkHtml = item.link
          ? '<p class="fav-link"><a href="' +
            escapeHtml(item.link) +
            '">打开相关笔记 →</a></p>'
          : "";
        return (
          '<article class="wb-item" data-id="' +
          escapeHtml(item.id) +
          '">' +
          '<div class="wb-item-head">' +
          '<span class="wb-item-meta">' +
          escapeHtml(item.subject || "") +
          (item.topic ? " · " + escapeHtml(item.topic) : "") +
          "</span>" +
          '<span class="wb-item-date">' +
          escapeHtml((item.addedAt || "").toString().slice(0, 19).replace("T", " ")) +
          "</span></div>" +
          '<div class="wb-item-q kb-math arithmatex">' +
          formatText(item.title || item.content) +
          "</div>" +
          (item.content && item.title
            ? '<div class="wb-answer kb-math arithmatex">' +
              formatText(item.content) +
              "</div>"
            : "") +
          linkHtml +
          '<button type="button" class="quiz-btn wb-btn-remove fav-remove">取消收藏</button>' +
          "</article>"
        );
      })
      .join("");

    box.querySelectorAll(".fav-remove").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var article = btn.closest(".wb-item");
        var id = article && article.getAttribute("data-id");
        if (!id) return;
        Promise.resolve(KBAuth.removeFavorite(id)).then(function () {
          refresh();
          if (KBAuth.renderHeaderAuth) KBAuth.renderHeaderAuth();
        });
      });
    });

    renderMath(box);
  }

  function init() {
    var root = $("fav-app");
    if (!root) return;
    if (root.dataset.favBound === "1") {
      refresh();
      return;
    }
    root.dataset.favBound = "1";

    if ($("fav-open-login"))
      $("fav-open-login").addEventListener("click", function () {
        if (window.KBAuth) KBAuth.openModal();
      });
    if ($("fav-clear"))
      $("fav-clear").addEventListener("click", function () {
        if (!confirm("确定清空全部收藏？")) return;
        Promise.resolve(KBAuth.clearFavorites()).then(function () {
          refresh();
          if (KBAuth.renderHeaderAuth) KBAuth.renderHeaderAuth();
        });
      });

    window.addEventListener("kb-auth-change", refresh);
    refresh();
  }

  function installPageFavoriteButton() {
    if (document.getElementById("kb-page-fav-btn")) return;
    var path = window.location.pathname || "";
    if (
      path.indexOf("/quiz") !== -1 ||
      path.indexOf("/exam") !== -1 ||
      path.indexOf("/wrongbook") !== -1 ||
      path.indexOf("/favorites") !== -1
    )
      return;

    var titleEl =
      document.querySelector("article.md-content__inner > h1") ||
      document.querySelector(".md-content h1");
    if (!titleEl) return;

    var btn = document.createElement("button");
    btn.id = "kb-page-fav-btn";
    btn.type = "button";
    btn.className = "quiz-btn quiz-btn-fav kb-page-fav-btn";
    btn.textContent = "收藏本页";
    btn.addEventListener("click", function () {
      if (!window.KBAuth) return;
      if (!KBAuth.currentUser()) {
        KBAuth.openModal();
        return;
      }
      var title = (titleEl.textContent || "笔记").trim();
      var subject = "笔记";
      if (path.indexOf("/mathematics") !== -1) subject = "数学";
      else if (path.indexOf("/physics") !== -1) subject = "物理";
      else if (path.indexOf("/chemistry") !== -1) subject = "化学";
      else if (path.indexOf("/biology") !== -1) subject = "生物";
      else if (path.indexOf("/english") !== -1) subject = "英语";

      btn.disabled = true;
      btn.textContent = "保存中…";
      Promise.resolve(
        KBAuth.addFavorite({
          subject: subject,
          topic: "知识页",
          title: title,
          content: title,
          link: path
        })
      ).then(function (r) {
        btn.disabled = false;
        if (r && r.ok) {
          btn.textContent = r.reason === "exists" ? "已收藏" : "已收藏 ✓";
          btn.classList.add("is-added");
        } else {
          btn.textContent = (r && r.msg) || "收藏失败";
        }
        if (KBAuth.renderHeaderAuth) KBAuth.renderHeaderAuth();
      });
    });

    var wrap = document.createElement("p");
    wrap.className = "kb-page-fav-wrap";
    wrap.appendChild(btn);
    titleEl.parentNode.insertBefore(wrap, titleEl.nextSibling);
  }

  function boot() {
    init();
    installPageFavoriteButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      var root = document.getElementById("fav-app");
      if (root) root.dataset.favBound = "0";
      var old = document.getElementById("kb-page-fav-btn");
      if (old && old.parentNode) old.parentNode.remove();
      setTimeout(boot, 0);
    });
  }
})();
