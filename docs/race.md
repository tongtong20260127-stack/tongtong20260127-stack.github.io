# 选择竞速

限时 **60 秒**，一次只显示一题；提交后进入下一题。时间到自动交卷。  
**需登录**，并先设置昵称（可上传头像）。多选题须全部选对才计正确。

**计分规则（用于排行）：**

`得分 = 正确题数 × 1000 + ⌊正确率 × 100⌋`

正确题数优先，正确率作为同分时的细分。

<div id="race-app" class="race-app" markdown="0">

  <div id="race-gate" class="race-card">
    <p id="race-gate-msg" class="race-muted">正在检查登录状态…</p>
    <div id="race-gate-actions" class="race-actions" hidden></div>
  </div>

  <div id="race-ready" class="race-card" hidden>
    <div class="race-profile-preview">
      <img id="race-ready-avatar" class="race-avatar" alt="头像" />
      <div>
        <div class="race-ready-name" id="race-ready-name">—</div>
        <div class="race-muted">准备好后点击开始。题库将打乱，60 秒倒计时。</div>
      </div>
    </div>
    <button type="button" id="race-btn-start" class="quiz-btn quiz-btn-next">开始竞速</button>
  </div>

  <div id="race-play" class="race-play" hidden>
    <div class="race-hud">
      <div class="race-hud-left">
        <span>第 <strong id="race-q-index">1</strong> 题</span>
        <span class="race-hud-sep">·</span>
        <span>已答 <strong id="race-answered">0</strong></span>
        <span class="race-hud-sep">·</span>
        <span>正确 <strong id="race-correct">0</strong></span>
      </div>
      <div id="race-timer" class="race-timer" aria-live="polite">1:00</div>
    </div>

    <article class="race-question exam-item">
      <div class="exam-item-head">
        <span id="race-meta"></span>
        <span id="race-type-badge" class="exam-diff"></span>
      </div>
      <div id="race-q-text" class="exam-item-q kb-math arithmatex"></div>
      <div id="race-options" class="exam-options"></div>
    </article>

    <div class="race-actions">
      <button type="button" id="race-btn-submit" class="quiz-btn quiz-btn-answer">提交本题</button>
    </div>
  </div>

  <div id="race-result" class="race-card" hidden>
    <h3 class="race-result-title">本场结果</h3>
    <div class="race-result-grid">
      <div><span class="race-muted">作答</span><strong id="race-res-answered">0</strong></div>
      <div><span class="race-muted">正确</span><strong id="race-res-correct">0</strong></div>
      <div><span class="race-muted">正确率</span><strong id="race-res-acc">0%</strong></div>
      <div><span class="race-muted">得分</span><strong id="race-res-score">0</strong></div>
    </div>
    <p id="race-res-rank" class="race-muted"></p>
    <div class="race-actions">
      <button type="button" id="race-btn-again" class="quiz-btn quiz-btn-next">再来一局</button>
      <a class="quiz-btn exam-btn-ghost" href="/account/">修改昵称 / 头像</a>
    </div>
  </div>

  <section id="race-board" class="race-board">
    <div class="race-board-head">
      <h3>排行榜</h3>
      <button type="button" id="race-btn-refresh-board" class="quiz-btn exam-btn-ghost">刷新</button>
    </div>
    <p class="race-muted race-board-note">按历史最高分排序；同时显示你的本场成绩（若有）。</p>
    <div id="race-board-list" class="race-board-list">加载中…</div>
  </section>

</div>
