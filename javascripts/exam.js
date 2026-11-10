/**
 * Tong's Knowledge Base — Exam / 组卷
 * Uses window.KB_QUESTION_BANK (single + multi)
 */
(function () {
  function getBank() {
    return window.KB_QUESTION_BANK || [];
  }

  var paper = [];
  var answers = {};
  var graded = false;
  var results = [];

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
        try {
          if (MathJax.typesetClear) MathJax.typesetClear([root]);
        } catch (e) {}
        MathJax.typesetPromise([root]).catch(function () {});
      }
    }, 40);
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

  function filteredBank() {
    var sub = ($("exam-subject") && $("exam-subject").value) || "全部";
    var typeF = ($("exam-type") && $("exam-type").value) || "全部";
    var pool = getBank().slice();
    if (sub !== "全部") {
      pool = pool.filter(function (q) {
        return q.subject === sub;
      });
    }
    if (typeF === "单选") {
      pool = pool.filter(function (q) {
        return (q.type || "single") === "single";
      });
    } else if (typeF === "多选") {
      pool = pool.filter(function (q) {
        return q.type === "multi";
      });
    }
    return pool;
  }

  function letters() {
    return ["A", "B", "C", "D"];
  }

  function isMulti(item) {
    return item.type === "multi" || Array.isArray(item.correct);
  }

  function normalizeCorrect(item, order) {
    if (isMulti(item)) {
      var set = {};
      (item.correct || []).forEach(function (c) {
        set[c] = true;
      });
      var out = [];
      order.forEach(function (oldIdx, newIdx) {
        if (set[oldIdx]) out.push(newIdx);
      });
      return out.sort(function (a, b) {
        return a - b;
      });
    }
    return order.indexOf(item.correct);
  }

  function arraysEqual(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }

  function buildPaper() {
    var pool = filteredBank();
    var n = parseInt(($("exam-count") && $("exam-count").value) || "10", 10);
    if (!pool.length) {
      alert("该筛选条件下暂无题目");
      return;
    }
    if (n > pool.length) n = pool.length;

    paper = shuffle(pool)
      .slice(0, n)
      .map(function (item, idx) {
        var order = shuffle([0, 1, 2, 3].slice(0, item.options.length));
        var opts = order.map(function (i) {
          return item.options[i];
        });
        return {
          idx: idx,
          subject: item.subject,
          topic: item.topic,
          q: item.q,
          options: opts,
          correct: normalizeCorrect(item, order),
          explain: item.explain,
          difficulty: item.difficulty || "HD.8",
          type: isMulti(item) ? "multi" : "single",
          raw: item
        };
      });

    answers = {};
    graded = false;
    results = [];

    $("exam-setup").hidden = true;
    $("exam-result").hidden = true;
    $("exam-paper").hidden = false;

    var sub = $("exam-subject").value;
    $("exam-paper-title").textContent =
      (sub === "全部" ? "综合" : sub) + "试卷";
    $("exam-paper-sub").textContent =
      "共 " + paper.length + " 题 · 含单选/多选 · 难度已标注 · 请作答后提交";

    renderPaperQuestions($("exam-questions"), false);
    $("exam-actions-before").hidden = false;
  }

  function renderPaperQuestions(container, isReview) {
    var onlyWrong =
      isReview && $("exam-only-wrong") && $("exam-only-wrong").checked;
    var list = paper;
    if (onlyWrong) {
      list = paper.filter(function (p, i) {
        return results[i] && !results[i].ok;
      });
    }

    if (!list.length) {
      container.innerHTML =
        '<div class="exam-empty">没有符合条件的题目。</div>';
      return;
    }

    container.innerHTML = list
      .map(function (item) {
        var i = item.idx;
        var res = results[i];
        var statusClass = "";
        var statusHtml = "";
        if (graded && res) {
          statusClass = res.ok ? " is-right" : " is-wrong";
          statusHtml = res.ok
            ? '<span class="exam-badge ok">正确</span>'
            : '<span class="exam-badge bad">错误</span>';
        }

        var typeLabel =
          item.type === "multi"
            ? '<span class="exam-type multi">多选</span>'
            : '<span class="exam-type single">单选</span>';
        var diffLabel =
          '<span class="exam-diff">' + (item.difficulty || "") + "</span>";

        var opts = item.options
          .map(function (opt, oi) {
            var L = letters()[oi];
            var inputType = item.type === "multi" ? "checkbox" : "radio";
            var checked = "";
            if (item.type === "multi") {
              var arr = answers[i] || [];
              if (arr.indexOf(oi) >= 0) checked = " checked";
            } else {
              if (answers[i] === oi) checked = " checked";
            }
            var disabled = graded ? " disabled" : "";
            var mark = "";
            if (graded) {
              var isAns =
                item.type === "multi"
                  ? (item.correct || []).indexOf(oi) >= 0
                  : oi === item.correct;
              if (isAns) mark = ' data-mark="correct"';
              if (item.type === "multi") {
                var picked = (answers[i] || []).indexOf(oi) >= 0;
                if (picked && !isAns) mark = ' data-mark="wrong"';
              } else if (answers[i] === oi && oi !== item.correct) {
                mark = ' data-mark="wrong"';
              }
            }
            return (
              '<label class="exam-option"' +
              mark +
              ">" +
              '<input type="' +
              inputType +
              '" name="exam-q-' +
              i +
              '" value="' +
              oi +
              '"' +
              checked +
              disabled +
              " />" +
              '<span class="exam-opt-key">' +
              L +
              ".</span>" +
              '<span class="exam-opt-text kb-math arithmatex">' +
              formatText(opt) +
              "</span></label>"
            );
          })
          .join("");

        var explain = "";
        if (graded && res) {
          var ansText =
            item.type === "multi"
              ? (item.correct || [])
                  .map(function (c) {
                    return letters()[c];
                  })
                  .join("")
              : letters()[item.correct];
          explain =
            '<div class="exam-explain kb-math arithmatex"><strong>解析：</strong>' +
            formatText(item.explain) +
            "　<strong>正确答案：</strong>" +
            ansText +
            "</div>";
        }

        return (
          '<article class="exam-item' +
          statusClass +
          '" data-idx="' +
          i +
          '">' +
          '<div class="exam-item-head">' +
          "<span>第 " +
          (i + 1) +
          " 题 · " +
          item.subject +
          " · " +
          item.topic +
          " " +
          typeLabel +
          " " +
          diffLabel +
          "</span>" +
          statusHtml +
          "</div>" +
          '<div class="exam-item-q kb-math arithmatex">' +
          formatText(item.q) +
          "</div>" +
          '<div class="exam-options">' +
          opts +
          "</div>" +
          explain +
          "</article>"
        );
      })
      .join("");

    if (!graded) {
      container.querySelectorAll("input").forEach(function (input) {
        input.addEventListener("change", function () {
          var idx = parseInt(input.name.replace("exam-q-", ""), 10);
          var item = paper[idx];
          if (!item) return;
          if (item.type === "multi") {
            var boxes = container.querySelectorAll(
              'input[name="exam-q-' + idx + '"]'
            );
            var picked = [];
            boxes.forEach(function (b) {
              if (b.checked) picked.push(parseInt(b.value, 10));
            });
            picked.sort(function (a, b) {
              return a - b;
            });
            answers[idx] = picked;
          } else {
            answers[idx] = parseInt(input.value, 10);
          }
        });
      });
    }

    renderMath(container);
  }

  function submitPaper() {
    if (!paper.length) return;
    var unanswered = paper.filter(function (p) {
      if (p.type === "multi")
        return !answers[p.idx] || !answers[p.idx].length;
      return answers[p.idx] === undefined;
    });
    if (unanswered.length) {
      if (!confirm("还有 " + unanswered.length + " 题未作答，确定提交吗？"))
        return;
    }

    var score = 0;
    results = paper.map(function (p) {
      var ok;
      if (p.type === "multi") {
        var picked = (answers[p.idx] || []).slice().sort(function (a, b) {
          return a - b;
        });
        var right = (p.correct || []).slice().sort(function (a, b) {
          return a - b;
        });
        ok = arraysEqual(picked, right);
      } else {
        ok = answers[p.idx] === p.correct;
      }
      if (ok) score++;
      return { ok: ok };
    });
    graded = true;

    $("exam-actions-before").hidden = true;
    $("exam-result").hidden = false;
    $("exam-score-num").textContent = String(score);
    $("exam-score-label").textContent = " / " + paper.length + " 分";
    $("exam-score-detail").textContent =
      "正确 " + score + " 题，错误 " + (paper.length - score) + " 题";

    renderPaperQuestions($("exam-review"), true);
    if ($("exam-paper")) $("exam-paper").hidden = true;
  }

  function resetExam() {
    paper = [];
    answers = {};
    graded = false;
    results = [];
    $("exam-setup").hidden = false;
    $("exam-paper").hidden = true;
    $("exam-result").hidden = true;
    updateBankCount();
  }

  function addWrongToBook() {
    if (!window.KBAuth) return;
    if (!KBAuth.currentUser()) {
      KBAuth.openModal();
      return;
    }
    var wrongs = paper.filter(function (p, i) {
      return results[i] && !results[i].ok;
    });
    if (!wrongs.length) {
      alert("没有错题");
      return;
    }
    var chain = Promise.resolve();
    var added = 0;
    wrongs.forEach(function (item) {
      chain = chain.then(function () {
        return KBAuth.addToWrongBook({
          subject: item.subject,
          topic: item.topic + " · " + (item.difficulty || ""),
          q: item.q,
          a:
            item.explain +
            " 正确答案：" +
            (item.type === "multi"
              ? (item.correct || [])
                  .map(function (c) {
                    return letters()[c];
                  })
                  .join("")
              : letters()[item.correct])
        }).then(function (r) {
          if (r && r.ok && r.reason !== "exists") added++;
        });
      });
    });
    chain.then(function () {
      var tip = $("exam-add-tip");
      if (tip) {
        tip.hidden = false;
        tip.textContent = "已处理错题同步（新增约 " + added + " 题）";
      }
      if (KBAuth.renderHeaderAuth) KBAuth.renderHeaderAuth();
    });
  }

  function updateBankCount() {
    var el = $("exam-bank-count");
    if (el) el.textContent = String(filteredBank().length);
    var total = $("exam-bank-total");
    if (total) total.textContent = String(getBank().length);
  }

  function init() {
    var root = $("exam-app");
    if (!root) return;
    if (root.dataset.examBound === "1") {
      updateBankCount();
      return;
    }
    root.dataset.examBound = "1";

    if ($("exam-btn-start"))
      $("exam-btn-start").addEventListener("click", buildPaper);
    if ($("exam-btn-submit"))
      $("exam-btn-submit").addEventListener("click", submitPaper);
    if ($("exam-btn-reset"))
      $("exam-btn-reset").addEventListener("click", resetExam);
    if ($("exam-btn-again"))
      $("exam-btn-again").addEventListener("click", function () {
        resetExam();
        buildPaper();
      });
    if ($("exam-btn-add-wrong"))
      $("exam-btn-add-wrong").addEventListener("click", addWrongToBook);
    if ($("exam-only-wrong"))
      $("exam-only-wrong").addEventListener("change", function () {
        renderPaperQuestions($("exam-review"), true);
      });
    if ($("exam-subject"))
      $("exam-subject").addEventListener("change", updateBankCount);
    if ($("exam-type"))
      $("exam-type").addEventListener("change", updateBankCount);

    updateBankCount();
  }

  function start() {
    if (!window.KB_QUESTION_BANK) {
      setTimeout(start, 40);
      return;
    }
    init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      var root = document.getElementById("exam-app");
      if (root) root.dataset.examBound = "0";
      setTimeout(start, 0);
    });
  }
})();
