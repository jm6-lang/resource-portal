import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'

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
  title: "资源收集站",
  titleTemplate: ":title - 海量免费资源下载",
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,
  description: "海量免费资源下载站，包含AI知识、书籍资料、跨境电商、自媒体、教育、健康、影视、工具等资源",
  head: [
    ['script', { async: '', src: 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js' }]
  ],
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '📂 资源', link: '/AIknowledge/' },
      { text: '关于我们', link: '/about' },
      { text: '免责声明', link: '/disclaimer' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jm6-lang/resource-portal' }
    ],
    search: {
      provider: 'local'
    },
    sidebar: [
      {
        text: '资源分类',
        items: [
          {
            text: 'AI 知识',
            collapsed: true,
            items: [
              { text: 'AI 知识主页', link: '/AIknowledge/' },
              ...getSidebarItems('AIknowledge')
            ]
          },
          {
            text: '书籍资料',
            collapsed: true,
            items: [
              { text: '书籍资料主页', link: '/book/' },
              ...getSidebarItems('book')
            ]
          },
          {
            text: '传统文化',
            collapsed: true,
            items: [
              { text: '传统文化主页', link: '/chinese-traditional/' },
              ...getSidebarItems('chinese-traditional')
            ]
          },
          {
            text: '跨境电商',
            collapsed: true,
            items: [
              { text: '跨境电商主页', link: '/cross-border/' },
              ...getSidebarItems('cross-border')
            ]
          },
          {
            text: '课程资料',
            collapsed: true,
            items: [
              { text: '课程资料主页', link: '/curriculum/' },
              ...getSidebarItems('curriculum')
            ]
          },
          {
            text: '教育知识',
            collapsed: true,
            items: [
              { text: '教育知识主页', link: '/edu-knowlege/' },
              ...getSidebarItems('edu-knowlege')
            ]
          },
          {
            text: '健康养生',
            collapsed: true,
            items: [
              { text: '健康养生主页', link: '/healthy/' },
              ...getSidebarItems('healthy')
            ]
          },
          {
            text: '影视媒体',
            collapsed: true,
            items: [
              { text: '影视媒体主页', link: '/movies/' },
              ...getSidebarItems('movies')
            ]
          },
          {
            text: '自媒体',
            collapsed: true,
            items: [
              { text: '自媒体主页', link: '/self-media/' },
              ...getSidebarItems('self-media')
            ]
          },
          {
            text: '工具合集',
            collapsed: true,
            items: [
              { text: '工具合集主页', link: '/tools/' },
              ...getSidebarItems('tools')
            ]
          },
        ]
      }
    ],
    footer: {
      message: '[免责声明](/disclaimer) | 如有侵权，请联系删除。<br>本站总访问量 <span id="busuanzi_value_site_pv"></span> 次 | 访客数 <span id="busuanzi_value_site_uv"></span> 人次',
      copyright: 'Copyright © 2026-present 644428571@qq.com'
    }
  }
})
