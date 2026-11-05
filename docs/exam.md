# 组卷 Exam

按学科或混合抽题，生成一套选择题试卷。提交后自动打分，可筛选错题并加入错题本。

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
      <label class="quiz-label">题量
        <select id="exam-count" class="quiz-select">
          <option value="5">5 题</option>
          <option value="10" selected>10 题</option>
          <option value="15">15 题</option>
        </select>
      </label>
      <span class="quiz-count-badge">选择题库 <strong id="exam-bank-count">0</strong> 题</span>
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
