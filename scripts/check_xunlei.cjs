const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const newResources = [
  { title: 'manus手机版', link: 'https://pan.xunlei.com/s/VOOk8y1nkJX_aZwoiNkZHARXA1' },
  { title: 'manus邀请码', link: 'https://pan.xunlei.com/s/VOOk9I6HqwD7OHSTuQaoRez2A1' },
  { title: '人工智能（AI）变现课程', link: 'https://pan.xunlei.com/s/VOOuLU3-dxoVSJw1VI9lWiRRA1' },
  { title: '扣子空间邀请码共享', link: 'https://pan.xunlei.com/s/VOOuNJ8h_mrrD5nVVcfC8WfZA1' },
  { title: 'AI换脸工具视频教程', link: 'https://pan.xunlei.com/s/VOQBYU4VXCgrMtHoYtxoDQk8A1' },
  { title: 'Autosale 智能体', link: 'https://pan.xunlei.com/s/VOWmgpCqKF-zqmyiUwZGQtzeA1' },
];

const newIds = newResources.map(r => {
  const m = r.link.match(/\/s\/([A-Za-z0-9_-]+)/);
  return { id: m ? m[1] : null, title: r.title, link: r.link };
});

const categories = ['tools', 'movies', 'curriculum', 'self-media', 'AIknowledge', 'healthy', 'book', 'chinese-traditional', 'edu-knowlege'];
const existingIds = new Map();
const duplicates = [];

for (const cat of categories) {
  const catDir = path.join(docsDir, cat);
  if (!fs.existsSync(catDir)) continue;
  const files = fs.readdirSync(catDir).filter(f => f.startsWith('post_') && f.endsWith('.md'));
  for (const f of files) {
    const content = fs.readFileSync(path.join(catDir, f), 'utf8');
    for (const r of newIds) {
      if (r.id && content.includes(r.id)) {
        duplicates.push({ id: r.id, title: r.title, file: `${cat}/${f}` });
        existingIds.set(r.id, true);
      }
    }
  }
}

console.log('检查', newResources.length, '个资源...');
console.log('重复:', duplicates.length);
duplicates.forEach(d => console.log(`  ✓ ${d.title} -> ${d.file}`));

const unique = newIds.filter(r => r.id && !existingIds.has(r.id));
console.log('\n新增:', unique.length);

if (unique.length > 0) {
  console.log('\n分类建议:');
  unique.forEach(r => {
    let cat = 'tools';
    if (r.title.includes('AI') || r.title.includes('智能') || r.title.includes('manus') || r.title.includes('扣子')) cat = 'AIknowledge';
    else if (r.title.includes('变现') || r.title.includes('邀请码')) cat = 'self-media';
    console.log(`  [${cat}] ${r.title}`);
  });
}
