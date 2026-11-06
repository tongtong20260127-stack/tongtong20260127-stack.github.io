/**
 * Tong's Knowledge Base — Supabase Auth + Wrong Book
 */
(function () {
  var client = null;
  var sessionUser = null;
  var wrongCache = [];

  function cfg() {
    return window.KB_SUPABASE || {};
  }

  function ensureClient() {
    if (client) return client;
    if (!window.supabase || !window.supabase.createClient) {
      console.error("[KBAuth] supabase-js 未加载");
      return null;
    }
    var c = cfg();
    if (!c.url || !c.key) {
      console.error("[KBAuth] 缺少 Supabase 配置");
      return null;
    }
    client = window.supabase.createClient(c.url, c.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    return client;
  }

  function simpleHash(str) {
    var h = 5381;
    for (var i = 0; i < str.length; i++) {
      h = ((h << 5) + h) ^ str.charCodeAt(i);
    }
    return (h >>> 0).toString(16);
  }

  function questionId(q) {
    return simpleHash((q.subject || "") + "|" + (q.topic || "") + "|" + (q.q || ""));
  }

  function displayName(user) {
    if (!user) return null;
    if (user.email) return user.email.split("@")[0];
    return (user.id || "user").slice(0, 8);
  }

  function currentUser() {
    return sessionUser ? displayName(sessionUser) : null;
  }

  function currentUserFull() {
    return sessionUser;
  }

  function mapRow(row) {
    return {
      id: row.question_hash || row.id,
      dbId: row.id,
      subject: row.subject,
      topic: row.topic,
      q: row.question,
      a: row.answer,
      addedAt: row.created_at
    };
  }

  async function refreshSession() {
    var sb = ensureClient();
    if (!sb) return null;
    var res = await sb.auth.getSession();
    sessionUser = res.data && res.data.session ? res.data.session.user : null;
    return sessionUser;
  }

  async function loadWrongBook() {
    var sb = ensureClient();
    if (!sb || !sessionUser) {
      wrongCache = [];
      return [];
    }
    var res = await sb
      .from("wrong_questions")
      .select("id, subject, topic, question, answer, question_hash, created_at")
      .order("created_at", { ascending: false });
    if (res.error) {
      console.error("[KBAuth] 读取错题失败", res.error);
      wrongCache = [];
      return [];
    }
    wrongCache = (res.data || []).map(mapRow);
    return wrongCache;
  }

  function getWrongBook() {
    return wrongCache.slice();
  }

  async function addToWrongBook(question) {
    var sb = ensureClient();
    if (!sb) return { ok: false, reason: "no_client", msg: "Supabase 未初始化" };
    if (!sessionUser) return { ok: false, reason: "not_login", msg: "请先登录" };
    var hash = questionId(question);
    if (wrongCache.some(function (item) { return item.id === hash; })) {
      return { ok: true, reason: "exists", count: wrongCache.length };
    }
    var res = await sb.from("wrong_questions").insert({
      user_id: sessionUser.id,
      subject: question.subject,
      topic: question.topic,
      question: question.q,
      answer: question.a,
      question_hash: hash
    }).select("id, subject, topic, question, answer, question_hash, created_at").single();
    if (res.error) {
      if (String(res.error.code) === "23505" || /duplicate/i.test(res.error.message || "")) {
        await loadWrongBook();
        return { ok: true, reason: "exists", count: wrongCache.length };
      }
      console.error("[KBAuth] 加入错题失败", res.error);
      return { ok: false, reason: "error", msg: res.error.message || "写入失败" };
    }
    wrongCache.unshift(mapRow(res.data));
    return { ok: true, reason: "added", count: wrongCache.length };
  }

  async function removeFromWrongBook(id) {
    var sb = ensureClient();
    if (!sb || !sessionUser) return false;
    var res = await sb.from("wrong_questions").delete().eq("question_hash", id);
    if (res.error) res = await sb.from("wrong_questions").delete().eq("id", id);
    if (res.error) return false;
    wrongCache = wrongCache.filter(function (item) {
      return item.id !== id && item.dbId !== id;
    });
    return true;
  }

  async function clearWrongBook() {
    var sb = ensureClient();
    if (!sb || !sessionUser) return false;
    var res = await sb.from("wrong_questions").delete().eq("user_id", sessionUser.id);
    if (res.error) return false;
    wrongCache = [];
    return true;
  }

  function friendlyAuthError(err) {
    var msg = (err && err.message) || "操作失败";
    if (/invalid login/i.test(msg)) return "邮箱或密码错误";
    if (/already registered/i.test(msg)) return "该邮箱已注册，请直接登录";
    if (/password/i.test(msg) && /least/i.test(msg)) return "密码太短，请至少 6 位";
    if (/rate limit/i.test(msg)) return "尝试过于频繁，请稍后再试";
    if (/email/i.test(msg) && /confirm/i.test(msg)) return "请先到邮箱点击验证链接（或在 Supabase 关闭邮箱验证）";
    if (/Failed to fetch|NetworkError|fetch|Load failed/i.test(msg))
      return "网络异常，请检查是否能访问 Supabase";
    return msg;
  }

  async function register(email, password) {
    var sb = ensureClient();
    if (!sb) return { ok: false, msg: "Supabase 未初始化" };
    email = (email || "").trim();
    if (!email || email.indexOf("@") < 1) return { ok: false, msg: "请输入有效邮箱" };
    if (!password || password.length < 6) return { ok: false, msg: "密码至少 6 位" };
    try {
      var res = await sb.auth.signUp({ email: email, password: password });
      if (res.error) return { ok: false, msg: friendlyAuthError(res.error) };
      if (res.data && res.data.session) {
        sessionUser = res.data.session.user;
        await loadWrongBook();
        return { ok: true, msg: "注册成功并已登录" };
      }
      return {
        ok: true,
        msg: "注册成功。若开启了邮箱验证，请到邮箱点链接后再登录。"
      };
    } catch (e) {
      return { ok: false, msg: friendlyAuthError(e) };
    }
  }

  async function login(email, password) {
    var sb = ensureClient();
    if (!sb) return { ok: false, msg: "Supabase 未初始化" };
    email = (email || "").trim();
    try {
      var res = await sb.auth.signInWithPassword({ email: email, password: password });
      if (res.error) return { ok: false, msg: friendlyAuthError(res.error) };
      sessionUser = res.data.session.user;
      await loadWrongBook();
      return { ok: true, msg: "登录成功" };
    } catch (e) {
      return { ok: false, msg: friendlyAuthError(e) };
    }
  }

  async function logout() {
    var sb = ensureClient();
    if (sb) await sb.auth.signOut();
    sessionUser = null;
    wrongCache = [];
  }

  function createModal() {
    if (document.getElementById("kb-auth-modal")) return;
    var modal = document.createElement("div");
    modal.id = "kb-auth-modal";
    modal.className = "kb-auth-modal";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="kb-auth-backdrop" data-auth-close></div>' +
      '<div class="kb-auth-dialog" role="dialog" aria-modal="true">' +
      '<button type="button" class="kb-auth-close" data-auth-close aria-label="关闭">×</button>' +
      '<h3 id="kb-auth-title" class="kb-auth-title">登录</h3>' +
      '<p class="kb-auth-note">使用邮箱注册/登录，错题本与收藏夹将同步到云端（Supabase）。</p>' +
      '<div class="kb-auth-tabs">' +
      '<button type="button" class="kb-auth-tab active" data-auth-tab="login">登录</button>' +
      '<button type="button" class="kb-auth-tab" data-auth-tab="register">注册</button>' +
      "</div>" +
      '<form id="kb-auth-form" class="kb-auth-form" autocomplete="on">' +
      '<label class="kb-auth-field"><span>邮箱</span>' +
      '<input type="email" id="kb-auth-username" name="email" required placeholder="name@example.com" /></label>' +
      '<label class="kb-auth-field"><span>密码</span>' +
      '<input type="password" id="kb-auth-password" name="password" required minlength="6" placeholder="至少 6 位" /></label>' +
      '<p id="kb-auth-msg" class="kb-auth-msg" hidden></p>' +
      '<button type="submit" id="kb-auth-submit" class="kb-auth-submit">登录</button>' +
      "</form></div>";
    document.body.appendChild(modal);
    var mode = "login";
    modal.querySelectorAll("[data-auth-close]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });
    modal.querySelectorAll("[data-auth-tab]").forEach(function (tab) {
      tab.addEventListener("click", function () {
        mode = tab.getAttribute("data-auth-tab");
        modal.querySelectorAll("[data-auth-tab]").forEach(function (t) {
          t.classList.remove("active");
        });
        tab.classList.add("active");
        document.getElementById("kb-auth-title").textContent = mode === "login" ? "登录" : "注册";
        document.getElementById("kb-auth-submit").textContent = mode === "login" ? "登录" : "注册";
        var msg = document.getElementById("kb-auth-msg");
        msg.hidden = true;
        msg.textContent = "";
      });
    });
    document.getElementById("kb-auth-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("kb-auth-username").value;
      var password = document.getElementById("kb-auth-password").value;
      var submitBtn = document.getElementById("kb-auth-submit");
      submitBtn.disabled = true;
      submitBtn.textContent = "请稍候…";
      var task = mode === "login" ? login(email, password) : register(email, password);
      task.then(function (result) {
        var msg = document.getElementById("kb-auth-msg");
        msg.hidden = false;
        msg.textContent = result.msg;
        msg.className = "kb-auth-msg " + (result.ok ? "ok" : "err");
        submitBtn.disabled = false;
        submitBtn.textContent = mode === "login" ? "登录" : "注册";
        if (result.ok && sessionUser) {
          setTimeout(function () {
            closeModal();
            renderHeaderAuth();
            window.dispatchEvent(new CustomEvent("kb-auth-change"));
          }, 350);
        }
      });
    });
  }

  function openModal() {
    createModal();
    var modal = document.getElementById("kb-auth-modal");
    modal.hidden = false;
    document.body.classList.add("kb-auth-open");
    setTimeout(function () {
      var input = document.getElementById("kb-auth-username");
      if (input) input.focus();
    }, 50);
  }

  function closeModal() {
    var modal = document.getElementById("kb-auth-modal");
    if (modal) modal.hidden = true;
    document.body.classList.remove("kb-auth-open");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function resolveWrongbookHref() {
    var path = window.location.pathname || "";
    if (path.indexOf("/wrongbook") !== -1) return "./";
    return "/wrongbook/";
  }

  function renderHeaderAuth() {
    var header = document.querySelector(".md-header__inner");
    if (!header) return;
    var slot = document.getElementById("kb-header-auth");
    if (!slot) {
      slot = document.createElement("div");
      slot.id = "kb-header-auth";
      slot.className = "kb-header-auth";
      var source =
        header.querySelector('[data-md-component="search"]') ||
        header.querySelector(".md-header__source");
      if (source) header.insertBefore(slot, source);
      else header.appendChild(slot);
    }
    var name = currentUser();
    if (name) {
      var wrongCount = wrongCache.length;
      slot.innerHTML =
        '<a class="kb-auth-user" href="' +
        resolveWrongbookHref() +
        '" title="我的错题本">' +
        '<span class="kb-auth-avatar">' +
        name.charAt(0).toUpperCase() +
        "</span>" +
        '<span class="kb-auth-name">' +
        escapeHtml(name) +
        "</span>" +
        (wrongCount ? '<span class="kb-auth-badge">' + wrongCount + "</span>" : "") +
        "</a>" +
        '<button type="button" class="kb-auth-logout" title="退出登录">退出</button>';
      slot.querySelector(".kb-auth-logout").addEventListener("click", function () {
        logout().then(function () {
          renderHeaderAuth();
          window.dispatchEvent(new CustomEvent("kb-auth-change"));
        });
      });
    } else {
      slot.innerHTML =
        '<button type="button" class="kb-auth-login-btn" id="kb-open-login">登录</button>';
      slot.querySelector("#kb-open-login").addEventListener("click", openModal);
    }
  }

  window.KBAuth = {
    currentUser: currentUser,
    currentUserFull: currentUserFull,
    login: login,
    register: register,
    logout: logout,
    openModal: openModal,
    getWrongBook: getWrongBook,
    loadWrongBook: loadWrongBook,
    addToWrongBook: addToWrongBook,
    removeFromWrongBook: removeFromWrongBook,
    clearWrongBook: clearWrongBook,
    questionId: questionId,
    simpleHash: simpleHash,
    ensureClient: ensureClient,
    renderHeaderAuth: renderHeaderAuth,
    refreshSession: refreshSession
  };

  async function boot() {
    createModal();
    try {
      await refreshSession();
      if (sessionUser) await loadWrongBook();
    } catch (e) {
      console.error("[KBAuth] boot error", e);
    }
    renderHeaderAuth();
    var sb = ensureClient();
    if (sb) {
      sb.auth.onAuthStateChange(function (event, session) {
        sessionUser = session ? session.user : null;
        if (sessionUser) {
          loadWrongBook().then(function () {
            renderHeaderAuth();
            window.dispatchEvent(new CustomEvent("kb-auth-change"));
          });
        } else {
          wrongCache = [];
          renderHeaderAuth();
          window.dispatchEvent(new CustomEvent("kb-auth-change"));
        }
      });
    }
  }

  function start() {
    if (!window.supabase || !window.supabase.createClient) {
      setTimeout(start, 50);
      return;
    }
    boot();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      setTimeout(function () {
        createModal();
        renderHeaderAuth();
      }, 0);
    });
  }
})();
