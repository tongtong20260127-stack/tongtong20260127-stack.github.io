/**
 * Tong's Knowledge Base — Random Quiz
 */
(function () {
  const QUESTIONS = [
    // ===== 数学 =====
    {
      subject: "数学",
      topic: "圆锥曲线 · 椭圆",
      q: "椭圆的标准方程（焦点在 x 轴）是什么？离心率 e 的取值范围是多少？",
      a: "标准方程：\\( \\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1 \\ (a > b > 0) \\)。\\n离心率 \\( e = \\dfrac{c}{a} \\)，其中 \\( c^2 = a^2 - b^2 \\)，且 \\( 0 < e < 1 \\)。"
    },
    {
      subject: "数学",
      topic: "圆锥曲线 · 双曲线",
      q: "双曲线 \\( \\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1 \\ ) 的渐近线方程是什么？",
      a: "渐近线方程为：\\( y = \\pm \\dfrac{b}{a}x \\)。\\n也可写成 \\( \\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 0 \\)。"
    },
    {
      subject: "数学",
      topic: "圆锥曲线 · 抛物线",
      q: "抛物线 \\( y^2 = 2px \\ (p > 0) \\) 的焦点坐标和准线方程分别是什么？",
      a: "焦点：\\( \\left(\\dfrac{p}{2},\\, 0\\right) \\)。\\n准线：\\( x = -\\dfrac{p}{2} \\)。\\n离心率 \\( e = 1 \\)。"
    },
    {
      subject: "数学",
      topic: "代数 · 数列",
      q: "等差数列的通项公式和前 n 项和公式分别是什么？",
      a: "通项：\\( a_n = a_1 + (n-1)d \\)。\\n前 n 项和：\\( S_n = \\dfrac{n(a_1+a_n)}{2} = na_1 + \\dfrac{n(n-1)}{2}d \\)。"
    },
    {
      subject: "数学",
      topic: "代数 · 不等式",
      q: "写出两个正数的均值不等式（算术-几何平均不等式）。",
      a: "对正数 \\( a, b \\)：\\( \\dfrac{a+b}{2} \\geq \\sqrt{ab} \\)，等号当且仅当 \\( a = b \\) 时成立。"
    },
    {
      subject: "数学",
      topic: "概率 · 排列组合",
      q: "排列数 \\( A_n^k \\) 和组合数 \\( C_n^k \\) 的公式分别是什么？",
      a: "\\( A_n^k = \\dfrac{n!}{(n-k)!} \\)。\\n\\( C_n^k = \\dfrac{n!}{k!(n-k)!} \\)。\\n关系：\\( C_n^k = \\dfrac{A_n^k}{k!} \\)。"
    },
    {
      subject: "数学",
      topic: "几何 · 立体几何",
      q: "球的体积公式和表面积公式分别是什么？",
      a: "体积：\\( V = \\dfrac{4}{3}\\pi R^3 \\)。\\n表面积：\\( S = 4\\pi R^2 \\)。"
    },
    {
      subject: "数学",
      topic: "圆锥曲线 · 统一定义",
      q: "圆锥曲线的统一定义中，离心率 e 如何区分椭圆、双曲线和抛物线？",
      a: "平面内到定点（焦点）与定直线（准线）距离之比为离心率 e：\\n• \\( 0 < e < 1 \\) → 椭圆\\n• \\( e > 1 \\) → 双曲线\\n• \\( e = 1 \\) → 抛物线"
    },

    // ===== 物理 =====
    {
      subject: "物理",
      topic: "力学 · 牛顿定律",
      q: "牛顿第二定律的内容是什么？写出公式。",
      a: "物体的加速度与合外力成正比，与质量成反比，方向与合外力方向相同。\\n公式：\\( \\vec{F}_{合} = m\\vec{a} \\)。"
    },
    {
      subject: "物理",
      topic: "力学 · 动量能量",
      q: "动能定理的内容是什么？",
      a: "合外力对物体做的功等于物体动能的变化。\\n\\( W_{合} = \\Delta E_k = \\dfrac{1}{2}mv^2 - \\dfrac{1}{2}mv_0^2 \\)。"
    },
    {
      subject: "物理",
      topic: "力学 · 圆周运动",
      q: "匀速圆周运动的向心加速度和向心力公式是什么？",
      a: "向心加速度：\\( a_n = \\dfrac{v^2}{r} = \\omega^2 r \\)。\\n向心力：\\( F_n = m\\dfrac{v^2}{r} = m\\omega^2 r \\)。\\n向心力由合力提供，不是一种新的力。"
    },
    {
      subject: "物理",
      topic: "电学 · 静电场",
      q: "库仑定律的公式是什么？k 的数值约为多少？",
      a: "\\( F = k\\dfrac{q_1 q_2}{r^2} \\)。\\n\\( k = 9.0 \\times 10^9\\,\\mathrm{N\\cdot m^2/C^2} \\)。"
    },
    {
      subject: "物理",
      topic: "电磁学 · 洛伦兹力",
      q: "带电粒子垂直进入匀强磁场做匀速圆周运动时，轨道半径和周期公式是什么？",
      a: "半径：\\( R = \\dfrac{mv}{qB} \\)。\\n周期：\\( T = \\dfrac{2\\pi m}{qB} \\)（与速度无关）。"
    },
    {
      subject: "物理",
      topic: "电磁学 · 电磁感应",
      q: "法拉第电磁感应定律的内容与公式是什么？",
      a: "电路中感应电动势的大小与穿过这一电路的磁通量的变化率成正比。\\n\\( E = n\\dfrac{\\Delta\\Phi}{\\Delta t} \\)。\\n导体切割磁感线：\\( E = Blv\\sin\\theta \\)。"
    },
    {
      subject: "物理",
      topic: "近代物理 · 光电效应",
      q: "爱因斯坦光电效应方程是什么？说明各符号含义。",
      a: "\\( E_k = h\\nu - W_0 \\)。\\n\\( E_k \\)：光电子最大初动能；\\( h\\nu \\)：光子能量；\\( W_0 = h\\nu_0 \\)：逸出功，\\( \\nu_0 \\) 为截止频率。"
    },
    {
      subject: "物理",
      topic: "电学 · 电路",
      q: "闭合电路欧姆定律的公式是什么？路端电压与外电阻的关系如何？",
      a: "\\( I = \\dfrac{E}{R + r} \\)。\\n路端电压 \\( U = E - Ir = IR \\)。\\n外电阻增大时，电流减小，路端电压增大。"
    },

    // ===== 化学 =====
    {
      subject: "化学",
      topic: "基础 · 物质的量",
      q: "物质的量 n 与质量 m、摩尔质量 M、微粒数 N 的关系式是什么？",
      a: "\\( n = \\dfrac{m}{M} = \\dfrac{N}{N_A} = \\dfrac{V}{V_m} \\)（气体）。\\n\\( N_A \\approx 6.02 \\times 10^{23}\\,\\mathrm{mol^{-1}} \\)。标准状况下 \\( V_m = 22.4\\,\\mathrm{L/mol} \\)。"
    },
    {
      subject: "化学",
      topic: "反应原理 · 化学平衡",
      q: "勒夏特列原理的内容是什么？升高温度平衡向哪个方向移动？",
      a: "如果改变影响平衡的一个条件，平衡就向能够减弱这种改变的方向移动。\\n升高温度 → 平衡向吸热方向移动。"
    },
    {
      subject: "化学",
      topic: "反应原理 · 电离",
      q: "水的离子积 \\( K_w \\) 在 25°C 时等于多少？pH 的定义是什么？",
      a: "\\( K_w = [H^+][OH^-] = 1.0 \\times 10^{-14} \\)（25°C）。\\n\\( \\mathrm{pH} = -\\lg[H^+] \\)。"
    },
    {
      subject: "化学",
      topic: "有机 · 官能团",
      q: "醛基的特征反应有哪些？如何检验醛基？",
      a: "醛基可发生氧化反应（如银镜反应、与新制 \\( Cu(OH)_2 \\) 反应）和还原反应（加成氢气等）。\\n检验：银镜反应或与新制氢氧化铜悬浊液共热产生砖红色沉淀。"
    },
    {
      subject: "化学",
      topic: "基础 · 氧化还原",
      q: "氧化还原反应的本质是什么？如何判断氧化剂和还原剂？",
      a: "本质是电子转移（或偏移）。\\n氧化剂：得电子、化合价降低的物质。\\n还原剂：失电子、化合价升高的物质。"
    },
    {
      subject: "化学",
      topic: "电化学 · 原电池",
      q: "原电池中，负极和正极分别发生什么反应？电子如何流动？",
      a: "负极：氧化反应（失电子）。\\n正极：还原反应（得电子）。\\n电子从负极经外电路流向正极。活泼金属一般作负极。"
    },

    // ===== 生物 =====
    {
      subject: "生物",
      topic: "细胞 · 结构",
      q: "线粒体和叶绿体的主要功能分别是什么？",
      a: "线粒体：有氧呼吸的主要场所，为细胞提供能量。\\n叶绿体：光合作用的场所，将光能转化为化学能。"
    },
    {
      subject: "生物",
      topic: "细胞 · 呼吸光合",
      q: "有氧呼吸的总反应式是什么？分为哪三个阶段？",
      a: "\\( C_6H_{12}O_6 + 6O_2 + 6H_2O \\rightarrow 6CO_2 + 12H_2O + \\text{能量} \\)。\\n三个阶段：糖酵解（细胞质基质）、丙酮酸氧化与三羧酸循环（线粒体基质）、电子传递链（线粒体内膜）。"
    },
    {
      subject: "生物",
      topic: "遗传 · 分离定律",
      q: "孟德尔分离定律的内容是什么？杂合子自交后代性状分离比约为多少？",
      a: "一对等位基因在减数分裂时分离，分别进入不同配子。\\n杂合子自交后代性状分离比约为 \\( 3:1 \\)。"
    },
    {
      subject: "生物",
      topic: "遗传 · 中心法则",
      q: "中心法则描述的遗传信息流动方向是什么？",
      a: "DNA → RNA → 蛋白质（转录与翻译）。\\n补充：逆转录（RNA → DNA）与 RNA 复制。"
    },
    {
      subject: "生物",
      topic: "稳态 · 免疫",
      q: "人体的三道防线分别是什么？特异性免疫包括哪两种？",
      a: "第一道：皮肤、黏膜。\\n第二道：体液中的杀菌物质和吞噬细胞（非特异性）。\\n第三道：免疫系统（特异性免疫）。\\n特异性免疫：体液免疫（B 细胞，产生抗体）和细胞免疫（T 细胞）。"
    },
    {
      subject: "生物",
      topic: "生态 · 能量流动",
      q: "生态系统中能量流动的特点是什么？相邻营养级间传递效率大约是多少？",
      a: "特点：单向流动、逐级递减。\\n相邻营养级间传递效率大约为 10%～20%。"
    },

    // ===== 英语 =====
    {
      subject: "英语",
      topic: "语法 · 时态",
      q: "现在完成时的基本结构是什么？主要表示什么含义？",
      a: "结构：have/has + 过去分词。\\n主要表示：过去发生的动作对现在造成的影响或结果，或从过去持续到现在的动作/状态。"
    },
    {
      subject: "英语",
      topic: "语法 · 非谓语",
      q: "不定式、动名词、现在分词、过去分词在语态和时态意义上有何区别？",
      a: "不定式 to do：目的、将来、具体。\\n动名词 doing：习惯、抽象、名词性。\\n现在分词 doing：主动、进行。\\n过去分词 done：被动、完成。"
    },
    {
      subject: "英语",
      topic: "语法 · 虚拟语气",
      q: "与现在事实相反的虚拟条件句，从句和主句的动词形式分别是什么？",
      a: "从句：If + 主语 + 过去式（be 常用 were）。\\n主句：主语 + would/could/might + 动词原形。"
    },
    {
      subject: "英语",
      topic: "词汇 · 构词",
      q: "前缀 un-/in-/im-/il-/ir- 通常表示什么含义？举两个例子。",
      a: "表示“不、否定”。\\n例如：unhappy（不高兴的）、impossible（不可能的）、illegal（非法的）、irregular（不规则的）。"
    },
    {
      subject: "英语",
      topic: "语法 · 从句",
      q: "定语从句的关系词有哪些？that 和 which 在限制性定语从句中修饰物时有何注意点？",
      a: "关系词：who, whom, whose, which, that, when, where, why 等。\\n修饰物时 that 和 which 常可互换；但在介词后、非限制性定语从句中一般只用 which，不用 that。"
    },
    {
      subject: "英语",
      topic: "写作 · 衔接",
      q: "写出至少四个表示“因果”或“转折”的英语连接词/短语。",
      a: "因果：because, so, therefore, as a result, consequently。\\n转折：but, however, yet, although, nevertheless, on the other hand。"
    }
  ];

  function $(id) {
    return document.getElementById(id);
  }

  function renderMath(el) {
    if (window.MathJax && MathJax.typesetPromise) {
      MathJax.typesetPromise([el]).catch(() => {});
    }
  }

  function formatText(text) {
    return text
      .replace(/\\n/g, "<br>")
      .replace(/\n/g, "<br>");
  }

  function getFiltered() {
    const subject = $("quiz-subject")?.value || "全部";
    if (subject === "全部") return QUESTIONS.slice();
    return QUESTIONS.filter((q) => q.subject === subject);
  }

  let current = null;

  function updateWrongBtn() {
    const btn = $("quiz-btn-wrong");
    if (!btn) return;
    const user = window.KBAuth && KBAuth.currentUser();
    if (!user) {
      btn.disabled = false;
      btn.textContent = "加入错题本（需登录）";
      btn.classList.remove("is-added");
      return;
    }
    if (!current) {
      btn.disabled = true;
      return;
    }
    const id = KBAuth.questionId(current);
    const exists = KBAuth.getWrongBook().some((item) => item.id === id);
    btn.disabled = false;
    if (exists) {
      btn.textContent = "已在错题本";
      btn.classList.add("is-added");
    } else {
      btn.textContent = "加入错题本";
      btn.classList.remove("is-added");
    }
  }

  function pickQuestion() {
    const pool = getFiltered();
    if (!pool.length) {
      current = null;
      $("quiz-question").innerHTML = "该学科暂无题目，请切换其他学科。";
      $("quiz-meta").textContent = "";
      $("quiz-answer-box").hidden = true;
      $("quiz-btn-answer").disabled = true;
      updateWrongBtn();
      return;
    }

    let idx;
    if (pool.length === 1) {
      idx = 0;
    } else {
      do {
        idx = Math.floor(Math.random() * pool.length);
      } while (pool[idx] === current && pool.length > 1);
    }

    current = pool[idx];

    $("quiz-meta").textContent = current.subject + "  ·  " + current.topic;
    $("quiz-question").innerHTML = formatText(current.q);
    $("quiz-answer").innerHTML = formatText(current.a);
    $("quiz-answer-box").hidden = true;
    $("quiz-btn-answer").disabled = false;
    $("quiz-btn-answer").textContent = "显示答案";

    updateWrongBtn();
    renderMath($("quiz-card"));
  }

  function toggleAnswer() {
    if (!current) return;
    const box = $("quiz-answer-box");
    if (box.hidden) {
      box.hidden = false;
      $("quiz-btn-answer").textContent = "隐藏答案";
      renderMath(box);
    } else {
      box.hidden = true;
      $("quiz-btn-answer").textContent = "显示答案";
    }
  }

  function addWrong() {
    if (!current) return;
    if (!window.KBAuth) return;

    if (!KBAuth.currentUser()) {
      KBAuth.openModal();
      return;
    }

    const result = KBAuth.addToWrongBook(current);
    updateWrongBtn();

    const tip = $("quiz-wrong-tip");
    if (tip) {
      if (result.reason === "exists") {
        tip.textContent = "该题已在错题本中";
      } else if (result.ok) {
        tip.textContent = "已加入错题本（当前共 " + result.count + " 题）";
      } else {
        tip.textContent = "加入失败，请先登录";
      }
      tip.hidden = false;
      clearTimeout(tip._t);
      tip._t = setTimeout(() => {
        tip.hidden = true;
      }, 2200);
    }

    if (window.KBAuth.renderHeaderAuth) KBAuth.renderHeaderAuth();
  }

  function init() {
    const root = $("quiz-app");
    if (!root) return;

    // 避免重复绑定：用一次性标记
    if (root.dataset.quizBound === "1") {
      pickQuestion();
      return;
    }
    root.dataset.quizBound = "1";

    $("quiz-btn-next")?.addEventListener("click", pickQuestion);
    $("quiz-btn-answer")?.addEventListener("click", toggleAnswer);
    $("quiz-subject")?.addEventListener("change", pickQuestion);
    $("quiz-btn-wrong")?.addEventListener("click", addWrong);

    window.addEventListener("kb-auth-change", updateWrongBtn);

    const countEl = $("quiz-count");
    if (countEl) countEl.textContent = QUESTIONS.length;

    pickQuestion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(() => {
      // 允许重新 init（清除标记）
      const root = document.getElementById("quiz-app");
      if (root) root.dataset.quizBound = "0";
      setTimeout(init, 0);
    });
  }
})();
