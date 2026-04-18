import fs from 'node:fs'
import path from 'node:path'

const dir = process.argv[2] || 'curriculum'
const docsDir = path.join(process.cwd(), 'docs')
const targetDir = path.join(docsDir, dir)

// Read title mapping from existing index.md frontmatter
const indexPath = path.join(targetDir, 'index.md')
const indexContent = fs.readFileSync(indexPath, 'utf-8')
const titleMatch = indexContent.match(/^---\n.*?title:\s*["']?(.+?)["']?\s*\n.*?---/s)
const pageTitle = titleMatch ? titleMatch[1] : dir

// Get the heading from first #
const headingMatch = indexContent.match(/^#\s+(.+)$/m)
const heading = headingMatch ? headingMatch[1] : pageTitle

// Scan all post files
const files = fs.readdirSync(targetDir)
  .filter(f => f.startsWith('post_') && f.endsWith('.md'))
  .sort((a, b) => {
    const numA = parseInt(a.match(/post_(\d+)/)?.[1] || '0')
    const numB = parseInt(b.match(/post_(\d+)/)?.[1] || '0')
    return numA - numB
  })

let tableRows = ''
for (const file of files) {
  const filePath = path.join(targetDir, file)
  const content = fs.readFileSync(filePath, 'utf-8')
  
  // Extract title from first # heading
  const h1Match = content.match(/^#\s+(.+)$/m)
  const name = h1Match ? h1Match[1].trim() : path.basename(file, '.md')
  
  // Extract platform from Badge
  const badgeMatch = content.match(/<Badge[^>]*text="([^"]+)"[^>]*\/>/)
  const platform = badgeMatch ? badgeMatch[1] : ''
  
  const slug = path.basename(file, '.md')
  tableRows += `| ${name} | ${platform} | [点击进入](/${dir}/${slug}) |\n`
}

const output = `---
title: "${pageTitle}"
---

# ${heading}

| 资源名称 | 平台 | 详情 |
| :--- | :--- | :--- |
${tableRows}`

fs.writeFileSync(indexPath, output, 'utf-8')
console.log(`Regenerated ${indexPath} with ${files.length} entries`)
