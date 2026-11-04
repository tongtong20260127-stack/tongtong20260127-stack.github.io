/**
 * Tong's Knowledge Base — Wrong Book Page
 */
(function () {
  function $(id) {
    return document.getElementById(id);
  }

  function formatText(text) {
    return String(text || "")
      .replace(/\r\n/g, "\n")
      .replace(/\n/g, "<br>");
  }

  function renderMath(el) {
    if (!el) return;
    el.classList.add("kb-math", "arithmatex");
    function run() {
      if (window.kbTypeset) {
        window.kbTypeset(el);
        return;
      }
      if (window.MathJax && MathJax.typesetPromise) {
        try {
          if (MathJax.typesetClear) MathJax.typesetClear([el]);
        } catch (e) {}
        MathJax.typesetPromise([el]).catch(function () {});
        return;
      }
      setTimeout(run, 120);
    }
    setTimeout(run, 30);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function render() {
    var root = $("wrongbook-app");
    if (!root || !window.KBAuth) return;

    var user = KBAuth.currentUser();
    var loginPrompt = $("wb-login-prompt");
    var content = $("wb-content");
    var listEl = $("wb-list");
    var emptyEl = $("wb-empty");
    var userLabel = $("wb-user");
    var countLabel = $("wb-count");

    if (!user) {
      if (loginPrompt) loginPrompt.hidden = false;
      if (content) content.hidden = true;
      return;
    }

    if (loginPrompt) loginPrompt.hidden = true;
    if (content) content.hidden = false;
    if (userLabel) userLabel.textContent = user;

    var list = KBAuth.getWrongBook();
    if (countLabel) countLabel.textContent = String(list.length);

    if (!list.length) {
      if (emptyEl) emptyEl.hidden = false;
      if (listEl) listEl.innerHTML = "";
      return;
    }

    if (emptyEl) emptyEl.hidden = true;

    listEl.innerHTML = list
      .map(function (item) {
        var date = item.addedAt ? new Date(item.addedAt).toLocaleString() : "";
        return (
          '<article class="wb-item" data-id="' +
          item.id +
          '">' +
          '<div class="wb-item-head">' +
          '<span class="wb-item-meta">' +
          escapeHtml(item.subject) +
          " · " +
          escapeHtml(item.topic) +
          "</span>" +
          '<span class="wb-item-date">' +
          escapeHtml(date) +
          "</span></div>" +
          '<div class="wb-item-q kb-math arithmatex">' +
          formatText(item.q) +
          "</div>" +
          '<details class="wb-item-a">' +
          "<summary>查看答案</summary>" +
          '<div class="wb-answer kb-math arithmatex">' +
          formatText(item.a) +
          "</div></details>" +
          '<div class="wb-item-actions">' +
          '<button type="button" class="quiz-btn wb-btn-remove" data-remove="' +
          item.id +
          '">移出错题本</button>' +
          "</div></article>"
        );
      })
      .join("");

    listEl.querySelectorAll("[data-remove]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-remove");
        KBAuth.removeFromWrongBook(id);
        if (KBAuth.renderHeaderAuth) KBAuth.renderHeaderAuth();
        render();
      });
    });

    listEl.querySelectorAll("details").forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (d.open) renderMath(d.querySelector(".wb-answer"));
      });
    });

    listEl.querySelectorAll(".wb-item-q").forEach(function (el) {
      renderMath(el);
    });
  }

  function init() {
    var root = $("wrongbook-app");
    if (!root) return;

    if ($("wb-open-login")) {
      $("wb-open-login").addEventListener("click", function () {
        if (window.KBAuth) KBAuth.openModal();
      });
    }

    if ($("wb-clear")) {
      $("wb-clear").addEventListener("click", function () {
        if (!window.KBAuth || !KBAuth.currentUser()) return;
        if (confirm("确定清空当前账号的全部错题吗？")) {
          KBAuth.clearWrongBook();
          if (KBAuth.renderHeaderAuth) KBAuth.renderHeaderAuth();
          render();
        }
      });
    }

    window.addEventListener("kb-auth-change", render);
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      setTimeout(init, 0);
    });
  }
})();
