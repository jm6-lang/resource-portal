---
title: 支付结果
description: 查看您的支付结果和订单详情
---

<div class="callback-page">
  <div class="callback-intro">
    <h1>支付结果查询</h1>
    <p>系统正在自动查询您的支付状态，请稍候...</p>
    <p class="callback-hint">如果您刚完成支付，系统将自动确认并显示结果。通常需要 3-10 秒。</p>
  </div>

  <PayResult />
</div>

<style>
.callback-page {
  max-width: 700px;
  margin: 0 auto;
}

.callback-intro {
  text-align: center;
  margin-bottom: 1rem;
}

.callback-intro h1 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem;
}

.callback-intro p {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  margin: 0 0 0.25rem;
}

.callback-hint {
  font-size: 0.85rem !important;
  color: var(--vp-c-text-3) !important;
}
</style>
