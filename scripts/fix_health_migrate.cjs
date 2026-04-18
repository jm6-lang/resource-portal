const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

// Migrations: source -> target
const migrations = [
  { src: 'movies/post_023.md', dst: 'healthy', title: '健身房私教内部视频课程' },
  { src: 'movies/post_024.md', dst: 'healthy', title: '健身新手入门训练经验视频课程' },
  { src: 'movies/post_018.md', dst: 'healthy', title: '颈椎保养课' },
  { src: 'curriculum/post_022.md', dst: 'healthy', title: '瑜伽减肥训练营' },
  { src: 'movies/post_028.md', dst: 'healthy', title: '八段锦详细视频课程' },
  { src: 'movies/post_126.md', dst: 'curriculum', title: '高情商沟通技巧视频课程' },
  { src: 'tools/post_050.md', dst: 'self-media', title: '小白创业指南老板商业必修课' },
];

const catLabels = {
  'healthy': '健康',
  'curriculum': '学习课程 / 职场技能',
  'self-media': '自媒体 / 电商专栏',
  'movies': '在线影视 / 音乐',
  'tools': '常用工具 / 会员版',
};

// Get next number for each target
function getNextNum(dir) {
  const dirPath = path.join(docsDir, dir);
  if (!fs.existsSync(dirPath)) return 1;
  const files = fs.readdirSync(dirPath).filter(f => f.startsWith('post_') && f.endsWith('.md'));
  let max = 0;
  for (const f of files) {
    const m = f.match(/post_(\d+)/);
    if (m) max = Math.max(max, parseInt(m[1]));
  }
  return max + 1;
}

const nextNums = {};

for (const m of migrations) {
  const srcPath = path.join(docsDir, m.src.replace(/\//g, path.sep));
  if (!fs.existsSync(srcPath)) {
    console.log(`SKIP (not found): ${m.src}`);
    continue;
  }

  if (!nextNums[m.dst]) nextNums[m.dst] = getNextNum(m.dst);
  const newNum = nextNums[m.dst]++;
  const newFile = `post_${String(newNum).padStart(3, '0')}.md`;
  const dstPath = path.join(docsDir, m.dst, newFile);

  let content = fs.readFileSync(srcPath, 'utf8');

  // Update category labels
  const srcDir = m.src.split('/')[0];
  const srcLabel = catLabels[srcDir];
  const dstLabel = catLabels[m.dst];
  if (srcLabel && dstLabel) {
    content = content.split(srcLabel).join(dstLabel);
  }

  // Write to new location
  fs.mkdirSync(path.dirname(dstPath), { recursive: true });
  fs.writeFileSync(dstPath, content, 'utf8');

  // Delete source
  fs.unlinkSync(srcPath);

  console.log(`MOVE: ${m.src} -> ${m.dst}/${newFile}`);
}

console.log('\nDone.');
