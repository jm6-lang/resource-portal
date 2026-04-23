import { h } from 'vue'
import type { HeadConfig, TransformContext } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import SocialShare from './components/SocialShare.vue'
import ZiWeiCalculator from './components/ZiWeiCalculator.vue'
import './custom.css'

const VisitorStats = {
  setup() {
    return () => h('div', { class: 'visitor-stats', innerHTML: `
      <span id="busuanzi_container_site_pv">
        🔥 站总访问量 <span id="busuanzi_value_site_pv">-</span> 次
      </span>
      <span id="busuanzi_container_site_uv">
        👥 站访客数 <span id="busuanzi_value_site_uv">-</span> 人
      </span>
      <span id="busuanzi_container_page_pv">
        📄 本页阅读 <span id="busuanzi_value_page_pv">-</span> 次
      </span>
    ` })
  }
}

// 面包屑分类映射（服务端渲染，百度可直接读取）
const breadcrumbMap: Record<string, { name: string; path: string }> = {
  '/AIknowledge/':        { name: 'AI 知识',     path: '/AIknowledge/' },
  '/book/':              { name: '书籍文献',    path: '/book/' },
  '/movies/':            { name: '在线影视',    path: '/movies/' },
  '/tools/':             { name: '常用工具',    path: '/tools/' },
  '/self-media/':        { name: '自媒体电商',  path: '/self-media/' },
  '/curriculum/':        { name: '互联网教程',  path: '/curriculum/' },
  '/healthy/':           { name: '健康养生',    path: '/healthy/' },
  '/chinese-traditional/': { name: '传统文化', path: '/chinese-traditional/' },
  '/cross-border/':      { name: '跨境电商',    path: '/cross-border/' },
  '/music/':             { name: '音乐',        path: '/music/' },
  '/edu-knowlege/':      { name: '教育资料',    path: '/edu-knowlege/' },
  '/exclusive/':         { name: '独家资源',    path: '/exclusive/' },
  '/nav/':               { name: '资源导航',    path: '/nav/' }
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ZiWeiCalculator', ZiWeiCalculator)
  },
  // 服务端注入 canonical URL 和面包屑（百度爬虫可直接读取）
  transformHead({ pageData }: TransformContext) {
    const head: HeadConfig[] = []

    // 1. 注入 canonical URL（SSR，非 JS 动态注入）
    if (pageData.relativePath) {
      const url = `https://docs.skillxm.cn/${pageData.relativePath.replace(/\.md$/, '.html')}`
      head.push(['link', { rel: 'canonical', href: url }])
    }

    // 2. 注入面包屑结构化数据（SSR，百度可直接解析）
    const pathname = '/' + pageData.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '.html')
    for (const [prefix, cat] of Object.entries(breadcrumbMap)) {
      if (pathname.startsWith(prefix) && pathname !== prefix) {
        const breadcrumb = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': '首页', 'item': 'https://docs.skillxm.cn/' },
            { '@type': 'ListItem', 'position': 2, 'name': cat.name, 'item': `https://docs.skillxm.cn${cat.path}` }
          ]
        }
        head.push(['script', { type: 'application/ld+json' }, JSON.stringify(breadcrumb)])
        break
      }
    }

    return head
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(SocialShare),
      'layout-bottom': () => h(VisitorStats)
    })
  }
}
