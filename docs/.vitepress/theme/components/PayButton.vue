<script setup lang="ts">
import { ref } from 'vue'

const API_BASE = 'https://skillxm-payment.你的用户名.workers.dev'

const props = defineProps<{
  type: 'resource' | 'yearly' | 'permanent'
  resourceId?: string
  resourceName?: string
  price: number
}>()

const loading = ref(false)
const error = ref('')

async function handlePay() {
  loading.value = true
  error.value = ''
  try {
    const body: any = { type: props.type }
    if (props.type === 'resource') {
      body.resourceId = props.resourceId
    } else {
      body.membershipType = props.type
    }

    const res = await fetch(`${API_BASE}/api/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json()

    if (data.code === 0 && data.data?.paymentUrl) {
      localStorage.setItem('pending_order_id', data.data.orderId)
      window.location.href = data.data.paymentUrl
    } else {
      error.value = data.msg || '创建订单失败，请稍后重试'
    }
  } catch (e) {
    error.value = '网络错误，请检查网络连接后重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="pay-button-wrapper">
    <button
      class="pay-btn"
      :class="{ 'is-loading': loading }"
      :disabled="loading"
      @click="handlePay"
    >
      <span v-if="loading" class="pay-btn-spinner"></span>
      <span v-else class="pay-btn-icon">&#x1F4B3;</span>
      <span class="pay-btn-text">
        {{ loading ? '正在创建订单...' : (type === 'resource' ? '立即购买' : '立即开通') }}
      </span>
      <span class="pay-btn-price">&yen;{{ price }}</span>
    </button>
    <div v-if="error" class="pay-btn-error">
      <span class="pay-btn-error-icon">&#x26A0;</span>
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.pay-button-wrapper {
  display: inline-block;
  width: 100%;
}

.pay-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%);
  color: #1a1a2e;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(255, 165, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
}

.pay-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s;
}

.pay-btn:hover::before {
  left: 100%;
}

.pay-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 165, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.15);
}

.pay-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(255, 165, 0, 0.3);
}

.pay-btn.is-loading {
  cursor: not-allowed;
  opacity: 0.85;
}

.pay-btn-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.pay-btn-text {
  flex: 1;
  text-align: center;
}

.pay-btn-price {
  background: rgba(0, 0, 0, 0.15);
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 800;
  flex-shrink: 0;
}

/* Spinner */
.pay-btn-spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(26, 26, 46, 0.2);
  border-top-color: #1a1a2e;
  border-radius: 50%;
  animation: pay-spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes pay-spin {
  to { transform: rotate(360deg); }
}

/* Error */
.pay-btn-error {
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  color: #ef4444;
  font-size: 0.85rem;
  text-align: center;
  animation: pay-shake 0.4s ease;
}

.pay-btn-error-icon {
  margin-right: 4px;
}

@keyframes pay-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

/* Dark mode */
.dark .pay-btn {
  color: #fff;
  box-shadow: 0 4px 15px rgba(255, 165, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dark .pay-btn-price {
  background: rgba(255, 255, 255, 0.2);
}

.dark .pay-btn.is-loading {
  opacity: 0.9;
}

.dark .pay-btn-spinner {
  border-color: rgba(255, 255, 255, 0.2);
  border-top-color: #fff;
}

.dark .pay-btn-error {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
}

/* Mobile */
@media (max-width: 640px) {
  .pay-btn {
    padding: 12px 16px;
    font-size: 0.9rem;
    gap: 6px;
  }

  .pay-btn-price {
    padding: 2px 8px;
    font-size: 0.8rem;
  }
}
</style>
