# 给站长留言

登录后可向站长发送建议、纠错或交流。留言保存在 Supabase，仅你与站长（通过后台）可见。

<div id="msg-app" class="wrongbook-app msg-app" markdown="0">

  <div id="msg-login-prompt" class="wb-login-prompt">
    <p>留言需先登录。请使用邮箱注册 / 登录后再填写。</p>
    <button type="button" id="msg-open-login" class="quiz-btn quiz-btn-next">去登录 / 注册</button>
  </div>

  <div id="msg-content" hidden>
    <div class="wb-toolbar">
      <div class="wb-userline">
        当前账号：<strong id="msg-user">—</strong>
      </div>
    </div>

    <form id="msg-form" class="msg-form">
      <label class="msg-field">
        <span>标题（可选）</span>
        <input type="text" id="msg-title" maxlength="80" placeholder="例如：某页公式笔误 / 功能建议" />
      </label>
      <label class="msg-field">
        <span>留言内容</span>
        <textarea id="msg-body" rows="6" maxlength="2000" required placeholder="请具体说明，方便站长处理。最多 2000 字。"></textarea>
      </label>
      <p id="msg-form-tip" class="quiz-wrong-tip" hidden></p>
      <button type="submit" id="msg-submit" class="quiz-btn quiz-btn-next">发送留言</button>
    </form>

    <h3 class="msg-history-title">我的留言记录</h3>
    <div id="msg-empty" class="wb-empty" hidden>你还没有发过留言。</div>
    <div id="msg-list" class="wb-list"></div>
  </div>

</div>

!!! tip "说明"
    - 必须登录后才能提交
    - 你可以在本页查看自己发过的留言
    - 站长在 Supabase **Table Editor → messages** 中查看全部留言
