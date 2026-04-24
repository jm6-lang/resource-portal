<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PayButton from './PayButton.vue'

const props = defineProps<{
  resource: {
    id: string
    title: string
    description: string
    price: number
    category: string
    coverImage?: string
  }
}>()

const purchased = ref(false)

onMounted(() => {
  const token = localStorage.getItem('access_token_' + props.resource.id)
  const membership = localStorage.getItem('membership_token')
  purchased.value = !!(token || membership)
})

const categoryLabel = computed(() => {
  const map: Record<string, string> = {
    ai: 'AI 知识',
    book: '书籍文献',
    tool: '效率工具',
    course: '教程课程',
    media: '自媒体',
    other: '其他'
  }
  return map[props.resource.category] || props.resource.category
})
</script>

<template>
  <div class="resource-card" :class="{ 'is-purchased': purchased }">
    <div class="resource-card-cover">
      <img
        v-if="resource.coverImage"
        :src="resource.coverImage"
        :alt="resource.title"
        loading="lazy"
      />
      <div v-else class="resource-card-cover-placeholder">
        <span>{{ resource.title.charAt(0) }}</span>
      </div>
      <span class="resource-card-badge">{{ categoryLabel }}</span>
      <span v-if="purchased" class="resource-card-purchased-badge">已购买</span>
    </div>
    <div class="resource-card-body">
      <h3 class="resource-card-title">{{ resource.title }}</h3>
      <p class="resource-card-desc">{{ resource.description }}</p>
      <div class="resource-card-footer">
        <span class="resource-card-price">&yen;{{ resource.price }}</span>
        <PayButton
          v-if="!purchased"
          type="resource"
          :resource-id="resource.id"
          :resource-name="resource.title"
          :price="resource.price"
        />
        <span v-else class="resource-card-owned">已拥有</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resource-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  border-color: rgba(255, 165, 0, 0.3);
}

.resource-card.is-purchased {
  border-color: rgba(34, 197, 94, 0.3);
}

/* Cover */
.resource-card-cover {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.resource-card-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.resource-card:hover .resource-card-cover img {
  transform: scale(1.05);
}

.resource-card-cover-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a1a2e;
}

.resource-card-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 3px 10px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
}

.resource-card-purchased-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 3px 10px;
  background: rgba(34, 197, 94, 0.9);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
}

/* Body */
.resource-card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.resource-card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.resource-card-desc {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0 0 1rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Footer */
.resource-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 0.75rem;
  border-top: 1px solid var(--vp-c-divider);
}

.resource-card-price {
  font-size: 1.3rem;
  font-weight: 800;
  color: #FFA500;
  flex-shrink: 0;
}

.resource-card-footer :deep(.pay-button-wrapper) {
  flex: 1;
  max-width: 180px;
}

.resource-card-footer :deep(.pay-btn) {
  padding: 10px 14px;
  font-size: 0.85rem;
}

.resource-card-owned {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 10px;
  color: #22c55e;
  font-size: 0.85rem;
  font-weight: 600;
  flex: 1;
  max-width: 180px;
  justify-content: center;
}

/* Mobile */
@media (max-width: 640px) {
  .resource-card-body {
    padding: 1rem;
  }

  .resource-card-title {
    font-size: 0.95rem;
  }

  .resource-card-price {
    font-size: 1.1rem;
  }

  .resource-card-footer :deep(.pay-button-wrapper) {
    max-width: 150px;
  }
}
</style>
