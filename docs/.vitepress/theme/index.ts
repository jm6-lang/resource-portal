import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import SocialShare from './components/SocialShare.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(SocialShare)
    })
  }
}
