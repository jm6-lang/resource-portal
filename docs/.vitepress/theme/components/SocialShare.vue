<template>
  <div class="social-share">
    <span class="share-label">分享到：</span>
    <div class="share-icons">
      <!-- QQ -->
      <a :href="qqShareUrl" target="_blank" class="share-item qq" title="分享到QQ">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19.03 18.06c-.36.6-.8 1.11-1.33 1.52c-.53.41-1.12.72-1.77.92c-.65.2-1.34.3-2.07.3c-.73 0-1.42-.1-2.07-.3c-.65-.2-1.24-.51-1.77-.92c-.53-.41-.97-.92-1.33-1.52c-.36-.6-.54-1.28-.54-2.04c0-.76.18-1.44.54-2.04c.36-.6.8-.11 1.33-.52c.53-.41 1.12-.72 1.77-.92c.65-.2 1.34-.3 2.07-.3c.73 0 1.42.1 2.07.3c.65.2 1.24.51 1.77.92c.53.41.97.92 1.33 1.52c.36.6.54 1.28.54 2.04c0 .76-.18 1.44-.54 2.04M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2"/></svg>
      </a>
      <!-- WeChat -->
      <a href="javascript:void(0)" @click="showWechat" class="share-item wechat" title="分享到微信">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2"/></svg>
      </a>
      <!-- Weibo -->
      <a :href="weiboShareUrl" target="_blank" class="share-item weibo" title="分享到微博">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M9.98 18.14c-3.8 0-6.15-2.04-6.15-4.56c0-2.52 2.35-4.56 6.15-4.56s6.15 2.04 6.15 4.56c0 2.52-2.35 4.56-6.15 4.56m6.15-8.12c-.42-.42-1.05-.63-1.89-.63c-.84 0-1.47.21-1.89.63c-.42.42-.63 1.05-.63 1.89c0 .84.21 1.47.63 1.89c.42.42 1.05.63 1.89.63c.84 0 1.47-.21 1.89-.63c.42-.42.63-1.05.63-1.89c0-.84-.21-1.47-.63-1.89M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2"/></svg>
      </a>
      <!-- X (Twitter) -->
      <a :href="twitterShareUrl" target="_blank" class="share-item twitter" title="分享到 X">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.13l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <!-- Facebook -->
      <a :href="facebookShareUrl" target="_blank" class="share-item facebook" title="分享到 Facebook">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7h-2.54v-2.9h2.54V9.82c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19V8.6h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z"/></svg>
      </a>
      <!-- Telegram -->
      <a :href="telegramShareUrl" target="_blank" class="share-item telegram" title="分享到 Telegram">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19c-.14.75-.42 1-.68 1.03c-.58.05-1.02-.38-1.58-.69c-.88-.48-1.38-.78-2.23-1.33c-.98-.64-.35-.99.22-1.56c.15-.15 2.71-2.48 2.76-2.59c.01-.01.01-.07-.02-.1c-.03-.03-.07-.02-.11-.01c-.06.01-.99.63-2.79 1.27c-.26.09-.5.14-.72.14c-.24 0-.71-.13-1.06-.24c-.43-.14-.77-.22-.74-.46c.02-.12.18-.25.49-.38c1.92-.84 3.2-.1.39-1.4c.33-.14.67-.21 1.01-.21c.22 0 .44.03.65.1c.41.14.75.43.95.81c.2.38.26.83.17 1.27z"/></svg>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { title } = useData()

const currentUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.href
  }
  return 'https://docs.skillxm.cn'
})

const siteTitle = computed(() => title.value || '小二郎资源分享站')

const qqShareUrl = computed(() => {
  const url = encodeURIComponent(currentUrl.value)
  const t = encodeURIComponent(siteTitle.value)
  return `https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${t}`
})

const weiboShareUrl = computed(() => {
  const url = encodeURIComponent(currentUrl.value)
  const t = encodeURIComponent(siteTitle.value)
  return `https://service.weibo.com/share/share.php?url=${url}&title=${t}`
})

const twitterShareUrl = computed(() => {
  const url = encodeURIComponent(currentUrl.value)
  const t = encodeURIComponent(siteTitle.value)
  return `https://twitter.com/intent/tweet?url=${url}&text=${t}`
})

const facebookShareUrl = computed(() => {
  const url = encodeURIComponent(currentUrl.value)
  return `https://www.facebook.com/sharer/share.php?u=${url}`
})

const telegramShareUrl = computed(() => {
  const url = encodeURIComponent(currentUrl.value)
  const t = encodeURIComponent(siteTitle.value)
  return `https://t.me/share/url?url=${url}&text=${t}`
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
  gap: 10px;
}

.share-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.share-item svg {
  width: 16px;
  height: 16px;
}

.share-item:hover {
  color: white;
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.share-item.qq:hover { background-color: #12b7f5; border-color: #12b7f5; }
.share-item.wechat:hover { background-color: #07c160; border-color: #07c160; }
.share-item.weibo:hover { background-color: #e6162d; border-color: #e6162d; }
.share-item.twitter:hover { background-color: #000000; border-color: #000000; }
.share-item.facebook:hover { background-color: #1877f2; border-color: #1877f2; }
.share-item.telegram:hover { background-color: #0088cc; border-color: #0088cc; }

@media (max-width: 960px) {
  .social-share {
    display: none;
  }
}
</style>
