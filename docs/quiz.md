# 随机练习 Random Quiz

根据知识库内容随机出题，先思考再揭晓答案，巩固记忆。

<div id="quiz-app" class="quiz-app" markdown="0">

  <div class="quiz-toolbar">
    <label class="quiz-label">
      学科筛选
      <select id="quiz-subject" class="quiz-select">
        <option value="全部">全部学科</option>
        <option value="数学">数学</option>
        <option value="物理">物理</option>
        <option value="化学">化学</option>
        <option value="生物">生物</option>
        <option value="英语">英语</option>
      </select>
    </label>
    <span class="quiz-count-badge">题库共 <strong id="quiz-count">0</strong> 题</span>
  </div>

  <div id="quiz-card" class="quiz-card">
    <div id="quiz-meta" class="quiz-meta"></div>
    <div id="quiz-question" class="quiz-question">加载中…</div>

    <div id="quiz-answer-box" class="quiz-answer-box" hidden>
      <div class="quiz-answer-title">答案</div>
      <div id="quiz-answer" class="quiz-answer"></div>
    </div>

    <div class="quiz-actions">
      <button type="button" id="quiz-btn-answer" class="quiz-btn quiz-btn-answer">显示答案</button>
      <button type="button" id="quiz-btn-next" class="quiz-btn quiz-btn-next">下一题</button>
    </div>
  </div>

  <p class="quiz-tip">提示：可先在脑海中作答，再点击「显示答案」对照；切换学科后会自动抽新题。</p>

</div>

!!! tip "使用说明"
    - 点击 **下一题** 随机抽取一道新题
    - 点击 **显示答案** 查看参考答案（支持再次隐藏）
    - 使用上方下拉框可按学科筛选题库
    - 题目覆盖数学、物理、化学、生物、英语的核心知识点
