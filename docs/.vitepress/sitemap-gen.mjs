/**
 * 自定义 sitemap 生成脚本
 * 构建完成后运行：node .vitepress/sitemap-gen.mjs
 *
 * 功能：
 * 1. 彻底去除 news/image/video/xhtml 等无用命名空间（百度不兼容）
 * 2. 添加 priority 和 changefreq 字段（帮助搜索引擎判断页面权重）
 * 3. 确保 sitemap 格式兼容百度/Google/Bing
 */
import fs from 'node:fs'
import path from 'node:path'

const hostname = 'https://docs.skillxm.cn'
const inputPath = path.join(process.cwd(), 'docs/.vitepress/dist/sitemap.xml')
const outputPath = path.join(process.cwd(), 'docs/.vitepress/dist/sitemap.xml')

if (!fs.existsSync(inputPath)) {
  console.warn('[sitemap-gen] dist/sitemap.xml not found, skipping.')
  process.exit(0)
}

let xml = fs.readFileSync(inputPath, 'utf-8')

// 1. 彻底清理所有非标准命名空间（只保留核心 sitemap 命名空间）
// 百度对 xmlns:news 等额外命名空间兼容性差，必须移除
xml = xml
  // 移除 urlset 标签上的所有额外命名空间声明
  .replace(/<urlset[^>]*>/, (match) => {
    // 只保留 xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    return '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  })
  // 移除所有包含 news: 的 url 块
  .replace(/<url>[\s\S]*?<\/url>\n?/g, (urlBlock) => {
    if (/<news:/.test(urlBlock)) return ''
    return urlBlock
  })
  // 清理可能残留的空行
  .replace(/\n{3,}/g, '\n\n')

// 2. 定义页面优先级规则
const priorityRules = [
  { pattern: /^\/$/, priority: '1.0', changefreq: 'daily' },
  { pattern: /^\/nav\/?$/, priority: '0.9', changefreq: 'weekly' },
  { pattern: /^\/exclusive\/?$/, priority: '0.9', changefreq: 'weekly' },
  { pattern: /^\/exclusive\/enterprise-/, priority: '0.8', changefreq: 'monthly' },
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
  { pattern: /^\/disclaimer\.html$/, priority: '0.5', changefreq: 'monthly' },
  { pattern: /^\/privacy\.html$/, priority: '0.5', changefreq: 'monthly' },
  { pattern: /^\/contact\.html$/, priority: '0.5', changefreq: 'monthly' },
  { pattern: /^\/links\.html$/, priority: '0.5', changefreq: 'monthly' },
]

function getPriorityAndFreq(urlPath) {
  for (const rule of priorityRules) {
    if (rule.pattern.test(urlPath)) {
      return { priority: rule.priority, changefreq: rule.changefreq }
    }
  }
  const depth = urlPath.split('/').filter(Boolean).length
  if (depth === 1) return { priority: '0.8', changefreq: 'weekly' }
  if (depth === 2) return { priority: '0.7', changefreq: 'monthly' }
  return { priority: '0.6', changefreq: 'monthly' }
}

// 3. 在每个 <url> 块中插入 priority 和 changefreq
xml = xml.replace(/<url>([\s\S]*?)<\/url>/g, (match, urlContent) => {
  const locMatch = urlContent.match(/<loc>(.*?)<\/loc>/)
  if (!locMatch) return match
  const locUrl = locMatch[1]
  const pathname = locUrl.replace(hostname, '')
  const { priority, changefreq } = getPriorityAndFreq(pathname)
  if (/<priority>/.test(urlContent)) return match
  return `<url>\n  ${urlContent.trim()}\n  <priority>${priority}</priority>\n  <changefreq>${changefreq}</changefreq>\n</url>`
})

xml = xml.trim() + '\n'

fs.writeFileSync(outputPath, xml, 'utf-8')

const urlCount = (xml.match(/<url>/g) || []).length
console.log(`[sitemap-gen] ✓ Generated sitemap.xml with ${urlCount} URLs`)
console.log(`[sitemap-gen] ✓ Cleaned all non-standard namespaces (news/image/video/xhtml)`)
console.log(`[sitemap-gen] ✓ Added priority/changefreq to all URLs`)
