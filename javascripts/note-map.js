/**
 * Topic / keyword → knowledge page path
 */
window.KB_NOTE_MAP = [
  { keys: ["椭圆"], path: "/mathematics/conic-sections/ellipse/", label: "椭圆" },
  { keys: ["双曲线"], path: "/mathematics/conic-sections/hyperbola/", label: "双曲线" },
  { keys: ["抛物线"], path: "/mathematics/conic-sections/parabola/", label: "抛物线" },
  { keys: ["统一定义", "离心率"], path: "/mathematics/conic-sections/index/", label: "圆锥曲线概述" },
  { keys: ["数列"], path: "/mathematics/algebra/sequences/", label: "数列" },
  { keys: ["不等式"], path: "/mathematics/algebra/inequalities/", label: "不等式" },
  { keys: ["排列组合"], path: "/mathematics/probability/combinatorics/", label: "排列组合" },
  { keys: ["立体几何"], path: "/mathematics/geometry/solid/", label: "立体几何" },
  { keys: ["牛顿"], path: "/physics/mechanics/kinematics-newton/", label: "牛顿运动定律" },
  { keys: ["动量", "动能"], path: "/physics/mechanics/momentum-energy/", label: "动量与能量" },
  { keys: ["圆周"], path: "/physics/mechanics/circular-gravity/", label: "圆周运动" },
  { keys: ["静电场", "库仑"], path: "/physics/electricity/electrostatics/", label: "静电场" },
  { keys: ["洛伦兹"], path: "/physics/electromagnetism/lorentz/", label: "洛伦兹力" },
  { keys: ["电磁感应", "法拉第"], path: "/physics/electromagnetism/induction/", label: "电磁感应" },
  { keys: ["光电"], path: "/physics/modern/photoelectric/", label: "光电效应" },
  { keys: ["电路", "欧姆", "电动势"], path: "/physics/electricity/emf/", label: "闭合电路" },
  { keys: ["物质的量"], path: "/chemistry/fundamentals/mole/", label: "物质的量" },
  { keys: ["化学平衡", "勒夏特列"], path: "/chemistry/reaction/equilibrium/", label: "化学平衡" },
  { keys: ["电离", "离子积", "pH"], path: "/chemistry/reaction/ionization/", label: "电离平衡" },
  { keys: ["醛", "官能团"], path: "/chemistry/organic/functional/", label: "官能团" },
  { keys: ["氧化还原"], path: "/chemistry/fundamentals/ion-redox/", label: "氧化还原" },
  { keys: ["原电池"], path: "/chemistry/reaction/electrochemistry/", label: "原电池" },
  { keys: ["线粒体", "叶绿体", "细胞 · 结构", "结构"], path: "/biology/cell/structure/", label: "细胞结构" },
  { keys: ["呼吸", "光合"], path: "/biology/cell/energy/", label: "呼吸与光合" },
  { keys: ["分离定律", "孟德尔"], path: "/biology/genetics/mendel/", label: "遗传规律" },
  { keys: ["中心法则", "DNA"], path: "/biology/genetics/dna/", label: "DNA与基因" },
  { keys: ["免疫"], path: "/biology/homeostasis/immune/", label: "免疫调节" },
  { keys: ["能量流动", "生态"], path: "/biology/ecology/flow/", label: "能量与物质" },
  { keys: ["时态"], path: "/english/grammar/tense-voice/", label: "时态与语态" },
  { keys: ["非谓语"], path: "/english/grammar/non-finite/", label: "非谓语动词" },
  { keys: ["虚拟"], path: "/english/grammar/subjunctive-inversion/", label: "虚拟语气" },
  { keys: ["构词", "词根", "前缀"], path: "/english/vocabulary/roots/", label: "词根词缀" },
  { keys: ["从句", "定语从句"], path: "/english/grammar/clauses/", label: "从句" },
  { keys: ["衔接", "写作"], path: "/english/writing/advanced/", label: "高分表达" }
];

window.KBResolveNote = function (subject, topic) {
  var text = (topic || "") + " " + (subject || "");
  var map = window.KB_NOTE_MAP || [];
  for (var i = 0; i < map.length; i++) {
    var item = map[i];
    for (var j = 0; j < item.keys.length; j++) {
      if (text.indexOf(item.keys[j]) !== -1) {
        return { path: item.path, label: item.label };
      }
    }
  }
  return null;
};
