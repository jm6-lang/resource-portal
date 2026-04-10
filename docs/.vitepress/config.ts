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
  title: "小二郎资源站",
  titleTemplate: ":title - 全球优质资源聚合平台",
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,
  description: "小二郎资源站：全网最全的 100TB+ 免费资源下载站，包含 AI 知识、精品书籍、跨境电商、自媒体、教育、健康、影视、提效工具等分类资源，每日持续更新。",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['script', { async: '', src: 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js' }]
  ],
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '🏠 首页', link: '/' },
      { 
        text: '📂 资源中心', 
        items: [
          { text: '🤖 AI 知识', link: '/AIknowledge/' },
          { text: '📚 精品书籍', link: '/book/' },
          { text: '📉 跨境电商', link: '/cross-border/' },
          { text: '🎬 影视媒体', link: '/movies/' },
          { text: '🛠️ 工具合集', link: '/tools/' },
          { text: '📱 自媒体运营', link: '/self-media/' },
          { text: '🎓 教育知识', link: '/edu-knowlege/' },
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
          button: {
            buttonText: '搜索资源...',
            buttonAriaLabel: '搜索资源'
          },
          modal: {
            noResultsText: '未找到相关资源',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },
    sidebar: [
      {
        text: '📖 资源地图',
        items: [
          {
            text: '🤖 AI 知识',
            collapsed: true,
            items: [
              { text: '✨ 全部资源', link: '/AIknowledge/' },
              ...getSidebarItems('AIknowledge')
            ]
          },
          {
            text: '📚 精品书籍',
            collapsed: true,
            items: [
              { text: '✨ 全部资源', link: '/book/' },
              ...getSidebarItems('book')
            ]
          },
          {
            text: '🏛️ 传统文化',
            collapsed: true,
            items: [
              { text: '✨ 全部资源', link: '/chinese-traditional/' },
              ...getSidebarItems('chinese-traditional')
            ]
          },
          {
            text: '📉 跨境电商',
            collapsed: true,
            items: [
              { text: '✨ 全部资源', link: '/cross-border/' },
              ...getSidebarItems('cross-border')
            ]
          },
          {
            text: '🎓 课程专栏',
            collapsed: true,
            items: [
              { text: '✨ 全部资源', link: '/curriculum/' },
              ...getSidebarItems('curriculum')
            ]
          },
          {
            text: '🍎 教育知识',
            collapsed: true,
            items: [
              { text: '✨ 全部资源', link: '/edu-knowlege/' },
              ...getSidebarItems('edu-knowlege')
            ]
          },
          {
            text: '💊 健康养生',
            collapsed: true,
            items: [
              { text: '✨ 全部资源', link: '/healthy/' },
              ...getSidebarItems('healthy')
            ]
          },
          {
            text: '🎬 影视剧集',
            collapsed: true,
            items: [
              { text: '✨ 全部资源', link: '/movies/' },
              ...getSidebarItems('movies')
            ]
          },
          {
            text: '📱 自媒体运营',
            collapsed: true,
            items: [
              { text: '✨ 全部资源', link: '/self-media/' },
              ...getSidebarItems('self-media')
            ]
          },
          {
            text: '🛠️ 工具大全',
            collapsed: true,
            items: [
              { text: '✨ 全部资源', link: '/tools/' },
              ...getSidebarItems('tools')
            ]
          },
        ]
      }
    ],
    footer: {
      message: '[⚖️ 免责声明](/disclaimer) | 如有侵权，请联系管理员核实删除。<br>本站已安全运行 <span id="run-time"></span> | 总访问量 <span id="busuanzi_value_site_pv"></span> | 访客数 <span id="busuanzi_value_site_uv"></span>',
      copyright: 'Copyright © 2026-present 644428571@qq.com'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    lastUpdatedText: '最近更新于',
    darkModeSwitchLabel: '深色模式切换',
    outlineTitle: '本页目录',
    sidebarMenuLabel: '侧边栏',
    returnToTopLabel: '返回顶部',
  }
})
   outlineTitle: '本页目录',
    sidebarMenuLabel: '侧边栏',
    returnToTopLabel: '返回顶部',
  }
})
