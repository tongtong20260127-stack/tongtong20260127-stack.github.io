/**
 * Tong's Knowledge Base — Auth & Wrong Book (localStorage)
 * 说明：纯前端实现，账号数据仅保存在当前浏览器，不上传服务器。
 */
(function () {
  const USERS_KEY = "kb_users_v1";
  const SESSION_KEY = "kb_session_v1";
  const WRONG_PREFIX = "kb_wrongbook_v1_";

  function simpleHash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) + h) ^ str.charCodeAt(i);
    }
    return (h >>> 0).toString(16);
  }

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch (e) {
      return null;
    }
  }

  function setSession(user) {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ username: user, ts: Date.now() }));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  function currentUser() {
    const s = getSession();
    return s && s.username ? s.username : null;
  }

  function wrongKey(username) {
    return WRONG_PREFIX + username;
  }

  function getWrongBook(username) {
    username = username || currentUser();
    if (!username) return [];
    try {
      return JSON.parse(localStorage.getItem(wrongKey(username)) || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveWrongBook(list, username) {
    username = username || currentUser();
    if (!username) return false;
    localStorage.setItem(wrongKey(username), JSON.stringify(list));
    return true;
  }

  function questionId(q) {
    return simpleHash((q.subject || "") + "|" + (q.topic || "") + "|" + (q.q || ""));
  }

  function addToWrongBook(question) {
    const user = currentUser();
    if (!user) return { ok: false, reason: "not_login" };
    const list = getWrongBook(user);
    const id = questionId(question);
    if (list.some(function (item) { return item.id === id; })) {
      return { ok: true, reason: "exists", count: list.length };
    }
    list.unshift({
      id: id,
      subject: question.subject,
      topic: question.topic,
      q: question.q,
      a: question.a,
      addedAt: new Date().toISOString()
    });
    saveWrongBook(list, user);
    return { ok: true, reason: "added", count: list.length };
  }

  function removeFromWrongBook(id) {
    const user = currentUser();
    if (!user) return false;
    const list = getWrongBook(user).filter(function (item) { return item.id !== id; });
    saveWrongBook(list, user);
    return true;
  }

  function clearWrongBook() {
    const user = currentUser();
    if (!user) return false;
    saveWrongBook([], user);
    return true;
  }

  function register(username, password) {
    username = (username || "").trim();
    if (!username || username.length < 2) return { ok: false, msg: "用户名至少 2 个字符" };
    if (!password || password.length < 4) return { ok: false, msg: "密码至少 4 个字符" };
    if (/[^a-zA-Z0-9_\u4e00-\u9fa5-]/.test(username)) {
      return { ok: false, msg: "用户名仅支持中英文、数字、下划线" };
    }
    const users = getUsers();
    if (users[username]) return { ok: false, msg: "用户名已存在" };
    users[username] = {
      hash: simpleHash(password + "::" + username),
      createdAt: new Date().toISOString()
    };
    saveUsers(users);
    setSession(username);
    return { ok: true, msg: "注册成功并已登录" };
  }

  function login(username, password) {
    username = (username || "").trim();
    const users = getUsers();
    if (!users[username]) return { ok: false, msg: "用户不存在，请先注册" };
    const hash = simpleHash(password + "::" + username);
    if (users[username].hash !== hash) return { ok: false, msg: "密码错误" };
    setSession(username);
    return { ok: true, msg: "登录成功" };
  }

  function logout() {
    setSession(null);
  }

  function createModal() {
    if (document.getElementById("kb-auth-modal")) return;

    const modal = document.createElement("div");
    modal.id = "kb-auth-modal";
    modal.className = "kb-auth-modal";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="kb-auth-backdrop" data-auth-close></div>' +
      '<div class="kb-auth-dialog" role="dialog" aria-modal="true" aria-labelledby="kb-auth-title">' +
      '<button type="button" class="kb-auth-close" data-auth-close aria-label="关闭">×</button>' +
      '<h3 id="kb-auth-title" class="kb-auth-title">登录</h3>' +
      '<p class="kb-auth-note">账号保存在本浏览器本地，清除浏览器数据会丢失。</p>' +
      '<div class="kb-auth-tabs">' +
      '<button type="button" class="kb-auth-tab active" data-auth-tab="login">登录</button>' +
      '<button type="button" class="kb-auth-tab" data-auth-tab="register">注册</button>' +
      "</div>" +
      '<form id="kb-auth-form" class="kb-auth-form" autocomplete="on">' +
      '<label class="kb-auth-field"><span>用户名</span>' +
      '<input type="text" id="kb-auth-username" name="username" required minlength="2" maxlength="32" placeholder="请输入用户名" /></label>' +
      '<label class="kb-auth-field"><span>密码</span>' +
      '<input type="password" id="kb-auth-password" name="password" required minlength="4" maxlength="64" placeholder="请输入密码" /></label>' +
      '<p id="kb-auth-msg" class="kb-auth-msg" hidden></p>' +
      '<button type="submit" id="kb-auth-submit" class="kb-auth-submit">登录</button>' +
      "</form></div>";
    document.body.appendChild(modal);

    let mode = "login";

    modal.querySelectorAll("[data-auth-close]").forEach(function (el) {
      el.addEventListener("click", function () { closeModal(); });
    });

    modal.querySelectorAll("[data-auth-tab]").forEach(function (tab) {
      tab.addEventListener("click", function () {
        mode = tab.getAttribute("data-auth-tab");
        modal.querySelectorAll("[data-auth-tab]").forEach(function (t) {
          t.classList.remove("active");
        });
        tab.classList.add("active");
        document.getElementById("kb-auth-title").textContent = mode === "login" ? "登录" : "注册";
        document.getElementById("kb-auth-submit").textContent = mode === "login" ? "登录" : "注册并登录";
        var msg = document.getElementById("kb-auth-msg");
        msg.hidden = true;
        msg.textContent = "";
      });
    });

    document.getElementById("kb-auth-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var username = document.getElementById("kb-auth-username").value;
      var password = document.getElementById("kb-auth-password").value;
      var result = mode === "login" ? login(username, password) : register(username, password);
      var msg = document.getElementById("kb-auth-msg");
      msg.hidden = false;
      msg.textContent = result.msg;
      msg.className = "kb-auth-msg " + (result.ok ? "ok" : "err");
      if (result.ok) {
        setTimeout(function () {
          closeModal();
          renderHeaderAuth();
          window.dispatchEvent(new CustomEvent("kb-auth-change"));
        }, 400);
      }
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
      if (source) {
        header.insertBefore(slot, source);
      } else {
        header.appendChild(slot);
      }
    }

    var user = currentUser();
    if (user) {
      var wrongCount = getWrongBook(user).length;
      slot.innerHTML =
        '<a class="kb-auth-user" href="' + resolveWrongbookHref() + '" title="我的错题本">' +
        '<span class="kb-auth-avatar">' + user.charAt(0).toUpperCase() + "</span>" +
        '<span class="kb-auth-name">' + escapeHtml(user) + "</span>" +
        (wrongCount ? '<span class="kb-auth-badge">' + wrongCount + "</span>" : "") +
        "</a>" +
        '<button type="button" class="kb-auth-logout" title="退出登录">退出</button>';
      slot.querySelector(".kb-auth-logout").addEventListener("click", function () {
        logout();
        renderHeaderAuth();
        window.dispatchEvent(new CustomEvent("kb-auth-change"));
      });
    } else {
      slot.innerHTML = '<button type="button" class="kb-auth-login-btn" id="kb-open-login">登录</button>';
      slot.querySelector("#kb-open-login").addEventListener("click", openModal);
    }
  }

  function resolveWrongbookHref() {
    // 尽量兼容不同层级路径
    var path = window.location.pathname || "";
    if (path.indexOf("/wrongbook") !== -1) return "./";
    if (path === "/" || /index\.html?$/.test(path) || path.endsWith("/tongtong20260127-stack.github.io/")) {
      return "wrongbook/";
    }
    // 子页面时回到站点根下的 wrongbook
    return "/wrongbook/";
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  window.KBAuth = {
    currentUser: currentUser,
    login: login,
    register: register,
    logout: logout,
    openModal: openModal,
    getWrongBook: getWrongBook,
    addToWrongBook: addToWrongBook,
    removeFromWrongBook: removeFromWrongBook,
    clearWrongBook: clearWrongBook,
    questionId: questionId,
    renderHeaderAuth: renderHeaderAuth
  };

  function boot() {
    createModal();
    renderHeaderAuth();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      setTimeout(boot, 0);
    });
  }
})();
