# 组卷 Exam

按学科或题型抽题，生成一套试卷（含**单选**与**多选**）。每题标注难度（EZ / HD / IN / AT + 1～18）。提交后自动打分，可筛选错题并加入错题本。

<div id="exam-app" class="exam-app" markdown="0">

  <div id="exam-setup" class="exam-setup">
    <div class="exam-setup-row">
      <label class="quiz-label">学科
        <select id="exam-subject" class="quiz-select">
          <option value="全部">混合（全部学科）</option>
          <option value="数学">数学</option>
          <option value="物理">物理</option>
          <option value="化学">化学</option>
          <option value="生物">生物</option>
          <option value="英语">英语</option>
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
      <span class="quiz-count-badge">当前筛选 <strong id="exam-bank-count">0</strong> / 总库 <strong id="exam-bank-total">0</strong> 题</span>
    </div>
    <button type="button" id="exam-btn-start" class="quiz-btn quiz-btn-next">开始组卷</button>
  </div>

  <div id="exam-paper" class="exam-paper" hidden>
    <div class="exam-paper-head">
      <div id="exam-paper-title" class="exam-paper-title">试卷</div>
      <div id="exam-paper-sub" class="exam-paper-sub"></div>
    </div>
    <div id="exam-questions" class="exam-questions"></div>
    <div class="exam-actions" id="exam-actions-before">
      <button type="button" id="exam-btn-submit" class="quiz-btn quiz-btn-answer">提交并阅卷</button>
      <button type="button" id="exam-btn-reset" class="quiz-btn exam-btn-ghost">重新组卷</button>
    </div>
  </div>

  <div id="exam-result" class="exam-result" hidden>
    <div id="exam-score-card" class="exam-score-card">
      <div class="exam-score-num" id="exam-score-num">0</div>
      <div class="exam-score-label" id="exam-score-label">得分</div>
      <div class="exam-score-detail" id="exam-score-detail"></div>
    </div>
    <div class="exam-result-tools">
      <label class="exam-check">
        <input type="checkbox" id="exam-only-wrong" />
        只看错题
      </label>
      <button type="button" id="exam-btn-add-wrong" class="quiz-btn quiz-btn-wrong">将本次错题加入错题本</button>
      <button type="button" id="exam-btn-again" class="quiz-btn quiz-btn-next">再来一套</button>
    </div>
    <p id="exam-add-tip" class="quiz-wrong-tip" hidden></p>
    <div id="exam-review" class="exam-questions"></div>
  </div>

</div>

!!! tip "难度说明"
    - **EZ** 基础（约 1～5）　**HD** 中等（约 6～10）　**IN** 较难（约 11～15）　**AT** 拔高（约 16～18）
    - 多选题需选全所有正确选项才得分
