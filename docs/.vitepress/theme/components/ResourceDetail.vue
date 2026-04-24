<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PayButton from './PayButton.vue'

const props = defineProps<{
  resourceId: string
  resourceTitle: string
  resourceDesc: string
  resourceCategory: string
  price?: number
  links?: Array<{ name: string; url: string }>
}>()

const API_BASE = 'https://skillxm-payment.你的用户名.workers.dev'

const unlocked = ref(false)
const checkingStatus = ref(true)
const isMember = ref(false)
const hasPurchased = ref(false)
const copiedIndex = ref(-1)

const finalPrice = computed(() => props.price || 5.9)

const categoryLabel = computed(() => {
  const map: Record<string, string> = {
    ai: 'AI 知识', book: '书籍文献', tool: '效率工具',
    course: '教程课程', media: '自媒体', education: '教育资料', other: '其他'
  }
  return map[props.resourceCategory] || props.resourceCategory
})

onMounted(async () => {
  // Check localStorage first
  const accessToken = localStorage.getItem('access_token_' + props.resourceId)
  const membershipToken = localStorage.getItem('membership_token')

  if (accessToken || membershipToken) {
    // Verify with server
    try {
      const token = membershipToken || accessToken
      const res = await fetch(
        `${API_BASE}/api/verify-access?resourceId=${props.resourceId}&token=${token}`
      )
      const data = await res.json()
      if (data.code === 0 && data.data?.granted) {
        unlocked.value = true
        isMember.value = !!membershipToken
        hasPurchased.value = !!accessToken
      }
    } catch {
      // If server check fails, trust localStorage
      unlocked.value = true
      isMember.value = !!membershipToken
      hasPurchased.value = !!accessToken
    }
  }
  checkingStatus.value = false
})

async function copyLink(index: number) {
  const link = props.links?.[index]
  if (!link) return
  try {
    await navigator.clipboard.writeText(link.url)
    copiedIndex.value = index
    setTimeout(() => { copiedIndex.value = -1 }, 2000)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = link.url
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copiedIndex.value = index
    setTimeout(() => { copiedIndex.value = -1 }, 2000)
  }
}
</script>

<template>
  <div class="resource-detail">
    <!-- Header -->
    <div class="rd-header">
      <span class="rd-category">{{ categoryLabel }}</span>
      <div class="rd-price-row">
        <span class="rd-price">&yen;{{ finalPrice }}</span>
        <span class="rd-price-label">/ 单资源购买</span>
      </div>
    </div>

    <!-- Description -->
    <div class="rd-desc">
      <p>{{ resourceDesc }}</p>
    </div>

    <!-- Links Section -->
    <div class="rd-links-section">
      <div class="rd-links-title">
        <span class="rd-links-icon">&#x1F4E6;</span>
        网盘下载链接
      </div>

      <!-- Checking -->
      <div v-if="checkingStatus" class="rd-links-checking">
        <div class="rd-links-spinner"></div>
        <p>正在验证访问权限...</p>
      </div>

      <!-- Unlocked -->
      <div v-else-if="unlocked" class="rd-links-unlocked">
        <div class="rd-unlocked-badge">
          <span v-if="isMember">&#x1F451; 会员免费</span>
          <span v-else>&#x2705; 已购买</span>
        </div>
        <div v-if="links && links.length > 0" class="rd-link-list">
          <div v-for="(link, index) in links" :key="index" class="rd-link-item">
            <div class="rd-link-info">
              <span class="rd-link-name">{{ link.name }}</span>
              <span class="rd-link-url">{{ link.url }}</span>
            </div>
            <div class="rd-link-actions">
              <a :href="link.url" target="_blank" rel="noopener" class="rd-link-open">
                打开链接
              </a>
              <button class="rd-link-copy" @click="copyLink(index)">
                {{ copiedIndex === index ? '已复制' : '复制' }}
              </button>
            </div>
          </div>
        </div>
        <div v-else class="rd-links-placeholder">
          <p>资源链接加载中，请稍候...</p>
        </div>
      </div>

      <!-- Locked -->
      <div v-else class="rd-links-locked">
        <div class="rd-lock-overlay">
          <div class="rd-lock-icon">&#x1F512;</div>
          <h3>该资源需要付费解锁</h3>
          <p>购买此资源或开通会员后，即可获取网盘下载链接</p>

          <div class="rd-lock-options">
            <div class="rd-lock-option">
              <div class="rd-lock-option-header">
                <span class="rd-lock-option-title">单资源购买</span>
                <span class="rd-lock-option-price">&yen;{{ finalPrice }}</span>
              </div>
              <p class="rd-lock-option-desc">仅解锁当前资源，永久有效</p>
              <PayButton
                type="resource"
                :resource-id="resourceId"
                :resource-name="resourceTitle"
                :price="finalPrice"
              />
            </div>
            <div class="rd-lock-divider">
              <span>或</span>
            </div>
            <div class="rd-lock-option rd-lock-option-member">
              <div class="rd-lock-option-header">
                <span class="rd-lock-option-title">开通会员</span>
                <span class="rd-lock-option-badge">推荐</span>
              </div>
              <p class="rd-lock-option-desc">解锁全部付费资源，年会员 &yen;79 / 永久会员 &yen;69</p>
              <a href="/paid/#membership" class="rd-lock-member-btn">查看会员计划</a>
            </div>
          </div>

          <p class="rd-lock-hint">
            已购买？前往 <a href="/paid/order-query">订单查询</a> 获取访问令牌
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resource-detail {
  margin: 1.5rem 0;
}

/* Header */
.rd-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.rd-category {
  display: inline-block;
  padding: 4px 14px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1));
  border: 1px solid rgba(255, 165, 0, 0.25);
  border-radius: 20px;
  color: #FFA500;
  font-size: 0.85rem;
  font-weight: 600;
}

.rd-price-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.rd-price {
  font-size: 2rem;
  font-weight: 900;
  color: #FFA500;
  line-height: 1;
}

.rd-price-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

/* Description */
.rd-desc {
  margin-bottom: 2rem;
}

.rd-desc p {
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  line-height: 1.8;
  margin: 0;
}

/* Links Section */
.rd-links-section {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  overflow: hidden;
}

.rd-links-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 1rem 1.5rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.rd-links-icon {
  font-size: 1.2rem;
}

/* Checking */
.rd-links-checking {
  padding: 3rem 1rem;
  text-align: center;
  color: var(--vp-c-text-2);
}

.rd-links-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--vp-c-divider);
  border-top-color: #FFA500;
  border-radius: 50%;
  animation: rd-spin 0.7s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes rd-spin {
  to { transform: rotate(360deg); }
}

/* Unlocked */
.rd-links-unlocked {
  padding: 1.25rem 1.5rem;
}

.rd-unlocked-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 20px;
  color: #22c55e;
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.rd-link-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rd-link-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 0.85rem 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  transition: border-color 0.2s;
}

.rd-link-item:hover {
  border-color: rgba(255, 165, 0, 0.3);
}

.rd-link-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.rd-link-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.rd-link-url {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rd-link-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.rd-link-open {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #1a1a2e;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.dark .rd-link-open {
  color: #fff;
}

.rd-link-open:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 165, 0, 0.3);
}

.rd-link-copy {
  padding: 6px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.rd-link-copy:hover {
  border-color: #FFA500;
  color: #FFA500;
}

.rd-links-placeholder {
  text-align: center;
  padding: 1rem;
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
}

/* Locked */
.rd-lock-overlay {
  padding: 2.5rem 2rem;
  text-align: center;
}

.rd-lock-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  line-height: 1;
}

.rd-lock-overlay h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem;
}

.rd-lock-overlay > p {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin: 0 0 1.5rem;
  line-height: 1.5;
}

/* Lock Options */
.rd-lock-options {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.rd-lock-option {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  text-align: center;
  min-width: 220px;
  max-width: 280px;
  flex: 1;
}

.rd-lock-option-member {
  border-color: rgba(255, 165, 0, 0.3);
  background: linear-gradient(180deg, rgba(255, 165, 0, 0.04), var(--vp-c-bg) 60%);
}

.rd-lock-option-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 0.5rem;
}

.rd-lock-option-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.rd-lock-option-price {
  font-size: 1.2rem;
  font-weight: 800;
  color: #FFA500;
}

.rd-lock-option-badge {
  padding: 2px 10px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #1a1a2e;
  font-size: 0.72rem;
  font-weight: 800;
  border-radius: 10px;
}

.dark .rd-lock-option-badge {
  color: #fff;
}

.rd-lock-option-desc {
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
  margin: 0 0 1rem;
  line-height: 1.4;
}

.rd-lock-member-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #1a1a2e;
  font-size: 0.88rem;
  font-weight: 700;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.25s;
  width: 100%;
  box-sizing: border-box;
}

.dark .rd-lock-member-btn {
  color: #fff;
}

.rd-lock-member-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 165, 0, 0.3);
}

.rd-lock-divider {
  flex-shrink: 0;
}

.rd-lock-divider span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
  font-weight: 600;
}

.rd-lock-hint {
  color: var(--vp-c-text-3);
  font-size: 0.82rem;
  margin: 0 !important;
}

.rd-lock-hint a {
  color: #FFA500;
  text-decoration: underline;
}

/* Mobile */
@media (max-width: 640px) {
  .rd-header {
    flex-direction: column;
  }

  .rd-lock-options {
    flex-direction: column;
  }

  .rd-lock-option {
    min-width: auto;
    max-width: 100%;
  }

  .rd-lock-divider {
    display: none;
  }

  .rd-link-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .rd-link-actions {
    width: 100%;
  }

  .rd-link-open, .rd-link-copy {
    flex: 1;
    text-align: center;
    justify-content: center;
  }

  .rd-lock-overlay {
    padding: 2rem 1rem;
  }
}
</style>
