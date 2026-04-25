/**
 * 自定义构建后处理脚本
 * 构建完成后运行：node .vitepress/sitemap-gen.mjs
 *
 * 功能：
 * 1. 彻底去除 news/image/video/xhtml 等无用命名空间（百度不兼容）
 * 2. 添加 priority 和 changefreq 字段
 * 3. 为所有 HTML 页面注入 canonical URL（SSR 级别，百度可读取）
 * 4. 为分类页面注入 BreadcrumbList JSON-LD
 * 5. 为所有页面注入 og:title 和 og:description
 */
import fs from 'node:fs'
import path from 'node:path'

const hostname = 'https://docs.skillxm.cn'
const distDir = path.join(process.cwd(), 'docs/.vitepress/dist')

// ========== Part 1: Sitemap 处理 ==========
const sitemapPath = path.join(distDir, 'sitemap.xml')

if (!fs.existsSync(sitemapPath)) {
  console.warn('[post-build] dist/sitemap.xml not found, skipping.')
  process.exit(0)
}

let xml = fs.readFileSync(sitemapPath, 'utf-8')

// 清理所有非标准命名空间
xml = xml
  .replace(/<urlset[^>]*>/, () => '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
  .replace(/<url>[\s\S]*?<\/url>\n?/g, (urlBlock) => {
    if (/<news:/.test(urlBlock)) return ''
    return urlBlock
  })
  .replace(/\n{3,}/g, '\n\n')

// 修复 lastmod 时间格式：去掉毫秒部分 (.000Z → Z)
// Google 要求标准 ISO 8601 格式，VitePress 生成的 .000Z 毫秒可能导致解析失败
xml = xml.replace(
  /(<lastmod>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})\.000Z(<\/lastmod>)/g,
  '$1Z$2'
)

// 优先级规则
const priorityRules = [
  { pattern: /^\/$/, priority: '1.0', changefreq: 'daily' },
  { pattern: /^\/nav\/?$/, priority: '0.9', changefreq: 'weekly' },
  { pattern: /^\/exclusive\/?$/, priority: '0.9', changefreq: 'weekly' },
  { pattern: /^\/exclusive\//, priority: '0.8', changefreq: 'monthly' },
  { pattern: /^\/AIknowledge\/?$/, priority: '0.8', changefreq: 'daily' },
  { pattern: /^\/book\/?$/, priority: '0.8', changefreq: 'daily' },
  { pattern: /^\/movies\/?$/, priority: '0.8', changefreq: 'daily' },
  { pattern: /^\/tools\/?$/, priority: '0.8', changefreq: 'daily' },
  { pattern: /^\/self-media\/?$/, priority: '0.8', changefreq: 'weekly' },
  { pattern: /^\/curriculum\/?$/, priority: '0.8', changefreq: 'daily' },
  { pattern: /^\/healthy\/?$/, priority: '0.8', changefreq: 'weekly' },
  { pattern: /^\/chinese-traditional\/?$/, priority: '0.8', changefreq: 'weekly' },
  { pattern: /^\/chinese-traditional\/ziwei\.html$/, priority: '0.9', changefreq: 'weekly' },
  { pattern: /^\/cross-border\/?$/, priority: '0.7', changefreq: 'weekly' },
  { pattern: /^\/music\/?$/, priority: '0.7', changefreq: 'weekly' },
  { pattern: /^\/edu-knowlege\/?$/, priority: '0.7', changefreq: 'weekly' },
  { pattern: /^\/about\.html$/, priority: '0.6', changefreq: 'monthly' },
]

function getPriorityAndFreq(urlPath) {
  for (const rule of priorityRules) {
    if (rule.pattern.test(urlPath)) return { priority: rule.priority, changefreq: rule.changefreq }
  }
  const depth = urlPath.split('/').filter(Boolean).length
  if (depth === 1) return { priority: '0.8', changefreq: 'weekly' }
  if (depth === 2) return { priority: '0.7', changefreq: 'monthly' }
  return { priority: '0.6', changefreq: 'monthly' }
}

xml = xml.replace(/<url>([\s\S]*?)<\/url>/g, (match, urlContent) => {
  const locMatch = urlContent.match(/<loc>(.*?)<\/loc>/)
  if (!locMatch) return match
  const pathname = locMatch[1].replace(hostname, '')
  const { priority, changefreq } = getPriorityAndFreq(pathname)
  if (/<priority>/.test(urlContent)) return match
  return `<url>\n  ${urlContent.trim()}\n  <priority>${priority}</priority>\n  <changefreq>${changefreq}</changefreq>\n</url>`
})

fs.writeFileSync(sitemapPath, xml.trim() + '\n', 'utf-8')
const urlCount = (xml.match(/<url>/g) || []).length
console.log(`[post-build] ✓ Sitemap: ${urlCount} URLs, namespaces cleaned`)

// ========== Part 2: HTML 后处理（注入 canonical + breadcrumb + OG） ==========

const breadcrumbMap = {
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

function processHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let processedCount = 0

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      processHtmlFiles(fullPath)
      continue
    }
    if (!entry.name.endsWith('.html')) continue

    let html = fs.readFileSync(fullPath, 'utf-8')

    // 跳过 404 页面
    if (html.includes('PAGE NOT FOUND')) continue

    // 从文件路径计算 URL 路径
    const relativePath = path.relative(distDir, fullPath)
    const urlPath = '/' + relativePath.replace(/\\/g, '/')
    const canonicalUrl = hostname + urlPath

    // 1. 注入 canonical URL（如果不存在）
    if (!html.includes('rel="canonical"')) {
      const canonicalTag = `<link rel="canonical" href="${canonicalUrl}">`
      // 插入到 </head> 之前
      html = html.replace('</head>', `  ${canonicalTag}\n</head>`)
    }

    // 2. 注入 BreadcrumbList JSON-LD（分类页面）
    for (const [prefix, cat] of Object.entries(breadcrumbMap)) {
      if (urlPath.startsWith(prefix) && urlPath !== prefix && !urlPath.endsWith('index.html')) {
        if (!html.includes('"@type":"BreadcrumbList"') && !html.includes('"@type": "BreadcrumbList"')) {
          const breadcrumb = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': '首页', 'item': hostname + '/' },
              { '@type': 'ListItem', 'position': 2, 'name': cat.name, 'item': hostname + cat.path }
            ]
          })
          const breadcrumbScript = `<script type="application/ld+json">${breadcrumb}</script>`
          html = html.replace('</head>', `  ${breadcrumbScript}\n</head>`)
        }
        break
      }
    }

    // 3. 注入 og:url（如果不存在）
    if (!html.includes('og:url') && !html.includes('property="og:url"')) {
      const ogUrlTag = `<meta property="og:url" content="${canonicalUrl}">`
      html = html.replace('</head>', `  ${ogUrlTag}\n</head>`)
    }

    fs.writeFileSync(fullPath, html, 'utf-8')
    processedCount++
  }

  return processedCount
}

const htmlCount = processHtmlFiles(distDir)
console.log(`[post-build] ✓ HTML: ${htmlCount} files processed (canonical + breadcrumb + og:url injected)`)
