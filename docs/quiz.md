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
    <div id="quiz-question" class="quiz-question kb-math arithmatex">加载中…</div>

    <div id="quiz-answer-box" class="quiz-answer-box" hidden>
      <div class="quiz-answer-title">答案</div>
      <div id="quiz-answer" class="quiz-answer kb-math arithmatex"></div>
    </div>

    <div class="quiz-actions">
      <button type="button" id="quiz-btn-answer" class="quiz-btn quiz-btn-answer">显示答案</button>
      <button type="button" id="quiz-btn-wrong" class="quiz-btn quiz-btn-wrong">加入错题本</button>
      <button type="button" id="quiz-btn-next" class="quiz-btn quiz-btn-next">下一题</button>
    </div>
    <p id="quiz-wrong-tip" class="quiz-wrong-tip" hidden></p>
  </div>

  <p class="quiz-tip">提示：使用右上角邮箱登录后，可将不会的题同步到云端错题本。</p>

</div>

!!! tip "使用说明"
    - 点击 **下一题** 随机抽题；**显示答案** 查看参考答案
    - 右上角用 **邮箱 + 密码** 注册/登录（Supabase 云端账号）
    - 登录后 **加入错题本** 会同步到云端，换设备登录同一邮箱可继续复习
