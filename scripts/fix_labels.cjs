const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const catLabels = {
  'AIknowledge': 'AI 知识 / 人工智能',
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

// Fix all index.md and migrated files
// Scan all post files in self-media (newly migrated), tools, movies, edu-knowlege
const dirsToFix = ['self-media', 'tools', 'movies', 'edu-knowlege', 'AIknowledge', 'curriculum'];
let fixed = 0;

for (const dir of dirsToFix) {
  const dirPath = path.join(docsDir, dir);
  const files = fs.readdirSync(dirPath).filter(f => f.startsWith('post_') && f.endsWith('.md'));
  
  for (const f of files) {
    const fp = path.join(dirPath, f);
    let content = fs.readFileSync(fp, 'utf8');
    let changed = false;
    
    // Fix category labels - replace any non-matching category with correct one
    const correctLabel = catLabels[dir];
    if (!correctLabel) continue;
    
    // Replace all other category labels in description and content
    for (const [d, label] of Object.entries(catLabels)) {
      if (d === dir) continue;
      if (content.includes(label)) {
        content = content.split(label).join(correctLabel);
        changed = true;
      }
    }
    
    if (changed) {
      fs.writeFileSync(fp, content, 'utf8');
      fixed++;
    }
  }
}

console.log(`Fixed category labels in ${fixed} files`);
