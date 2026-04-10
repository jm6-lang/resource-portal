import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Automatically read Markdown titles and generate sidebar items.
 */
function getSidebarItems(dir: string) {
  const fullPath = path.join(process.cwd(), 'docs', dir)
  if (!fs.existsSync(fullPath)) return []
  const files = fs.readdirSync(fullPath)
    .filter(file => file.endsWith('.md') && file !== 'index.md')
    .sort()

  return files.map(file => {
    const filePath = path.join(fullPath, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const match = content.match(/^#\s+(.+)$/m)
    const name = match ? match[1].trim() : path.basename(file, '.md')
    return {
      text: name,
      link: `/${dir}/${path.basename(file, '.md')}`
    }
  })
}

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
    ['script', {}, `
      (function() {
        var link = document.createElement('link');
        link.rel = 'canonical';
        link.href = window.location.protocol + '//' + window.location.host + window.location.pathname;
        document.head.appendChild(link);
      })();
    `],
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
          { text: '📉 跨境电商', link: '/self-media/' },
          { text: '🎓 学习课程', link: '/curriculum/' },
          { text: '🍎 教育资源', link: '/edu-knowlege/' },
          { text: '🛠️ 软件工具', link: '/tools/' },
          { text: '💊 健康养生', link: '/healthy/' },
          { text: '🏛️ 传统文化', link: '/chinese-traditional/' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jm6-lang/resource-portal' }
    ],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索海量资源...' },
          modal: { noResultsText: '未找到相关资源' }
        }
      }
    },
    sidebar: [
      {
        text: '📖 资源导航',
        items: [
          { text: '🤖 AI 知识专区', collapsed: true, items: [{ text: '✨ 全部内容', link: '/AIknowledge/' }, ...getSidebarItems('AIknowledge')] },
          { text: '📚 书籍文献库', collapsed: true, items: [{ text: '✨ 全部内容', link: '/book/' }, ...getSidebarItems('book')] },
          { text: '🎬 影视剧集区', collapsed: true, items: [{ text: '✨ 全部内容', link: '/movies/' }, ...getSidebarItems('movies')] },
          { text: '📈 自媒体/电商', collapsed: true, items: [{ text: '✨ 全部内容', link: '/self-media/' }, ...getSidebarItems('self-media')] },
          { text: '🎓 职场/技能课', collapsed: true, items: [{ text: '✨ 全部内容', link: '/curriculum/' }, ...getSidebarItems('curriculum')] },
          { text: '🍎 教育资料馆', collapsed: true, items: [{ text: '✨ 全部内容', link: '/edu-knowlege/' }, ...getSidebarItems('edu-knowlege')] },
          { text: '🛠️ 常用工具箱', collapsed: true, items: [{ text: '✨ 全部内容', link: '/tools/' }, ...getSidebarItems('tools')] },
          { text: '💊 健康养生堂', collapsed: true, items: [{ text: '✨ 全部内容', link: '/healthy/' }, ...getSidebarItems('healthy')] },
          { text: '🏛️ 传统文化阁', collapsed: true, items: [{ text: '✨ 全部内容', link: '/chinese-traditional/' }, ...getSidebarItems('chinese-traditional')] },
        ]
      }
    ],
    footer: {
      message: '[关于我们](/about) | [隐私政策](/privacy) | [联系我们](/contact) | [版权声明](/disclaimer) | [友链申请](/links) | [广告合作](/ads)<br>本站已安全运行 <span id="run-time"></span> | 总访问量 <span id="busuanzi_value_site_pv"></span> | 访客数 <span id="busuanzi_value_site_uv"></span>',
      copyright: 'Copyright © 2026-present 小二郎资源分享站'
    },
    lastUpdatedText: '最近更新于',
    darkModeSwitchLabel: '深色模式切换',
    outlineTitle: '本页目录',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
  }
})
