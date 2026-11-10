/**
 * 选择竞速 — 60s 限时顺序答题 + 排行榜
 */
(function () {
  var DURATION = 60;

  var state = {
    queue: [],
    idx: 0,
    answered: 0,
    correct: 0,
    remaining: DURATION,
    running: false,
    finished: false,
    timerId: null,
    lastResult: null,
    profile: null
  };

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s || "";
    return d.innerHTML;
  }

  function defaultAvatar(seed) {
    var s = encodeURIComponent(String(seed || "user").slice(0, 24));
    return (
      "https://api.dicebear.com/7.x/identicon/svg?seed=" +
      s +
      "&backgroundType=gradientLinear"
    );
  }

  function formatTime(sec) {
    var s = Math.max(0, sec | 0);
    var m = Math.floor(s / 60);
    var r = s % 60;
    return m + ":" + (r < 10 ? "0" : "") + r;
  }

  function calcScore(correct, answered) {
    var acc = answered > 0 ? correct / answered : 0;
    return correct * 1000 + Math.floor(acc * 100);
  }

  function accuracyText(correct, answered) {
    if (!answered) return "0%";
    return Math.round((correct / answered) * 1000) / 10 + "%";
  }

  function isMulti(item) {
    return item && (item.type === "multi" || Array.isArray(item.correct));
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function renderMath(root) {
    if (!root) return;
    root.classList.add("kb-math", "arithmatex");
    setTimeout(function () {
      if (window.kbTypeset) window.kbTypeset(root);
      else if (window.MathJax && MathJax.typesetPromise) {
        try {
          if (MathJax.typesetClear) MathJax.typesetClear([root]);
        } catch (e) {}
        MathJax.typesetPromise([root]).catch(function () {});
      }
    }, 40);
  }

  function getClient() {
    return window.KBAuth && KBAuth.getClient ? KBAuth.getClient() : null;
  }

  function show(el, on) {
    if (!el) return;
    el.hidden = !on;
  }

  async function loadProfile() {
    var user = KBAuth.currentUserFull && KBAuth.currentUserFull();
    if (!user) return null;
    var sb = getClient();
    if (!sb) return null;
    try {
      var res = await sb
        .from("profiles")
        .select("nickname, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      if (res.error) {
        console.error("[Race] profile", res.error);
        return null;
      }
      state.profile = res.data || null;
      return state.profile;
    } catch (e) {
      console.error("[Race] profile exception", e);
      return null;
    }
  }

  async function refreshGate() {
    var gate = $("race-gate");
    var ready = $("race-ready");
    var play = $("race-play");
    var result = $("race-result");
    if (state.running) return;

    show(play, false);
    show(result, false);

    if (!window.KBAuth) {
      show(gate, true);
      $("race-gate-msg").textContent = "认证模块加载中…";
      return;
    }

    try {
      if (KBAuth.refreshSession) await KBAuth.refreshSession();
    } catch (e) {
      console.error("[Race] refreshSession", e);
    }

    var user = KBAuth.currentUser && KBAuth.currentUser();
    if (!user) {
      show(gate, true);
      show(ready, false);
      $("race-gate-msg").textContent = "选择竞速需要登录后使用。";
      var actions = $("race-gate-actions");
      if (actions) {
        actions.hidden = false;
        actions.innerHTML =
          '<button type="button" class="quiz-btn quiz-btn-next" id="race-open-login">登录 / 注册</button>';
        var btn = $("race-open-login");
        if (btn)
          btn.onclick = function () {
            if (KBAuth.openModal) KBAuth.openModal();
          };
      }
      return;
    }

    var prof = await loadProfile();
    if (!prof || !prof.nickname) {
      show(gate, true);
      show(ready, false);
      $("race-gate-msg").textContent =
        "请先在「我的账号」设置昵称（可选头像）后再来竞速。";
      var actionsErr = $("race-gate-actions");
      if (actionsErr) {
        actionsErr.hidden = false;
        actionsErr.innerHTML =
          '<a class="quiz-btn quiz-btn-next" href="/account/">去设置资料</a> ' +
          '<button type="button" class="quiz-btn exam-btn-ghost" id="race-retry-gate">重试</button>';
        var retry = $("race-retry-gate");
        if (retry)
          retry.onclick = function () {
            refreshGate();
          };
      }
      return;
    }

    show(gate, false);
    show(ready, true);
    if ($("race-ready-name")) $("race-ready-name").textContent = prof.nickname;
    if ($("race-ready-avatar"))
      $("race-ready-avatar").src =
        prof.avatar_url || defaultAvatar(user.id || prof.nickname);
  }

  function stopTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function updateHud() {
    if ($("race-q-index")) $("race-q-index").textContent = String(state.idx + 1);
    if ($("race-answered")) $("race-answered").textContent = String(state.answered);
    if ($("race-correct")) $("race-correct").textContent = String(state.correct);
    var t = $("race-timer");
    if (t) {
      t.textContent = formatTime(state.remaining);
      if (state.remaining <= 10) t.classList.add("is-low");
      else t.classList.remove("is-low");
    }
  }

  function checkAnswer(item, selected) {
    if (isMulti(item)) {
      var right = (item.correct || []).slice().sort(function (a, b) {
        return a - b;
      });
      var sel = (selected || []).slice().sort(function (a, b) {
        return a - b;
      });
      if (right.length !== sel.length) return false;
      for (var i = 0; i < right.length; i++) if (right[i] !== sel[i]) return false;
      return true;
    }
    return selected.length === 1 && selected[0] === item.correct;
  }

  function renderQuestion() {
    var item = state.queue[state.idx];
    if (!item) {
      finishRace();
      return;
    }
    updateHud();
    var multi = isMulti(item);
    if ($("race-meta"))
      $("race-meta").textContent =
        (item.subject || "") +
        " · " +
        (item.topic || "") +
        (item.difficulty ? " · " + item.difficulty : "");
    if ($("race-type-badge"))
      $("race-type-badge").textContent = multi ? "多选" : "单选";
    if ($("race-q-text")) $("race-q-text").innerHTML = item.q || "";
    var box = $("race-options");
    if (!box) return;
    box.innerHTML = "";
    (item.options || []).forEach(function (opt, oi) {
      var id = "race-opt-" + state.idx + "-" + oi;
      var lab = document.createElement("label");
      lab.className = "exam-option";
      lab.setAttribute("for", id);
      var input = document.createElement("input");
      input.type = multi ? "checkbox" : "radio";
      input.name = "race-opt";
      input.id = id;
      input.value = String(oi);
      var span = document.createElement("span");
      span.innerHTML = opt;
      lab.appendChild(input);
      lab.appendChild(span);
      box.appendChild(lab);
    });
    renderMath($("race-q-text"));
    renderMath(box);
  }

  function collectSelected() {
    var nodes = document.querySelectorAll('#race-options input:checked');
    var selected = [];
    nodes.forEach(function (n) {
      selected.push(parseInt(n.value, 10));
    });
    return selected;
  }

  function submitCurrent(andNext) {
    if (!state.running || state.finished) return;
    var item = state.queue[state.idx];
    if (!item) {
      finishRace();
      return;
    }
    var selected = collectSelected();
    if (andNext !== "force" && !selected.length) return;
    state.answered += 1;
    if (selected.length && checkAnswer(item, selected)) state.correct += 1;
    state.idx += 1;
    if (state.idx >= state.queue.length || state.remaining <= 0) {
      finishRace();
      return;
    }
    if (andNext) renderQuestion();
  }

  async function saveResult(payload) {
    var sb = getClient();
    var user = KBAuth.currentUserFull && KBAuth.currentUserFull();
    if (!sb || !user) return { ok: false, msg: "未登录" };
    try {
      var res = await sb.from("race_results").insert({
        user_id: user.id,
        nickname: payload.nickname,
        avatar_url: payload.avatar_url || null,
        answered: payload.answered,
        correct: payload.correct,
        accuracy: payload.accuracy,
        score: payload.score
      });
      if (res.error) {
        console.error("[Race] save", res.error);
        return { ok: false, msg: res.error.message };
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, msg: (e && e.message) || String(e) };
    }
  }

  async function finishRace() {
    if (state.finished) return;
    state.finished = true;
    state.running = false;
    stopTimer();
    var answered = state.answered;
    var correct = state.correct;
    var acc = answered > 0 ? correct / answered : 0;
    var score = calcScore(correct, answered);
    state.lastResult = { answered: answered, correct: correct, accuracy: acc, score: score };

    show($("race-play"), false);
    show($("race-result"), true);
    if ($("race-res-answered")) $("race-res-answered").textContent = String(answered);
    if ($("race-res-correct")) $("race-res-correct").textContent = String(correct);
    if ($("race-res-acc")) $("race-res-acc").textContent = accuracyText(correct, answered);
    if ($("race-res-score")) $("race-res-score").textContent = String(score);
    if ($("race-res-rank")) $("race-res-rank").textContent = "正在同步成绩…";

    var prof = state.profile || {};
    var save = await saveResult({
      nickname: prof.nickname || "选手",
      avatar_url: prof.avatar_url || null,
      answered: answered,
      correct: correct,
      accuracy: acc,
      score: score
    });
    if ($("race-res-rank")) {
      $("race-res-rank").textContent = save.ok
        ? "成绩已记录，可在下方排行榜查看。"
        : "本机结算完成，但云端保存失败：" + (save.msg || "");
    }
    loadLeaderboard();
  }

  function getSelectedSubjects() {
    var all = $("race-sub-all");
    if (all && all.checked) return null;
    var nodes = document.querySelectorAll("#race-app input.race-sub:checked");
    var list = [];
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].value) list.push(nodes[i].value);
    }
    return list;
  }

  function syncSubjectAllBox() {
    var all = $("race-sub-all");
    if (!all) return;
    var nodes = document.querySelectorAll("#race-app input.race-sub");
    var checked = 0;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].checked) checked++;
    }
    all.checked = nodes.length > 0 && checked === nodes.length;
  }

  function bindSubjectPicker() {
    var all = $("race-sub-all");
    var nodes = document.querySelectorAll("#race-app input.race-sub");
    if (all && !all.dataset.bound) {
      all.dataset.bound = "1";
      all.addEventListener("change", function () {
        for (var i = 0; i < nodes.length; i++) nodes[i].checked = all.checked;
      });
    }
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].dataset.bound) continue;
      nodes[i].dataset.bound = "1";
      nodes[i].addEventListener("change", syncSubjectAllBox);
    }
  }

  function startRace() {
    var bank = (window.KB_QUESTION_BANK || []).slice();
    if (!bank.length) {
      alert("题库尚未加载，请稍后刷新重试。");
      return;
    }
    var subjects = getSelectedSubjects();
    if (subjects !== null) {
      if (!subjects.length) {
        alert("请至少勾选一个学科，或选择「全部学科」。");
        return;
      }
      bank = bank.filter(function (q) {
        return subjects.indexOf(q.subject) !== -1;
      });
      if (!bank.length) {
        alert("当前勾选的学科在题库中没有题目，请换一组学科。");
        return;
      }
    }
    stopTimer();
    state.queue = shuffle(bank);
    state.idx = 0;
    state.answered = 0;
    state.correct = 0;
    state.remaining = DURATION;
    state.running = true;
    state.finished = false;
    state.lastResult = null;

    show($("race-gate"), false);
    show($("race-ready"), false);
    show($("race-result"), false);
    show($("race-play"), true);
    renderQuestion();

    state.timerId = setInterval(function () {
      state.remaining -= 1;
      updateHud();
      if (state.remaining <= 0) {
        stopTimer();
        if (state.running && !state.finished) {
          var selected = collectSelected();
          if (selected.length) submitCurrent("force");
          else finishRace();
        }
      }
    }, 1000);
  }

  async function loadLeaderboard() {
    var list = $("race-board-list");
    if (!list) return;
    list.textContent = "加载中…";
    if (!window.KBAuth) {
      list.innerHTML = '<p class="race-muted">认证模块未加载。</p>';
      return;
    }
    var sb = getClient();
    if (!sb) {
      list.innerHTML = '<p class="race-muted">无法连接后端（Supabase）。</p>';
      return;
    }
    try {
      var res = await sb
        .from("race_results")
        .select(
          "user_id, nickname, avatar_url, answered, correct, accuracy, score, created_at"
        )
        .order("score", { ascending: false })
        .limit(200);
      if (res.error) {
        console.error("[Race] board", res.error);
        list.innerHTML =
          '<p class="race-muted">排行榜加载失败：' +
          escapeHtml(res.error.message || "未知错误") +
          "。请确认已创建 race_results 表及 RLS 策略。</p>";
        return;
      }
      var rows = res.data || [];
      var best = {};
      rows.forEach(function (r) {
        var id = r.user_id;
        if (!best[id] || r.score > best[id].score) best[id] = r;
      });
      var ranked = Object.keys(best)
        .map(function (k) {
          return best[k];
        })
        .sort(function (a, b) {
          if (b.score !== a.score) return b.score - a.score;
          if (b.correct !== a.correct) return b.correct - a.correct;
          return b.answered - a.answered;
        })
        .slice(0, 50);
      var me = KBAuth.currentUserFull && KBAuth.currentUserFull();
      var meId = me ? me.id : null;
      if (!ranked.length) {
        list.innerHTML = '<p class="race-muted">暂无成绩，来当第一名吧。</p>';
        return;
      }
      list.innerHTML = ranked
        .map(function (r, i) {
          var av = r.avatar_url || defaultAvatar(r.user_id || r.nickname);
          var acc = Math.round(Number(r.accuracy || 0) * 1000) / 10;
          var isMe = meId && r.user_id === meId;
          return (
            '<div class="race-row' +
            (isMe ? " is-me" : "") +
            '">' +
            '<div class="race-row-rank">' +
            (i + 1) +
            "</div>" +
            '<img class="race-avatar" src="' +
            escapeHtml(av) +
            '" alt="" />' +
            '<div><div class="race-row-name">' +
            escapeHtml(r.nickname || "选手") +
            (isMe ? "（我）" : "") +
            '</div><div class="race-row-stats">答 ' +
            r.answered +
            " · 对 " +
            r.correct +
            " · 正确率 " +
            acc +
            "%</div></div>" +
            '<div class="race-row-score">' +
            r.score +
            "</div></div>"
          );
        })
        .join("");
      if (state.lastResult && meId) {
        var idx = ranked.findIndex(function (r) {
          return r.user_id === meId;
        });
        if (idx >= 0 && $("race-res-rank")) {
          $("race-res-rank").textContent =
            "你的历史最高分目前排在第 " +
            (idx + 1) +
            " 名（本场得分 " +
            state.lastResult.score +
            "）。";
        }
      }
    } catch (e) {
      console.error("[Race] board exception", e);
      list.innerHTML =
        '<p class="race-muted">排行榜加载异常：' +
        escapeHtml((e && e.message) || String(e)) +
        "</p>";
    }
  }

  function bind() {
    var root = $("race-app");
    if (!root || root.dataset.bound === "1") return;
    root.dataset.bound = "1";
    bindSubjectPicker();
    if ($("race-btn-start")) $("race-btn-start").addEventListener("click", startRace);
    if ($("race-btn-submit"))
      $("race-btn-submit").addEventListener("click", function () {
        var selected = collectSelected();
        if (!selected.length) {
          alert("请至少选择一个选项再提交。");
          return;
        }
        submitCurrent(true);
      });
    if ($("race-btn-again"))
      $("race-btn-again").addEventListener("click", function () {
        state.finished = false;
        state.lastResult = null;
        refreshGate();
      });
    if ($("race-btn-refresh-board"))
      $("race-btn-refresh-board").addEventListener("click", loadLeaderboard);
    window.addEventListener("kb-auth-change", function () {
      if (!state.running) {
        refreshGate();
        loadLeaderboard();
      }
    });
  }

  function boot() {
    if (!$("race-app")) return;
    if (!window.KBAuth) {
      setTimeout(boot, 80);
      return;
    }
    bind();
    refreshGate();
    loadLeaderboard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      var root = document.getElementById("race-app");
      if (root) root.dataset.bound = "0";
      setTimeout(boot, 0);
    });
  }
})();
