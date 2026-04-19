const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');
const pad = n => String(n).padStart(3, '0');

const resources = [
  // self-media (2)
  { title: '暴利玄学，教你如何快速跨入命理行业，日入1000＋月入过万', link: 'https://pan.quark.cn/s/840f6257a6d0', keywords: '命理, 玄学, 变现, 赚钱项目, 自媒体', cat: 'self-media' },
  { title: '450个搞钱玩法教程合集', link: 'https://pan.quark.cn/s/40e52dc4571c', keywords: '搞钱, 赚钱, 副业, 变现, 赚钱项目', cat: 'self-media' },
  // chinese-traditional (5)
  { title: '图解中国传统文化 居家风水——避凶 纳吉 宅兴 人和', link: 'https://pan.quark.cn/s/3e3dac1707c4', keywords: '风水, 传统文化, 居家风水, 国学', cat: 'chinese-traditional' },
  { title: '书法字帖资源合集', link: 'https://pan.quark.cn/s/bae1d2a98cc1', keywords: '书法, 字帖, 传统文化, 书法资源', cat: 'chinese-traditional' },
  { title: '风水和算命系列课程合集', link: 'https://pan.quark.cn/s/5a6da18eb0b3', keywords: '风水, 算命, 命理, 传统文化, 国学', cat: 'chinese-traditional' },
  { title: '练字教程字帖大合集', link: 'https://pan.quark.cn/s/ed38ac8a3a44', keywords: '练字, 字帖, 书法, 传统文化', cat: 'chinese-traditional' },
  { title: '金葫芦万年历电子版', link: 'https://pan.quark.cn/s/ee9c58057f96', keywords: '万年历, 传统文化, 历法, 国学', cat: 'chinese-traditional' },
  // movies (1)
  { title: '抖音热门华语劲爆车载DJ歌曲合集', link: 'https://pan.quark.cn/s/b8596ed95e1c', keywords: 'DJ, 车载音乐, 华语歌曲, 歌曲合集', cat: 'movies' },
];

function getMaxNum(dir) {
  const fullDir = path.join(docsDir, dir);
  if (!fs.existsSync(fullDir)) return 0;
  const files = fs.readdirSync(fullDir).filter(f => f.startsWith('post_') && f.endsWith('.md'));
  return Math.max(0, ...files.map(f => parseInt(f.match(/post_(\d+)/)?.[1] || '0')));
}

const counters = {};

function createFile(r) {
  const cat = r.cat;
  if (!counters[cat]) counters[cat] = getMaxNum(cat);
  counters[cat]++;
  const num = counters[cat];
  const filePath = path.join(docsDir, cat, `post_${pad(num)}.md`);
  const content = `---
title: "${r.title}"
description: "点击免费下载 ${r.title}。小二郎资源分享站深度整理。"
keywords: "${r.keywords}"
---

# ${r.title}

<Badge type="tip" text="夸克网盘" /> <Badge type="warning" text="精品资源" />

## 📋 资源介绍
欢迎访问小二郎资源分享站！本页面提供 **${r.title}** 的免费下载链接。该资源经过深度整理，旨在为您提供优质的学习与研究素材。

## 📥 资源详情
- **资源名称**: ${r.title}
- **更新日期**: 2026-04-19
- **网盘类型**: 夸克网盘
- **直达链接**: <a href="${r.link}" target="_blank" rel="noopener noreferrer" class="download-link">🔗 点击获取网盘资源</a>

---

### 🛡️ 申明与反馈
- **版权申明**: 本站所有资源均收集自互联网，版权归原作者所有。仅供个人学习研究，请于下载后24小时内删除。
- **链接失效**: 如果您发现下载链接已失效，请联系管理员核实。

---
💡 **更多资源**: 返回 [小二郎资源分享站](/)
`;
  fs.writeFileSync(filePath, content);
  console.log(`✅ ${cat}/post_${pad(num)}.md - ${r.title}`);
}

resources.forEach(createFile);
console.log(`\n共创建 ${resources.length} 个资源文件`);
