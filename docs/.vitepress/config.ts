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
    const name = path.basename(file, '.md')
    return {
      text: name,
      link: `/${dir}/${name}`
    }
  })
}

export default defineConfig({
  base: '/',
  title: "资源收集站",
  titleTemplate: ":title - 海量免费资源下载",
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,
  description: "海量免费资源下载站，包含AI知识、书籍资料、跨境电商、自媒体、教育、健康、影视、工具等资源",
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '📂 资源', link: '/AIknowledge/' }
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
      message: '如有侵权，请联系删除。',
      copyright: 'Copyright © 2026-present'
    }
  }
})
