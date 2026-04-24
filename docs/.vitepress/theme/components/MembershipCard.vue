<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PayButton from './PayButton.vue'

const yearlyPurchased = ref(false)
const permanentPurchased = ref(false)

onMounted(() => {
  const membership = localStorage.getItem('membership_token')
  if (membership) {
    // If membership token exists, check type
    // For simplicity, mark both as purchased if any membership token exists
    yearlyPurchased.value = true
    permanentPurchased.value = true
  }
})

const yearlyFeatures = [
  '畅享全部付费资源',
  '新资源优先获取',
  '专属会员标识',
  '有效期一年',
  '到期可续费'
]

const permanentFeatures = [
  '畅享全部付费资源',
  '新资源优先获取',
  '专属会员标识',
  '永久有效，一次付费终身使用',
  '未来新资源自动解锁',
  '优先技术支持'
]
</script>

<template>
  <div class="membership-section">
    <h2 class="membership-heading">会员计划</h2>
    <p class="membership-subheading">开通会员，畅享全部付费资源，一次付费终身受益</p>

    <div class="membership-grid">
      <!-- Yearly Plan -->
      <div class="membership-card" :class="{ 'is-purchased': yearlyPurchased }">
        <div class="membership-card-header">
          <h3 class="membership-card-name">年度会员</h3>
          <p class="membership-card-tagline">按年付费，灵活选择</p>
        </div>
        <div class="membership-card-price">
          <span class="membership-card-currency">&yen;</span>
          <span class="membership-card-amount">79</span>
          <span class="membership-card-period">/年</span>
        </div>
        <ul class="membership-card-features">
          <li v-for="feature in yearlyFeatures" :key="feature">
            <span class="membership-card-check">&#x2713;</span>
            {{ feature }}
          </li>
        </ul>
        <div class="membership-card-action">
          <PayButton
            v-if="!yearlyPurchased"
            type="yearly"
            :price="79"
          />
          <span v-else class="membership-card-owned">&#x2705; 已开通</span>
        </div>
      </div>

      <!-- Permanent Plan -->
      <div class="membership-card membership-card-featured" :class="{ 'is-purchased': permanentPurchased }">
        <div class="membership-card-ribbon">推荐</div>
        <div class="membership-card-header">
          <h3 class="membership-card-name">永久会员</h3>
          <p class="membership-card-tagline">一次付费，终身使用</p>
        </div>
        <div class="membership-card-price">
          <span class="membership-card-original">&yen;129</span>
          <span class="membership-card-currency">&yen;</span>
          <span class="membership-card-amount">69</span>
          <span class="membership-card-period">/永久</span>
        </div>
        <p class="membership-card-sale">限时活动价</p>
        <ul class="membership-card-features">
          <li v-for="feature in permanentFeatures" :key="feature">
            <span class="membership-card-check">&#x2713;</span>
            {{ feature }}
          </li>
        </ul>
        <div class="membership-card-action">
          <PayButton
            v-if="!permanentPurchased"
            type="permanent"
            :price="69"
          />
          <span v-else class="membership-card-owned">&#x2705; 已开通</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.membership-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
}

.membership-heading {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem;
}

.membership-subheading {
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  margin: 0 0 2rem;
}

.membership-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

@media (max-width: 640px) {
  .membership-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* Card */
.membership-card {
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 20px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.membership-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.membership-card-featured {
  border-color: #FFA500;
  background: linear-gradient(180deg, rgba(255, 165, 0, 0.05) 0%, var(--vp-c-bg-soft) 40%);
}

.membership-card-featured:hover {
  box-shadow: 0 12px 32px rgba(255, 165, 0, 0.15);
}

.membership-card.is-purchased {
  border-color: rgba(34, 197, 94, 0.3);
}

/* Ribbon */
.membership-card-ribbon {
  position: absolute;
  top: 16px;
  right: -30px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #1a1a2e;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 4px 36px;
  transform: rotate(45deg);
  letter-spacing: 1px;
}

/* Header */
.membership-card-header {
  margin-bottom: 1.25rem;
}

.membership-card-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--vp-c-text-1);
  margin: 0 0 0.25rem;
}

.membership-card-tagline {
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  margin: 0;
}

/* Price */
.membership-card-price {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
}

.membership-card-original {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
  text-decoration: line-through;
  margin-right: 8px;
}

.membership-card-currency {
  font-size: 1.1rem;
  font-weight: 700;
  color: #FFA500;
}

.membership-card-amount {
  font-size: 2.8rem;
  font-weight: 900;
  color: #FFA500;
  line-height: 1;
}

.membership-card-period {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin-left: 2px;
}

.membership-card-sale {
  color: #ef4444;
  font-size: 0.8rem;
  font-weight: 600;
  margin: 0 0 1rem;
}

/* Features */
.membership-card-features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
  text-align: left;
}

.membership-card-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.4rem 0;
  font-size: 0.88rem;
  color: var(--vp-c-text-1);
}

.membership-card-check {
  color: #22c55e;
  font-weight: 700;
  flex-shrink: 0;
  font-size: 0.9rem;
}

/* Action */
.membership-card-action {
  margin-top: 0.5rem;
}

.membership-card-owned {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 24px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;
  color: #22c55e;
  font-size: 0.95rem;
  font-weight: 600;
}

/* Dark mode */
.dark .membership-card-ribbon {
  color: #fff;
}

.dark .membership-card-amount,
.dark .membership-card-currency {
  color: #FFD700;
}

.dark .membership-card-featured {
  background: linear-gradient(180deg, rgba(255, 165, 0, 0.08) 0%, var(--vp-c-bg-soft) 40%);
}
</style>
