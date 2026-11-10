# 组卷

从题库中按学科与题型抽取选择题，提交后自动阅卷；可只看错题，并可选择加入错题本。

<div id="exam-app" class="exam-app" markdown="0">
  <div class="exam-toolbar">
    <label class="quiz-label">学科
      <select id="exam-subject" class="quiz-select">
        <option value="全部">混合（全部学科）</option>
        <option value="语文">语文</option>
        <option value="数学">数学</option>
        <option value="英语">英语</option>
        <option value="物理">物理</option>
        <option value="化学">化学</option>
        <option value="生物">生物</option>
        <option value="历史">历史</option>
        <option value="地理">地理</option>
        <option value="政治">政治</option>
      </select>
    </label>
    <label class="quiz-label">题型
      <select id="exam-type" class="quiz-select">
        <option value="全部">全部题型</option>
        <option value="单选">仅单选</option>
        <option value="多选">仅多选</option>
      </select>
    </label>
    <label class="quiz-label">题量
      <select id="exam-count" class="quiz-select">
        <option value="5">5 题</option>
        <option value="10" selected>10 题</option>
        <option value="15">15 题</option>
        <option value="20">20 题</option>
        <option value="30">30 题</option>
      </select>
    </label>
    <button type="button" id="exam-start" class="quiz-btn quiz-btn-next">开始组卷</button>
    <span class="quiz-count-badge">当前筛选题库 <strong id="exam-bank-count">0</strong> 题</span>
  </div>
  <div id="exam-paper" class="exam-paper" hidden></div>
  <div id="exam-actions" class="exam-actions" hidden>
    <button type="button" id="exam-submit" class="quiz-btn quiz-btn-answer">提交答案</button>
    <button type="button" id="exam-wrong-only" class="quiz-btn exam-btn-ghost" hidden>只看错题</button>
    <button type="button" id="exam-add-wrong" class="quiz-btn exam-btn-ghost" hidden>错题加入错题本</button>
  </div>
  <div id="exam-result" class="exam-result" hidden></div>
</div>
