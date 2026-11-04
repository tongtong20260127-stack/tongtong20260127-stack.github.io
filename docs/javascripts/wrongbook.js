/**
 * Tong's Knowledge Base — Wrong Book Page
 */
(function () {
  function $(id) {
    return document.getElementById(id);
  }

  function formatText(text) {
    return String(text || "")
      .replace(/\\n/g, "<br>")
      .replace(/\n/g, "<br>");
  }

  function renderMath(el) {
    if (window.MathJax && MathJax.typesetPromise && el) {
      MathJax.typesetPromise([el]).catch(() => {});
    }
  }

  function render() {
    const root = $("wrongbook-app");
    if (!root || !window.KBAuth) return;

    const user = KBAuth.currentUser();
    const loginPrompt = $("wb-login-prompt");
    const content = $("wb-content");
    const listEl = $("wb-list");
    const emptyEl = $("wb-empty");
    const userLabel = $("wb-user");
    const countLabel = $("wb-count");

    if (!user) {
      if (loginPrompt) loginPrompt.hidden = false;
      if (content) content.hidden = true;
      return;
    }

    if (loginPrompt) loginPrompt.hidden = true;
    if (content) content.hidden = false;
    if (userLabel) userLabel.textContent = user;

    const list = KBAuth.getWrongBook();
    if (countLabel) countLabel.textContent = String(list.length);

    if (!list.length) {
      if (emptyEl) emptyEl.hidden = false;
      if (listEl) listEl.innerHTML = "";
      return;
    }

    if (emptyEl) emptyEl.hidden = true;

    listEl.innerHTML = list
      .map((item, index) => {
        const date = item.addedAt ? new Date(item.addedAt).toLocaleString() : "";
        return `
          <article class="wb-item" data-id="${item.id}">
            <div class="wb-item-head">
              <span class="wb-item-meta">${escapeHtml(item.subject)} · ${escapeHtml(item.topic)}</span>
              <span class="wb-item-date">${escapeHtml(date)}</span>
            </div>
            <div class="wb-item-q">${formatText(item.q)}</div>
            <details class="wb-item-a">
              <summary>查看答案</summary>
              <div class="wb-answer">${formatText(item.a)}</div>
            </details>
            <div class="wb-item-actions">
              <button type="button" class="quiz-btn wb-btn-remove" data-remove="${item.id}">移出错题本</button>
            </div>
          </article>
        `;
      })
      .join("");

    listEl.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-remove");
        KBAuth.removeFromWrongBook(id);
        if (KBAuth.renderHeaderAuth) KBAuth.renderHeaderAuth();
        render();
      });
    });

    listEl.querySelectorAll("details").forEach((d) => {
      d.addEventListener("toggle", () => {
        if (d.open) renderMath(d);
      });
    });

    renderMath(listEl);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function init() {
    const root = $("wrongbook-app");
    if (!root) return;

    $("wb-open-login")?.addEventListener("click", () => {
      if (window.KBAuth) KBAuth.openModal();
    });

    $("wb-clear")?.addEventListener("click", () => {
      if (!window.KBAuth || !KBAuth.currentUser()) return;
      if (confirm("确定清空当前账号的全部错题吗？")) {
        KBAuth.clearWrongBook();
        if (KBAuth.renderHeaderAuth) KBAuth.renderHeaderAuth();
        render();
      }
    });

    window.addEventListener("kb-auth-change", render);
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(() => setTimeout(init, 0));
  }
})();
