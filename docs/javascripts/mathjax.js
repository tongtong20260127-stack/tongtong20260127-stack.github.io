window.MathJax = {
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"]
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"]
    ],
    processEscapes: true,
    processEnvironments: true
  },
  options: {
    skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"],
    // 兼容 MkDocs 正文 (arithmatex) 与练习/错题本动态内容 (kb-math)
    ignoreHtmlClass: "tex2jax_ignore",
    processHtmlClass: "arithmatex|kb-math"
  }
};

function kbTypeset(root) {
  if (!window.MathJax || !MathJax.typesetPromise) return Promise.resolve();
  var nodes = root ? [root] : undefined;
  try {
    if (nodes && MathJax.typesetClear) MathJax.typesetClear(nodes);
  } catch (e) {}
  return MathJax.typesetPromise(nodes).catch(function () {});
}

window.kbTypeset = kbTypeset;

if (typeof document$ !== "undefined") {
  document$.subscribe(function () {
    kbTypeset();
  });
}
