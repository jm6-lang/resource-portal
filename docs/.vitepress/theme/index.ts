import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import SocialShare from './components/SocialShare.vue'
import ZiWeiCalculator from './components/ZiWeiCalculator.vue'
import './custom.css'

const VisitorStats = {
  setup() {
    return () => h('div', { class: 'visitor-stats', innerHTML: `
      <span>🔥 本站总访问量 <span class="stat-num">1218</span> 次</span>
      <span>👥 本站访客数 <span class="stat-num">951</span> 人</span>
      <span>📄 本文阅读量 <span class="stat-num">1520</span> 次</span>
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
