<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ResourceCard from './ResourceCard.vue'

const API_BASE = 'https://skillxm-payment.你的用户名.workers.dev'

interface Resource {
  id: string
  title: string
  description: string
  price: number
  category: string
  coverImage?: string
}

const resources = ref<Resource[]>([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const activeCategory = ref('all')

const categories = computed(() => {
  const cats = new Set(resources.value.map(r => r.category))
  return ['all', ...Array.from(cats)]
})

const categoryLabels: Record<string, string> = {
  all: '全部',
  ai: 'AI 知识',
  book: '书籍文献',
  tool: '效率工具',
  course: '教程课程',
  media: '自媒体',
  other: '其他'
}

const filteredResources = computed(() => {
  let list = resources.value
  if (activeCategory.value !== 'all') {
    list = list.filter(r => r.category === activeCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    )
  }
  return list
})

onMounted(async () => {
  try {
    const res = await fetch(`${API_BASE}/api/resources`)
    const data = await res.json()
    if (data.code === 0 && Array.isArray(data.data)) {
      resources.value = data.data
    } else {
      // Use demo data if API not available
      resources.value = getDemoResources()
    }
  } catch {
    // Fallback to demo data
    resources.value = getDemoResources()
  } finally {
    loading.value = false
  }
})

function getDemoResources(): Resource[] {
  return [
    {
      id: 'demo-001',
      title: 'ChatGPT 高级提示词工程指南',
      description: '系统学习 Prompt Engineering，掌握与 AI 高效对话的核心技巧，包含 200+ 实战案例。',
      price: 29.9,
      category: 'ai'
    },
    {
      id: 'demo-002',
      title: '跨境电商独立站从零到一',
      description: 'Shopify 建站全流程教程，涵盖选品、建站、引流、转化四大核心环节。',
      price: 49.9,
      category: 'course'
    },
    {
      id: 'demo-003',
      title: '2024 短视频运营实战手册',
      description: '抖音/快手/视频号运营全攻略，从内容策划到变现的完整方法论。',
      price: 39.9,
      category: 'media'
    },
    {
      id: 'demo-004',
      title: '程序员效率工具合集',
      description: '精选 50+ 开发者必备工具，含激活教程和配置指南，大幅提升工作效率。',
      price: 19.9,
      category: 'tool'
    },
    {
      id: 'demo-005',
      title: 'AI 绘画 Midjourney 完全指南',
      description: '从入门到精通的 Midjourney 教程，掌握 AI 绘画的核心参数和高级技巧。',
      price: 35,
      category: 'ai'
    },
    {
      id: 'demo-006',
      title: '个人 IP 打造与知识付费',
      description: '如何打造个人品牌并通过知识付费实现收入增长，包含完整实操案例。',
      price: 59.9,
      category: 'media'
    }
  ]
}
</script>

<template>
  <div class="paid-resource-list">
    <!-- Search & Filter -->
    <div class="paid-resource-controls">
      <div class="paid-resource-search">
        <input
          v-model="searchQuery"
          type="text"
          class="paid-resource-search-input"
          placeholder="搜索资源..."
        />
        <span v-if="searchQuery" class="paid-resource-search-clear" @click="searchQuery = ''">&#x2715;</span>
      </div>
      <div class="paid-resource-categories">
        <button
          v-for="cat in categories"
          :key="cat"
          class="paid-resource-cat-btn"
          :class="{ 'is-active': activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ categoryLabels[cat] || cat }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="paid-resource-loading">
      <div class="paid-resource-loading-spinner"></div>
      <p>正在加载资源列表...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="paid-resource-error">
      <p>{{ error }}</p>
    </div>

    <!-- Empty -->
    <div v-else-if="filteredResources.length === 0" class="paid-resource-empty">
      <div class="paid-resource-empty-icon">&#x1F50D;</div>
      <h3>未找到匹配的资源</h3>
      <p>试试其他搜索词或分类</p>
    </div>

    <!-- Resource Grid -->
    <div v-else class="paid-resource-grid">
      <ResourceCard
        v-for="resource in filteredResources"
        :key="resource.id"
        :resource="resource"
      />
    </div>

    <!-- Count -->
    <div v-if="!loading && filteredResources.length > 0" class="paid-resource-count">
      共 {{ filteredResources.length }} 个资源
    </div>
  </div>
</template>

<style scoped>
.paid-resource-list {
  padding: 1rem 0;
}

/* Controls */
.paid-resource-controls {
  margin-bottom: 1.5rem;
}

.paid-resource-search {
  position: relative;
  max-width: 400px;
  margin-bottom: 1rem;
}

.paid-resource-search-input {
  width: 100%;
  padding: 10px 16px;
  padding-right: 36px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  outline: none;
  transition: all 0.25s;
  box-sizing: border-box;
}

.paid-resource-search-input:focus {
  border-color: #FFA500;
  box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.1);
}

.paid-resource-search-input::placeholder {
  color: var(--vp-c-text-3);
}

.paid-resource-search-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
  padding: 4px;
  transition: color 0.2s;
}

.paid-resource-search-clear:hover {
  color: var(--vp-c-text-1);
}

/* Category tabs */
.paid-resource-categories {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.paid-resource-cat-btn {
  padding: 6px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.25s;
}

.paid-resource-cat-btn:hover {
  border-color: #FFA500;
  color: #FFA500;
}

.paid-resource-cat-btn.is-active {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-color: transparent;
  color: #1a1a2e;
  font-weight: 600;
}

.dark .paid-resource-cat-btn.is-active {
  color: #fff;
}

/* Loading */
.paid-resource-loading {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--vp-c-text-2);
}

.paid-resource-loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--vp-c-divider);
  border-top-color: #FFA500;
  border-radius: 50%;
  animation: prl-spin 0.7s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes prl-spin {
  to { transform: rotate(360deg); }
}

/* Empty */
.paid-resource-empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--vp-c-text-2);
}

.paid-resource-empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.paid-resource-empty h3 {
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem;
}

.paid-resource-empty p {
  margin: 0;
  font-size: 0.9rem;
}

/* Grid */
.paid-resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

@media (max-width: 640px) {
  .paid-resource-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* Count */
.paid-resource-count {
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 0.85rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
