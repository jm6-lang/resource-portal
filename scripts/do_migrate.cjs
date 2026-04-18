const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');
const migrations = require('./migration_plan.cjs');

// Category label map for updating frontmatter
const catLabels = {
  'AIknowledge': 'AI知识 / 人工智能',
  'book': '书籍文献库',
  'chinese-traditional': '传统文化阁',
  'curriculum': '学习课程 / 职场技能',
  'edu-knowlege': '教育资料馆',
  'movies': '在线影视 / 音乐',
  'self-media': '自媒体 / 电商专栏',
  'tools': '常用工具 / 会员版',
  'healthy': '健康',
  'cross-border': '跨境电商',
};

// Get next available post number in a directory
function getNextNum(dir) {
  const dirPath = path.join(docsDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return 1;
  }
  const files = fs.readdirSync(dirPath).filter(f => f.startsWith('post_') && f.endsWith('.md'));
  let maxNum = 0;
  for (const f of files) {
    const m = f.match(/post_(\d+)/);
    if (m) maxNum = Math.max(maxNum, parseInt(m[1]));
  }
  return maxNum + 1;
}

// Track next numbers per target directory
const nextNums = {};

// Execute migrations
const movedFiles = []; // track for deletion from source
const log = [];

for (const [srcRel, info] of Object.entries(migrations)) {
  const srcPath = path.join(docsDir, srcRel.replace(/\//g, path.sep));
  if (!fs.existsSync(srcPath)) {
    log.push(`SKIP (not found): ${srcRel}`);
    continue;
  }

  const targetDir = info.target;
  if (!nextNums[targetDir]) nextNums[targetDir] = getNextNum(targetDir);
  const newNum = nextNums[targetDir]++;
  const newFile = `post_${String(newNum).padStart(3, '0')}.md`;
  const dstPath = path.join(docsDir, targetDir, newFile);

  let content = fs.readFileSync(srcPath, 'utf8');

  // Update category labels in description and content
  const srcLabel = catLabels[srcRel.split('/')[0]];
  const dstLabel = catLabels[targetDir];
  if (srcLabel && dstLabel) {
    content = content.replace(new RegExp(srcLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), dstLabel);
  }

  // Also fix generic labels
  content = content.replace(/分类[：:]\s*软件工具 \/ 实用插件/g, `分类：${dstLabel}`);
  content = content.replace(/分类[：:]\s*软件工具 \/ 会员版/g, `分类：${dstLabel}`);
  content = content.replace(/分类[：:]\s*常用工具 \/ 会员版/g, `分类：${dstLabel}`);
  content = content.replace(/分类[：:]\s*学习课程 \/ 职场技能/g, `分类：${dstLabel}`);
  content = content.replace(/分类[：:]\s*AI知识 \/ 人工智能/g, `分类：${dstLabel}`);
  content = content.replace(/分类[：:]\s*在线影视 \/ 音乐/g, `分类：${dstLabel}`);
  content = content.replace(/分类[：:]\s*自媒体 \/ 电商专栏/g, `分类：${dstLabel}`);
  content = content.replace(/分类[：:]\s*教育资料馆/g, `分类：${dstLabel}`);

  fs.writeFileSync(dstPath, content, 'utf8');
  movedFiles.push(srcPath);
  log.push(`MOVE: ${srcRel} -> ${targetDir}/${newFile} (${info.reason})`);
}

// Delete source files
for (const src of movedFiles) {
  fs.unlinkSync(src);
}

// Output log
for (const line of log) {
  console.log(line);
}
console.log(`\nTotal migrated: ${movedFiles.length}`);
