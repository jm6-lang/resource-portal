const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const newResources = [
  { title: '中国古玩鉴识知识系列书籍', link: 'https://pan.xunlei.com/s/VOOk9ly0JBu9rQyGiwv31UsnA1' },
  { title: '创业优质教程合集', link: 'https://pan.xunlei.com/s/VOOuKbEkRTmQCQcZcBrRvcYtA1' },
  { title: '百病食疗大全（彩图精装）', link: 'https://pan.xunlei.com/s/VOOuKiYOFPUtXUKuIOgMhb4yA1' },
  { title: '用声音修炼气场（完结）', link: 'https://pan.xunlei.com/s/VOOuLYoTRTmQCQcZcBrRvzs-A1' },
  { title: '《梅花易数白话解》象数思维的智慧', link: 'https://pan.xunlei.com/s/VOOuLe65NaBNlzRDdqMF43NUA1' },
  { title: '富爸爸系列全集（纪念新版·共32册）', link: 'https://pan.xunlei.com/s/VOP3rnoD-wEAtCmsdBlggRXRA1' },
  { title: '书库合集', link: 'https://pan.xunlei.com/s/VOQ6I4rzezacrOCmZ3xzNozIA1' },
  { title: '人人都可以学的顶级思维法(套装共7册)', link: 'https://pan.xunlei.com/s/VOQ6KC01-caw75eeiJRzVHXPA1' },
  { title: '富爸爸点石成金等套装共五册', link: 'https://pan.xunlei.com/s/VOQ6KI9A7MK-8MadlJlaxMUgA1' },
  { title: '中医补肾壮阳秘方', link: 'https://pan.xunlei.com/s/VOQ6MNnRpklQNxGL9FDLjXYdA1' },
  { title: '父与子的X教尬聊', link: 'https://pan.xunlei.com/s/VOQ6Mi03829Ak4YZiGHD5x7yA1' },
  { title: 'MBA课程', link: 'https://pan.xunlei.com/s/VOQ6MoEjeF5hzjNz8XoKo6nVA1' },
  { title: '中医古籍合集超全系列', link: 'https://pan.xunlei.com/s/VOQBckc4OoRRo7e7hTVWQymaA1' },
  { title: '最新上千套农村自建房图纸合集', link: 'https://pan.xunlei.com/s/VOVjp6cmrCI1e6xO09VM77mAA1' },
];

const newIds = newResources.map(r => {
  const m = r.link.match(/\/s\/([A-Za-z0-9_-]+)/);
  return { id: m ? m[1] : null, title: r.title, link: r.link };
});

const categories = ['book', 'tools', 'movies', 'curriculum', 'self-media', 'AIknowledge', 'healthy', 'chinese-traditional', 'edu-knowlege'];
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
duplicates.forEach(d => console.log(`  ✓ ${d.title.slice(0, 25)}... -> ${d.file}`));

const unique = newIds.filter(r => r.id && !existingIds.has(r.id));
console.log('\n新增:', unique.length);

if (unique.length > 0) {
  console.log('\n新增资源:');
  unique.forEach(r => console.log(`  - ${r.title}`));
}
