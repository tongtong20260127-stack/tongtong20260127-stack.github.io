/**
 * 化学实验台（形象化）— SVG 器材/试剂 + 倾倒反应
 */
(function () {
  var CATS = [
    { id: 'vessel', name: '反应容器' },
    { id: 'heat', name: '加热器具' },
    { id: 'solid', name: '固体药品' },
    { id: 'liquid', name: '液体药品' },
    { id: 'tool', name: '辅助器材' }
  ];
  var ITEMS = [
    { id: 'flask', name: '圆底烧瓶', cat: 'vessel', kind: 'vessel', art: 'flask' },
    { id: 'beaker', name: '烧杯', cat: 'vessel', kind: 'vessel', art: 'beaker' },
    { id: 'tube', name: '试管', cat: 'vessel', kind: 'vessel', art: 'tube' },
    { id: 'erlenmeyer', name: '锥形瓶', cat: 'vessel', kind: 'vessel', art: 'erlenmeyer' },
    { id: 'lamp', name: '酒精灯', cat: 'heat', kind: 'heat', art: 'lamp' },
    { id: 'HCl', name: '盐酸', formula: 'HCl', cat: 'liquid', kind: 'reagent', art: 'bottle', fill: '#90caf9', label: 'HCl' },
    { id: 'H2SO4', name: '硫酸', formula: 'H2SO4', cat: 'liquid', kind: 'reagent', art: 'bottle', fill: '#fff59d', label: 'H2SO4' },
    { id: 'NaOH', name: '氢氧化钠', formula: 'NaOH', cat: 'liquid', kind: 'reagent', art: 'bottle', fill: '#a5d6a7', label: 'NaOH' },
    { id: 'CuSO4', name: '硫酸铜', formula: 'CuSO4', cat: 'liquid', kind: 'reagent', art: 'bottle', fill: '#42a5f5', label: 'CuSO4' },
    { id: 'AgNO3', name: '硝酸银', formula: 'AgNO3', cat: 'liquid', kind: 'reagent', art: 'bottle', fill: '#eeeeee', label: 'AgNO3' },
    { id: 'Na2CO3', name: '碳酸钠', formula: 'Na2CO3', cat: 'liquid', kind: 'reagent', art: 'bottle', fill: '#bcaaa4', label: 'Na2CO3' },
    { id: 'BaCl2', name: '氯化钡', formula: 'BaCl2', cat: 'liquid', kind: 'reagent', art: 'bottle', fill: '#cfd8dc', label: 'BaCl2' },
    { id: 'FeCl3', name: '氯化铁', formula: 'FeCl3', cat: 'liquid', kind: 'reagent', art: 'bottle', fill: '#ffb74d', label: 'FeCl3' },
    { id: 'KSCN', name: '硫氰化钾', formula: 'KSCN', cat: 'liquid', kind: 'reagent', art: 'bottle', fill: '#ce93d8', label: 'KSCN' },
    { id: 'H2O2', name: '过氧化氢', formula: 'H2O2', cat: 'liquid', kind: 'reagent', art: 'bottle', fill: '#80deea', label: 'H2O2' },
    { id: 'phen', name: '酚酞', formula: 'phen', cat: 'liquid', kind: 'reagent', art: 'bottle', fill: '#f48fb1', label: '酚酞' },
    { id: 'Zn', name: '锌粒', formula: 'Zn', cat: 'solid', kind: 'reagent', art: 'jar', fill: '#90a4ae', label: 'Zn' },
    { id: 'Fe', name: '铁粉', formula: 'Fe', cat: 'solid', kind: 'reagent', art: 'jar', fill: '#546e7a', label: 'Fe' },
    { id: 'CaCO3', name: '大理石', formula: 'CaCO3', cat: 'solid', kind: 'reagent', art: 'jar', fill: '#eceff1', label: 'CaCO3' },
    { id: 'MnO2', name: '二氧化锰', formula: 'MnO2', cat: 'solid', kind: 'reagent', art: 'jar', fill: '#37474f', label: 'MnO2' },
    { id: 'CuO', name: '氧化铜', formula: 'CuO', cat: 'solid', kind: 'reagent', art: 'jar', fill: '#263238', label: 'CuO' },
    { id: 'dropper', name: '胶头滴管', cat: 'tool', kind: 'tool', art: 'dropper' }
  ];
  var REACTIONS = [
    { need: ['HCl', 'NaOH'], consume: { HCl: 1, NaOH: 1 }, produce: { NaCl: 1, H2O: 1 }, chem: 'HCl + NaOH = NaCl + H2O', ionic: 'H+ + OH- = H2O', note: '酸碱中和。' },
    { need: ['H2SO4', 'BaCl2'], consume: { H2SO4: 1, BaCl2: 1 }, produce: { BaSO4: 1, HCl: 2 }, chem: 'H2SO4 + BaCl2 = BaSO4↓ + 2HCl', ionic: 'Ba2+ + SO42- = BaSO4↓', note: '白色沉淀。', gas: 0, color: null },
    { need: ['CuSO4', 'NaOH'], consume: { CuSO4: 1, NaOH: 2 }, produce: { CuOH2: 1, Na2SO4: 1 }, chem: 'CuSO4 + 2NaOH = Cu(OH)2↓ + Na2SO4', ionic: 'Cu2+ + 2OH- = Cu(OH)2↓', note: '蓝色絮状沉淀。', color: '#64b5f6' },
    { need: ['AgNO3', 'HCl'], consume: { AgNO3: 1, HCl: 1 }, produce: { AgCl: 1, HNO3: 1 }, chem: 'AgNO3 + HCl = AgCl↓ + HNO3', ionic: 'Ag+ + Cl- = AgCl↓', note: '白色氯化银沉淀。' },
    { need: ['Na2CO3', 'HCl'], consume: { Na2CO3: 1, HCl: 2 }, produce: { NaCl: 2, CO2: 1, H2O: 1 }, chem: 'Na2CO3 + 2HCl = 2NaCl + CO2↑ + H2O', ionic: 'CO32- + 2H+ = CO2↑ + H2O', note: '有气泡产生。', gas: 1 },
    { need: ['CaCO3', 'HCl'], consume: { CaCO3: 1, HCl: 2 }, produce: { CaCl2: 1, CO2: 1, H2O: 1 }, chem: 'CaCO3 + 2HCl = CaCl2 + CO2↑ + H2O', ionic: 'CaCO3 + 2H+ = Ca2+ + CO2↑ + H2O', note: '大理石溶解放气。', gas: 1 },
    { need: ['Zn', 'HCl'], consume: { Zn: 1, HCl: 2 }, produce: { ZnCl2: 1, H2: 1 }, chem: 'Zn + 2HCl = ZnCl2 + H2↑', ionic: 'Zn + 2H+ = Zn2+ + H2↑', note: '产生氢气。', gas: 1 },
    { need: ['Fe', 'HCl'], consume: { Fe: 1, HCl: 2 }, produce: { FeCl2: 1, H2: 1 }, chem: 'Fe + 2HCl = FeCl2 + H2↑', ionic: 'Fe + 2H+ = Fe2+ + H2↑', note: '铁与盐酸反应。', gas: 1 },
    { need: ['Fe', 'CuSO4'], consume: { Fe: 1, CuSO4: 1 }, produce: { FeSO4: 1, Cu: 1 }, chem: 'Fe + CuSO4 = FeSO4 + Cu', ionic: 'Fe + Cu2+ = Fe2+ + Cu', note: '置换出红色铜。', color: '#ef9a9a' },
    { need: ['H2O2', 'MnO2'], consume: { H2O2: 2 }, produce: { H2O: 2, O2: 1 }, chem: '2H2O2 =MnO2=> 2H2O + O2↑', ionic: '（催化分解）', note: '产生氧气。', gas: 1 },
    { need: ['FeCl3', 'KSCN'], consume: { FeCl3: 1, KSCN: 1 }, produce: { FeSCN: 1 }, chem: 'Fe3+ + SCN- = [Fe(SCN)]2+', ionic: 'Fe3+ + SCN- = [Fe(SCN)]2+', note: '溶液呈血红色。', color: '#c62828' },
    { need: ['NaOH', 'phen'], consume: {}, produce: {}, chem: '酚酞在碱性溶液中变红', ionic: '—', note: '指示剂变红。', color: '#f48fb1' },
    { need: ['CuO', 'H2SO4'], consume: { CuO: 1, H2SO4: 1 }, produce: { CuSO4: 1, H2O: 1 }, chem: 'CuO + H2SO4 = CuSO4 + H2O', ionic: 'CuO + 2H+ = Cu2+ + H2O', note: '黑色氧化铜溶解变蓝。', color: '#42a5f5' }
  ];
  var state = { pieces: [], selectedId: null, cat: 'vessel', log: [], uid: 1 };
  function $(id) { return document.getElementById(id); }
  function findDef(id) {
    for (var i = 0; i < ITEMS.length; i++) if (ITEMS[i].id === id) return ITEMS[i];
    return null;
  }
  function svgBottle(fill, label) {
    return '<svg viewBox="0 0 64 96" xmlns="http://www.w3.org/2000/svg"><rect x="22" y="4" width="20" height="10" rx="2" fill="#b0bec5"/><rect x="18" y="12" width="28" height="8" rx="1" fill="#78909c"/><path d="M14 34 h36 v48 c0 6-5 10-10 10 H24 c-5 0-10-4-10-10z" fill="#eceff1" stroke="#90a4ae" stroke-width="1.2"/><path d="M16 48 h32 v30 c0 4-3 7-8 7 H24 c-5 0-8-3-8-7z" fill="' + (fill || '#90caf9') + '" opacity="0.85"/><rect x="18" y="40" width="28" height="16" rx="2" fill="#fff" opacity="0.92"/><text x="32" y="51" text-anchor="middle" font-size="7" font-family="sans-serif" fill="#333">' + (label || '') + '</text></svg>';
  }
  function svgJar(fill, label) {
    return '<svg viewBox="0 0 64 96" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="8" width="36" height="12" rx="3" fill="#78909c"/><path d="M12 20 h40 v58 c0 6-5 10-10 10 H22 c-5 0-10-4-10-10z" fill="#cfd8dc" stroke="#78909c" stroke-width="1.2"/><path d="M14 50 h36 v24 c0 4-3 7-8 7 H22 c-5 0-8-3-8-7z" fill="' + (fill || '#546e7a') + '"/><rect x="18" y="28" width="28" height="14" rx="2" fill="#fff" opacity="0.9"/><text x="32" y="38" text-anchor="middle" font-size="7.5" fill="#222">' + (label || '') + '</text></svg>';
  }
  function svgFlask(liquid) {
    return '<svg viewBox="0 0 80 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="14" rx="10" ry="4" fill="#b0bec5"/><rect x="32" y="12" width="16" height="28" fill="#e3f2fd" stroke="#90a4ae" stroke-width="1.2"/><path d="M32 40 L12 92 c-2 6 2 12 10 12 h36 c8 0 12-6 10-12 L48 40z" fill="#e3f2fd" stroke="#90a4ae" stroke-width="1.4"/>' +
      (liquid && liquid !== 'transparent' ? '<path d="M18 78 L14 92 c-1 4 2 8 8 8 h36 c6 0 9-4 8-8 L58 78z" fill="' + liquid + '" opacity="0.88"/>' : '') +
      '<text x="40" y="102" text-anchor="middle" font-size="7" fill="#90a4ae">250 mL</text></svg>';
  }
  function svgBeaker(liquid) {
    return '<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg"><path d="M18 12 h44 v70 c0 6-5 10-10 10 H28 c-5 0-10-4-10-10z" fill="#e3f2fd" stroke="#90a4ae" stroke-width="1.5"/>' +
      (liquid && liquid !== 'transparent' ? '<path d="M22 48 h36 v30 c0 4-3 7-7 7 H29 c-4 0-7-3-7-7z" fill="' + liquid + '" opacity="0.88"/>' : '') + '</svg>';
  }
  function svgTube(liquid) {
    return '<svg viewBox="0 0 48 110" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="6" width="16" height="78" rx="2" fill="#e3f2fd" stroke="#90a4ae" stroke-width="1.3"/><path d="M16 80 h16 v8 a8 8 0 0 1-16 0z" fill="#e3f2fd" stroke="#90a4ae" stroke-width="1.3"/>' +
      (liquid && liquid !== 'transparent' ? '<rect x="18" y="55" width="12" height="30" rx="2" fill="' + liquid + '" opacity="0.9"/>' : '') + '</svg>';
  }
  function svgErlenmeyer(liquid) {
    return '<svg viewBox="0 0 80 110" xmlns="http://www.w3.org/2000/svg"><rect x="34" y="8" width="12" height="22" fill="#e3f2fd" stroke="#90a4ae" stroke-width="1.2"/><path d="M34 30 L12 92 c-2 6 2 12 10 12 h36 c8 0 12-6 10-12 L46 30z" fill="#e3f2fd" stroke="#90a4ae" stroke-width="1.4"/>' +
      (liquid && liquid !== 'transparent' ? '<path d="M22 72 L16 92 c-1 4 2 8 8 8 h32 c6 0 9-4 8-8 L58 72z" fill="' + liquid + '" opacity="0.88"/>' : '') + '</svg>';
  }
  function svgLamp(lit) {
    return '<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">' +
      (lit ? '<g class="lab-flame"><ellipse cx="40" cy="18" rx="6" ry="12" fill="#ffeb3b"/><ellipse cx="40" cy="20" rx="3.5" ry="8" fill="#ff9800"/></g>' : '') +
      '<rect x="36" y="28" width="8" height="10" fill="#bdbdbd"/><path d="M18 40 h44 c4 0 6 3 6 6 v28 c0 8-8 14-22 14 s-22-6-22-14 V46 c0-3 2-6 6-6z" fill="#eceff1" stroke="#90a4ae" stroke-width="1.3"/></svg>';
  }
  function svgDropper() {
    return '<svg viewBox="0 0 40 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="12" rx="12" ry="10" fill="#ef9a9a"/><rect x="14" y="20" width="12" height="50" fill="#e3f2fd" stroke="#90a4ae" stroke-width="1"/><path d="M14 70 L20 92 L26 70z" fill="#90a4ae"/></svg>';
  }
  function artFor(def, piece) {
    if (!def) return '';
    var liquid = 'transparent';
    if (piece && piece.color) liquid = piece.color;
    else if (piece && piece.content) {
      var keys = Object.keys(piece.content);
      if (keys.length) {
        for (var i = 0; i < ITEMS.length; i++) {
          if (ITEMS[i].formula === keys[0] || ITEMS[i].id === keys[0]) {
            if (ITEMS[i].fill) liquid = ITEMS[i].fill;
            break;
          }
        }
        if (liquid === 'transparent') liquid = '#81d4fa';
      }
    }
    switch (def.art) {
      case 'bottle': return svgBottle(def.fill, def.label || def.name);
      case 'jar': return svgJar(def.fill, def.label || def.name);
      case 'flask': return svgFlask(liquid);
      case 'beaker': return svgBeaker(liquid);
      case 'tube': return svgTube(liquid);
      case 'erlenmeyer': return svgErlenmeyer(liquid);
      case 'lamp': return svgLamp(piece && piece.lit);
      case 'dropper': return svgDropper();
      default: return svgBeaker(liquid);
    }
  }
  function setMsg(text, ok) {
    var el = $('lab-chem-msg');
    if (!el) return;
    el.textContent = text || '';
    el.className = 'lab-msg' + (text ? (ok ? ' ok' : ' err') : '');
  }
  function log(msg) {
    state.log.unshift({ t: new Date().toLocaleTimeString(), msg: msg });
    if (state.log.length > 40) state.log.pop();
    var ul = $('lab-chem-log');
    if (!ul) return;
    ul.innerHTML = state.log.map(function (x) { return '<li><strong>' + x.t + '</strong> ' + x.msg + '</li>'; }).join('');
  }
  function setEq(chem, ionic) {
    var el = $('lab-chem-eq');
    if (!el) return;
    if (!chem) { el.textContent = '尚无反应'; return; }
    el.textContent = '化学方程式：\n' + chem + '\n\n离子方程式：\n' + (ionic || '—');
  }
  function renderCats() {
    var box = $('lab-chem-cats');
    if (!box) return;
    box.innerHTML = CATS.map(function (c) {
      return '<button type="button" class="lab-cat-btn' + (state.cat === c.id ? ' is-on' : '') + '" data-cat="' + c.id + '">' + c.name + '</button>';
    }).join('');
    box.querySelectorAll('[data-cat]').forEach(function (btn) {
      btn.onclick = function () { state.cat = btn.getAttribute('data-cat'); renderCats(); renderPalette(); };
    });
  }
  function renderPalette() {
    var box = $('lab-chem-palette');
    if (!box) return;
    var items = ITEMS.filter(function (x) { return x.cat === state.cat; });
    box.innerHTML = items.map(function (it) {
      return '<div class="lab-pal-card" draggable="true" data-def="' + it.id + '"><div class="lab-pal-art">' + artFor(it, null) + '</div><div class="lab-pal-name">' + it.name + '</div></div>';
    }).join('');
    box.querySelectorAll('.lab-pal-card').forEach(function (el) {
      el.addEventListener('dragstart', function (e) { e.dataTransfer.setData('text/lab-def', el.getAttribute('data-def')); });
      el.addEventListener('click', function () { addPiece(el.getAttribute('data-def')); });
    });
  }
  function pieceLabel(p) { return (findDef(p.defId) || {}).name || p.defId; }
  function contentText(p) {
    var keys = Object.keys(p.content || {});
    if (!keys.length) return '';
    return keys.map(function (k) { return k + '×' + p.content[k]; }).join(' ');
  }
  function renderBench() {
    var bench = $('lab-chem-bench');
    if (!bench) return;
    if (!state.pieces.length) {
      bench.innerHTML = '<p class="lab-bench-hint">将器材或药品拖到实验台上</p>';
    } else {
      bench.innerHTML = state.pieces.map(function (p) {
        var def = findDef(p.defId) || {};
        var cls = 'lab-entity';
        if (p.id === state.selectedId) cls += ' is-selected';
        if (p.gas) cls += ' has-gas';
        if (p.lit) cls += ' is-lit';
        var sub = contentText(p);
        return '<div class="' + cls + '" data-id="' + p.id + '"><div class="lab-entity-art">' + artFor(def, p) + '</div><div class="lab-entity-label">' + (def.name || p.defId) + (sub ? '<br>' + sub : '') + '</div></div>';
      }).join('');
      bench.querySelectorAll('.lab-entity').forEach(function (el) {
        el.onclick = function () {
          var id = el.getAttribute('data-id');
          state.selectedId = id;
          var p = getPiece(id);
          var def = findDef(p.defId);
          if (def && def.kind === 'heat') {
            p.lit = !p.lit;
            log(p.lit ? '点燃酒精灯' : '熄灭酒精灯');
          }
          renderBench(); fillSelects();
        };
      });
    }
    fillSelects();
  }
  function fillSelects() {
    var vessels = state.pieces.filter(function (p) {
      var d = findDef(p.defId);
      return d && (d.kind === 'vessel' || d.kind === 'reagent');
    });
    function opts(sel, empty) {
      var el = $(sel);
      if (!el) return;
      var cur = el.value;
      el.innerHTML = (empty ? '<option value="">（无）</option>' : '') + vessels.map(function (p) {
        return '<option value="' + p.id + '">' + pieceLabel(p) + ' #' + p.id + '</option>';
      }).join('');
      if (cur) el.value = cur;
      if (state.selectedId) el.value = state.selectedId;
    }
    opts('lab-chem-target', false);
    opts('lab-chem-source', true);
  }
  function addPiece(defId) {
    var def = findDef(defId);
    if (!def) return;
    var p = { id: String(state.uid++), defId: defId, content: {}, color: null, gas: false, lit: def.kind === 'heat' ? false : undefined };
    if (def.kind === 'reagent') p.content[def.formula || def.id] = 1;
    state.pieces.push(p);
    state.selectedId = p.id;
    log('添加：' + def.name);
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
    var matched = null;
    for (var i = 0; i < REACTIONS.length; i++) {
      var r = REACTIONS[i], ok = true;
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
    if (matched.gas) p.gas = true;
    if (matched.color) p.color = matched.color;
    setEq(matched.chem, matched.ionic);
    log('反应：' + matched.chem + ' — ' + matched.note);
    return true;
  }
  function pour() {
    var tid = $('lab-chem-target') && $('lab-chem-target').value;
    var sid = $('lab-chem-source') && $('lab-chem-source').value;
    if (!tid || !sid || sid === tid) { setMsg('请选择不同的来源与目标', false); return; }
    var target = getPiece(tid), source = getPiece(sid);
    if (!target || !source) return;
    var keys = speciesOf(source);
    if (!keys.length) { setMsg('来源为空', false); return; }
    keys.forEach(function (k) {
      target.content[k] = (target.content[k] || 0) + source.content[k];
      delete source.content[k];
    });
    source.gas = false;
    log('倾倒：' + pieceLabel(source) + ' → ' + pieceLabel(target));
    tryReact(target);
    renderBench();
    setMsg('已倾倒混合', true);
  }
  function heat() {
    var tid = $('lab-chem-target') && $('lab-chem-target').value;
    var p = getPiece(tid);
    if (!p) { setMsg('请选择容器', false); return; }
    var hasLamp = state.pieces.some(function (x) {
      var d = findDef(x.defId);
      return d && d.kind === 'heat' && x.lit;
    });
    if (!hasLamp) log('提示：可先点燃酒精灯再加热（点击酒精灯）');
    if (p.content.H2O2 && p.content.MnO2) tryReact(p);
    else if (p.content.H2O2) { p.gas = true; setEq('2H2O2 = 2H2O + O2↑（加热促进）', '—'); log('加热过氧化氢'); }
    else log('加热：' + pieceLabel(p));
    renderBench();
    setMsg('已加热', true);
  }
  function emptyVessel() {
    var tid = $('lab-chem-target') && $('lab-chem-target').value;
    var p = getPiece(tid);
    if (!p) return;
    p.content = {}; p.color = null; p.gas = false;
    log('清空：' + pieceLabel(p));
    setEq(null);
    renderBench();
  }
  function removeSelected() {
    var tid = state.selectedId || ($('lab-chem-target') && $('lab-chem-target').value);
    if (!tid) return;
    state.pieces = state.pieces.filter(function (p) { return p.id !== tid; });
    if (state.selectedId === tid) state.selectedId = null;
    renderBench();
  }
  function snapshot() {
    return { kind: 'chemistry', title: ($('lab-chem-title') && $('lab-chem-title').value) || '未命名化学实验', pieces: state.pieces, uid: state.uid, log: state.log.slice(0, 20) };
  }
  function restore(data) {
    if (!data) return;
    state.pieces = data.pieces || [];
    state.uid = data.uid || state.pieces.length + 1;
    state.log = data.log || [];
    state.selectedId = null;
    if ($('lab-chem-title') && data.title) $('lab-chem-title').value = data.title;
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
      var ins = await sb.from('lab_projects').insert({ user_id: user.id, kind: 'chemistry', title: payload.title, state: payload });
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
      var res = await sb.from('lab_projects').select('state, title, updated_at').eq('user_id', user.id).eq('kind', 'chemistry').order('updated_at', { ascending: false }).limit(1);
      if (res.error || !res.data || !res.data.length) { setMsg(res.error ? '读取失败' : '云端暂无存档', false); return; }
      restore(res.data[0].state);
      setMsg('已读取：' + (res.data[0].title || ''), true);
    } catch (e) { setMsg('读取异常', false); }
  }
  function bind() {
    if (!$('lab-chem-app') || $('lab-chem-app').dataset.bound === '1') return;
    $('lab-chem-app').dataset.bound = '1';
    var bench = $('lab-chem-bench');
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
    if ($('lab-chem-pour')) $('lab-chem-pour').onclick = pour;
    if ($('lab-chem-heat')) $('lab-chem-heat').onclick = heat;
    if ($('lab-chem-empty')) $('lab-chem-empty').onclick = emptyVessel;
    if ($('lab-chem-remove')) $('lab-chem-remove').onclick = removeSelected;
    if ($('lab-chem-clear')) $('lab-chem-clear').onclick = function () {
      state.pieces = []; state.selectedId = null; setEq(null); log('清空台面'); renderBench();
    };
    if ($('lab-chem-save')) $('lab-chem-save').onclick = saveCloud;
    if ($('lab-chem-load')) $('lab-chem-load').onclick = loadCloud;
  }
  function boot() {
    if (!$('lab-chem-app')) return;
    bind(); renderCats(); renderPalette(); renderBench();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  if (typeof document$ !== 'undefined') {
    document$.subscribe(function () {
      var root = document.getElementById('lab-chem-app');
      if (root) root.dataset.bound = '0';
      var bench = document.getElementById('lab-chem-bench');
      if (bench) bench.dataset.dropBound = '0';
      setTimeout(boot, 0);
    });
  }
})();
