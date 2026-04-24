import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'

function getSidebarItems(dir: string, recursive = false) {
  const fullPath = path.join(process.cwd(), 'docs', dir)
  if (!fs.existsSync(fullPath)) return []

  const items: any[] = []

  // Current directory files
  const files = fs.readdirSync(fullPath)
    .filter(file => file.endsWith('.md') && file !== 'index.md')
    .sort()

  for (const file of files) {
    const filePath = path.join(fullPath, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const match = content.match(/^#\s+(.+)$/m)
    const name = match ? match[1].trim() : path.basename(file, '.md')
    items.push({
      text: name,
      link: `/${dir}/${path.basename(file, '.md')}.html`
    })
  }

  // Subdirectory files (recursive)
  if (recursive) {
    const subDirs = fs.readdirSync(fullPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
      .sort()

    for (const subDir of subDirs) {
      const subItems = getSidebarItems(`${dir}/${subDir}`, false)
      items.push(...subItems)
    }
  }

  return items
}

export default defineConfig({
  base: process.env.BASE || '/',
  title: "小二郎资源分享站",
  titleTemplate: "全球优质资源聚合平台",
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,
  description: "小二郎资源分享站：全网最全的 200TB+ 免费资源下载站，包含 AI 知识、精品书籍、跨境电商、自媒体、教育、健康、影视、提效工具等分类资源，每日持续更新。",

  sitemap: {
    hostname: 'https://docs.skillxm.cn',
    lastmodDateOnly: false,
    // 排除不需要收录的页面
    exclude: ['/ads', '/404']
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    ['meta', { name: 'baidu-site-verification', content: 'codeva-2us9nStCe1' }],
    // 百度移动适配声明（自适应/响应式）
    ['meta', { name: 'applicable-device', content: 'pc,mobile' }],
    ['meta', { name: 'MobileOptimized', content: 'width' }],
    ['meta', { name: 'HandheldFriendly', content: 'true' }],
    // Open Graph - 社交分享
    ['meta', { property: 'og:site_name', content: '小二郎资源分享站' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: 'https://docs.skillxm.cn/logo.png' }],
    ['meta', { property: 'og:image:width', content: '200' }],
    ['meta', { property: 'og:image:height', content: '200' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://docs.skillxm.cn/logo.png' }],
    // JSON-LD 结构化数据 - 网站级（Organization + WebSite）
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://docs.skillxm.cn/#organization',
          'name': '小二郎资源分享站',
          'url': 'https://docs.skillxm.cn/',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://docs.skillxm.cn/logo.png'
          },
          'sameAs': [
            'https://github.com/jm6-lang/resource-portal'
          ]
        },
        {
          '@type': 'WebSite',
          '@id': 'https://docs.skillxm.cn/#website',
          'url': 'https://docs.skillxm.cn/',
          'name': '小二郎资源分享站',
          'publisher': { '@id': 'https://docs.skillxm.cn/#organization' },
          'description': '全网最全的 200TB+ 免费资源下载站，包含 AI 知识、精品书籍、跨境电商、自媒体、教育、健康、影视、提效工具等分类资源，每日持续更新。',
          'potentialAction': {
            '@type': 'SearchAction',
            'target': {
              '@type': 'EntryPoint',
              'urlTemplate': 'https://docs.skillxm.cn/?search={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          }
        }
      ]
    }, null, 0)],
    ['script', { async: '', src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4710405779358793', crossorigin: 'anonymous' }],
    ['script', { async: '', src: 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js' }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/iztro@2.2.3/dist/iztro.min.js' }],
    // 百度主动推送 - 仅推送当前页面URL（避免每次访问推送全站sitemap导致配额浪费）
    ['script', {}, `
      (function(){
        if (location.protocol === 'https:') {
          var site = 'https://docs.skillxm.cn';
          var token = 'zJsDaj5ibt8ZlVgz';
          var url = location.protocol + '//' + location.host + location.pathname;
          var xhr = new XMLHttpRequest();
          xhr.open('POST', 'https://data.zz.baidu.com/urls?site=' + site + '&token=' + token, true);
          xhr.setRequestHeader('Content-Type', 'text/plain');
          xhr.send(url);
        }
      })();
    `]
  ],

  themeConfig: {
    logo: { src: '/logo.png', alt: '小二郎资源分享站 Logo' },
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '🗺️ 资源导航', link: '/nav/' },
      { text: '💎 独家资源', link: '/exclusive/' },
      { text: '👑 付费资源', link: '/paid/' }
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
        text: '📖 免费资源',
        items: [
          { text: '🗺️ 全部资源索引', link: '/nav/' },
          { text: '💎 独家资源专区', collapsed: false, items: [{ text: '✨ 专区首页', link: '/exclusive/' }, { text: '💳 注册卡采购', link: '/exclusive/registration-card.html' }, { text: '📱 大流量卡', link: '/exclusive/data-card.html' }, { text: '🛠️ 电话标记清除', link: '/exclusive/phone-label-clean.html' }, { text: '🔍 企业法人号码核验', link: '/exclusive/enterprise-verify.html' }, { text: '📊 企业法人号码批量核验', link: '/exclusive/enterprise-batch-verify.html' }] },
          { text: '🤖 AI 知识专区', link: '/AIknowledge/' },
          { text: '📚 书籍文献库', link: '/book/' },
          { text: '🎬 在线影视/音乐', link: '/movies/' },
          { text: '📈 自媒体/电商专栏', link: '/self-media/' },
          { text: '🎓 最新互联网项目教程', link: '/curriculum/' },
          { text: '🍎 教育资料馆', link: '/edu-knowlege/' },
          { text: '🛠️ 常用工具/会员版', link: '/tools/' },
          { text: '🔮 紫微斗数排盘', link: '/chinese-traditional/ziwei.html' },
          { text: '🏛️ 传统文化阁', link: '/chinese-traditional/' },
        ]
      },
      {
        text: '👑 付费资源',
        items: [
          { text: '💎 付费精品资源', link: '/paid/' },
          { text: '📋 订单查询', link: '/paid/order-query.html' },
        ]
      }
    ],
    footer: {
      message: '<a href="https://docs.skillxm.cn/about">关于我们</a> | <a href="https://docs.skillxm.cn/disclaimer">免责声明</a> | <a href="https://docs.skillxm.cn/privacy">隐私政策</a> | <a href="https://docs.skillxm.cn/contact">联系我们</a> | <a href="https://docs.skillxm.cn/links">友情链接</a> | <a href="https://docs.skillxm.cn/ads">广告合作</a><br>友情链接：<a href="https://skillxm.cn" target="_blank">skillxm.cn</a> | <a href="https://tool.skillxm.cn" target="_blank">tool.skillxm.cn</a> | <a href="https://ziwei.skillxm.cn" target="_blank">ziwei.skillxm.cn</a>',
      copyright: 'Copyright © 2026-present 小二郎资源分享站'
    },
    lastUpdatedText: '最近更新于',
    darkModeSwitchLabel: '深色模式切换',
    outlineTitle: '本页目录',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
  }
})
