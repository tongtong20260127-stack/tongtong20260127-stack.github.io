// 轻微页面增强：卡片入场动画
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".kb-card, .kb-stat");
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(16px)";
    card.style.transition = `opacity 0.45s ease ${index * 0.06}s, transform 0.45s ease ${index * 0.06}s`;
    observer.observe(card);
  });
});
