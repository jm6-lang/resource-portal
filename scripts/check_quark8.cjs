const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const input = `暴利玄学，教你如何快速跨入命理行业，日入1000＋月入过万 https://pan.quark.cn/s/840f6257a6d0
图解中国传统文化 居家风水 https://pan.quark.cn/s/3e3dac1707c4
书法字帖资源合集 https://pan.quark.cn/s/bae1d2a98cc1
风水和算命系列课程合集 https://pan.quark.cn/s/5a6da18eb0b3
抖音热门华语劲爆车载DJ歌曲合集 https://pan.quark.cn/s/b8596ed95e1c
450个搞钱玩法教程合集 https://pan.quark.cn/s/40e52dc4571c
练字教程字帖大合集 https://pan.quark.cn/s/ed38ac8a3a44
金葫芦万年历电子版 https://pan.quark.cn/s/ee9c58057f96`;

const newResources = input.split('\n').map(line => {
  const match = line.match(/^(.+?)\s+https:\/\/pan\.quark\.cn\/s\/([A-Za-z0-9]+)/);
  if (match) {
    return { title: match[1].trim(), id: match[2], link: `https://pan.quark.cn/s/${match[2]}` };
  }
  return null;
}).filter(Boolean);

const categories = ['book', 'tools', 'movies', 'curriculum', 'self-media', 'AIknowledge', 'healthy', 'chinese-traditional', 'edu-knowlege'];
const existingIds = new Map();
const duplicates = [];

for (const cat of categories) {
  const catDir = path.join(docsDir, cat);
  if (!fs.existsSync(catDir)) continue;
  const files = fs.readdirSync(catDir).filter(f => f.startsWith('post_') && f.endsWith('.md'));
  for (const f of files) {
    const content = fs.readFileSync(path.join(catDir, f), 'utf8');
    for (const r of newResources) {
      if (r.id && content.includes(r.id)) {
        duplicates.push({ id: r.id, title: r.title, file: `${cat}/${f}` });
        existingIds.set(r.id, true);
      }
    }
  }
}

console.log('检查', newResources.length, '个资源...');
console.log('重复:', duplicates.length);
duplicates.forEach(d => console.log(`  ✓ ${d.title.slice(0, 35)}... -> ${d.file}`));

const unique = newResources.filter(r => r.id && !existingIds.has(r.id));
console.log('\n新增:', unique.length);

if (unique.length > 0) {
  console.log('\n新增资源及分类建议:');
  unique.forEach(r => {
    let cat = '待定';
    if (/命理|玄学|风水|算命/.test(r.title)) cat = 'chinese-traditional';
    if (/变现|搞钱|赚钱|月入/.test(r.title)) cat = 'self-media';
    if (/歌曲|DJ|车载/.test(r.title)) cat = 'movies';
    if (/书法|字帖|练字/.test(r.title)) cat = 'chinese-traditional';
    if (/万年历/.test(r.title)) cat = 'chinese-traditional';
    console.log(`  - [${cat}] ${r.title}`);
  });
}
