/**
 * 自定义 sitemap 生成脚本
 * 构建完成后运行：node .vitepress/sitemap-gen.mjs
 *
 * 功能：
 * 1. 去除 news 命名空间（无新闻内容，避免 Google 误判）
 * 2. 添加 priority 和 changefreq 字段（帮助搜索引擎判断页面权重）
 * 3. 去除 trailing slash 保持 cleanUrls 一致
 */
import fs from 'node:fs'
import path from 'node:path'

const hostname = 'https://docs.skillxm.cn'
const inputPath = path.join(process.cwd(), '.vitepress/dist/sitemap.xml')
const outputPath = path.join(process.cwd(), '.vitepress/dist/sitemap.xml')

if (!fs.existsSync(inputPath)) {
  console.warn('[sitemap-gen] dist/sitemap.xml not found, skipping.')
  process.exit(0)
}

let xml = fs.readFileSync(inputPath, 'utf-8')

// 1. 去除 news 命名空间声明和所有 news: 条目
xml = xml
  .replace(/\s*xmlns:news="[^"]*"\n?/g, '')
  .replace(/<url>[\s\S]*?<\/url>\n?/g, (urlBlock) => {
    if (/<news:/.test(urlBlock)) return '' // 跳过含 news 的 url 条目
    return urlBlock
  })

// 2. 定义页面优先级规则
const priorityRules = [
  { pattern: /^\/$/, priority: '1.0', changefreq: 'daily' },          // 首页
  { pattern: /^\/nav\/?$/, priority: '0.9', changefreq: 'weekly' },  // 资源导航
  { pattern: /^\/exclusive\/?$/, priority: '0.9', changefreq: 'weekly' }, // 独家资源
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
  { pattern: /^\/ads\.html$/, priority: '0.5', changefreq: 'monthly' },
  // 内容页（默认）
]

function getPriorityAndFreq(urlPath) {
  for (const rule of priorityRules) {
    if (rule.pattern.test(urlPath)) {
      return { priority: rule.priority, changefreq: rule.changefreq }
    }
  }
  // 内容页按深度递减
  const depth = urlPath.split('/').filter(Boolean).length
  if (depth === 1) return { priority: '0.8', changefreq: 'weekly' }   // 分类页
  if (depth === 2) return { priority: '0.7', changefreq: 'monthly' } // 内容页
  return { priority: '0.6', changefreq: 'monthly' }
}

// 3. 在每个 <url> 块中插入 priority 和 changefreq
xml = xml.replace(/<url>([\s\S]*?)<\/url>/g, (match, urlContent) => {
  // 提取 loc
  const locMatch = urlContent.match(/<loc>(.*?)<\/loc>/)
  if (!locMatch) return match
  const locUrl = locMatch[1]
  const pathname = locUrl.replace(hostname, '')
  const { priority, changefreq } = getPriorityAndFreq(pathname)

  // 如果已有 priority/changefreq 则跳过（避免重复）
  if (/<priority>/.test(urlContent)) return match

  return `<url>\n  ${urlContent.trim()}\n  <priority>${priority}</priority>\n  <changefreq>${changefreq}</changefreq>\n</url>`
})

// 4. 清理末尾空白，保留一个 sitemap 头部
xml = xml
  .replace(/<urlset([^>]*)xmlns:news="[^"]*"/, '<urlset$1')
  .trim() + '\n'

fs.writeFileSync(outputPath, xml, 'utf-8')

// 统计
const urlCount = (xml.match(/<url>/g) || []).length
console.log(`[sitemap-gen] ✓ Generated sitemap.xml with ${urlCount} URLs`)
console.log(`[sitemap-gen] ✓ Removed news namespace, added priority/changefreq`)
