/**
 * Topic / keyword → knowledge page path
 */
window.KB_NOTE_MAP = [
  { keys: ["文言", "实词", "虚词"], path: "/chinese/classical/words/", label: "文言实词虚词" },
  { keys: ["句式", "翻译"], path: "/chinese/classical/syntax/", label: "文言句式翻译" },
  { keys: ["名句"], path: "/chinese/classical/quotes/", label: "名句名篇" },
  { keys: ["论述类", "实用类"], path: "/chinese/modern/argument/", label: "论述实用类文本" },
  { keys: ["文学类", "小说", "散文"], path: "/chinese/modern/literature/", label: "文学类文本" },
  { keys: ["议论文", "作文"], path: "/chinese/writing/argumentation/", label: "议论文写作" },
  { keys: ["郡县", "三省六部", "科举"], path: "/history/ancient/institutions/", label: "古代制度" },
  { keys: ["辛亥革命", "五四", "南京条约"], path: "/history/modern_cn/late-qing-republic/", label: "晚清民国" },
  { keys: ["十一届三中全会", "改革开放"], path: "/history/modern_cn/prc/", label: "新中国史" },
  { keys: ["文艺复兴", "启蒙"], path: "/history/world/west/", label: "近代西方" },
  { keys: ["冷战", "两极"], path: "/history/world/twentieth/", label: "20世纪世界" },
  { keys: ["自转", "公转", "直射"], path: "/geography/physical/earth-atmosphere/", label: "地球运动与大气" },
  { keys: ["水循环", "地貌"], path: "/geography/physical/water-landform/", label: "水与地貌" },
  { keys: ["城市化", "区位"], path: "/geography/human/population-industry/", label: "人口城市产业" },
  { keys: ["可持续"], path: "/geography/regional/development/", label: "区域发展" },
  { keys: ["新发展理念", "市场经济"], path: "/politics/economy/market/", label: "经济与新发展理念" },
  { keys: ["人民代表大会", "依法治国"], path: "/politics/gov/people-rule/", label: "政治与法治" },
  { keys: ["文化自信"], path: "/politics/culture/culture/", label: "文化" },
  { keys: ["矛盾", "唯物", "实践是认识"], path: "/politics/philosophy/basics/", label: "哲学基础" },
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
  { keys: ["线粒体", "叶绿体"], path: "/biology/cell/structure/", label: "细胞结构" },
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
