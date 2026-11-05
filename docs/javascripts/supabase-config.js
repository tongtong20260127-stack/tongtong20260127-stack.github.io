/**
 * Supabase 前端配置（Publishable / anon key 可公开用于浏览器）
 * 请勿把 service_role / secret key 放进前端代码
 */
window.KB_SUPABASE = {
  url: "https://viqxwlffleawbasnxcmd.supabase.co",
  // 若登录失败，可到 Supabase → Project Settings → API
  // 再复制 Legacy anon (JWT, 以 eyJ 开头) 替换下面这一行
  key: "sb_publishable_TfeyhwE2VYdVB0CVw9WP_g_5SmAcTh_"
};
