---
layout: home

title: 独家资源专区 - 小二郎资源分享站
description: "独家原创资源：平台专属原创内容、精选合集、独家整理的稀缺资源与精品资料推荐。"
---

<div class="exclusive-hero">
  <div class="hero-icon">💎</div>
  <h1>独家资源专区</h1>
  <p class="hero-subtitle">站长精心对接的优质渠道 · 持续引入更多独家服务</p>
</div>

## 🏆 全部服务

<div class="exclusive-grid">

  <a href="/exclusive/registration-card" class="exclusive-card" style="--accent: #8b5cf6;">
    <div class="ecard-icon">💳</div>
    <div class="ecard-body">
      <h3>注册卡采购</h3>
      <p>提供各类正规行业注册卡、流量卡采购渠道，货源稳定，售后无忧。适合批量采购，支持各类平台注册场景。</p>
      <span class="ecard-tag">长期稳定</span>
    </div>
    <div class="ecard-arrow">→</div>
  </a>

  <a href="/exclusive/data-card" class="exclusive-card" style="--accent: #10b981;">
    <div class="ecard-icon">📱</div>
    <div class="ecard-body">
      <h3>四大运营商大流量卡</h3>
      <p>低月租（19-59元）· 高流量（100-250G），四大运营商官方授权，适合重度上网用户。支持扫码下单，当地运营商直发。</p>
      <span class="ecard-tag">热门</span>
    </div>
    <div class="ecard-arrow">→</div>
  </a>

  <a href="/exclusive/phone-label-clean" class="exclusive-card" style="--accent: #f59e0b;">
    <div class="ecard-icon">🛠️</div>
    <div class="ecard-body">
      <h3>电话号码标记清除</h3>
      <p>专业清除手机号被标记为广告、骚扰、营销等问题，快速恢复号码信誉。支持全平台号码修复，效率高、见效快。</p>
      <span class="ecard-tag">快速见效</span>
    </div>
    <div class="ecard-arrow">→</div>
  </a>

  <!-- 💡 新增服务时，在下方添加同类卡片即可 -->

</div>

---

::: tip 🚀 更多服务持续上线中
本专区持续引入各类优质渠道资源，如需咨询或反馈，请联系管理员。
:::

<style scoped>

.exclusive-hero {
  text-align: center;
  padding: 3rem 1rem 2.5rem;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(16, 185, 129, 0.06));
  border-radius: 20px;
  margin-bottom: 2.5rem;
  border: 1px solid var(--vp-c-divider);
}

.hero-icon {
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.exclusive-hero h1 {
  margin: 0 0 0.5rem;
  font-size: 2rem;
  background: linear-gradient(135deg, #8b5cf6, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

/* ── 大卡片 Grid ── */
.exclusive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.2rem;
  margin: 2rem 0;
}

/* ── 单张卡片 ── */
.exclusive-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-left: 4px solid var(--accent, var(--vp-c-brand-1));
  border-radius: 14px;
  padding: 1.4rem 1.2rem;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.exclusive-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--accent, var(--vp-c-brand-1)) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.exclusive-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  border-color: var(--accent, var(--vp-c-brand-1));
  color: var(--vp-c-text-1);
}

.exclusive-card:hover::before {
  opacity: 0.05;
}

.ecard-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
  line-height: 1;
  position: relative;
  z-index: 1;
}

.ecard-body {
  flex: 1;
  position: relative;
  z-index: 1;
  min-width: 0;
}

.ecard-body h3 {
  margin: 0 0 0.4rem;
  font-size: 1.05rem;
  font-weight: 700;
}

.ecard-body p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
}

.ecard-tag {
  display: inline-block;
  margin-top: 0.6rem;
  font-size: 0.7rem;
  padding: 2px 10px;
  border-radius: 20px;
  background: rgba(139, 92, 246, 0.1);
  color: var(--accent, var(--vp-c-brand-1));
  border: 1px solid color-mix(in srgb, var(--accent, #8b5cf6) 30%, transparent);
  font-weight: 600;
}

.ecard-arrow {
  font-size: 1.4rem;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  transition: transform 0.2s, color 0.2s;
}

.exclusive-card:hover .ecard-arrow {
  transform: translateX(4px);
  color: var(--accent, var(--vp-c-brand-1));
}

@media (max-width: 768px) {
  .exclusive-grid {
    grid-template-columns: 1fr;
  }
  .exclusive-hero h1 {
    font-size: 1.5rem;
  }
}
</style>
