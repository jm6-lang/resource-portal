const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

// New resources from user
const newResources = [
  { title: '【小红书】玩法教程最全攻略【24套课】', link: 'https://pan.quark.cn/s/cb0de89979a8' },
  { title: '【TikTok】玩法教程最全攻略【27套课】', link: 'https://pan.quark.cn/s/44a65ca8c8cd' },
  { title: '【抖音】玩法教程最全攻略【21套课】', link: 'https://pan.quark.cn/s/f17ab4fd435d' },
  { title: '小红书带货42天训练营无压货', link: 'https://pan.quark.cn/s/60e57dc22ac8' },
  { title: '电商课程·拼多多运营必听10节课', link: 'https://pan.quark.cn/s/b486d9d3c3d7' },
  { title: '旅行小红书起号运营', link: 'https://pan.quark.cn/s/b6406d8001a1' },
  { title: '跨境电商实操课程从零到精通', link: 'https://pan.quark.cn/s/d09808093993' },
  { title: '小红书爆款文案【指令+教程】', link: 'https://pan.quark.cn/s/a0eb204cecb7' },
  { title: '影视解说训练营', link: 'https://pan.quark.cn/s/74d6f6d286e4' },
  { title: '起号：给自媒体人的60条实操干货', link: 'https://pan.quark.cn/s/9ad9f6c8a9cf' },
  { title: '新媒体流量变现运营课程', link: 'https://pan.quark.cn/s/af324f13eeaf' },
  { title: '阿里巴巴国际站课程', link: 'https://pan.quark.cn/s/9f32d229f7f0' },
  { title: 'TikTok海外影视课程全套', link: 'https://pan.quark.cn/s/fd97bad234ed' },
  { title: '外贸线上实战训练营', link: 'https://pan.quark.cn/s/b6782807e7da' },
  { title: '带货短视频文案脚本公式进阶班', link: 'https://pan.quark.cn/s/bd65e40662fa' },
  { title: '《从流量到留量：让你的产品实现低成本持续增长》', link: 'https://pan.quark.cn/s/7bf2401503bd' },
  { title: '视频号风口21天从0到1视频课程', link: 'https://pan.quark.cn/s/22dad9ef0225' },
  { title: '视频号运营实战课程', link: 'https://pan.quark.cn/s/0637528c7bd1' },
  { title: '【公众号运营】零基础入门公众号全方位讲解', link: 'https://pan.quark.cn/s/0b22c3599f3b' },
  { title: '付费群流出写作教程【16合集】', link: 'https://pan.quark.cn/s/0177baad81d4' },
];

// Extract quark IDs
const newIds = newResources.map(r => {
  const m = r.link.match(/\/s\/([a-f0-9]+)/);
  return m ? m[1] : null;
}).filter(Boolean);

// Scan all existing files
const categories = ['self-media', 'curriculum', 'tools', 'movies', 'AIknowledge', 'healthy'];
const existingIds = new Set();
const duplicates = [];

for (const cat of categories) {
  const catDir = path.join(docsDir, cat);
  if (!fs.existsSync(catDir)) continue;

  const files = fs.readdirSync(catDir).filter(f => f.startsWith('post_') && f.endsWith('.md'));
  for (const f of files) {
    const content = fs.readFileSync(path.join(catDir, f), 'utf8');
    for (const id of newIds) {
      if (content.includes(id)) {
        duplicates.push({ id, file: `${cat}/${f}` });
        existingIds.add(id);
      }
    }
  }
}

console.log('Checking', newIds.length, 'new resources...');
console.log('Duplicates found:', duplicates.length);
duplicates.forEach(d => console.log(`  ${d.id} -> ${d.file}`));

// Show unique ones
const unique = newResources.filter(r => {
  const m = r.link.match(/\/s\/([a-f0-9]+)/);
  return m && !existingIds.has(m[1]);
});

console.log('\nUnique resources:', unique.length);
unique.forEach(r => console.log(`  - ${r.title}`));
