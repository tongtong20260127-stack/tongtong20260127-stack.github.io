# 我的账号

登录后可设置**昵称**与**头像**。这些信息与账号绑定，用于「选择竞速」排行榜展示。

<div id="account-app" class="account-app" markdown="0">

  <div id="account-gate" class="race-card">
    <p id="account-gate-msg" class="race-muted">正在检查登录状态…</p>
    <div id="account-gate-actions" class="race-actions" hidden></div>
  </div>

  <div id="account-form-wrap" class="race-card" hidden>
    <div class="account-avatar-row">
      <img id="account-avatar-preview" class="race-avatar race-avatar-lg" alt="头像预览" />
      <div class="account-avatar-actions">
        <label class="quiz-btn exam-btn-ghost account-file-label">
          上传头像
          <input type="file" id="account-avatar-input" accept="image/*" hidden />
        </label>
        <button type="button" id="account-avatar-default" class="quiz-btn exam-btn-ghost">使用默认头像</button>
        <p class="race-muted">建议正方形图片，将自动压缩为约 128×128。</p>
      </div>
    </div>

    <label class="quiz-label account-nick-label">昵称
      <input type="text" id="account-nickname" class="account-input" maxlength="20" placeholder="2～20 个字符" />
    </label>

    <p id="account-msg" class="kb-auth-msg" hidden></p>

    <div class="race-actions">
      <button type="button" id="account-btn-save" class="quiz-btn quiz-btn-next">保存资料</button>
      <a class="quiz-btn exam-btn-ghost" href="/race/">去竞速</a>
    </div>
  </div>

</div>
