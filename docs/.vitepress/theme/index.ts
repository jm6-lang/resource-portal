import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import SocialShare from './components/SocialShare.vue'
import ZiWeiCalculator from './components/ZiWeiCalculator.vue'
import './custom.css'

const VisitorStats = {
  setup() {
    return () => h('div', { class: 'visitor-stats', innerHTML: `
      <span id="busuanzi_container_site_pv" style="display:none;">
        🔥 本站总访问量 <span id="busuanzi_value_site_pv"></span> 次
      </span>
      <span id="busuanzi_container_site_uv" style="display:none;">
        👥 本站访客数 <span id="busuanzi_value_site_uv"></span> 人
      </span>
      <span id="busuanzi_container_page_pv" style="display:none;">
        📄 本文阅读量 <span id="busuanzi_value_page_pv"></span> 次
      </span>
    ` })
  }
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ZiWeiCalculator', ZiWeiCalculator)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(SocialShare),
      'layout-bottom': () => h(VisitorStats)
    })
  }
}
