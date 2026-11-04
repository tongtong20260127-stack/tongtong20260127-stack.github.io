# 错题本 Wrong Book

登录后，在随机练习中可将题目加入错题本，按账号独立保存，便于复习巩固。

<div id="wrongbook-app" class="wrongbook-app" markdown="0">

  <div id="wb-login-prompt" class="wb-login-prompt">
    <p>你当前未登录。请先登录或注册账号，才能查看和使用错题本。</p>
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

!!! warning "数据说明"
    本站为静态页面，账号与错题本保存在 **当前浏览器的本地存储** 中，不会上传到服务器。更换设备、清除浏览器数据或使用无痕模式将无法同步或会丢失数据。
