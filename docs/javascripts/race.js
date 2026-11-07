/**
 * 选择竞速 — 限时一题一题作答 + 排行榜
 */
(function () {
  var DURATION = 60;
  var letters = ["A", "B", "C", "D"];

  var state = {
    profile: null,
    queue: [],
    idx: 0,
    answered: 0,
    correct: 0,
    remaining: DURATION,
    timerId: null,
    running: false,
    finished: false,
    lastResult: null
  };

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, """);
  }

  function defaultAvatar(seed) {
    var s = encodeURIComponent(String(seed || "guest").slice(0, 24));
    return "https://api.dicebear.com/7.x/thumbs/svg?seed=" + s + "&backgroundColor=5c6bc0,26c6da,7e57c2";
  }

  function formatTime(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function calcScore(correct, answered) {
    if (!answered) return 0;
    var acc = correct / answered;
    return correct * 1000 + Math.floor(acc * 100);
  }

  function accuracyText(correct, answered) {
    if (!answered) return "0%";
    return Math.round((correct / answered) * 1000) / 10 + "%";
  }

  function isMulti(item) {
    return item.type === "multi" || Array.isArray(item.correct);
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
    return window.KBAuth && KBAuth.ensureClient ? KBAuth.ensureClient() : null;
  }

  async function loadProfile() {
    var user = KBAuth.currentUserFull && KBAuth.currentUserFull();
    if (!user) {
      state.profile = null;
      return null;
    }
    var sb = getClient();
    if (!sb) return null;
    var res = await sb
      .from("profiles")
      .select("user_id, nickname, avatar_url, updated_at")
      .eq("user_id", user.id)
      .maybeSingle();
    if (res.error) {
      console.error("[Race] profile", res.error);
      state.profile = null;
      return null;
    }
    state.profile = res.data || null;
    return state.profile;
  }

  function show(el, on) {
    if (!el) return;
    el.hidden = !on;
  }

  async function refreshGate() {
    var gate = $("race-gate");
    var ready = $("race-ready");
    var play = $("race-play");
    var result = $("race-result");
    if (!$("race-app")) return;
    if (state.running) return;
    show(play, false);
    show(result, !!state.lastResult);
    await (KBAuth.refreshSession ? KBAuth.refreshSession() : Promise.resolve());
    var user = KBAuth.currentUserFull && KBAuth.currentUserFull();
    if (!user) {
      show(gate, true);
      show(ready, false);
      $("race-gate-msg").textContent = "选择竞速需要登录后使用。";
      var actions = $("race-gate-actions");
      actions.hidden = false;
      actions.innerHTML =
        '<button type="button" class="quiz-btn quiz-btn-next" id="race-open-login">登录 / 注册</button>';
      var btn = $("race-open-login");
      if (btn)
        btn.onclick = function () {
          if (KBAuth.openModal) KBAuth.openModal();
        };
      return;
    }
    await loadProfile();
    if (!state.profile || !state.profile.nickname) {
      show(gate, true);
      show(ready, false);
      $("race-gate-msg").textContent = "请先设置昵称（可上传头像），再开始竞速。";
      var actions2 = $("race-gate-actions");
      actions2.hidden = false;
      actions2.innerHTML = '<a class="quiz-btn quiz-btn-next" href="/account/">去设置资料</a>';
      return;
    }
    show(gate, false);
    show(ready, true);
    var nick = state.profile.nickname;
    var av = state.profile.avatar_url || defaultAvatar(user.id || nick);
    $("race-ready-name").textContent = nick;
    $("race-ready-avatar").src = av;
    $("race-ready-avatar").alt = nick;
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
    if (!state.queue.length || state.idx >= state.queue.length) {
      finishRace();
      return;
    }
    var item = state.queue[state.idx];
    var multi = isMulti(item);
    $("race-meta").textContent =
      (item.subject || "") +
      " · " +
      (item.topic || "") +
      (item.difficulty ? " · " + item.difficulty : "");
    $("race-type-badge").textContent = multi ? "多选" : "单选";
    $("race-q-text").innerHTML = String(item.q || "").replace(/\n/g, "<br>");
    var box = $("race-options");
    box.innerHTML = "";
    (item.options || []).forEach(function (opt, oi) {
      var label = document.createElement("label");
      label.className = "exam-option";
      var input = document.createElement("input");
      input.type = multi ? "checkbox" : "radio";
      input.name = "race-opt";
      input.value = String(oi);
      var key = document.createElement("span");
      key.className = "exam-opt-key";
      key.textContent = letters[oi] + ".";
      var text = document.createElement("span");
      text.className = "exam-opt-text kb-math arithmatex";
      text.innerHTML = opt;
      label.appendChild(input);
      label.appendChild(key);
      label.appendChild(text);
      box.appendChild(label);
    });
    renderMath($("race-q-text"));
    renderMath(box);
    updateHud();
  }

  function collectSelected() {
    var nodes = document.querySelectorAll("#race-options input:checked");
    var out = [];
    nodes.forEach(function (n) {
      out.push(parseInt(n.value, 10));
    });
    return out;
  }

  function submitCurrent(andNext) {
    if (!state.running || state.finished) return;
    if (state.idx >= state.queue.length) {
      finishRace();
      return;
    }
    var item = state.queue[state.idx];
    var selected = collectSelected();
    if (!selected.length && andNext !== "force") return;
    state.answered += 1;
    if (selected.length && checkAnswer(item, selected)) state.correct += 1;
    state.idx += 1;
    updateHud();
    if (state.idx >= state.queue.length || state.remaining <= 0) finishRace();
    else renderQuestion();
  }

  async function saveResult(payload) {
    var sb = getClient();
    var user = KBAuth.currentUserFull && KBAuth.currentUserFull();
    if (!sb || !user) return null;
    var row = {
      user_id: user.id,
      nickname: payload.nickname,
      avatar_url: payload.avatar_url || null,
      answered: payload.answered,
      correct: payload.correct,
      accuracy: payload.answered ? payload.correct / payload.answered : 0,
      score: payload.score
    };
    var res = await sb.from("race_results").insert(row).select("id").maybeSingle();
    if (res.error) {
      console.error("[Race] save result", res.error);
      return null;
    }
    return res.data;
  }

  async function finishRace() {
    if (state.finished) return;
    state.finished = true;
    state.running = false;
    stopTimer();
    var user = KBAuth.currentUserFull && KBAuth.currentUserFull();
    var nick = (state.profile && state.profile.nickname) || "选手";
    var av =
      (state.profile && state.profile.avatar_url) ||
      defaultAvatar((user && user.id) || nick);
    var score = calcScore(state.correct, state.answered);
    state.lastResult = {
      answered: state.answered,
      correct: state.correct,
      accuracy: state.answered ? state.correct / state.answered : 0,
      score: score,
      nickname: nick,
      avatar_url: av
    };
    show($("race-play"), false);
    show($("race-ready"), false);
    show($("race-result"), true);
    $("race-res-answered").textContent = String(state.answered);
    $("race-res-correct").textContent = String(state.correct);
    $("race-res-acc").textContent = accuracyText(state.correct, state.answered);
    $("race-res-score").textContent = String(score);
    await saveResult(state.lastResult);
    await loadLeaderboard();
    $("race-res-rank").textContent = "成绩已提交到排行榜（按历史最高分排序）。";
  }

  function startRace() {
    var bank = window.KB_QUESTION_BANK || [];
    if (!bank.length) {
      alert("题库尚未加载，请稍后刷新重试。");
      return;
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
    var sb = getClient();
    if (!sb) {
      list.textContent = "无法连接后端。";
      return;
    }
    var res = await sb
      .from("race_results")
      .select("user_id, nickname, avatar_url, answered, correct, accuracy, score, created_at")
      .order("score", { ascending: false })
      .limit(200);
    if (res.error) {
      console.error("[Race] board", res.error);
      list.innerHTML =
        '<p class="race-muted">排行榜加载失败。请确认已在 Supabase 创建 <code>race_results</code> 表及 RLS 策略。</p>';
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
          "<div><div class=\"race-row-name\">" +
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
  }

  function bind() {
    var root = $("race-app");
    if (!root || root.dataset.bound === "1") return;
    root.dataset.bound = "1";
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
      if (!state.running) refreshGate();
    });
  }

  function boot() {
    if (!$("race-app")) return;
    if (!window.KBAuth || !window.KB_QUESTION_BANK) {
      setTimeout(boot, 60);
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
