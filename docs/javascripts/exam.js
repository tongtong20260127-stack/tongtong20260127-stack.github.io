/**
 * Tong's Knowledge Base — Exam / 组卷
 */
(function () {
  var BANK = [
    // 数学
    {
      subject: "数学",
      topic: "圆锥曲线",
      q: "椭圆 \\( \\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}=1\\ (a>b>0) \\) 的离心率 e 满足：",
      options: ["\\( 0<e<1 \\)", "\\( e=1 \\)", "\\( e>1 \\)", "\\( e=0 \\)"],
      correct: 0,
      explain: "椭圆离心率 \\( e=c/a \\)，且 \\( 0<e<1 \\)。"
    },
    {
      subject: "数学",
      topic: "圆锥曲线",
      q: "双曲线 \\( \\dfrac{x^2}{a^2}-\\dfrac{y^2}{b^2}=1 \\) 的渐近线是：",
      options: [
        "\\( y=\\pm\\dfrac{b}{a}x \\)",
        "\\( y=\\pm\\dfrac{a}{b}x \\)",
        "\\( x=\\pm a \\)",
        "\\( y=\\pm b \\)"
      ],
      correct: 0,
      explain: "焦点在 x 轴的双曲线，渐近线为 \\( y=\\pm\\dfrac{b}{a}x \\)。"
    },
    {
      subject: "数学",
      topic: "圆锥曲线",
      q: "抛物线 \\( y^2=2px\\ (p>0) \\) 的焦点坐标是：",
      options: [
        "\\( \\left(\\dfrac{p}{2},0\\right) \\)",
        "\\( (p,0) \\)",
        "\\( \\left(\\dfrac{p}{4},0\\right) \\)",
        "\\( (0,p) \\)"
      ],
      correct: 0,
      explain: "标准式 \\( y^2=2px \\) 焦点为 \\( \\left(\\dfrac{p}{2},0\\right) \\)。"
    },
    {
      subject: "数学",
      topic: "数列",
      q: "等差数列 \\( \\{a_n\\} \\) 中，通项公式为：",
      options: [
        "\\( a_n=a_1+(n-1)d \\)",
        "\\( a_n=a_1\\cdot q^{n-1} \\)",
        "\\( a_n=n\\cdot a_1 \\)",
        "\\( a_n=a_1+nd \\)"
      ],
      correct: 0,
      explain: "等差数列通项：\\( a_n=a_1+(n-1)d \\)。"
    },
    {
      subject: "数学",
      topic: "不等式",
      q: "对正数 a,b，算术-几何平均不等式正确的是：",
      options: [
        "\\( \\dfrac{a+b}{2}\\geq\\sqrt{ab} \\)",
        "\\( \\dfrac{a+b}{2}\\leq\\sqrt{ab} \\)",
        "\\( a+b\\geq ab \\)",
        "\\( \\sqrt{ab}\\geq a+b \\)"
      ],
      correct: 0,
      explain: "均值不等式：\\( \\dfrac{a+b}{2}\\geq\\sqrt{ab} \\)，等号当 a=b。"
    },
    {
      subject: "数学",
      topic: "排列组合",
      q: "组合数 \\( C_n^k \\) 等于：",
      options: [
        "\\( \\dfrac{n!}{k!(n-k)!} \\)",
        "\\( \\dfrac{n!}{(n-k)!} \\)",
        "\\( n^k \\)",
        "\\( k! \\)"
      ],
      correct: 0,
      explain: "\\( C_n^k=\\dfrac{n!}{k!(n-k)!} \\)。"
    },
    {
      subject: "数学",
      topic: "立体几何",
      q: "半径为 R 的球的体积是：",
      options: [
        "\\( \\dfrac{4}{3}\\pi R^3 \\)",
        "\\( 4\\pi R^2 \\)",
        "\\( \\dfrac{4}{3}\\pi R^2 \\)",
        "\\( \\pi R^3 \\)"
      ],
      correct: 0,
      explain: "球体积 \\( V=\\dfrac{4}{3}\\pi R^3 \\)，表面积 \\( 4\\pi R^2 \\)。"
    },
    {
      subject: "数学",
      topic: "圆锥曲线",
      q: "圆锥曲线统一定义中，e=1 对应：",
      options: ["抛物线", "椭圆", "双曲线", "圆"],
      correct: 0,
      explain: "e<1 椭圆，e=1 抛物线，e>1 双曲线。"
    },

    // 物理
    {
      subject: "物理",
      topic: "牛顿定律",
      q: "牛顿第二定律的表达式是：",
      options: [
        "\\( \\vec{F}_{合}=m\\vec{a} \\)",
        "\\( F=G\\dfrac{m_1m_2}{r^2} \\)",
        "\\( F=kx \\)",
        "\\( F=qE \\)"
      ],
      correct: 0,
      explain: "合外力等于质量与加速度的乘积。"
    },
    {
      subject: "物理",
      topic: "动能定理",
      q: "动能定理指出，合外力做功等于：",
      options: ["动能的变化", "势能的变化", "机械能的变化", "动量的变化"],
      correct: 0,
      explain: "\\( W_{合}=\\Delta E_k \\)。"
    },
    {
      subject: "物理",
      topic: "圆周运动",
      q: "匀速圆周运动向心加速度大小为：",
      options: [
        "\\( \\dfrac{v^2}{r} \\)",
        "\\( vr \\)",
        "\\( \\dfrac{v}{r} \\)",
        "\\( v^2 r \\)"
      ],
      correct: 0,
      explain: "\\( a_n=\\dfrac{v^2}{r}=\\omega^2 r \\)。"
    },
    {
      subject: "物理",
      topic: "静电场",
      q: "库仑定律中，真空中静电力常量 k 约为：",
      options: [
        "\\( 9.0\\times 10^9\\,\\mathrm{N\\cdot m^2/C^2} \\)",
        "\\( 6.67\\times 10^{-11} \\)",
        "\\( 3.0\\times 10^8 \\)",
        "\\( 1.6\\times 10^{-19} \\)"
      ],
      correct: 0,
      explain: "k≈9.0×10⁹ N·m²/C²。"
    },
    {
      subject: "物理",
      topic: "洛伦兹力",
      q: "带电粒子垂直进入匀强磁场做匀速圆周运动，半径 R 为：",
      options: [
        "\\( \\dfrac{mv}{qB} \\)",
        "\\( \\dfrac{qB}{mv} \\)",
        "\\( \\dfrac{mB}{qv} \\)",
        "\\( qvB \\)"
      ],
      correct: 0,
      explain: "由 \\( qvB=m\\dfrac{v^2}{R} \\) 得 \\( R=\\dfrac{mv}{qB} \\)。"
    },
    {
      subject: "物理",
      topic: "电磁感应",
      q: "法拉第电磁感应定律：感应电动势大小与磁通量变化率：",
      options: ["成正比", "成反比", "无关", "等于磁通量"],
      correct: 0,
      explain: "\\( E=n\\dfrac{\\Delta\\Phi}{\\Delta t} \\)。"
    },
    {
      subject: "物理",
      topic: "光电效应",
      q: "爱因斯坦光电效应方程是：",
      options: [
        "\\( E_k=h\\nu-W_0 \\)",
        "\\( E=mc^2 \\)",
        "\\( E=\\dfrac{1}{2}mv^2 \\)",
        "\\( E=qU \\)"
      ],
      correct: 0,
      explain: "最大初动能等于光子能量减逸出功。"
    },
    {
      subject: "物理",
      topic: "电路",
      q: "闭合电路欧姆定律中，电流 I 等于：",
      options: [
        "\\( \\dfrac{E}{R+r} \\)",
        "\\( \\dfrac{E}{R} \\)",
        "\\( ER \\)",
        "\\( \\dfrac{R}{E+r} \\)"
      ],
      correct: 0,
      explain: "I = E / (R+r)，E 为电动势，r 为内阻。"
    },

    // 化学
    {
      subject: "化学",
      topic: "物质的量",
      q: "物质的量 n 与质量 m、摩尔质量 M 的关系是：",
      options: [
        "\\( n=\\dfrac{m}{M} \\)",
        "\\( n=mM \\)",
        "\\( n=\\dfrac{M}{m} \\)",
        "\\( n=m+M \\)"
      ],
      correct: 0,
      explain: "n = m/M。"
    },
    {
      subject: "化学",
      topic: "化学平衡",
      q: "升高温度时，化学平衡向：",
      options: ["吸热方向移动", "放热方向移动", "不移动", "任意方向"],
      correct: 0,
      explain: "勒夏特列原理：升温平衡向吸热方向移动。"
    },
    {
      subject: "化学",
      topic: "电离",
      q: "25°C 时水的离子积 \\( K_w \\) 约为：",
      options: [
        "\\( 1.0\\times 10^{-14} \\)",
        "\\( 1.0\\times 10^{-7} \\)",
        "\\( 14 \\)",
        "\\( 7 \\)"
      ],
      correct: 0,
      explain: "Kw = [H⁺][OH⁻] = 1.0×10⁻¹⁴（25°C）。"
    },
    {
      subject: "化学",
      topic: "氧化还原",
      q: "氧化还原反应的本质是：",
      options: ["电子转移（或偏移）", "离子交换", "分子扩散", "热量传递"],
      correct: 0,
      explain: "本质是电子转移；化合价变化是外在表现。"
    },
    {
      subject: "化学",
      topic: "原电池",
      q: "原电池中，负极发生的是：",
      options: ["氧化反应", "还原反应", "中和反应", "化合反应"],
      correct: 0,
      explain: "负极失电子，发生氧化反应。"
    },
    {
      subject: "化学",
      topic: "有机",
      q: "检验醛基常用的是：",
      options: [
        "银镜反应或新制 Cu(OH)₂",
        "酸碱指示剂",
        "焰色反应",
        "淀粉碘化钾试纸"
      ],
      correct: 0,
      explain: "醛基可被弱氧化剂氧化，出现银镜或砖红色沉淀。"
    },

    // 生物
    {
      subject: "生物",
      topic: "细胞",
      q: "有氧呼吸的主要场所是：",
      options: ["线粒体", "叶绿体", "核糖体", "高尔基体"],
      correct: 0,
      explain: "线粒体是有氧呼吸主要场所。"
    },
    {
      subject: "生物",
      topic: "细胞",
      q: "光合作用的场所是：",
      options: ["叶绿体", "线粒体", "液泡", "中心体"],
      correct: 0,
      explain: "叶绿体进行光合作用。"
    },
    {
      subject: "生物",
      topic: "遗传",
      q: "杂合子自交，一对相对性状的分离比约为：",
      options: ["3:1", "1:1", "9:3:3:1", "1:2:1（表现型）"],
      correct: 0,
      explain: "分离定律下杂合子自交表现型比约 3:1。"
    },
    {
      subject: "生物",
      topic: "中心法则",
      q: "遗传信息从 DNA 到蛋白质的基本流向是：",
      options: [
        "DNA→RNA→蛋白质",
        "蛋白质→RNA→DNA",
        "RNA→蛋白质→DNA",
        "DNA→蛋白质→RNA"
      ],
      correct: 0,
      explain: "中心法则：转录与翻译。"
    },
    {
      subject: "生物",
      topic: "免疫",
      q: "特异性免疫主要包括：",
      options: [
        "体液免疫和细胞免疫",
        "只有皮肤黏膜",
        "只有吞噬细胞",
        "只有过敏反应"
      ],
      correct: 0,
      explain: "第三道防线：体液免疫（B 细胞）与细胞免疫（T 细胞）。"
    },
    {
      subject: "生物",
      topic: "生态",
      q: "生态系统能量流动的特点是：",
      options: [
        "单向流动、逐级递减",
        "双向流动、可循环",
        "只增不减",
        "与物质循环完全无关"
      ],
      correct: 0,
      explain: "能量单向流动、逐级递减，传递效率约 10%～20%。"
    },

    // 英语
    {
      subject: "英语",
      topic: "时态",
      q: "现在完成时的基本结构是：",
      options: [
        "have/has + 过去分词",
        "be + doing",
        "will + 动词原形",
        "had + 过去分词"
      ],
      correct: 0,
      explain: "现在完成时：have/has + done。"
    },
    {
      subject: "英语",
      topic: "非谓语",
      q: "表示“被动、完成”意义的非谓语形式通常是：",
      options: ["过去分词 done", "现在分词 doing", "不定式 to do", "动名词 doing（一律主动）"],
      correct: 0,
      explain: "过去分词常表被动或完成。"
    },
    {
      subject: "英语",
      topic: "虚拟语气",
      q: "与现在事实相反的虚拟条件句，从句动词常用：",
      options: [
        "过去式（be 常用 were）",
        "动词原形",
        "现在完成时",
        "将来时"
      ],
      correct: 0,
      explain: "If + 过去式；主句 would/could/might + 动词原形。"
    },
    {
      subject: "英语",
      topic: "词汇",
      q: "前缀 un-/in-/im-/il-/ir- 通常表示：",
      options: ["否定、不", "再次", "之前", "超过"],
      correct: 0,
      explain: "如 unhappy, impossible, illegal, irregular。"
    },
    {
      subject: "英语",
      topic: "从句",
      q: "在介词后引导定语从句、修饰物时，一般用：",
      options: ["which", "that", "what", "who"],
      correct: 0,
      explain: "介词后通常用 which，不用 that。"
    },
    {
      subject: "英语",
      topic: "衔接",
      q: "下列哪个最常表示转折关系？",
      options: ["however", "therefore", "as a result", "because"],
      correct: 0,
      explain: "however 表转折；therefore / as a result 表结果。"
    }
  ];

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
    if (sub === "全部") return BANK.slice();
    return BANK.filter(function (q) {
      return q.subject === sub;
    });
  }

  function letters() {
    return ["A", "B", "C", "D"];
  }

  function buildPaper() {
    var pool = filteredBank();
    var n = parseInt(($("exam-count") && $("exam-count").value) || "10", 10);
    if (!pool.length) {
      alert("该学科暂无题目");
      return;
    }
    if (n > pool.length) n = pool.length;

    paper = shuffle(pool).slice(0, n).map(function (item, idx) {
      // 打乱选项，记录新的正确下标
      var order = shuffle([0, 1, 2, 3].slice(0, item.options.length));
      var opts = order.map(function (i) {
        return item.options[i];
      });
      var correct = order.indexOf(item.correct);
      return {
        idx: idx,
        subject: item.subject,
        topic: item.topic,
        q: item.q,
        options: opts,
        correct: correct,
        explain: item.explain,
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
      (sub === "全部" ? "综合" : sub) + "选择题试卷";
    $("exam-paper-sub").textContent =
      "共 " + paper.length + " 题 · 每题 1 分 · 请选择后提交";

    renderPaperQuestions($("exam-questions"), false);
    $("exam-actions-before").hidden = false;
  }

  function renderPaperQuestions(container, isReview) {
    var onlyWrong = isReview && $("exam-only-wrong") && $("exam-only-wrong").checked;
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

        var opts = item.options
          .map(function (opt, oi) {
            var L = letters()[oi];
            var checked = answers[i] === oi ? " checked" : "";
            var disabled = graded ? " disabled" : "";
            var mark = "";
            if (graded) {
              if (oi === item.correct) mark = " data-mark=\"correct\"";
              if (answers[i] === oi && oi !== item.correct) mark = " data-mark=\"wrong\"";
            }
            return (
              '<label class="exam-option"' +
              mark +
              ">" +
              '<input type="radio" name="exam-q-' +
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
          explain =
            '<div class="exam-explain kb-math arithmatex"><strong>解析：</strong>' +
            formatText(item.explain) +
            "　<strong>正确答案：</strong>" +
            letters()[item.correct] +
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
      container.querySelectorAll('input[type="radio"]').forEach(function (input) {
        input.addEventListener("change", function () {
          var name = input.name;
          var idx = parseInt(name.replace("exam-q-", ""), 10);
          answers[idx] = parseInt(input.value, 10);
        });
      });
    }

    renderMath(container);
  }

  function submitPaper() {
    if (!paper.length) return;
    var unanswered = paper.filter(function (p) {
      return answers[p.idx] === undefined;
    });
    if (unanswered.length) {
      if (!confirm("还有 " + unanswered.length + " 题未作答，确定提交吗？")) return;
    }

    var right = 0;
    results = paper.map(function (p) {
      var ok = answers[p.idx] === p.correct;
      if (ok) right++;
      return { ok: ok, chosen: answers[p.idx] };
    });
    graded = true;

    $("exam-paper").hidden = true;
    $("exam-result").hidden = false;
    $("exam-score-num").textContent = String(right);
    $("exam-score-label").textContent =
      "/ " + paper.length + " 分";
    var rate = Math.round((right / paper.length) * 100);
    $("exam-score-detail").textContent =
      "正确 " + right + " 题，错误 " + (paper.length - right) + " 题，正确率 " + rate + "%";

    if ($("exam-only-wrong")) $("exam-only-wrong").checked = false;
    renderPaperQuestions($("exam-review"), true);

    var wrongCount = paper.length - right;
    var addBtn = $("exam-btn-add-wrong");
    if (addBtn) {
      addBtn.disabled = wrongCount === 0;
      addBtn.textContent =
        wrongCount === 0 ? "本次无错题" : "将本次错题加入错题本（" + wrongCount + "）";
    }
  }

  function toWrongItem(p) {
    var L = letters();
    var optText = p.options
      .map(function (o, i) {
        return L[i] + ". " + o;
      })
      .join("\n");
    return {
      subject: p.subject,
      topic: "组卷 · " + p.topic,
      q: p.q + "\n" + optText,
      a: "正确答案：" + L[p.correct] + "\n" + p.explain
    };
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
    if (!wrongs.length) return;

    var btn = $("exam-btn-add-wrong");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "上传中…";
    }

    var chain = Promise.resolve({ added: 0, exists: 0, fail: 0 });
    wrongs.forEach(function (p) {
      chain = chain.then(function (stat) {
        return Promise.resolve(KBAuth.addToWrongBook(toWrongItem(p))).then(function (r) {
          if (r && r.ok && r.reason === "added") stat.added++;
          else if (r && r.reason === "exists") stat.exists++;
          else stat.fail++;
          return stat;
        });
      });
    });

    chain.then(function (stat) {
      var tip = $("exam-add-tip");
      if (tip) {
        tip.hidden = false;
        tip.textContent =
          "完成：新加入 " +
          stat.added +
          " 题，已存在 " +
          stat.exists +
          " 题" +
          (stat.fail ? "，失败 " + stat.fail + " 题" : "");
      }
      if (btn) {
        btn.disabled = false;
        btn.textContent = "将本次错题加入错题本";
      }
      if (KBAuth.renderHeaderAuth) KBAuth.renderHeaderAuth();
    });
  }

  function showSetup() {
    $("exam-setup").hidden = false;
    $("exam-paper").hidden = true;
    $("exam-result").hidden = true;
    paper = [];
    answers = {};
    graded = false;
    results = [];
  }

  function init() {
    var root = $("exam-app");
    if (!root) return;
    if (root.dataset.examBound === "1") return;
    root.dataset.examBound = "1";

    if ($("exam-bank-count")) $("exam-bank-count").textContent = String(BANK.length);

    if ($("exam-btn-start")) $("exam-btn-start").addEventListener("click", buildPaper);
    if ($("exam-btn-submit")) $("exam-btn-submit").addEventListener("click", submitPaper);
    if ($("exam-btn-reset")) $("exam-btn-reset").addEventListener("click", showSetup);
    if ($("exam-btn-again")) $("exam-btn-again").addEventListener("click", showSetup);
    if ($("exam-btn-add-wrong"))
      $("exam-btn-add-wrong").addEventListener("click", addWrongToBook);
    if ($("exam-only-wrong")) {
      $("exam-only-wrong").addEventListener("change", function () {
        if (graded) renderPaperQuestions($("exam-review"), true);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      var root = document.getElementById("exam-app");
      if (root) root.dataset.examBound = "0";
      setTimeout(init, 0);
    });
  }
})();
