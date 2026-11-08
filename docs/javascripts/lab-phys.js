/**
 * 物理实验台 — 简易电路模拟
 */
(function () {
  var PARTS = [
    { id: "battery", name: "电源 3V", kind: "battery", V: 3, icon: "电" },
    { id: "switch", name: "开关", kind: "switch", closed: true, icon: "开" },
    { id: "bulb", name: "小灯泡 3Ω", kind: "bulb", R: 3, icon: "泡" },
    { id: "resistor", name: "电阻 6Ω", kind: "resistor", R: 6, icon: "阻" },
    { id: "resistor2", name: "电阻 12Ω", kind: "resistor", R: 12, icon: "阻" },
    { id: "ammeter", name: "电流表", kind: "meter", icon: "A" },
    { id: "wire", name: "导线", kind: "wire", R: 0, icon: "线" }
  ];

  var state = {
    pieces: [],
    selectedId: null,
    log: [],
    uid: 1
  };

  function $(id) {
    return document.getElementById(id);
  }

  function findDef(id) {
    for (var i = 0; i < PARTS.length; i++) if (PARTS[i].id === id) return PARTS[i];
    return null;
  }

  function setMsg(text, ok) {
    var el = $("lab-phys-msg");
    if (!el) return;
    el.textContent = text || "";
    el.className = "lab-msg" + (text ? (ok ? " ok" : " err") : "");
  }

  function log(msg) {
    state.log.unshift({ t: new Date().toLocaleTimeString(), msg: msg });
    if (state.log.length > 40) state.log.pop();
    var ul = $("lab-phys-log");
    if (!ul) return;
    ul.innerHTML = state.log
      .map(function (x) {
        return "<li><strong>" + x.t + "</strong> " + x.msg + "</li>";
      })
      .join("");
  }

  function renderPalette() {
    var box = $("lab-phys-palette");
    if (!box) return;
    box.innerHTML = PARTS.map(function (it) {
      return (
        '<div class="lab-item" draggable="true" data-def="' +
        it.id +
        '"><span class="lab-item-icon ph">' +
        it.icon +
        "</span><span>" +
        it.name +
        "</span></div>"
      );
    }).join("");
    box.querySelectorAll(".lab-item").forEach(function (el) {
      el.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text/lab-def", el.getAttribute("data-def"));
      });
      el.addEventListener("click", function () {
        addPiece(el.getAttribute("data-def"));
      });
    });
  }

  function addPiece(defId) {
    var def = findDef(defId);
    if (!def) return;
    var p = {
      id: String(state.uid++),
      defId: defId,
      closed: def.kind === "switch" ? true : undefined
    };
    state.pieces.push(p);
    state.selectedId = p.id;
    log("添加：" + def.name);
    renderBench();
  }

  function getPiece(id) {
    for (var i = 0; i < state.pieces.length; i++) {
      if (state.pieces[i].id === id) return state.pieces[i];
    }
    return null;
  }

  function renderBench() {
    var bench = $("lab-phys-bench");
    if (!bench) return;
    if (!state.pieces.length) {
      bench.innerHTML = '<p class="lab-bench-hint">将元件拖到电路板</p>';
      return;
    }
    bench.innerHTML = state.pieces
      .map(function (p) {
        var def = findDef(p.defId) || {};
        var cls = "lab-piece phys";
        if (p.id === state.selectedId) cls += " is-selected";
        if (def.kind === "bulb" && p.lit) cls += " is-lit";
        var body = def.name;
        if (def.kind === "switch") {
          body += p.closed ? "（闭合）" : "（断开）";
        }
        if (def.kind === "bulb" && p.lit) body += " 亮";
        return (
          '<div class="' +
          cls +
          '" data-id="' +
          p.id +
          '"><div class="lab-piece-title">' +
          (def.icon || "?") +
          " " +
          (def.kind || "") +
          '</div><div class="lab-piece-body">' +
          body +
          "</div></div>"
        );
      })
      .join("");
    bench.querySelectorAll(".lab-piece").forEach(function (el) {
      el.onclick = function () {
        var id = el.getAttribute("data-id");
        var p = getPiece(id);
        state.selectedId = id;
        var def = findDef(p.defId);
        if (def && def.kind === "switch") {
          p.closed = !p.closed;
          log("开关 → " + (p.closed ? "闭合" : "断开"));
          analyze();
        }
        renderBench();
      };
    });
  }

  function analyze() {
    var hasBattery = false;
    var V = 0;
    var openSwitch = false;
    var Rsum = 0;
    var hasLoad = false;
    var bulbs = [];

    state.pieces.forEach(function (p) {
      var d = findDef(p.defId);
      if (!d) return;
      if (d.kind === "battery") {
        hasBattery = true;
        V += d.V || 0;
      }
      if (d.kind === "switch" && p.closed === false) openSwitch = true;
      if (d.kind === "bulb" || d.kind === "resistor") {
        hasLoad = true;
        Rsum += d.R || 0;
        if (d.kind === "bulb") bulbs.push(p);
      }
    });

    var el = $("lab-phys-result");
    bulbs.forEach(function (b) {
      b.lit = false;
    });

    if (!hasBattery) {
      if (el)
        el.textContent =
          "未检测到电源。请添加电源后组成闭合回路。\n\n欧姆定律：I = U / R";
      renderBench();
      return;
    }
    if (openSwitch) {
      if (el)
        el.textContent =
          "开关断开 → 断路，电流 I = 0。\n电源电压 U = " +
          V +
          " V（断路时外电路无电流）。";
      log("分析：断路");
      renderBench();
      return;
    }
    if (!hasLoad || Rsum <= 0) {
      if (el)
        el.textContent =
          "警告：可能发生短路（电源被导线/开关直接连通且无有效电阻）！\n请接入灯泡或电阻。\n电源 U = " +
          V +
          " V";
      log("分析：短路风险");
      renderBench();
      return;
    }

    var I = V / Rsum;
    bulbs.forEach(function (b) {
      b.lit = I > 0.05;
    });
    if (el) {
      el.textContent =
        "串联模型估算：\n" +
        "总电压 U = " +
        V +
        " V\n" +
        "总电阻 R = " +
        Rsum +
        " Ω\n" +
        "电流 I = U/R = " +
        I.toFixed(3) +
        " A\n" +
        (bulbs.length
          ? "灯泡：" + (I > 0.05 ? "发光" : "电流过小，几乎不亮")
          : "无灯泡");
    }
    log("分析：I ≈ " + I.toFixed(3) + " A");
    renderBench();
    setMsg("分析完成", true);
  }

  function snapshot() {
    return {
      kind: "physics",
      title: ($("lab-phys-title") && $("lab-phys-title").value) || "未命名电路实验",
      pieces: state.pieces,
      uid: state.uid,
      log: state.log.slice(0, 20)
    };
  }

  function restore(data) {
    if (!data) return;
    state.pieces = data.pieces || [];
    state.uid = data.uid || state.pieces.length + 1;
    state.log = data.log || [];
    state.selectedId = null;
    if ($("lab-phys-title") && data.title) $("lab-phys-title").value = data.title;
    renderBench();
    var ul = $("lab-phys-log");
    if (ul) {
      ul.innerHTML = state.log
        .map(function (x) {
          return "<li><strong>" + x.t + "</strong> " + x.msg + "</li>";
        })
        .join("");
    }
  }

  function getClient() {
    return window.KBAuth && KBAuth.ensureClient ? KBAuth.ensureClient() : null;
  }

  async function saveCloud() {
    var user = KBAuth && KBAuth.currentUserFull && KBAuth.currentUserFull();
    if (!user) {
      setMsg("请先登录后再保存", false);
      if (KBAuth && KBAuth.openModal) KBAuth.openModal();
      return;
    }
    var sb = getClient();
    if (!sb) {
      setMsg("无法连接后端", false);
      return;
    }
    var payload = snapshot();
    try {
      var ins = await sb.from("lab_projects").insert({
        user_id: user.id,
        kind: "physics",
        title: payload.title,
        state: payload
      });
      if (ins.error) {
        setMsg("保存失败：" + (ins.error.message || "请先建表 lab_projects"), false);
        return;
      }
      setMsg("已保存到云端", true);
      log("云端保存：" + payload.title);
    } catch (e) {
      setMsg("保存异常", false);
    }
  }

  async function loadCloud() {
    var user = KBAuth && KBAuth.currentUserFull && KBAuth.currentUserFull();
    if (!user) {
      setMsg("请先登录", false);
      if (KBAuth && KBAuth.openModal) KBAuth.openModal();
      return;
    }
    var sb = getClient();
    if (!sb) {
      setMsg("无法连接后端", false);
      return;
    }
    try {
      var res = await sb
        .from("lab_projects")
        .select("state, title, updated_at")
        .eq("user_id", user.id)
        .eq("kind", "physics")
        .order("updated_at", { ascending: false })
        .limit(1);
      if (res.error) {
        setMsg("读取失败：" + (res.error.message || ""), false);
        return;
      }
      if (!res.data || !res.data.length) {
        setMsg("云端暂无物理实验存档", false);
        return;
      }
      restore(res.data[0].state);
      setMsg("已读取：" + (res.data[0].title || ""), true);
    } catch (e) {
      setMsg("读取异常", false);
    }
  }

  function bind() {
    if (!$("lab-phys-app") || $("lab-phys-app").dataset.bound === "1") return;
    $("lab-phys-app").dataset.bound = "1";
    var bench = $("lab-phys-bench");
    if (bench && bench.dataset.dropBound !== "1") {
      bench.dataset.dropBound = "1";
      bench.addEventListener("dragover", function (e) {
        e.preventDefault();
        bench.classList.add("is-dragover");
      });
      bench.addEventListener("dragleave", function () {
        bench.classList.remove("is-dragover");
      });
      bench.addEventListener("drop", function (e) {
        e.preventDefault();
        bench.classList.remove("is-dragover");
        var defId = e.dataTransfer.getData("text/lab-def");
        if (defId) addPiece(defId);
      });
    }
    if ($("lab-phys-analyze")) $("lab-phys-analyze").onclick = analyze;
    if ($("lab-phys-remove"))
      $("lab-phys-remove").onclick = function () {
        if (!state.selectedId) return;
        state.pieces = state.pieces.filter(function (p) {
          return p.id !== state.selectedId;
        });
        state.selectedId = null;
        renderBench();
      };
    if ($("lab-phys-clear"))
      $("lab-phys-clear").onclick = function () {
        state.pieces = [];
        state.selectedId = null;
        if ($("lab-phys-result"))
          $("lab-phys-result").textContent = "放置元件后点击「分析电路」";
        log("清空电路");
        renderBench();
      };
    if ($("lab-phys-save")) $("lab-phys-save").onclick = saveCloud;
    if ($("lab-phys-load")) $("lab-phys-load").onclick = loadCloud;
  }

  function boot() {
    if (!$("lab-phys-app")) return;
    bind();
    renderPalette();
    renderBench();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      var root = document.getElementById("lab-phys-app");
      if (root) root.dataset.bound = "0";
      var bench = document.getElementById("lab-phys-bench");
      if (bench) bench.dataset.dropBound = "0";
      setTimeout(boot, 0);
    });
  }
})();
