# 收藏夹 Favorites

登录后可收藏练习题或笔记链接，数据保存在 Supabase 云端。

<div id="fav-app" class="wrongbook-app fav-app" markdown="0">

  <div id="fav-login-prompt" class="wb-login-prompt">
    <p>你当前未登录。请使用邮箱注册/登录后查看云端收藏夹。</p>
    <button type="button" id="fav-open-login" class="quiz-btn quiz-btn-next">去登录 / 注册</button>
  </div>

  <div id="fav-content" hidden>
    <div class="wb-toolbar">
      <div class="wb-userline">
        当前账号：<strong id="fav-user">—</strong>
        · 收藏 <strong id="fav-count">0</strong> 条
      </div>
      <button type="button" id="fav-clear" class="quiz-btn wb-btn-clear">清空收藏夹</button>
    </div>

    <div id="fav-empty" class="wb-empty" hidden>
      收藏夹还是空的。在 <a href="../quiz/">随机练习</a> 中点「收藏」，或在笔记页右下角收藏当前页。
    </div>

    <div id="fav-list" class="wb-list"></div>
  </div>

</div>
