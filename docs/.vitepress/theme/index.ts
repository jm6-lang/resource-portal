import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import SocialShare from './components/SocialShare.vue'
import ZiWeiCalculator from './components/ZiWeiCalculator.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ZiWeiCalculator', ZiWeiCalculator)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(SocialShare)
    })
  }
}
