/**
 * 账号资料 — 昵称 + 头像（与 auth.users 绑定）
 */
(function () {
  function $(id) {
    return document.getElementById(id);
  }

  function defaultAvatar(seed) {
    var s = encodeURIComponent(String(seed || "guest").slice(0, 24));
    return "https://api.dicebear.com/7.x/thumbs/svg?seed=" + s + "&backgroundColor=5c6bc0,26c6da,7e57c2";
  }

  function getClient() {
    return window.KBAuth && KBAuth.ensureClient ? KBAuth.ensureClient() : null;
  }

  function setMsg(text, ok) {
    var el = $("account-msg");
    if (!el) return;
    el.hidden = !text;
    el.textContent = text || "";
    el.className = "kb-auth-msg " + (ok ? "ok" : "err");
  }

  function compressImage(file) {
    return new Promise(function (resolve, reject) {
      if (!file || !file.type || file.type.indexOf("image/") !== 0) {
        reject(new Error("请选择图片文件"));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error("图片请小于 5MB"));
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          var size = 128;
          var canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          var ctx = canvas.getContext("2d");
          var scale = Math.max(size / img.width, size / img.height);
          var w = img.width * scale;
          var h = img.height * scale;
          var x = (size - w) / 2;
          var y = (size - h) / 2;
          ctx.fillStyle = "#e8eaf6";
          ctx.fillRect(0, 0, size, size);
          ctx.drawImage(img, x, y, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = function () {
          reject(new Error("无法读取图片"));
        };
        img.src = reader.result;
      };
      reader.onerror = function () {
        reject(new Error("读取失败"));
      };
      reader.readAsDataURL(file);
    });
  }

  async function loadProfileIntoForm() {
    var user = KBAuth.currentUserFull && KBAuth.currentUserFull();
    if (!user) return;
    var sb = getClient();
    if (!sb) return;
    var res = await sb
      .from("profiles")
      .select("nickname, avatar_url")
      .eq("user_id", user.id)
      .maybeSingle();
    var data = res.data || {};
    var nick = data.nickname || "";
    var av = data.avatar_url || defaultAvatar(user.id);
    $("account-nickname").value = nick;
    $("account-avatar-preview").src = av;
    $("account-avatar-preview").dataset.url = data.avatar_url || "";
  }

  async function refresh() {
    if (!$("account-app")) return;
    await (KBAuth.refreshSession ? KBAuth.refreshSession() : Promise.resolve());
    var user = KBAuth.currentUserFull && KBAuth.currentUserFull();
    var gate = $("account-gate");
    var form = $("account-form-wrap");
    if (!user) {
      gate.hidden = false;
      form.hidden = true;
      $("account-gate-msg").textContent = "请先登录后再设置昵称与头像。";
      var actions = $("account-gate-actions");
      actions.hidden = false;
      actions.innerHTML =
        '<button type="button" class="quiz-btn quiz-btn-next" id="account-open-login">登录 / 注册</button>';
      var b = $("account-open-login");
      if (b)
        b.onclick = function () {
          if (KBAuth.openModal) KBAuth.openModal();
        };
      return;
    }
    gate.hidden = true;
    form.hidden = false;
    await loadProfileIntoForm();
  }

  async function save() {
    var user = KBAuth.currentUserFull && KBAuth.currentUserFull();
    if (!user) {
      setMsg("请先登录", false);
      return;
    }
    var nick = ($("account-nickname").value || "").trim();
    if (nick.length < 2 || nick.length > 20) {
      setMsg("昵称需为 2～20 个字符", false);
      return;
    }
    var av = $("account-avatar-preview").dataset.url || null;
    if (av === "") av = null;

    var sb = getClient();
    if (!sb) {
      setMsg("无法连接后端", false);
      return;
    }
    var row = {
      user_id: user.id,
      nickname: nick,
      avatar_url: av,
      updated_at: new Date().toISOString()
    };
    var res = await sb.from("profiles").upsert(row, { onConflict: "user_id" });
    if (res.error) {
      console.error("[Account]", res.error);
      setMsg(
        "保存失败：" +
          (res.error.message || "请确认已创建 profiles 表及 RLS 策略"),
        false
      );
      return;
    }
    setMsg("已保存", true);
  }

  function bind() {
    var root = $("account-app");
    if (!root || root.dataset.bound === "1") return;
    root.dataset.bound = "1";

    if ($("account-btn-save")) $("account-btn-save").addEventListener("click", save);

    if ($("account-avatar-input"))
      $("account-avatar-input").addEventListener("change", function (e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;
        compressImage(file)
          .then(function (dataUrl) {
            $("account-avatar-preview").src = dataUrl;
            $("account-avatar-preview").dataset.url = dataUrl;
            setMsg("头像已选择，请点击保存", true);
          })
          .catch(function (err) {
            setMsg(err.message || "上传失败", false);
          });
      });

    if ($("account-avatar-default"))
      $("account-avatar-default").addEventListener("click", function () {
        var user = KBAuth.currentUserFull && KBAuth.currentUserFull();
        var seed = user ? user.id : "guest";
        var url = defaultAvatar(seed);
        $("account-avatar-preview").src = url;
        $("account-avatar-preview").dataset.url = "";
        setMsg("已切换为默认头像，请点击保存", true);
      });

    window.addEventListener("kb-auth-change", refresh);
  }

  function boot() {
    if (!$("account-app")) return;
    if (!window.KBAuth) {
      setTimeout(boot, 60);
      return;
    }
    bind();
    refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      var root = document.getElementById("account-app");
      if (root) root.dataset.bound = "0";
      setTimeout(boot, 0);
    });
  }
})();
