<template>
  <div class="social-share">
    <span class="share-label">分享到：</span>
    <div class="share-icons">
      <!-- QQ -->
      <a :href="qqShareUrl" target="_blank" class="share-item qq" title="分享到QQ">
        <svg viewBox="0 0 1024 1024"><path fill="currentColor" d="M824.8 613.2c-16-1.4-25.2-13.4-21.2-28.4c13.2-49.2 19.6-100.2 19.6-152.2c0-184.4-138.8-333.8-310-333.8S203.2 248.2 203.2 432.6c0 52 6.4 103 19.6 152.2c4 15-5.2 27-21.2 28.4c-61.6 5.4-114.4 21.4-158.4 48c-10.4 6.2-12.2 19.4-4.2 28.2c28.6 31.4 74.6 55.4 128.2 68c-2 11.6-3.2 23.6-3.2 35.8c0 88.4 78.8 160 176 160c14.2 0 28-1.6 41.2-4.6c29.4 25.4 66.2 40.6 106.8 40.6c40.6 0 77.4-15.2 106.8-40.6c13.2 3 27 4.6 41.2 4.6c97.2 0 176-71.6 176-160c0-12.2-1.2-24.2-3.2-35.8c53.6-12.6 99.6-36.6 128.2-68c8-8.8 6.2-22-4.2-28.2c-44-26.6-96.8-42.6-158.4-48z"/></svg>
      </a>
      <!-- WeChat -->
      <a href="javascript:void(0)" @click="showWechat" class="share-item wechat" title="分享到微信">
        <svg viewBox="0 0 1024 1024"><path fill="currentColor" d="M653.1 336.1c-13.1 0-26.1 1.1-38.8 3.3c13.1 41.1 20.3 84.8 20.3 130.3c0 101.4-35.6 194.4-95.7 267.8c40.4 11.4 84.1 17.8 129.6 17.8c31.1 0 61.1-2.9 90.1-8.4l103.1 53.4l-27.3-91.8c61.4-53.1 100.1-128.1 100.1-212.1c-.1-144.1-117.1-260.3-261.4-260.3zM346.9 144c-164.7 0-298.2 112.9-298.2 252.1c0 84.8 49.4 159.7 125.1 207.1L141 705.4l117.8-61c27.8 5.1 57.3 7.8 88.1 7.8c164.7 0 298.2-112.9 298.2-252.1S494.7 144 346.9 144zm-117.8 210c-21.3 0-38.6-17.3-38.6-38.6s17.3-38.6 38.6-38.6s38.6 17.3 38.6 38.6s-17.3 38.6-38.6 38.6zm235.6 0c-21.3 0-38.6-17.3-38.6-38.6s17.3-38.6 38.6-38.6s38.6 17.3 38.6 38.6s-17.3 38.6-38.6 38.6z"/></svg>
      </a>
      <!-- Weibo -->
      <a :href="weiboShareUrl" target="_blank" class="share-item weibo" title="分享到微博">
        <svg viewBox="0 0 1024 1024"><path fill="currentColor" d="M411.3 720.1c-103.1 10.1-189.4-37.1-192.7-105.4c-3.3-68.3 77.4-131.9 180.5-142c103.1-10.1 189.4 37.1 192.7 105.4c3.3 68.3-77.4 131.9-180.5 142zm211.1-263.1c-11.4-15.4-33.1-20.1-48.4-10.4c-15.4 9.7-20.4 29.1-11.4 45.4c11.4 15.4 33.1 20.1 48.4 10.4c15.4-9.7 22.8-29.1 11.4-45.4zm11.4-105.1c-25.1-29.4-65.4-37.1-91.4-17.1c-26.1 20.1-27.1 60.1-4.3 93.1c22.8 33.1 62.4 42.1 89.4 24.1c27.1-18.1 31.4-70.1 6.3-100.1zm211.1 210.1c0 144.1-192.7 230.1-384.5 230.1c-220.1 0-354.5-110.1-354.5-210.1c0-100.1 110.1-180.1 240.1-210.1c-20.1-30.1-30.1-60.1-30.1-80.1c0-60.1 70.1-110.1 160.1-110.1c110.1 0 150.1 50.1 150.1 90.1c0 20.1-10.1 40.1-30.1 60.1c110.1 30.1 248.9 100.1 248.9 230.1zM844.8 320.1c-20.1-20.1-50.1-30.1-80.1-20.1c-10.1 0-20.1 10.1-20.1 20.1c0 10.1 10.1 20.1 20.1 20.1c10.1 0 20.1 0 30.1 10.1c10.1 10.1 10.1 20.1 10.1 30.1c0 10.1 10.1 20.1 20.1 20.1c10.1 0 20.1-10.1 20.1-20.1c0-30.1-10.1-60.1-30.1-80.1z"/></svg>
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
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-right: 0.8rem;
}

.share-icons {
  display: flex;
  gap: 12px;
}

.share-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-soft);
  border: 1.5px solid var(--vp-c-divider);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.share-item svg {
  width: 18px;
  height: 18px;
}

.share-item:hover {
  color: white;
  transform: translateY(-4px) scale(1.15);
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
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
