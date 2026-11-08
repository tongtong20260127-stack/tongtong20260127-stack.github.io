/**
 * 化学实验台 — 拖放器材/试剂、倾倒混合、反应方程式
 * 数据与逻辑合一；若需扩展反应，在 REACTIONS 中追加规则即可。
 */
(function () {
  var EQUIPMENT = [
    { id: "beaker", name: "烧杯", kind: "vessel", cat: "器材", icon: "杯" },
    { id: "tube", name: "试管", kind: "vessel", cat: "器材", icon: "管" },
    { id: "flask", name: "锥形瓶", kind: "vessel", cat: "器材", icon: "瓶" },
    { id: "dropper", name: "滴管", kind: "tool", cat: "器材", icon: "滴" },
    { id: "rod", name: "玻璃棒", kind: "tool", cat: "器材", icon: "棒" },
    { id: "stand", name: "铁架台", kind: "tool", cat: "器材", icon: "架" }
  ];

  var REAGENTS = [
    { id: "HCl", name: "盐酸 HCl", formula: "HCl", cat: "试剂", icon: "酸", color: "#e3f2fd" },
    { id: "H2SO4", name: "硫酸 H2SO4", formula: "H2SO4", cat: "试剂", icon: "酸", color: "#fff8e1" },
    { id: "HNO3", name: "硝酸 HNO3", formula: "HNO3", cat: "试剂", icon: "酸", color: "#fce4ec" },
    { id: "NaOH", name: "氢氧化钠 NaOH", formula: "NaOH", cat: "试剂", icon: "碱", color: "#e8f5e9" },
    { id: "CaOH2", name: "氢氧化钙 Ca(OH)2", formula: "Ca(OH)2", cat: "试剂", icon: "碱", color: "#f1f8e9" },
    { id: "BaOH2", name: "氢氧化钡 Ba(OH)2", formula: "Ba(OH)2", cat: "试剂", icon: "碱", color: "#f9fbe7" },
    { id: "CuSO4", name: "硫酸铜 CuSO4", formula: "CuSO4", cat: "试剂", icon: "盐", color: "#bbdefb" },
    { id: "AgNO3", name: "硝酸银 AgNO3", formula: "AgNO3", cat: "试剂", icon: "盐", color: "#f5f5f5" },
    { id: "Na2CO3", name: "碳酸钠 Na2CO3", formula: "Na2CO3", cat: "试剂", icon: "盐", color: "#efebe9" },
    { id: "NaCl", name: "氯化钠 NaCl", formula: "NaCl", cat: "试剂", icon: "盐", color: "#fafafa" },
    { id: "BaCl2", name: "氯化钡 BaCl2", formula: "BaCl2", cat: "试剂", icon: "盐", color: "#eceff1" },
    { id: "FeCl3", name: "氯化铁 FeCl3", formula: "FeCl3", cat: "试剂", icon: "盐", color: "#ffe0b2" },
    { id: "KSCN", name: "硫氰化钾 KSCN", formula: "KSCN", cat: "试剂", icon: "盐", color: "#f3e5f5" },
    { id: "H2O2", name: "过氧化氢 H2O2", formula: "H2O2", cat: "试剂", icon: "氧", color: "#e0f7fa" },
    { id: "phen", name: "酚酞试液", formula: "phen", cat: "试剂", icon: "指", color: "#fce4ec" },
    { id: "Zn", name: "锌粒 Zn", formula: "Zn", cat: "试剂", icon: "Zn", color: "#cfd8dc" },
    { id: "Fe", name: "铁钉 Fe", formula: "Fe", cat: "试剂", icon: "Fe", color: "#b0bec5" },
    { id: "Cu", name: "铜片 Cu", formula: "Cu", cat: "试剂", icon: "Cu", color: "#ffab91" },
    { id: "CaCO3", name: "大理石 CaCO3", formula: "CaCO3", cat: "试剂", icon: "石", color: "#eeeeee" },
    { id: "MnO2", name: "二氧化锰 MnO2", formula: "MnO2", cat: "试剂", icon: "催", color: "#424242" }
  ];

  var REACTIONS = [
    { need: ["HCl", "NaOH"], consume: { HCl: 1, NaOH: 1 }, produce: { NaCl: 1, H2O: 1 }, chem: "HCl + NaOH = NaCl + H2O", ionic: "H+ + OH- = H2O", note: "酸碱中和。" },
    { need: ["H2SO4", "NaOH"], consume: { H2SO4: 1, NaOH: 2 }, produce: { Na2SO4: 1, H2O: 2 }, chem: "H2SO4 + 2NaOH = Na2SO4 + 2H2O", ionic: "H+ + OH- = H2O", note: "硫酸中和。" },
    { need: ["H2SO4", "BaOH2"], consume: { H2SO4: 1, BaOH2: 1 }, produce: { BaSO4: 1, H2O: 2 }, chem: "H2SO4 + Ba(OH)2 = BaSO4↓ + 2H2O", ionic: "Ba2+ + SO42- = BaSO4↓", note: "白色沉淀。", precipitate: "BaSO4" },
    { need: ["H2SO4", "BaCl2"], consume: { H2SO4: 1, BaCl2: 1 }, produce: { BaSO4: 1, HCl: 2 }, chem: "H2SO4 + BaCl2 = BaSO4↓ + 2HCl", ionic: "Ba2+ + SO42- = BaSO4↓", note: "检验硫酸根。", precipitate: "BaSO4" },
    { need: ["CuSO4", "NaOH"], consume: { CuSO4: 1, NaOH: 2 }, produce: { CuOH2: 1, Na2SO4: 1 }, chem: "CuSO4 + 2NaOH = Cu(OH)2↓ + Na2SO4", ionic: "Cu2+ + 2OH- = Cu(OH)2↓", note: "蓝色絮状沉淀。", precipitate: "CuOH2", color: "#64b5f6" },
    { need: ["AgNO3", "HCl"], consume: { AgNO3: 1, HCl: 1 }, produce: { AgCl: 1, HNO3: 1 }, chem: "AgNO3 + HCl = AgCl↓ + HNO3", ionic: "Ag+ + Cl- = AgCl↓", note: "白色氯化银沉淀。", precipitate: "AgCl" },
    { need: ["AgNO3", "NaCl"], consume: { AgNO3: 1, NaCl: 1 }, produce: { AgCl: 1, NaNO3: 1 }, chem: "AgNO3 + NaCl = AgCl↓ + NaNO3", ionic: "Ag+ + Cl- = AgCl↓", note: "检验氯离子。", precipitate: "AgCl" },
    { need: ["Na2CO3", "HCl"], consume: { Na2CO3: 1, HCl: 2 }, produce: { NaCl: 2, CO2: 1, H2O: 1 }, chem: "Na2CO3 + 2HCl = 2NaCl + CO2↑ + H2O", ionic: "CO32- + 2H+ = CO2↑ + H2O", note: "有气泡（CO2）。", gas: "CO2" },
    { need: ["CaCO3", "HCl"], consume: { CaCO3: 1, HCl: 2 }, produce: { CaCl2: 1, CO2: 1, H2O: 1 }, chem: "CaCO3 + 2HCl = CaCl2 + CO2↑ + H2O", ionic: "CaCO3 + 2H+ = Ca2+ + CO2↑ + H2O", note: "大理石与盐酸。", gas: "CO2" },
    { need: ["Zn", "HCl"], consume: { Zn: 1, HCl: 2 }, produce: { ZnCl2: 1, H2: 1 }, chem: "Zn + 2HCl = ZnCl2 + H2↑", ionic: "Zn + 2H+ = Zn2+ + H2↑", note: "产生氢气。", gas: "H2" },
    { need: ["Fe", "HCl"], consume: { Fe: 1, HCl: 2 }, produce: { FeCl2: 1, H2: 1 }, chem: "Fe + 2HCl = FeCl2 + H2↑", ionic: "Fe + 2H+ = Fe2+ + H2↑", note: "铁与盐酸。", gas: "H2" },
    { need: ["Fe", "CuSO4"], consume: { Fe: 1, CuSO4: 1 }, produce: { FeSO4: 1, Cu: 1 }, chem: "Fe + CuSO4 = FeSO4 + Cu", ionic: "Fe + Cu2+ = Fe2+ + Cu", note: "置换出铜。", color: "#ef9a9a" },
    { need: ["Zn", "CuSO4"], consume: { Zn: 1, CuSO4: 1 }, produce: { ZnSO4: 1, Cu: 1 }, chem: "Zn + CuSO4 = ZnSO4 + Cu", ionic: "Zn + Cu2+ = Zn2+ + Cu", note: "锌置换铜。", color: "#ef9a9a" },
    { need: ["H2O2", "MnO2"], consume: { H2O2: 2 }, produce: { H2O: 2, O2: 1 }, chem: "2H2O2 --MnO2--> 2H2O + O2↑", ionic: "（催化分解）", note: "产生氧气。", gas: "O2" },
    { need: ["FeCl3", "KSCN"], consume: { FeCl3: 1, KSCN: 1 }, produce: { FeSCN: 1 }, chem: "Fe3+ + SCN- → [Fe(SCN)]2+（血红色）", ionic: "Fe3+ + SCN- = [Fe(SCN)]2+", note: "血红色，检验Fe3+。", color: "#c62828" },
    { need: ["NaOH", "phen"], consume: {}, produce: {}, chem: "酚酞遇碱变红", ionic: "—", note: "指示剂变色。", color: "#f48fb1", indicator: true },
    { need: ["CaOH2", "phen"], consume: {}, produce: {}, chem: "酚酞遇碱变红", ionic: "—", note: "指示剂变色。", color: "#f48fb1", indicator: true }
  ];

  var state = { pieces: [], selectedId: null, cat: "器材", log: [], uid: 1 };

  function $(id) { return document.getElementById(id); }
  function catalog() { return EQUIPMENT.concat(REAGENTS); }
  function findDef(id) {
    for (var i = 0; i < catalog().length; i++) if (catalog()[i].id === id) return catalog()[i];
    return null;
  }
  function setMsg(text, ok) {
    var el = $("lab-chem-msg");
    if (!el) return;
    el.textContent = text || "";
    el.className = "lab-msg" + (text ? (ok ? " ok" : " err") : "");
  }
  function log(msg) {
    state.log.unshift({ t: new Date().toLocaleTimeString(), msg: msg });
    if (state.log.length > 40) state.log.pop();
    renderLog();
  }
  function renderLog() {
    var ul = $("lab-chem-log");
    if (!ul) return;
    ul.innerHTML = state.log.map(function (x) {
      return "<li><strong>" + x.t + "</strong> " + x.msg + "</li>";
    }).join("");
  }
  function setEq(chem, ionic) {
    var el = $("lab-chem-eq");
    if (!el) return;
    if (!chem) { el.textContent = "尚无反应"; return; }
    el.textContent = "化学方程式：\n" + chem + "\n\n离子方程式：\n" + (ionic || "—");
  }
  function renderCats() {
    var box = $("lab-chem-cats");
    if (!box) return;
    box.innerHTML = ["器材", "试剂"].map(function (c) {
      return '<button type="button" class="lab-cat-btn' + (state.cat === c ? " is-on" : "") + '" data-cat="' + c + '">' + c + "</button>";
    }).join("");
    box.querySelectorAll("[data-cat]").forEach(function (btn) {
      btn.onclick = function () { state.cat = btn.getAttribute("data-cat"); renderCats(); renderPalette(); };
    });
  }
  function renderPalette() {
    var box = $("lab-chem-palette");
    if (!box) return;
    var items = catalog().filter(function (x) { return x.cat === state.cat; });
    box.innerHTML = items.map(function (it) {
      var ic = it.kind === "vessel" || it.kind === "tool" ? "eq" : "re";
      return '<div class="lab-item" draggable="true" data-def="' + it.id + '"><span class="lab-item-icon ' + ic + '">' + (it.icon || "?") + "</span><span>" + it.name + "</span></div>";
    }).join("");
    box.querySelectorAll(".lab-item").forEach(function (el) {
      el.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text/lab-def", el.getAttribute("data-def"));
      });
      el.addEventListener("click", function () { addPiece(el.getAttribute("data-def")); });
    });
  }
  function pieceLabel(p) { return (findDef(p.defId) || {}).name || p.defId; }
  function contentText(p) {
    var keys = Object.keys(p.content || {});
    if (!keys.length) return "（空）";
    return keys.map(function (k) { return k + "×" + p.content[k]; }).join("，");
  }
  function renderBench() {
    var bench = $("lab-chem-bench");
    if (!bench) return;
    if (!state.pieces.length) {
      bench.innerHTML = '<p class="lab-bench-hint">将器材或试剂拖到此处</p>';
    } else {
      bench.innerHTML = state.pieces.map(function (p) {
        var def = findDef(p.defId) || {};
        var cls = "lab-piece";
        if (p.id === state.selectedId) cls += " is-selected";
        if (p.precipitate) cls += " has-precipitate";
        if (p.gas) cls += " has-gas";
        if (p.hot) cls += " is-hot";
        var style = p.color ? ' style="background:' + p.color + '"' : "";
        return '<div class="' + cls + '" data-id="' + p.id + '"' + style + '><div class="lab-piece-title">' + (def.name || p.defId) + '</div><div class="lab-piece-body">' + (def.kind === "vessel" || def.cat === "试剂" ? contentText(p) : (def.kind === "tool" ? "工具" : "")) + (p.note ? "<br>" + p.note : "") + "</div>" + (p.hot ? '<span class="lab-piece-badge">热</span>' : "") + "</div>";
      }).join("");
      bench.querySelectorAll(".lab-piece").forEach(function (el) {
        el.onclick = function () { state.selectedId = el.getAttribute("data-id"); renderBench(); fillSelects(); };
      });
    }
    fillSelects();
  }
  function fillSelects() {
    var vessels = state.pieces.filter(function (p) {
      var d = findDef(p.defId);
      return d && (d.kind === "vessel" || d.cat === "试剂");
    });
    function opts(sel, withEmpty) {
      var el = $(sel);
      if (!el) return;
      var cur = el.value;
      el.innerHTML = (withEmpty ? '<option value="">（无）</option>' : "") + vessels.map(function (p) {
        return '<option value="' + p.id + '">' + pieceLabel(p) + " #" + p.id + "</option>";
      }).join("");
      if (cur) el.value = cur;
      if (state.selectedId) el.value = state.selectedId;
    }
    opts("lab-chem-target", false);
    opts("lab-chem-source", true);
  }
  function addPiece(defId) {
    var def = findDef(defId);
    if (!def) return;
    var p = { id: String(state.uid++), defId: defId, content: {}, color: def.color || null, precipitate: false, gas: false, hot: false, note: "" };
    if (def.cat === "试剂") p.content[def.formula || def.id] = 1;
    state.pieces.push(p);
    state.selectedId = p.id;
    log("添加：" + def.name);
    renderBench();
  }
  function getPiece(id) {
    for (var i = 0; i < state.pieces.length; i++) if (state.pieces[i].id === id) return state.pieces[i];
    return null;
  }
  function speciesOf(p) {
    return Object.keys(p.content || {}).filter(function (k) { return p.content[k] > 0; });
  }
  function tryReact(p) {
    var set = {};
    speciesOf(p).forEach(function (s) { set[s] = true; });
    var def = findDef(p.defId);
    if (def && def.cat === "试剂" && def.formula) set[def.formula] = true;
    var matched = null;
    for (var i = 0; i < REACTIONS.length; i++) {
      var r = REACTIONS[i];
      var ok = true;
      for (var j = 0; j < r.need.length; j++) if (!set[r.need[j]]) { ok = false; break; }
      if (ok) { matched = r; break; }
    }
    if (!matched) return false;
    Object.keys(matched.consume || {}).forEach(function (k) {
      if (p.content[k]) {
        p.content[k] -= matched.consume[k];
        if (p.content[k] <= 0) delete p.content[k];
      }
    });
    Object.keys(matched.produce || {}).forEach(function (k) {
      p.content[k] = (p.content[k] || 0) + matched.produce[k];
    });
    if (matched.precipitate) p.precipitate = true;
    if (matched.gas) p.gas = true;
    if (matched.color) p.color = matched.color;
    if (matched.indicator) p.note = "指示剂变色";
    setEq(matched.chem, matched.ionic);
    log("反应：" + matched.chem + " — " + matched.note);
    return true;
  }
  function pour() {
    var tid = $("lab-chem-target") && $("lab-chem-target").value;
    var sid = $("lab-chem-source") && $("lab-chem-source").value;
    if (!tid || !sid || sid === tid) { setMsg("请选择不同的来源与目标", false); return; }
    var target = getPiece(tid), source = getPiece(sid);
    if (!target || !source) return;
    var keys = speciesOf(source);
    if (!keys.length) { setMsg("来源为空", false); return; }
    keys.forEach(function (k) {
      target.content[k] = (target.content[k] || 0) + source.content[k];
      delete source.content[k];
    });
    source.precipitate = false; source.gas = false; source.note = "";
    log("倾倒：" + pieceLabel(source) + " → " + pieceLabel(target));
    tryReact(target);
    renderBench();
    setMsg("已倾倒混合", true);
  }
  function heat() {
    var tid = $("lab-chem-target") && $("lab-chem-target").value;
    var p = getPiece(tid);
    if (!p) { setMsg("请选择容器", false); return; }
    p.hot = true;
    if (p.content.H2O2 && p.content.MnO2) tryReact(p);
    else if (p.content.H2O2) { p.gas = true; setEq("2H2O2 = 2H2O + O2↑（加热促进）", "—"); log("加热过氧化氢"); }
    else log("加热：" + pieceLabel(p));
    renderBench();
    setMsg("已加热", true);
  }
  function emptyVessel() {
    var tid = $("lab-chem-target") && $("lab-chem-target").value;
    var p = getPiece(tid);
    if (!p) return;
    p.content = {}; p.precipitate = false; p.gas = false; p.hot = false; p.note = "";
    p.color = (findDef(p.defId) || {}).color || null;
    log("清空：" + pieceLabel(p));
    setEq(null);
    renderBench();
  }
  function removeSelected() {
    var tid = state.selectedId || ($("lab-chem-target") && $("lab-chem-target").value);
    if (!tid) return;
    state.pieces = state.pieces.filter(function (p) { return p.id !== tid; });
    if (state.selectedId === tid) state.selectedId = null;
    log("移出 #" + tid);
    renderBench();
  }
  function snapshot() {
    return {
      kind: "chemistry",
      title: ($("lab-chem-title") && $("lab-chem-title").value) || "未命名化学实验",
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
    if ($("lab-chem-title") && data.title) $("lab-chem-title").value = data.title;
    renderBench(); renderLog();
  }
  function getClient() {
    return window.KBAuth && KBAuth.ensureClient ? KBAuth.ensureClient() : null;
  }
  async function saveCloud() {
    var user = KBAuth && KBAuth.currentUserFull && KBAuth.currentUserFull();
    if (!user) { setMsg("请先登录后再保存", false); if (KBAuth && KBAuth.openModal) KBAuth.openModal(); return; }
    var sb = getClient();
    if (!sb) { setMsg("无法连接后端", false); return; }
    var payload = snapshot();
    try {
      var ins = await sb.from("lab_projects").insert({ user_id: user.id, kind: "chemistry", title: payload.title, state: payload });
      if (ins.error) { setMsg("保存失败：" + (ins.error.message || "请先建表 lab_projects"), false); return; }
      setMsg("已保存到云端", true);
      log("云端保存：" + payload.title);
    } catch (e) { setMsg("保存异常", false); }
  }
  async function loadCloud() {
    var user = KBAuth && KBAuth.currentUserFull && KBAuth.currentUserFull();
    if (!user) { setMsg("请先登录", false); if (KBAuth && KBAuth.openModal) KBAuth.openModal(); return; }
    var sb = getClient();
    if (!sb) { setMsg("无法连接后端", false); return; }
    try {
      var res = await sb.from("lab_projects").select("state, title, updated_at").eq("user_id", user.id).eq("kind", "chemistry").order("updated_at", { ascending: false }).limit(1);
      if (res.error) { setMsg("读取失败：" + (res.error.message || ""), false); return; }
      if (!res.data || !res.data.length) { setMsg("云端暂无化学实验存档", false); return; }
      restore(res.data[0].state);
      setMsg("已读取：" + (res.data[0].title || ""), true);
    } catch (e) { setMsg("读取异常", false); }
  }
  function bindDrop() {
    var bench = $("lab-chem-bench");
    if (!bench || bench.dataset.dropBound === "1") return;
    bench.dataset.dropBound = "1";
    bench.addEventListener("dragover", function (e) { e.preventDefault(); bench.classList.add("is-dragover"); });
    bench.addEventListener("dragleave", function () { bench.classList.remove("is-dragover"); });
    bench.addEventListener("drop", function (e) {
      e.preventDefault();
      bench.classList.remove("is-dragover");
      var defId = e.dataTransfer.getData("text/lab-def");
      if (defId) addPiece(defId);
    });
  }
  function bind() {
    if (!$("lab-chem-app") || $("lab-chem-app").dataset.bound === "1") return;
    $("lab-chem-app").dataset.bound = "1";
    if ($("lab-chem-pour")) $("lab-chem-pour").onclick = pour;
    if ($("lab-chem-heat")) $("lab-chem-heat").onclick = heat;
    if ($("lab-chem-empty")) $("lab-chem-empty").onclick = emptyVessel;
    if ($("lab-chem-remove")) $("lab-chem-remove").onclick = removeSelected;
    if ($("lab-chem-clear")) $("lab-chem-clear").onclick = function () {
      state.pieces = []; state.selectedId = null; setEq(null); log("清空台面"); renderBench();
    };
    if ($("lab-chem-save")) $("lab-chem-save").onclick = saveCloud;
    if ($("lab-chem-load")) $("lab-chem-load").onclick = loadCloud;
    bindDrop();
  }
  function boot() {
    if (!$("lab-chem-app")) return;
    bind(); renderCats(); renderPalette(); renderBench(); renderLog();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      var root = document.getElementById("lab-chem-app");
      if (root) root.dataset.bound = "0";
      var bench = document.getElementById("lab-chem-bench");
      if (bench) bench.dataset.dropBound = "0";
      setTimeout(boot, 0);
    });
  }
})();
