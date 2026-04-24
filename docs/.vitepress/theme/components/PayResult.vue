<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const API_BASE = 'https://skillxm-payment.你的用户名.workers.dev'

const status = ref<'checking' | 'paid' | 'timeout' | 'error'>('checking')
const orderData = ref<any>(null)
const accessToken = ref('')
const membershipToken = ref('')
const copied = ref(false)
let pollTimer: number | null = null
let startTime = 0

onMounted(() => {
  const orderId = localStorage.getItem('pending_order_id')
  if (!orderId) {
    status.value = 'error'
    return
  }
  startTime = Date.now()
  pollOrderStatus(orderId)
})

function pollOrderStatus(orderId: string) {
  // Immediate first check
  checkStatus(orderId)

  pollTimer = window.setInterval(async () => {
    if (Date.now() - startTime > 180000) {
      clearInterval(pollTimer!)
      status.value = 'timeout'
      return
    }
    await checkStatus(orderId)
  }, 2000)
}

async function checkStatus(orderId: string) {
  try {
    const res = await fetch(`${API_BASE}/api/order-status?orderId=${orderId}`)
    const data = await res.json()
    if (data.code === 0 && data.data?.status === 'paid') {
      if (pollTimer) clearInterval(pollTimer)
      orderData.value = data.data
      if (data.data.type === 'resource') {
        accessToken.value = data.data.accessToken || ''
        localStorage.setItem('access_token_' + data.data.resourceId, accessToken.value)
      } else {
        membershipToken.value = data.data.membershipToken || ''
        localStorage.setItem('membership_token', membershipToken.value)
      }
      localStorage.removeItem('pending_order_id')
      status.value = 'paid'
    }
  } catch (e) {
    // Ignore poll errors, keep polling
  }
}

function retryCheck() {
  const orderId = localStorage.getItem('pending_order_id')
  if (!orderId) return
  status.value = 'checking'
  startTime = Date.now()
  pollOrderStatus(orderId)
}

async function copyToken() {
  const token = accessToken.value || membershipToken.value
  if (!token) return
  try {
    await navigator.clipboard.writeText(token)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback
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

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<template>
  <div class="pay-result-card">
    <!-- Checking State -->
    <div v-if="status === 'checking'" class="pay-result-state pay-result-checking">
      <div class="pay-result-spinner"></div>
      <h3 class="pay-result-title">正在查询支付结果...</h3>
      <p class="pay-result-desc">请稍候，系统正在确认您的支付状态</p>
      <div class="pay-result-progress">
        <div class="pay-result-progress-bar"></div>
      </div>
    </div>

    <!-- Paid State -->
    <div v-else-if="status === 'paid'" class="pay-result-state pay-result-success">
      <div class="pay-result-icon">&#x2705;</div>
      <h3 class="pay-result-title">支付成功！</h3>
      <div class="pay-result-details">
        <div class="pay-result-row">
          <span class="pay-result-label">订单编号：</span>
          <span class="pay-result-value">{{ orderData?.orderId }}</span>
        </div>
        <div class="pay-result-row">
          <span class="pay-result-label">订单类型：</span>
          <span class="pay-result-value">{{ orderData?.type === 'resource' ? '资源购买' : '会员开通' }}</span>
        </div>
        <div class="pay-result-row">
          <span class="pay-result-label">支付金额：</span>
          <span class="pay-result-value pay-result-amount">&yen;{{ orderData?.amount }}</span>
        </div>
        <div v-if="orderData?.resourceName" class="pay-result-row">
          <span class="pay-result-label">资源名称：</span>
          <span class="pay-result-value">{{ orderData.resourceName }}</span>
        </div>
      </div>

      <!-- Access Token for resource -->
      <div v-if="accessToken" class="pay-result-token">
        <div class="pay-result-token-header">
          <span>访问令牌</span>
          <button class="pay-result-copy-btn" @click="copyToken">
            {{ copied ? '已复制' : '复制' }}
          </button>
        </div>
        <div class="pay-result-token-value">{{ accessToken }}</div>
        <p class="pay-result-token-hint">请妥善保存此令牌，用于访问已购买的资源</p>
      </div>

      <!-- Membership info -->
      <div v-if="membershipToken" class="pay-result-token">
        <div class="pay-result-token-header">
          <span>会员令牌</span>
          <button class="pay-result-copy-btn" @click="copyToken">
            {{ copied ? '已复制' : '复制' }}
          </button>
        </div>
        <div class="pay-result-token-value">{{ membershipToken }}</div>
        <p class="pay-result-token-hint">会员已激活，您现在可以畅享所有付费资源</p>
      </div>

      <div class="pay-result-actions">
        <a href="/paid/" class="pay-result-btn pay-result-btn-primary">浏览付费资源</a>
        <a href="/" class="pay-result-btn pay-result-btn-secondary">返回首页</a>
      </div>
    </div>

    <!-- Timeout State -->
    <div v-else-if="status === 'timeout'" class="pay-result-state pay-result-timeout">
      <div class="pay-result-icon">&#x23F0;</div>
      <h3 class="pay-result-title">查询超时</h3>
      <p class="pay-result-desc">
        支付结果查询已超时，但您的支付可能已经成功。
        请前往<a href="/paid/order-query" class="pay-result-link">订单查询页面</a>手动查询。
      </p>
      <div class="pay-result-actions">
        <button class="pay-result-btn pay-result-btn-primary" @click="retryCheck">
          继续查询
        </button>
        <a href="/paid/order-query" class="pay-result-btn pay-result-btn-secondary">
          手动查询
        </a>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="pay-result-state pay-result-error">
      <div class="pay-result-icon">&#x274C;</div>
      <h3 class="pay-result-title">未找到待查询的订单</h3>
      <p class="pay-result-desc">
        系统未检测到待处理的支付订单。如果您已完成支付，请前往
        <a href="/paid/order-query" class="pay-result-link">订单查询页面</a>输入订单号查询。
      </p>
      <div class="pay-result-actions">
        <a href="/paid/" class="pay-result-btn pay-result-btn-primary">浏览付费资源</a>
        <a href="/paid/order-query" class="pay-result-btn pay-result-btn-secondary">
          订单查询
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pay-result-card {
  max-width: 560px;
  margin: 2rem auto;
  border-radius: 16px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.pay-result-state {
  padding: 2.5rem 2rem;
  text-align: center;
}

.pay-result-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  line-height: 1;
}

.pay-result-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 0.75rem;
}

.pay-result-desc {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 1.5rem;
}

.pay-result-link {
  color: #FFA500;
  text-decoration: underline;
  font-weight: 600;
}

/* Checking spinner */
.pay-result-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--vp-c-divider);
  border-top-color: #FFA500;
  border-radius: 50%;
  animation: pr-spin 0.8s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes pr-spin {
  to { transform: rotate(360deg); }
}

.pay-result-progress {
  width: 100%;
  height: 4px;
  background: var(--vp-c-divider);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 1rem;
}

.pay-result-progress-bar {
  width: 30%;
  height: 100%;
  background: linear-gradient(90deg, #FFD700, #FFA500);
  border-radius: 2px;
  animation: pr-progress 1.5s ease-in-out infinite;
}

@keyframes pr-progress {
  0% { transform: translateX(-100%); width: 30%; }
  50% { width: 60%; }
  100% { transform: translateX(400%); width: 30%; }
}

/* Success details */
.pay-result-details {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin: 1.5rem 0;
  text-align: left;
}

.pay-result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.pay-result-row + .pay-result-row {
  border-top: 1px solid var(--vp-c-divider);
}

.pay-result-label {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  flex-shrink: 0;
}

.pay-result-value {
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  font-weight: 600;
  word-break: break-all;
  text-align: right;
}

.pay-result-amount {
  color: #FFA500;
  font-size: 1.1rem;
}

/* Token display */
.pay-result-token {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin: 1rem 0;
  text-align: left;
}

.pay-result-token-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
}

.pay-result-copy-btn {
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pay-result-copy-btn:hover {
  border-color: #FFA500;
  color: #FFA500;
}

.pay-result-token-value {
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

.pay-result-token-hint {
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

/* Action buttons */
.pay-result-actions {
  display: flex;
  gap: 12px;
  margin-top: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.pay-result-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.25s;
  cursor: pointer;
  border: none;
}

.pay-result-btn-primary {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #1a1a2e;
  box-shadow: 0 2px 8px rgba(255, 165, 0, 0.3);
}

.pay-result-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 165, 0, 0.4);
}

.dark .pay-result-btn-primary {
  color: #fff;
}

.pay-result-btn-secondary {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.pay-result-btn-secondary:hover {
  border-color: #FFA500;
  color: #FFA500;
}

/* Mobile */
@media (max-width: 640px) {
  .pay-result-state {
    padding: 1.5rem 1rem;
  }

  .pay-result-title {
    font-size: 1.2rem;
  }

  .pay-result-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .pay-result-value {
    text-align: left;
  }

  .pay-result-actions {
    flex-direction: column;
  }

  .pay-result-btn {
    width: 100%;
  }
}
</style>
