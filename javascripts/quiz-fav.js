/**
 * Quiz page: knowledge links + favorite button
 */
(function () {
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
      el.hidden = true;
      return;
    }
    var note = KBResolveNote(cur.subject, cur.topic);
    if (!note) {
      el.hidden = true;
      el.innerHTML = "";
      return;
    }
    el.hidden = false;
    el.innerHTML =
      '相关笔记：<a href="' + note.path + '">查看「' + note.label + '」→</a>';
  }

  function updateFavBtn() {
    var btn = $("quiz-btn-fav");
    if (!btn || !window.KBAuth) return;
    if (!KBAuth.currentUser()) {
      btn.textContent = "收藏（需登录）";
      btn.classList.remove("is-added");
      return;
    }
    if (!KBAuth.favoriteId || !KBAuth.getFavorites) {
      btn.textContent = "收藏";
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
    btn.textContent = exists ? "已收藏" : "收藏";
    if (exists) btn.classList.add("is-added");
    else btn.classList.remove("is-added");
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
    updateNoteLink();
    updateFavBtn();
  }

  function watch() {
    bind();
    var card = $("quiz-card");
    if (card && !card.dataset.favObs) {
      card.dataset.favObs = "1";
      var obs = new MutationObserver(function () {
        updateNoteLink();
        updateFavBtn();
      });
      obs.observe(card, { childList: true, subtree: true, characterData: true });
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
      setTimeout(watch, 0);
    });
  }
})();
