---
title: 订单查询
description: 手动查询订单支付状态和获取访问令牌
---

<script setup>
import { ref } from 'vue'

const API_BASE = 'https://skillxm-payment.你的用户名.workers.dev'

const queryOrderId = ref('')
const queryLoading = ref(false)
const queryResult = ref(null)
const queryError = ref('')
const copied = ref(false)

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

async function copyToken() {
  const token = queryResult.value?.accessToken || queryResult.value?.membershipToken
  if (!token) return
  try {
    await navigator.clipboard.writeText(token)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = token
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}

function getStatusText(status) {
  const map = {
    pending: '待支付',
    paid: '已支付',
    expired: '已过期',
    refunded: '已退款'
  }
  return map[status] || status
}

function getTypeText(type) {
  const map = {
    resource: '资源购买',
    yearly: '年度会员',
    permanent: '永久会员'
  }
  return map[type] || type
}
</script>

<div class="order-query-page">
  <h1>订单查询</h1>
  <p class="order-query-desc">输入您的订单号，查询支付状态并获取访问令牌。</p>

  <div class="order-query-form">
    <div class="order-query-input-group">
      <input
        v-model="queryOrderId"
        type="text"
        class="order-query-input"
        placeholder="请输入订单号"
        @keyup.enter="handleQuery"
      />
      <button
        class="order-query-btn"
        :class="{ 'is-loading': queryLoading }"
        :disabled="queryLoading || !queryOrderId.trim()"
        @click="handleQuery"
      >
        {{ queryLoading ? '查询中...' : '查询订单' }}
      </button>
    </div>
  </div>

  <!-- Error -->
  <div v-if="queryError" class="order-query-error">
    {{ queryError }}
  </div>

  <!-- Result -->
  <div v-if="queryResult" class="order-query-result">
    <div class="order-query-result-header">
      <span class="order-query-status" :class="'status-' + queryResult.status">
        {{ getStatusText(queryResult.status) }}
      </span>
      <span class="order-query-type">{{ getTypeText(queryResult.type) }}</span>
    </div>

    <div class="order-query-details">
      <div class="order-query-row">
        <span class="order-query-label">订单编号</span>
        <span class="order-query-value">{{ queryResult.orderId }}</span>
      </div>
      <div class="order-query-row">
        <span class="order-query-label">订单类型</span>
        <span class="order-query-value">{{ getTypeText(queryResult.type) }}</span>
      </div>
      <div class="order-query-row">
        <span class="order-query-label">支付金额</span>
        <span class="order-query-value order-query-amount">&yen;{{ queryResult.amount }}</span>
      </div>
      <div class="order-query-row">
        <span class="order-query-label">创建时间</span>
        <span class="order-query-value">{{ queryResult.createdAt }}</span>
      </div>
      <div v-if="queryResult.resourceName" class="order-query-row">
        <span class="order-query-label">资源名称</span>
        <span class="order-query-value">{{ queryResult.resourceName }}</span>
      </div>
    </div>

    <!-- Token for paid orders -->
    <div v-if="queryResult.status === 'paid'" class="order-query-token">
      <div class="order-query-token-header">
        <span>{{ queryResult.type === 'resource' ? '访问令牌' : '会员令牌' }}</span>
        <button class="order-query-copy-btn" @click="copyToken">
          {{ copied ? '已复制' : '复制令牌' }}
        </button>
      </div>
      <div class="order-query-token-value">
        {{ queryResult.accessToken || queryResult.membershipToken }}
      </div>
      <p class="order-query-token-hint">请妥善保存此令牌，用于访问已购买的资源</p>
    </div>

    <!-- Pending hint -->
    <div v-if="queryResult.status === 'pending'" class="order-query-pending-hint">
      该订单尚未完成支付。如已支付，请稍后再次查询，系统可能需要几分钟同步支付结果。
    </div>
  </div>

  <div class="order-query-tips">
    <h3>温馨提示</h3>
    <ul>
      <li>订单号在创建订单时会显示，请妥善记录</li>
      <li>支付完成后通常需要 1-5 分钟同步结果</li>
      <li>如果长时间未同步，请联系客服处理</li>
    </ul>
  </div>
</div>

<style>
.order-query-page {
  max-width: 600px;
  margin: 0 auto;
}

.order-query-page h1 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem;
}

.order-query-desc {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  margin: 0 0 1.5rem;
}

/* Form */
.order-query-form {
  margin-bottom: 1.5rem;
}

.order-query-input-group {
  display: flex;
  gap: 10px;
}

.order-query-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  outline: none;
  transition: all 0.25s;
}

.order-query-input:focus {
  border-color: #FFA500;
  box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.1);
}

.order-query-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #1a1a2e;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
  white-space: nowrap;
}

.dark .order-query-btn {
  color: #fff;
}

.order-query-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 165, 0, 0.3);
}

.order-query-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Error */
.order-query-error {
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 10px;
  color: #ef4444;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

/* Result */
.order-query-result {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.order-query-result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.order-query-status {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
}

.status-paid {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-pending {
  background: rgba(255, 165, 0, 0.1);
  color: #FFA500;
}

.status-expired {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.status-refunded {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.order-query-type {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  font-weight: 600;
}

/* Details */
.order-query-details {
  padding: 0.75rem 1.25rem;
}

.order-query-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0;
}

.order-query-row + .order-query-row {
  border-top: 1px solid var(--vp-c-divider);
}

.order-query-label {
  color: var(--vp-c-text-2);
  font-size: 0.88rem;
  flex-shrink: 0;
}

.order-query-value {
  color: var(--vp-c-text-1);
  font-size: 0.88rem;
  font-weight: 600;
  text-align: right;
  word-break: break-all;
}

.order-query-amount {
  color: #FFA500;
  font-size: 1.05rem;
}

/* Token */
.order-query-token {
  margin: 0 1.25rem 1rem;
  padding: 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
}

.order-query-token-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.88rem;
  color: var(--vp-c-text-1);
}

.order-query-copy-btn {
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.order-query-copy-btn:hover {
  border-color: #FFA500;
  color: #FFA500;
}

.order-query-token-value {
  background: var(--vp-c-bg-soft);
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  padding: 0.75rem;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  word-break: break-all;
  line-height: 1.5;
  user-select: all;
}

.order-query-token-hint {
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

/* Pending hint */
.order-query-pending-hint {
  margin: 0 1.25rem 1rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 165, 0, 0.08);
  border: 1px solid rgba(255, 165, 0, 0.15);
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* Tips */
.order-query-tips {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.25rem;
}

.order-query-tips h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 0.75rem;
}

.order-query-tips ul {
  padding-left: 1.25rem;
  margin: 0;
}

.order-query-tips li {
  color: var(--vp-c-text-2);
  font-size: 0.88rem;
  line-height: 1.8;
}

@media (max-width: 640px) {
  .order-query-input-group {
    flex-direction: column;
  }

  .order-query-btn {
    width: 100%;
  }

  .order-query-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .order-query-value {
    text-align: left;
  }
}
</style>
