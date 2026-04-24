import { h } from 'vue'
import type { HeadConfig, TransformContext } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import SocialShare from './components/SocialShare.vue'
import ZiWeiCalculator from './components/ZiWeiCalculator.vue'
import PayButton from './components/PayButton.vue'
import PayResult from './components/PayResult.vue'
import ResourceCard from './components/ResourceCard.vue'
import MembershipCard from './components/MembershipCard.vue'
import PaidResourceList from './components/PaidResourceList.vue'
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
    app.component('PayButton', PayButton)
    app.component('PayResult', PayResult)
    app.component('ResourceCard', ResourceCard)
    app.component('MembershipCard', MembershipCard)
    app.component('PaidResourceList', PaidResourceList)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(SocialShare),
      'layout-bottom': () => h(VisitorStats)
    })
  }
}

// 使用 VitePress 的 setupBuild 钩子在构建时注入 canonical 和面包屑
// 这比 transformHead 更可靠，因为它直接修改构建产物
if (typeof globalThis !== 'undefined') {
  (globalThis as any).__VITEPRESS_BREADCRUMB_MAP__ = breadcrumbMap
}
