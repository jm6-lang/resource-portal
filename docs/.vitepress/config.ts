import { defineConfig } from 'vitepress'

export default defineConfig({
  base: process.env.BASE || '/',
  title: "小二郎资源分享站",
  titleTemplate: "全网优质资源聚合平台",
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,
  description: "小二郎资源分享站：全网最全的 200TB+ 免费资源下载站，包含 AI 知识、精品书籍、跨境电商、自媒体、教育、健康、影视、提效工具等分类资源，每日持续更新。",
  
  sitemap: {
    hostname: 'https://docs.skillxm.cn'
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    ['script', { async: '', src: 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js' }]
  ],

  themeConfig: {
    logo: { src: '/logo.png', alt: '小二郎资源分享站 Logo' },
    nav: [
      { text: '🏠 首页', link: '/' },
      { 
        text: '📂 资源中心', 
        items: [
          { text: '🤖 AI 知识', link: '/AIknowledge/' },
          { text: '📚 精品书籍', link: '/book/' },
          { text: '🎬 影视娱乐', link: '/movies/' },
          { text: '📉 跨境电商', link: '/cross-border/' },
          { text: '🎓 学习课程', link: '/curriculum/' },
          { text: '🍎 教育资源', link: '/edu-knowlege/' },
          { text: '🛠️ 软件工具', link: '/tools/' },
          { text: '💊 健康养生', link: '/healthy/' },
          { text: '🏛️ 传统文化', link: '/chinese-traditional/' },
        ]
      },
      { text: '💎 独家资源', link: '/exclusive/' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jm6-lang/resource-portal' }
    ],
    search: {
      provider: 'local'
    },
    sidebar: [
      {
        text: '📖 资源导航',
        items: [
          { text: '💎 独家资源专区', link: '/exclusive/' },
          { text: '🤖 AI 知识专区', link: '/AIknowledge/' },
          { text: '📚 书籍文献库', link: '/book/' },
          { text: '🎬 影视剧集区', link: '/movies/' },
          { text: '📈 自媒体/电商专栏', link: '/self-media/' },
          { text: '🎓 职场/技能课精品', link: '/curriculum/' },
          { text: '🍎 教育资料馆', link: '/edu-knowlege/' },
          { text: '🛠️ 常用工具/会员版', link: '/tools/' },
          { text: '💊 健康养生堂', link: '/healthy/' },
          { text: '🏛️ 传统文化阁', link: '/chinese-traditional/' },
        ]
      }
    ],
    footer: {
      message: '<a href="https://docs.skillxm.cn/about">关于我们</a> | <a href="https://docs.skillxm.cn/disclaimer">免责声明</a> | <a href="https://docs.skillxm.cn/privacy">隐私政策</a> | <a href="https://docs.skillxm.cn/contact">联系我们</a> | <a href="https://docs.skillxm.cn/links">友情链接</a> | <a href="https://docs.skillxm.cn/ads">广告合作</a>',
      copyright: 'Copyright © 2026-present 小二郎资源分享站'
    }
  }
})
