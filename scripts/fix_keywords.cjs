const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

// Fix category keywords in migrated files
const fixes = [
  { file: 'healthy/post_001.md', old: '影视娱乐 / 短剧', new: '健康' },
  { file: 'healthy/post_002.md', old: '影视娱乐 / 短剧', new: '健康' },
  { file: 'healthy/post_003.md', old: '影视娱乐 / 短剧', new: '健康' },
  { file: 'healthy/post_004.md', old: '学习课程 / 职场技能', new: '健康' },
  { file: 'healthy/post_005.md', old: '影视娱乐 / 短剧', new: '健康' },
  { file: 'curriculum/post_155.md', old: '影视娱乐 / 短剧', new: '学习课程 / 职场技能' },
];

for (const fix of fixes) {
  const filePath = path.join(docsDir, fix.file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  content = content.split(fix.old).join(fix.new);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed: ${fix.file}`);
}

console.log('\nDone.');
