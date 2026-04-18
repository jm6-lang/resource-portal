const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const pad = n => String(n).padStart(3, '0');

// 分类
const bookResources = [
  { title: '12个月从0赚到100万美金', link: 'https://pan.baidu.com/s/1irl6ngoJPEeMjoCQrBEkgA?pwd=24d2', pwd: '24d2', keywords: '赚钱, 创业, 财富自由, 商业思维' },
];

const curriculumResources = [
  { title: '变频空调维修技术资料格力美的原理与图纸视频教程', link: 'https://pan.baidu.com/s/13fn_zLJgSkcV6phBeZA9Dg?pwd=1234', pwd: '1234', keywords: '空调维修, 家电维修, 技术培训, 维修教程' },
];

const chineseResources = [
  { title: '中医笔记', link: 'https://pan.baidu.com/s/1fRk2ImfY3W-E7akzWkFYxQ?pwd=1234', pwd: '1234', keywords: '中医, 中医学习, 医学笔记, 中医知识' },
];

const selfMediaResources = [
  { title: '知乎小说项目详细教程', link: 'https://pan.baidu.com/s/1H-FtZZtDe9ByonoChH6JzA?pwd=9tk5', pwd: '9tk5', keywords: '知乎, 小说项目, 自媒体, 变现教程' },
  { title: '小红书电商项目教程，0-1入门全盘玩法解析', link: 'https://pan.baidu.com/s/1MW9xHKjxCMVHV94Ghm1lIA?pwd=je38', pwd: 'je38', keywords: '小红书, 电商, 自媒体, 运营教程' },
];

function getMaxNum(dir) {
  const fullDir = path.join(docsDir, dir);
  if (!fs.existsSync(fullDir)) return 0;
  const files = fs.readdirSync(fullDir).filter(f => f.startsWith('post_') && f.endsWith('.md'));
  const nums = files.map(f => parseInt(f.match(/post_(\d+)/)?.[1] || '0'));
  return Math.max(0, ...nums);
}

const template = (r) => `---
title: "${r.title}"
description: "点击免费下载 ${r.title}。小二郎资源分享站深度整理。"
keywords: "${r.keywords}"
---

# ${r.title}

<Badge type="tip" text="Baidu" /> <Badge type="warning" text="精品资源" />

## 📋 资源介绍
欢迎访问小二郎资源分享站！本页面提供 **${r.title}** 的免费下载链接。该资源经过深度整理，旨在为您提供优质的学习与研究素材。

## 📥 资源详情
- **资源名称**: ${r.title}
- **更新日期**: 2026-04-18
- **网盘类型**: 百度网盘
- **提取码**: ${r.pwd}
- **直达链接**: <a href="${r.link}" target="_blank" rel="noopener noreferrer" class="download-link">🔗 点击获取网盘资源</a>

---

### 🛡️ 申明与反馈
- **版权申明**: 本站所有资源均收集自互联网，版权归原作者所有。仅供个人学习研究，请于下载后24小时内删除。
- **链接失效**: 如果您发现下载链接已失效，请联系管理员核实。

---
💡 **更多资源**: 返回 [小二郎资源分享站](/)
`;

function createFiles(resources, dir) {
  let num = getMaxNum(dir);
  resources.forEach(r => {
    num++;
    const filePath = path.join(docsDir, dir, `post_${pad(num)}.md`);
    fs.writeFileSync(filePath, template(r));
    console.log(`Created: ${dir}/post_${pad(num)}.md - ${r.title}`);
  });
  return resources.length;
}

let total = 0;
console.log('\n=== 书籍 ===');
total += createFiles(bookResources, 'book');

console.log('\n=== 互联网项目教程 ===');
total += createFiles(curriculumResources, 'curriculum');

console.log('\n=== 传统文化 ===');
total += createFiles(chineseResources, 'chinese-traditional');

console.log('\n=== 自媒体 ===');
total += createFiles(selfMediaResources, 'self-media');

console.log(`\n✅ 共创建 ${total} 个资源文件`);
