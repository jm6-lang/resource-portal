const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const migrations = [
  { src: 'movies/post_016.md', title: 'TikTok海外影视课程全套' },
  { src: 'movies/post_047.md', title: '带货短视频文案脚本公式进阶班' },
  { src: 'movies/post_116.md', title: '视频号运营实战课程' },
  { src: 'movies/post_117.md', title: '视频号风口21天从0到1视频课程' },
];

const catLabels = {
  'self-media': '自媒体 / 电商专栏',
  'movies': '在线影视 / 音乐',
};

// Get next number for self-media
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

let nextNum = getNextNum('self-media');
console.log('self-media next number:', nextNum);

for (const m of migrations) {
  const srcPath = path.join(docsDir, m.src.replace(/\//g, path.sep));
  if (!fs.existsSync(srcPath)) {
    console.log(`SKIP (not found): ${m.src}`);
    continue;
  }

  const newNum = nextNum++;
  const newFile = `post_${String(newNum).padStart(3, '0')}.md`;
  const dstPath = path.join(docsDir, 'self-media', newFile);

  let content = fs.readFileSync(srcPath, 'utf8');

  // Update category labels
  content = content.split(catLabels['movies']).join(catLabels['self-media']);

  // Write to new location
  fs.mkdirSync(path.dirname(dstPath), { recursive: true });
  fs.writeFileSync(dstPath, content, 'utf8');

  // Delete source
  fs.unlinkSync(srcPath);

  console.log(`MOVE: ${m.src} -> self-media/${newFile}`);
}

console.log('\nDone. Migrated', migrations.length, 'files.');
