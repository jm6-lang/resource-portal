<template>
  <div class="social-share">
    <span class="share-label">分享到：</span>
    <div class="share-icons">
      <!-- QQ -->
      <a :href="qqShareUrl" target="_blank" class="share-item qq" title="分享到QQ">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19.03 18.06c-.36.6-.8 1.11-1.33 1.52c-.53.41-1.12.72-1.77.92c-.65.2-1.34.3-2.07.3c-.73 0-1.42-.1-2.07-.3c-.65-.2-1.24-.51-1.77-.92c-.53-.41-.97-.92-1.33-1.52c-.36-.6-.54-1.28-.54-2.04c0-.76.18-1.44.54-2.04c.36-.6.8-.11 1.33-.52c.53-.41 1.12-.72 1.77-.92c.65-.2 1.34-.3 2.07-.3c.73 0 1.42.1 2.07.3c.65.2 1.24.51 1.77.92c.53.41.97.92 1.33 1.52c.36.6.54 1.28.54 2.04c0 .76-.18 1.44-.54 2.04M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2"/></svg>
      </a>
      <!-- Weibo -->
      <a :href="weiboShareUrl" target="_blank" class="share-item weibo" title="分享到微博">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M9.98 18.14c-3.8 0-6.15-2.04-6.15-4.56c0-2.52 2.35-4.56 6.15-4.56s6.15 2.04 6.15 4.56c0 2.52-2.35 4.56-6.15 4.56m6.15-8.12c-.42-.42-1.05-.63-1.89-.63c-.84 0-1.47.21-1.89.63c-.42.42-.63 1.05-.63 1.89c0 .84.21 1.47.63 1.89c.42.42 1.05.63 1.89.63c.84 0 1.47-.21 1.89-.63c.42-.42.63-1.05.63-1.89c0-.84-.21-1.47-.63-1.89M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2"/></svg>
      </a>
      <!-- WeChat (Trigger QR or just link to home) -->
      <a href="javascript:void(0)" @click="showWechat" class="share-item wechat" title="分享到微信">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2"/></svg>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { title, page } = useData()

const currentUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.href
  }
  return 'https://docs.skillxm.cn'
})

const qqShareUrl = computed(() => {
  const url = encodeURIComponent(currentUrl.value)
  const t = encodeURIComponent(title.value || '小二郎资源分享站')
  return `https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${t}`
})

const weiboShareUrl = computed(() => {
  const url = encodeURIComponent(currentUrl.value)
  const t = encodeURIComponent(title.value || '小二郎资源分享站')
  return `https://service.weibo.com/share/share.php?url=${url}&title=${t}`
})

const showWechat = () => {
  alert('请复制当前页面链接分享给微信好友或朋友圈：\n' + currentUrl.value)
}
</script>

<style scoped>
.social-share {
  display: flex;
  align-items: center;
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 1px solid var(--vp-c-divider);
}

.share-label {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-right: 0.5rem;
}

.share-icons {
  display: flex;
  gap: 8px;
}

.share-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: var(--vp-c-text-2);
  transition: all 0.3s;
}

.share-item svg {
  width: 18px;
  height: 18px;
}

.share-item:hover {
  color: white;
  transform: scale(1.1);
}

.share-item.qq:hover { background-color: #12b7f5; }
.share-item.weibo:hover { background-color: #e6162d; }
.share-item.wechat:hover { background-color: #07c160; }

@media (max-width: 768px) {
  .social-share {
    display: none;
  }
}
</style>
