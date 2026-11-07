/**
 * Favorites API extension for KBAuth
 */
(function () {
  var favCache = [];

  function mapFavRow(row) {
    return {
      id: row.item_hash || row.id,
      dbId: row.id,
      subject: row.subject,
      topic: row.topic,
      title: row.title,
      content: row.content,
      link: row.link,
      addedAt: row.created_at
    };
  }

  function favoriteId(item) {
    var h = window.KBAuth && KBAuth.simpleHash;
    if (!h) return String(Date.now());
    return h(
      (item.subject || "") +
        "|" +
        (item.topic || "") +
        "|" +
        (item.title || "") +
        "|" +
        (item.content || "") +
        "|" +
        (item.link || "")
    );
  }

  async function loadFavorites() {
    if (!window.KBAuth || !KBAuth.ensureClient) return [];
    var sb = KBAuth.ensureClient();
    var user = KBAuth.currentUserFull && KBAuth.currentUserFull();
    if (!sb || !user) {
      favCache = [];
      return [];
    }
    var res = await sb
      .from("favorites")
      .select("id, subject, topic, title, content, link, item_hash, created_at")
      .order("created_at", { ascending: false });
    if (res.error) {
      console.error("[Fav] load failed", res.error);
      favCache = [];
      return [];
    }
    favCache = (res.data || []).map(mapFavRow);
    return favCache;
  }

  function getFavorites() {
    return favCache.slice();
  }

  async function addFavorite(item) {
    if (!window.KBAuth || !KBAuth.ensureClient) return { ok: false, msg: "未就绪" };
    var sb = KBAuth.ensureClient();
    var user = KBAuth.currentUserFull && KBAuth.currentUserFull();
    if (!sb) return { ok: false, msg: "Supabase 未初始化" };
    if (!user) return { ok: false, reason: "not_login", msg: "请先登录" };
    var hash = favoriteId(item);
    if (favCache.some(function (x) { return x.id === hash; })) {
      return { ok: true, reason: "exists", count: favCache.length };
    }
    var res = await sb
      .from("favorites")
      .insert({
        user_id: user.id,
        subject: item.subject || "",
        topic: item.topic || "",
        title: item.title || item.content || "收藏",
        content: item.content || item.title || "",
        link: item.link || "",
        item_hash: hash
      })
      .select("id, subject, topic, title, content, link, item_hash, created_at")
      .single();
    if (res.error) {
      if (String(res.error.code) === "23505" || /duplicate/i.test(res.error.message || "")) {
        await loadFavorites();
        return { ok: true, reason: "exists", count: favCache.length };
      }
      return {
        ok: false,
        msg: res.error.message || "请先在 Supabase SQL Editor 创建 favorites 表"
      };
    }
    favCache.unshift(mapFavRow(res.data));
    return { ok: true, reason: "added", count: favCache.length };
  }

  async function removeFavorite(id) {
    if (!window.KBAuth || !KBAuth.ensureClient) return false;
    var sb = KBAuth.ensureClient();
    var user = KBAuth.currentUserFull && KBAuth.currentUserFull();
    if (!sb || !user) return false;
    var res = await sb.from("favorites").delete().eq("item_hash", id);
    if (res.error) res = await sb.from("favorites").delete().eq("id", id);
    if (res.error) return false;
    favCache = favCache.filter(function (item) {
      return item.id !== id && item.dbId !== id;
    });
    return true;
  }

  async function clearFavorites() {
    if (!window.KBAuth || !KBAuth.ensureClient) return false;
    var sb = KBAuth.ensureClient();
    var user = KBAuth.currentUserFull && KBAuth.currentUserFull();
    if (!sb || !user) return false;
    var res = await sb.from("favorites").delete().eq("user_id", user.id);
    if (res.error) return false;
    favCache = [];
    return true;
  }

  function attach() {
    if (!window.KBAuth) {
      setTimeout(attach, 50);
      return;
    }
    KBAuth.getFavorites = getFavorites;
    KBAuth.loadFavorites = loadFavorites;
    KBAuth.addFavorite = addFavorite;
    KBAuth.removeFavorite = removeFavorite;
    KBAuth.clearFavorites = clearFavorites;
    KBAuth.favoriteId = favoriteId;

    if (KBAuth.currentUser()) {
      loadFavorites().then(function () {
        window.dispatchEvent(new CustomEvent("kb-auth-change"));
      });
    }
    window.addEventListener("kb-auth-change", function () {
      if (KBAuth.currentUser()) loadFavorites();
      else favCache = [];
    });
  }

  attach();
})();
