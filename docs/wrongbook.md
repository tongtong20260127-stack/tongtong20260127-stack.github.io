# 错题本 Wrong Book

登录后，在随机练习中可将题目加入错题本。数据保存在 Supabase 云端，按账号隔离。

<div id="wrongbook-app" class="wrongbook-app" markdown="0">

  <div id="wb-login-prompt" class="wb-login-prompt">
    <p>你当前未登录。请使用邮箱注册/登录后查看云端错题本。</p>
    <button type="button" id="wb-open-login" class="quiz-btn quiz-btn-next">去登录 / 注册</button>
  </div>

  <div id="wb-content" hidden>
    <div class="wb-toolbar">
      <div class="wb-userline">
        当前账号：<strong id="wb-user">—</strong>
        · 错题 <strong id="wb-count">0</strong> 道
      </div>
      <button type="button" id="wb-clear" class="quiz-btn wb-btn-clear">清空错题本</button>
    </div>

    <div id="wb-empty" class="wb-empty" hidden>
      错题本还是空的。去 <a href="../quiz/">随机练习</a> 把不会的题加进来吧。
    </div>

    <div id="wb-list" class="wb-list"></div>
  </div>

</div>

!!! tip "说明"
    - 登录方式：邮箱 + 密码（云端账号）
    - 若注册后无法登录，请到 Supabase 控制台关闭 Email 的 Confirm email，或查收验证邮件
    - 若提示表不存在，请在 SQL Editor 执行建表语句（见接入说明）
