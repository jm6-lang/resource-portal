const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const newResources = [
  { title: '2025一建二建全科各机构最新网课', link: 'https://pan.quark.cn/s/349bbce69e86' },
  { title: '销售营销学顶级精英教学视频课程【18套】', link: 'https://pan.quark.cn/s/749dd7db6608' },
  { title: '孩子必听的100个历史故事（完结）', link: 'https://pan.quark.cn/s/260d646d91d5' },
  { title: '孕期全攻略（完结）', link: 'https://pan.quark.cn/s/1de29234509d' },
  { title: '（全球外语）最新精整26门小语种零基础全套学习资料', link: 'https://pan.quark.cn/s/f67180336b4e' },
  { title: '雪梨老师学英语，自然拼读音标课语法课新概念全套【80GB】', link: 'https://pan.quark.cn/s/37db7af0aad7' },
  { title: '我不是教你玩阴的：鬼谷子的心理学诡计', link: 'https://pan.quark.cn/s/fd1d8a5e21a9' },
  { title: '【最新版公考面试课程】', link: 'https://pan.quark.cn/s/ba2cb4ccc858' },
  { title: '十三天快速通关高中历史', link: 'https://pan.quark.cn/s/9618fa92528a' },
  { title: '000超级记忆力训练课程（16天）', link: 'https://pan.quark.cn/s/00fa9188dd84' },
  { title: '国考公考省考资料合辑（2024-2025）', link: 'https://pan.quark.cn/s/3ff435f62136' },
  { title: '2025考研英语词汇闪过（10本）', link: 'https://pan.quark.cn/s/1e01ab58bdaf' },
  { title: '2025年7节课搞定国考常识', link: 'https://pan.quark.cn/s/d5ed5281d50c' },
  { title: '初中各科知识点梳理', link: 'https://pan.quark.cn/s/74153e93c83e' },
  { title: '高中教辅资源汇总合集', link: 'https://pan.quark.cn/s/4807ab495ed8' },
  { title: '雅思旗舰VIP直达7分班', link: 'https://pan.quark.cn/s/4d63fc4a67d1' },
  { title: '2025年考研复试必备资料', link: 'https://pan.quark.cn/s/6f91441b54ef' },
  { title: '初中九科学霸笔记（无水印）', link: 'https://pan.quark.cn/s/79183bb66cc5' },
  { title: '初级社工教材（2025年）', link: 'https://pan.quark.cn/s/9de8457192dc' },
  { title: '中级社工教材（2025年）', link: 'https://pan.quark.cn/s/7f8f7bf7076d' },
  { title: '法考资料（2025年）', link: 'https://pan.quark.cn/s/25eaee3c01c2' },
  { title: '乔伯伯：5500词汇系统英语课 (127节)', link: 'https://pan.quark.cn/s/fe1f2edbbb28' },
  { title: '【2025自考+专升本+学位英语合集】', link: 'https://pan.quark.cn/s/cf39d8b82e38' },
  { title: '985学霸逆袭学习方法+提分经验', link: 'https://pan.quark.cn/s/6c1fc54308ad' },
  { title: '高考能力提升卷', link: 'https://pan.quark.cn/s/873a9bb68de4' },
  { title: '相命学课程全集', link: 'https://pan.quark.cn/s/6df1ce12f8c3' },
  { title: '考神大牛（韩语）零基础0-TOPIK4全程班', link: 'https://pan.quark.cn/s/9fdfb7c2b17e' },
  { title: '启蒙英语动画', link: 'https://pan.quark.cn/s/58476c46e35e' },
  { title: '2025一建二建全科各机构最新网课', link: 'https://pan.quark.cn/s/87dcb7e87c51' },
  { title: '可打印教育资源合集', link: 'https://pan.quark.cn/s/9d3a3de94c1d' },
];

// Extract quark IDs
const newIds = newResources.map(r => {
  const m = r.link.match(/\/s\/([a-f0-9]+)/);
  return { id: m ? m[1] : null, title: r.title, link: r.link };
});

// Scan all existing files
const categories = ['edu-knowlege', 'curriculum', 'self-media', 'tools', 'movies', 'AIknowledge', 'healthy', 'book', 'chinese-traditional'];
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
duplicates.forEach(d => console.log(`  ✓ ${d.title.slice(0, 20)}... -> ${d.file}`));

// Unique ones
const unique = newIds.filter(r => r.id && !existingIds.has(r.id));
console.log('\n新增:', unique.length);
unique.forEach(r => console.log(`  + ${r.title}`));

// Categorize unique
console.log('\n分类建议:');
unique.forEach(r => {
  const t = r.title.toLowerCase();
  let cat = 'edu-knowlege';
  if (t.includes('相命') || t.includes('命理')) cat = 'chinese-traditional';
  else if (t.includes('孕期') || t.includes('孕妇')) cat = 'healthy';
  console.log(`  [${cat}] ${r.title.slice(0, 30)}`);
});
