/**
 * 物理实验台（形象化）— SVG 电路元件
 */
(function () {
  var PARTS = [
    { id: "battery", name: "电源 3V", kind: "battery", V: 3, art: "battery" },
    { id: "switch", name: "开关", kind: "switch", art: "switch" },
    { id: "bulb", name: "小灯泡 3Ω", kind: "bulb", R: 3, art: "bulb" },
    { id: "resistor", name: "电阻 6Ω", kind: "resistor", R: 6, art: "resistor" },
    { id: "resistor2", name: "电阻 12Ω", kind: "resistor", R: 12, art: "resistor" },
    { id: "ammeter", name: "电流表", kind: "meter", art: "meter" },
    { id: "wire", name: "导线", kind: "wire", R: 0, art: "wire" }
  ];
  var state = { pieces: [], selectedId: null, log: [], uid: 1 };
  function $(id) { return document.getElementById(id); }
  function findDef(id) {
    for (var i = 0; i < PARTS.length; i++) if (PARTS[i].id === id) return PARTS[i];
    return null;
  }
  function svgBattery() {
    return '<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="14" width="48" height="32" rx="4" fill="#546e7a" stroke="#37474f" stroke-width="1.5"/><rect x="22" y="18" width="18" height="24" rx="2" fill="#263238"/><rect x="44" y="18" width="18" height="24" rx="2" fill="#eceff1"/><line x1="10" y1="30" x2="18" y2="30" stroke="#90a4ae" stroke-width="3"/><line x1="66" y1="30" x2="80" y2="30" stroke="#90a4ae" stroke-width="3"/><line x1="80" y1="22" x2="80" y2="38" stroke="#90a4ae" stroke-width="2"/><text x="31" y="34" text-anchor="middle" font-size="9" fill="#fff">−</text><text x="53" y="34" text-anchor="middle" font-size="10" fill="#333">+</text></svg>';
  }
  function svgSwitch(closed) {
    return '<svg viewBox="0 0 90 50" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="28" x2="28" y2="28" stroke="#90a4ae" stroke-width="3"/><circle cx="30" cy="28" r="4" fill="#78909c"/><circle cx="60" cy="28" r="4" fill="#78909c"/><line x1="62" y1="28" x2="82" y2="28" stroke="#90a4ae" stroke-width="3"/>' +
      (closed ? '<line x1="30" y1="28" x2="60" y2="28" stroke="#ffca28" stroke-width="3"/>' : '<line x1="30" y1="28" x2="52" y2="12" stroke="#ffca28" stroke-width="3"/>') + '</svg>';
  }
  function svgBulb(lit) {
    return '<svg viewBox="0 0 70 90" xmlns="http://www.w3.org/2000/svg"><ellipse cx="35" cy="32" rx="22" ry="26" fill="' + (lit ? '#fff59d' : '#eceff1') + '" stroke="#90a4ae" stroke-width="1.5"/>' +
      (lit ? '<ellipse cx="35" cy="30" rx="10" ry="12" fill="#ffecb3" opacity="0.9"/>' : '') +
      '<path d="M28 55 h14 v8 h-14z" fill="#78909c"/><rect x="26" y="62" width="18" height="14" rx="2" fill="#546e7a"/><line x1="30" y1="78" x2="30" y2="86" stroke="#90a4ae" stroke-width="2"/><line x1="40" y1="78" x2="40" y2="86" stroke="#90a4ae" stroke-width="2"/></svg>';
  }
  function svgResistor() {
    return '<svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg"><line x1="4" y1="20" x2="22" y2="20" stroke="#90a4ae" stroke-width="3"/><path d="M22 20 L28 8 L36 32 L44 8 L52 32 L60 8 L68 32 L76 20" fill="none" stroke="#ff8a65" stroke-width="3"/><line x1="76" y1="20" x2="96" y2="20" stroke="#90a4ae" stroke-width="3"/></svg>';
  }
  function svgMeter() {
    return '<svg viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="54" height="48" rx="6" fill="#eceff1" stroke="#546e7a" stroke-width="2"/><text x="35" y="38" text-anchor="middle" font-size="18" font-weight="700" fill="#1565c0">A</text><line x1="18" y1="62" x2="18" y2="68" stroke="#90a4ae" stroke-width="2"/><line x1="52" y1="62" x2="52" y2="68" stroke="#90a4ae" stroke-width="2"/></svg>';
  }
  function svgWire() {
    return '<svg viewBox="0 0 90 24" xmlns="http://www.w3.org/2000/svg"><line x1="4" y1="12" x2="86" y2="12" stroke="#26c6da" stroke-width="4" stroke-linecap="round"/><circle cx="4" cy="12" r="4" fill="#80deea"/><circle cx="86" cy="12" r="4" fill="#80deea"/></svg>';
  }
  function artFor(def, piece) {
    if (!def) return '';
    switch (def.art) {
      case 'battery': return svgBattery();
      case 'switch': return svgSwitch(piece && piece.closed !== false);
      case 'bulb': return svgBulb(piece && piece.lit);
      case 'resistor': return svgResistor();
      case 'meter': return svgMeter();
      case 'wire': return svgWire();
      default: return svgWire();
    }
  }
  function setMsg(text, ok) {
    var el = $('lab-phys-msg');
    if (!el) return;
    el.textContent = text || '';
    el.className = 'lab-msg' + (text ? (ok ? ' ok' : ' err') : '');
  }
  function log(msg) {
    state.log.unshift({ t: new Date().toLocaleTimeString(), msg: msg });
    if (state.log.length > 40) state.log.pop();
    var ul = $('lab-phys-log');
    if (!ul) return;
    ul.innerHTML = state.log.map(function (x) { return '<li><strong>' + x.t + '</strong> ' + x.msg + '</li>'; }).join('');
  }
  function renderPalette() {
    var box = $('lab-phys-palette');
    if (!box) return;
    box.innerHTML = PARTS.map(function (it) {
      return '<div class="lab-pal-card" draggable="true" data-def="' + it.id + '"><div class="lab-pal-art">' + artFor(it, { closed: true }) + '</div><div class="lab-pal-name">' + it.name + '</div></div>';
    }).join('');
    box.querySelectorAll('.lab-pal-card').forEach(function (el) {
      el.addEventListener('dragstart', function (e) { e.dataTransfer.setData('text/lab-def', el.getAttribute('data-def')); });
      el.addEventListener('click', function () { addPiece(el.getAttribute('data-def')); });
    });
  }
  function addPiece(defId) {
    var def = findDef(defId);
    if (!def) return;
    var p = { id: String(state.uid++), defId: defId, closed: def.kind === 'switch' ? true : undefined, lit: false };
    state.pieces.push(p);
    state.selectedId = p.id;
    log('添加：' + def.name);
    renderBench();
  }
  function getPiece(id) {
    for (var i = 0; i < state.pieces.length; i++) if (state.pieces[i].id === id) return state.pieces[i];
    return null;
  }
  function renderBench() {
    var bench = $('lab-phys-bench');
    if (!bench) return;
    if (!state.pieces.length) {
      bench.innerHTML = '<p class="lab-bench-hint">将电路元件拖到电路板上</p><div class="lab-wire-hint">串联模型 · 点击开关切换通断</div>';
      return;
    }
    bench.innerHTML = state.pieces.map(function (p) {
      var def = findDef(p.defId) || {};
      var cls = 'lab-entity phys';
      if (p.id === state.selectedId) cls += ' is-selected';
      if (def.kind === 'bulb' && p.lit) cls += ' is-lit';
      var extra = '';
      if (def.kind === 'switch') extra = p.closed ? '（闭合）' : '（断开）';
      if (def.kind === 'bulb' && p.lit) extra = ' 亮';
      return '<div class="' + cls + '" data-id="' + p.id + '"><div class="lab-entity-art">' + artFor(def, p) + '</div><div class="lab-entity-label">' + def.name + extra + '</div></div>';
    }).join('') + '<div class="lab-wire-hint">点击开关可切换 · 再点「分析电路」</div>';
    bench.querySelectorAll('.lab-entity').forEach(function (el) {
      el.onclick = function () {
        var id = el.getAttribute('data-id');
        var p = getPiece(id);
        state.selectedId = id;
        var def = findDef(p.defId);
        if (def && def.kind === 'switch') {
          p.closed = !p.closed;
          log('开关 → ' + (p.closed ? '闭合' : '断开'));
          analyze();
        }
        renderBench();
      };
    });
  }
  function analyze() {
    var hasBattery = false, V = 0, openSwitch = false, Rsum = 0, hasLoad = false, bulbs = [];
    state.pieces.forEach(function (p) {
      var d = findDef(p.defId);
      if (!d) return;
      if (d.kind === 'battery') { hasBattery = true; V += d.V || 0; }
      if (d.kind === 'switch' && p.closed === false) openSwitch = true;
      if (d.kind === 'bulb' || d.kind === 'resistor') {
        hasLoad = true; Rsum += d.R || 0;
        if (d.kind === 'bulb') bulbs.push(p);
      }
    });
    var el = $('lab-phys-result');
    bulbs.forEach(function (b) { b.lit = false; });
    if (!hasBattery) { if (el) el.textContent = '未检测到电源。\n欧姆定律：I = U / R'; renderBench(); return; }
    if (openSwitch) { if (el) el.textContent = '开关断开 → 断路，I = 0\n电源 U = ' + V + ' V'; log('分析：断路'); renderBench(); return; }
    if (!hasLoad || Rsum <= 0) { if (el) el.textContent = '警告：可能短路！请接入灯泡或电阻。\n电源 U = ' + V + ' V'; log('分析：短路风险'); renderBench(); return; }
    var I = V / Rsum;
    bulbs.forEach(function (b) { b.lit = I > 0.05; });
    if (el) el.textContent = '串联估算：\nU = ' + V + ' V\nR = ' + Rsum + ' Ω\nI = U/R = ' + I.toFixed(3) + ' A\n' + (bulbs.length ? (I > 0.05 ? '灯泡发光' : '电流过小，灯几乎不亮') : '');
    log('分析：I ≈ ' + I.toFixed(3) + ' A');
    renderBench();
    setMsg('分析完成', true);
  }
  function snapshot() {
    return { kind: 'physics', title: ($('lab-phys-title') && $('lab-phys-title').value) || '未命名电路实验', pieces: state.pieces, uid: state.uid, log: state.log.slice(0, 20) };
  }
  function restore(data) {
    if (!data) return;
    state.pieces = data.pieces || [];
    state.uid = data.uid || state.pieces.length + 1;
    state.log = data.log || [];
    state.selectedId = null;
    if ($('lab-phys-title') && data.title) $('lab-phys-title').value = data.title;
    renderBench();
  }
  function getClient() { return window.KBAuth && KBAuth.ensureClient ? KBAuth.ensureClient() : null; }
  async function saveCloud() {
    var user = KBAuth && KBAuth.currentUserFull && KBAuth.currentUserFull();
    if (!user) { setMsg('请先登录后再保存', false); if (KBAuth && KBAuth.openModal) KBAuth.openModal(); return; }
    var sb = getClient();
    if (!sb) { setMsg('无法连接后端', false); return; }
    var payload = snapshot();
    try {
      var ins = await sb.from('lab_projects').insert({ user_id: user.id, kind: 'physics', title: payload.title, state: payload });
      if (ins.error) { setMsg('保存失败：' + (ins.error.message || '请建表 lab_projects'), false); return; }
      setMsg('已保存到云端', true);
    } catch (e) { setMsg('保存异常', false); }
  }
  async function loadCloud() {
    var user = KBAuth && KBAuth.currentUserFull && KBAuth.currentUserFull();
    if (!user) { setMsg('请先登录', false); if (KBAuth && KBAuth.openModal) KBAuth.openModal(); return; }
    var sb = getClient();
    if (!sb) { setMsg('无法连接后端', false); return; }
    try {
      var res = await sb.from('lab_projects').select('state, title, updated_at').eq('user_id', user.id).eq('kind', 'physics').order('updated_at', { ascending: false }).limit(1);
      if (res.error || !res.data || !res.data.length) { setMsg(res.error ? '读取失败' : '云端暂无存档', false); return; }
      restore(res.data[0].state);
      setMsg('已读取：' + (res.data[0].title || ''), true);
    } catch (e) { setMsg('读取异常', false); }
  }
  function bind() {
    if (!$('lab-phys-app') || $('lab-phys-app').dataset.bound === '1') return;
    $('lab-phys-app').dataset.bound = '1';
    var bench = $('lab-phys-bench');
    if (bench && bench.dataset.dropBound !== '1') {
      bench.dataset.dropBound = '1';
      bench.addEventListener('dragover', function (e) { e.preventDefault(); bench.classList.add('is-dragover'); });
      bench.addEventListener('dragleave', function () { bench.classList.remove('is-dragover'); });
      bench.addEventListener('drop', function (e) {
        e.preventDefault(); bench.classList.remove('is-dragover');
        var defId = e.dataTransfer.getData('text/lab-def');
        if (defId) addPiece(defId);
      });
    }
    if ($('lab-phys-analyze')) $('lab-phys-analyze').onclick = analyze;
    if ($('lab-phys-remove')) $('lab-phys-remove').onclick = function () {
      if (!state.selectedId) return;
      state.pieces = state.pieces.filter(function (p) { return p.id !== state.selectedId; });
      state.selectedId = null; renderBench();
    };
    if ($('lab-phys-clear')) $('lab-phys-clear').onclick = function () {
      state.pieces = []; state.selectedId = null;
      if ($('lab-phys-result')) $('lab-phys-result').textContent = '放置元件后点击「分析电路」';
      log('清空电路'); renderBench();
    };
    if ($('lab-phys-save')) $('lab-phys-save').onclick = saveCloud;
    if ($('lab-phys-load')) $('lab-phys-load').onclick = loadCloud;
  }
  function boot() {
    if (!$('lab-phys-app')) return;
    bind(); renderPalette(); renderBench();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  if (typeof document$ !== 'undefined') {
    document$.subscribe(function () {
      var root = document.getElementById('lab-phys-app');
      if (root) root.dataset.bound = '0';
      var bench = document.getElementById('lab-phys-bench');
      if (bench) bench.dataset.dropBound = '0';
      setTimeout(boot, 0);
    });
  }
})();
