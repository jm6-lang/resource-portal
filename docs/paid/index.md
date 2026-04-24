---
title: 付费精品资源
description: 精选高质量付费资源，一次购买永久使用。支持单资源购买和会员订阅，会员可畅享全部资源。
---

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const API_BASE = 'https://skillxm-payment.你的用户名.workers.dev'

// Order query component
const queryOrderId = ref('')
const queryLoading = ref(false)
const queryResult = ref(null)
const queryError = ref('')

async function handleQuery() {
  if (!queryOrderId.value.trim()) return
  queryLoading.value = true
  queryError.value = ''
  queryResult.value = null
  try {
    const res = await fetch(`${API_BASE}/api/order-status?orderId=${queryOrderId.value.trim()}`)
    const data = await res.json()
    if (data.code === 0) {
      queryResult.value = data.data
    } else {
      queryError.value = data.msg || '查询失败，请检查订单号是否正确'
    }
  } catch {
    queryError.value = '网络错误，请稍后重试'
  } finally {
    queryLoading.value = false
  }
}
</script>

<div class="paid-hero">
  <h1 class="paid-hero-title">&#x1F3A8; 付费精品资源</h1>
  <p class="paid-hero-desc">精选高质量付费资源，一次购买永久使用。支持单资源购买和会员订阅，会员可畅享全部资源。</p>
</div>

## 会员计划

开通会员，解锁全部付费资源，享受持续更新的优质内容。

<MembershipCard />

## 精品资源

<div class="paid-section-divider"></div>

<PaidResourceList />

## 购买流程

<div class="purchase-flow">
  <div class="purchase-flow-step">
    <div class="purchase-flow-number">1</div>
    <h4>选择资源</h4>
    <p>浏览资源列表，选择您需要的资源或开通会员</p>
  </div>
  <div class="purchase-flow-step">
    <div class="purchase-flow-number">2</div>
    <h4>确认支付</h4>
    <p>点击购买按钮，系统将自动创建订单并跳转至支付页面</p>
  </div>
  <div class="purchase-flow-step">
    <div class="purchase-flow-number">3</div>
    <h4>获取资源</h4>
    <p>支付完成后自动返回，系统将发放访问令牌</p>
  </div>
</div>

## 常见问题

### 购买后如何获取资源？

支付完成后，系统会自动跳转回本站并显示访问令牌。如果未自动跳转，请前往 [支付结果页面](/paid/callback) 或 [订单查询页面](/paid/order-query) 手动查询。

### 会员和单资源购买有什么区别？

- **单资源购买**：仅解锁指定资源，适合只需单个资源的用户
- **年度会员**：一年内畅享全部资源，适合需要多个资源的用户
- **永久会员**：一次付费终身使用，未来新资源自动解锁，性价比最高

### 支付方式有哪些？

目前支持微信支付和支付宝。在支付页面可以选择您偏好的支付方式。

### 访问令牌丢失了怎么办？

您可以在 [订单查询页面](/paid/order-query) 输入订单号重新获取令牌。建议购买后立即保存令牌。

### 可以退款吗？

由于数字资源的特殊性，支付成功后暂不支持退款。请在购买前仔细阅读资源说明。

<style>
.paid-hero {
  text-align: center;
  padding: 2.5rem 1rem 1.5rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 165, 0, 0.05) 100%);
  border-radius: 16px;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 165, 0, 0.15);
}

.paid-hero-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 0.75rem;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.paid-hero-desc {
  color: var(--vp-c-text-2);
  font-size: 1rem;
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
}

.paid-section-divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #FFD700, #FFA500);
  border-radius: 2px;
  margin: 2rem auto;
}

/* Purchase Flow */
.purchase-flow {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 1.5rem 0;
}

.purchase-flow-step {
  text-align: center;
  padding: 1.5rem 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  transition: all 0.3s;
}

.purchase-flow-step:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.purchase-flow-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #1a1a2e;
  font-size: 1.1rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
}

.dark .purchase-flow-number {
  color: #fff;
}

.purchase-flow-step h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.purchase-flow-step p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

@media (max-width: 640px) {
  .purchase-flow {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .paid-hero-title {
    font-size: 1.5rem;
  }
}
</style>


