/**
 * Quiz page: knowledge links + favorite button
 * 注意：禁止在 MutationObserver 回调里无条件改写 DOM，否则会与换题/MathJax 形成死循环卡死页面
 */
(function () {
  var updating = false;
  var debounceTimer = null;

  function $(id) {
    return document.getElementById(id);
  }

  function currentFromDom() {
    var meta = $("quiz-meta");
    var q = $("quiz-question");
    var a = $("quiz-answer");
    if (!meta || !q) return null;
    var parts = (meta.textContent || "").split("·").map(function (s) {
      return s.trim();
    });
    return {
      subject: parts[0] || "",
      topic: parts.slice(1).join(" · ") || "",
      q: q.innerText || q.textContent || "",
      a: (a && (a.innerText || a.textContent)) || ""
    };
  }

  function updateNoteLink() {
    var el = $("quiz-note-link");
    if (!el) return;
    var cur = currentFromDom();
    if (!cur || !window.KBResolveNote) {
      if (!el.hidden || el.innerHTML) {
        updating = true;
        el.hidden = true;
        el.innerHTML = "";
        updating = false;
      }
      return;
    }
    var note = KBResolveNote(cur.subject, cur.topic);
    if (!note) {
      if (!el.hidden || el.innerHTML) {
        updating = true;
        el.hidden = true;
        el.innerHTML = "";
        updating = false;
      }
      return;
    }
    var html =
      '相关笔记：<a href="' + note.path + '">查看「' + note.label + '」→</a>';
    // 内容未变则不写 DOM，避免触发观察者
    if (!el.hidden && el.innerHTML === html) return;
    updating = true;
    el.hidden = false;
    el.innerHTML = html;
    updating = false;
  }

  function updateFavBtn() {
    var btn = $("quiz-btn-fav");
    if (!btn || !window.KBAuth) return;
    if (!KBAuth.currentUser()) {
      if (btn.textContent !== "收藏（需登录）") {
        btn.textContent = "收藏（需登录）";
        btn.classList.remove("is-added");
      }
      return;
    }
    if (!KBAuth.favoriteId || !KBAuth.getFavorites) {
      if (btn.textContent !== "收藏") btn.textContent = "收藏";
      return;
    }
    var cur = currentFromDom();
    if (!cur) return;
    var note = window.KBResolveNote ? KBResolveNote(cur.subject, cur.topic) : null;
    var payload = {
      subject: cur.subject,
      topic: cur.topic,
      title: cur.q,
      content: cur.a,
      link: note ? note.path : ""
    };
    var id = KBAuth.favoriteId(payload);
    var exists = KBAuth.getFavorites().some(function (item) {
      return item.id === id;
    });
    var nextText = exists ? "已收藏" : "收藏";
    if (btn.textContent !== nextText) btn.textContent = nextText;
    if (exists) btn.classList.add("is-added");
    else btn.classList.remove("is-added");
  }

  function safeRefresh() {
    if (updating) return;
    updateNoteLink();
    updateFavBtn();
  }

  function scheduleRefresh() {
    if (updating) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(safeRefresh, 80);
  }

  function onFavClick() {
    if (!window.KBAuth) return;
    if (!KBAuth.currentUser()) {
      KBAuth.openModal();
      return;
    }
    if (!KBAuth.addFavorite) {
      alert("收藏功能加载中，请稍后再试");
      return;
    }
    var cur = currentFromDom();
    if (!cur) return;
    var note = window.KBResolveNote ? KBResolveNote(cur.subject, cur.topic) : null;
    var btn = $("quiz-btn-fav");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "保存中…";
    }
    Promise.resolve(
      KBAuth.addFavorite({
        subject: cur.subject,
        topic: cur.topic,
        title: cur.q,
        content: cur.a,
        link: note ? note.path : ""
      })
    ).then(function (result) {
      if (btn) btn.disabled = false;
      updateFavBtn();
      var tip = $("quiz-wrong-tip");
      if (tip) {
        if (result.reason === "exists") tip.textContent = "已在收藏夹中";
        else if (result.ok) tip.textContent = "已加入收藏夹（共 " + result.count + " 条）";
        else tip.textContent = result.msg || "收藏失败";
        tip.hidden = false;
        clearTimeout(tip._t);
        tip._t = setTimeout(function () {
          tip.hidden = true;
        }, 2500);
      }
    });
  }

  function bind() {
    var btn = $("quiz-btn-fav");
    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = "1";
      btn.addEventListener("click", onFavClick);
    }
    safeRefresh();
  }

  function watch() {
    bind();
    var card = $("quiz-card");
    if (card && !card.dataset.favObs) {
      card.dataset.favObs = "1";
      var obs = new MutationObserver(function () {
        if (updating) return;
        scheduleRefresh();
      });
      // 只观察题干与元信息，避免 note-link 改写连环触发
      var meta = $("quiz-meta");
      var q = $("quiz-question");
      if (meta) obs.observe(meta, { childList: true, subtree: true });
      if (q) obs.observe(q, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", watch);
  } else {
    watch();
  }
  window.addEventListener("kb-auth-change", function () {
    updateFavBtn();
  });
  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      var card = document.getElementById("quiz-card");
      if (card) card.dataset.favObs = "0";
      var btn = document.getElementById("quiz-btn-fav");
      if (btn) btn.dataset.bound = "0";
      setTimeout(watch, 0);
    });
  }
})();
