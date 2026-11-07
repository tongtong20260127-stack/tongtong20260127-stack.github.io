/**
 * Leave a message for the site owner (Supabase)
 */
(function () {
  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatText(text) {
    return escapeHtml(text || "").replace(/\n/g, "<br>");
  }

  async function loadMyMessages() {
    if (!window.KBAuth || !KBAuth.ensureClient) return [];
    var sb = KBAuth.ensureClient();
    var user = KBAuth.currentUserFull && KBAuth.currentUserFull();
    if (!sb || !user) return [];

    var res = await sb
      .from("messages")
      .select("id, title, body, created_at")
      .order("created_at", { ascending: false });

    if (res.error) {
      console.error("[Msg] load failed", res.error);
      return { error: res.error.message || "读取失败" };
    }
    return res.data || [];
  }

  async function sendMessage(title, body) {
    if (!window.KBAuth || !KBAuth.ensureClient) {
      return { ok: false, msg: "未就绪" };
    }
    var sb = KBAuth.ensureClient();
    var user = KBAuth.currentUserFull && KBAuth.currentUserFull();
    if (!sb) return { ok: false, msg: "Supabase 未初始化" };
    if (!user) return { ok: false, msg: "请先登录" };

    body = (body || "").trim();
    title = (title || "").trim();
    if (!body) return { ok: false, msg: "请填写留言内容" };
    if (body.length > 2000) return { ok: false, msg: "内容过长（最多 2000 字）" };

    var res = await sb
      .from("messages")
      .insert({
        user_id: user.id,
        user_email: user.email || "",
        title: title,
        body: body
      })
      .select("id")
      .single();

    if (res.error) {
      return {
        ok: false,
        msg: res.error.message || "发送失败，请确认已创建 messages 表"
      };
    }
    return { ok: true, msg: "发送成功，站长会在后台看到" };
  }

  function renderList(rows) {
    var list = $("msg-list");
    var empty = $("msg-empty");
    if (!list) return;

    if (rows && rows.error) {
      if (empty) {
        empty.hidden = false;
        empty.textContent = "读取失败：" + rows.error + "（请先执行建表 SQL）";
      }
      list.innerHTML = "";
      return;
    }

    if (!rows || !rows.length) {
      if (empty) {
        empty.hidden = false;
        empty.textContent = "你还没有发过留言。";
      }
      list.innerHTML = "";
      return;
    }

    if (empty) empty.hidden = true;
    list.innerHTML = rows
      .map(function (row) {
        var t = (row.created_at || "").toString().slice(0, 19).replace("T", " ");
        return (
          '<article class="wb-item">' +
          '<div class="wb-item-head">' +
          '<span class="wb-item-meta">' +
          escapeHtml(row.title || "（无标题）") +
          "</span>" +
          '<span class="wb-item-date">' +
          escapeHtml(t) +
          "</span></div>" +
          '<div class="wb-item-q">' +
          formatText(row.body) +
          "</div></article>"
        );
      })
      .join("");
  }

  async function refresh() {
    var root = $("msg-app");
    if (!root || !window.KBAuth) return;

    var user = KBAuth.currentUser();
    var prompt = $("msg-login-prompt");
    var content = $("msg-content");

    if (!user) {
      if (prompt) prompt.hidden = false;
      if (content) content.hidden = true;
      return;
    }

    if (prompt) prompt.hidden = true;
    if (content) content.hidden = false;
    if ($("msg-user")) $("msg-user").textContent = user;

    var rows = await loadMyMessages();
    renderList(rows);
  }

  function showTip(text, ok) {
    var tip = $("msg-form-tip");
    if (!tip) return;
    tip.hidden = false;
    tip.textContent = text;
    tip.className = "quiz-wrong-tip " + (ok ? "ok" : "err");
    clearTimeout(tip._t);
    tip._t = setTimeout(function () {
      tip.hidden = true;
    }, 3500);
  }

  function init() {
    var root = $("msg-app");
    if (!root) return;
    if (root.dataset.msgBound === "1") {
      refresh();
      return;
    }
    root.dataset.msgBound = "1";

    if ($("msg-open-login")) {
      $("msg-open-login").addEventListener("click", function () {
        if (window.KBAuth) KBAuth.openModal();
      });
    }

    var form = $("msg-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!KBAuth.currentUser()) {
          KBAuth.openModal();
          return;
        }
        var title = $("msg-title") ? $("msg-title").value : "";
        var body = $("msg-body") ? $("msg-body").value : "";
        var btn = $("msg-submit");
        if (btn) {
          btn.disabled = true;
          btn.textContent = "发送中…";
        }
        Promise.resolve(sendMessage(title, body)).then(function (result) {
          if (btn) {
            btn.disabled = false;
            btn.textContent = "发送留言";
          }
          showTip(result.msg, result.ok);
          if (result.ok) {
            if ($("msg-title")) $("msg-title").value = "";
            if ($("msg-body")) $("msg-body").value = "";
            refresh();
          }
        });
      });
    }

    window.addEventListener("kb-auth-change", refresh);
    refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      var root = document.getElementById("msg-app");
      if (root) root.dataset.msgBound = "0";
      setTimeout(init, 0);
    });
  }
})();
