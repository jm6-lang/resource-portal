const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '..', 'docs', 'tools');
const moviesDir = path.join(__dirname, '..', 'docs', 'movies');

// Music files identified
const musicFiles = [
  'post_016.md','post_025.md','post_035.md','post_037.md','post_042.md',
  'post_064.md','post_066.md','post_074.md','post_076.md','post_077.md',
  'post_081.md','post_086.md','post_104.md','post_105.md','post_106.md',
  'post_107.md','post_108.md','post_109.md','post_110.md','post_111.md',
  'post_112.md','post_113.md','post_114.md','post_115.md','post_116.md',
  'post_117.md','post_118.md','post_119.md','post_120.md','post_121.md',
  'post_122.md','post_201.md'
];

// Next available number in movies
let nextNum = 145;

for (const f of musicFiles) {
  const srcPath = path.join(toolsDir, f);
  if (!fs.existsSync(srcPath)) {
    console.log('SKIP (not found): ' + f);
    continue;
  }
  
  const content = fs.readFileSync(srcPath, 'utf8');
  const newNum = nextNum++;
  const newFile = `post_${String(newNum).padStart(3, '0')}.md`;
  const dstPath = path.join(moviesDir, newFile);
  
  // Update internal links: replace /tools/xxx with /movies/newFile
  let updated = content.replace(/\/tools\/post_\d+/g, `/movies/post_${String(newNum).padStart(3, '0')}`);
  
  // Update frontmatter description if it mentions tools category
  updated = updated.replace(
    /分类：软件工具 \/ 实用插件/g,
    '分类：在线影视 / 音乐'
  );
  updated = updated.replace(
    /分类：软件工具 \/ 会员版/g,
    '分类：在线影视 / 音乐'
  );
  updated = updated.replace(
    /分类：常用工具 \/ 会员版/g,
    '分类：在线影视 / 音乐'
  );
  
  fs.writeFileSync(dstPath, updated, 'utf8');
  console.log(`MOVED: ${f} -> movies/${newFile}`);
}

console.log(`\nTotal moved: ${nextNum - 145}`);
console.log(`Next available movies number: ${nextNum}`);
