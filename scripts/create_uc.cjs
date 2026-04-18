const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

// 分类处理
const musicResources = [
  { title: '高品质车载DJ【音乐大碟】', link: 'https://drive.uc.cn/s/6b6622c1d37d4', keywords: '车载音乐, DJ, 音乐合集, 高品质音乐' },
  { title: '精选音乐Mp3合集', link: 'https://drive.uc.cn/s/15e7b0d47d884', keywords: '音乐合集, Mp3, 精选音乐, 流行歌曲' },
];

const curriculumResources = [
  { title: 'Html5+Css3由浅入深教程', link: 'https://drive.uc.cn/s/4b1848d6e36b4', keywords: 'HTML5, CSS3, 前端教程, Web开发, 编程入门' },
  { title: '黑帽SEO全套课程', link: 'https://drive.uc.cn/s/a5a5518113484', keywords: 'SEO, 黑帽SEO, 搜索引擎优化, 网站推广' },
  { title: '6天掌握mysql基础视频教程', link: 'https://drive.uc.cn/s/4d9b7c9b416a4', keywords: 'MySQL, 数据库, SQL教程, 编程教程' },
  { title: '最新C#零基础入门全集', link: 'https://drive.uc.cn/s/545c4bad670b4', keywords: 'C#, CSharp, 编程入门, .NET开发' },
  { title: 'JavaWeb新版1', link: 'https://drive.uc.cn/s/04fd9d90bf654', keywords: 'Java, JavaWeb, 后端开发, Web编程' },
  { title: 'Web前端全栈HTML5+大神之路', link: 'https://drive.uc.cn/s/2f1e49b28a674', keywords: '前端全栈, HTML5, Web开发, 前端工程师' },
  { title: '正则表达式入门', link: 'https://drive.uc.cn/s/e5179da8a5d74', keywords: '正则表达式, Regex, 编程技巧, 文本处理' },
  { title: '记忆大师之李威教程 打造最强记忆', link: 'https://drive.uc.cn/s/f9e96afb1f7f4', keywords: '记忆训练, 学习方法, 大脑开发, 记忆宫殿' },
  { title: 'JAVA基础到高级全套教程', link: 'https://drive.uc.cn/s/3a02d35a08244', keywords: 'Java, 编程教程, 后端开发, 零基础入门' },
  { title: 'python全套教程', link: 'https://drive.uc.cn/s/786079f453dc4', keywords: 'Python, 编程教程, 人工智能, 数据分析' },
  { title: 'Dreamweaver CC网页设计从入门到精通', link: 'https://drive.uc.cn/s/f7b84e2f7d5a4', keywords: 'Dreamweaver, 网页设计, 前端开发, Adobe' },
  { title: '小程序开发教程大合集从零基础到精通视频课程', link: 'https://drive.uc.cn/s/5e7c7ed278b04', keywords: '小程序, 微信开发, 前端开发, 移动开发' },
];

const toolsResources = [
  { title: 'FCPX全套资源', link: 'https://drive.uc.cn/s/383419a0c2694', keywords: 'FCPX, Final Cut Pro, 视频剪辑, Mac软件' },
  { title: 'PS 100款简易字体特效制作教程+源文件+字体', link: 'https://drive.uc.cn/s/1208958b6fd94', keywords: 'Photoshop, PS教程, 字体特效, 设计资源' },
  { title: 'C4D渲染器合集', link: 'https://drive.uc.cn/s/88809affa5454', keywords: 'C4D, Cinema 4D, 渲染器, 3D设计' },
  { title: '平面设计速成，从小白到大神（完结）', link: 'https://drive.uc.cn/s/f33174c45c424', keywords: '平面设计, 设计教程, PS教程, 设计入门' },
  { title: 'PS抠图0基础从入门到精通教学 秒变大神', link: 'https://drive.uc.cn/s/d444f96adca34', keywords: 'PS抠图, Photoshop, 图像处理, 设计技巧' },
  { title: '全套高清photoshop网上收费教程', link: 'https://drive.uc.cn/s/144eaaa307314', keywords: 'Photoshop, PS教程, 图像处理, 设计软件' },
  { title: 'AI软件系统教程，大神带你感受AI的矢量魔法', link: 'https://drive.uc.cn/s/1500f5a08f744', keywords: 'Adobe Illustrator, AI教程, 矢量设计, 平面设计' },
  { title: '电商合成案例教程，大神带你掌握合成技法', link: 'https://drive.uc.cn/s/5458d031f4cc4', keywords: '电商设计, PS合成, 图片合成, 设计教程' },
  { title: '某宝买的PS资源', link: 'https://drive.uc.cn/s/e0148855f0dd4', keywords: 'Photoshop, PS资源, 设计素材, 破解软件' },
  { title: '电脑工具合集', link: 'https://drive.uc.cn/s/af1d7a0351a54', keywords: '电脑工具, 软件合集, 实用工具, 系统工具' },
  { title: '游戏内购合集资源', link: 'https://drive.uc.cn/s/7f7b570ae8ef4', keywords: '游戏内购, 游戏资源, 破解游戏, 手机游戏' },
  { title: '软件合集', link: 'https://drive.uc.cn/s/759efdc1128a4', keywords: '软件合集, 破解软件, 实用工具, 电脑软件' },
  { title: '16节实用性爆棚的PS教学-走进PhotoshopCC', link: 'https://drive.uc.cn/s/781b0df66f524', keywords: 'Photoshop, PS教程, 图像处理, 设计入门' },
];

const eduResources = [
  { title: '英语四六级保命班', link: 'https://drive.uc.cn/s/0b3f5fbf37c84', keywords: '四六级, 英语考试, 大学英语, 考试技巧' },
  { title: '下半年瑞思拜四六级讲义（针对12月考试）', link: 'https://drive.uc.cn/s/b58cb4261b5e4', keywords: '四六级, 英语考试, 考试资料, 讲义' },
  { title: '2025医学类视频课程合集', link: 'https://drive.uc.cn/s/fec141e4b2394', keywords: '医学课程, 医学视频, 医学考试, 执业医师' },
];

const selfMediaResources = [
  { title: '淘宝开店教程100节课', link: 'https://drive.uc.cn/s/b0f8461696e74', keywords: '淘宝开店, 电商运营, 网店教程, 电商创业' },
  { title: '抖音引流课程：日引300粉实战操作方法', link: 'https://drive.uc.cn/s/6e0472d6fb964', keywords: '抖音引流, 短视频运营, 粉丝增长, 抖音营销' },
  { title: '哔哩实操运营从0到20万粉【已完结】', link: 'https://drive.uc.cn/s/6c2d2a9040204', keywords: 'B站运营, 哔哩哔哩, 自媒体, 粉丝增长' },
  { title: '抖音电商（抖音小红书电商最新玩法！）（完结）', link: 'https://drive.uc.cn/s/c553800a1e144', keywords: '抖音电商, 小红书电商, 直播带货, 电商运营' },
];

// 获取各目录最大编号
function getMaxNum(dir) {
  const fullDir = path.join(docsDir, dir);
  if (!fs.existsSync(fullDir)) return 0;
  const files = fs.readdirSync(fullDir).filter(f => f.startsWith('post_') && f.endsWith('.md'));
  const nums = files.map(f => parseInt(f.match(/post_(\d+)/)?.[1] || '0'));
  return Math.max(0, ...nums);
}

const pad = n => String(n).padStart(3, '0');

const template = (r, cat) => `---
title: "${r.title}"
description: "点击免费下载 ${r.title}。小二郎资源分享站深度整理。"
keywords: "${r.keywords}"
---

# ${r.title}

<Badge type="tip" text="UC" /> <Badge type="warning" text="精品资源" />

## 📋 资源介绍
欢迎访问小二郎资源分享站！本页面提供 **${r.title}** 的免费下载链接。该资源经过深度整理，旨在为您提供优质的学习与研究素材。

## 📥 资源详情
- **资源名称**: ${r.title}
- **更新日期**: 2026-04-18
- **网盘类型**: UC网盘
- **直达链接**: <a href="${r.link}" target="_blank" rel="noopener noreferrer" class="download-link">🔗 点击获取网盘资源</a>

---

### 🛡️ 申明与反馈
- **版权申明**: 本站所有资源均收集自互联网，版权归原作者所有。仅供个人学习研究，请于下载后24小时内删除。
- **链接失效**: 如果您发现下载链接已失效，请联系管理员核实。

---
💡 **更多资源**: 返回 [小二郎资源分享站](/)
`;

// 创建文件
function createFiles(resources, dir) {
  let num = getMaxNum(dir);
  resources.forEach(r => {
    num++;
    const filePath = path.join(docsDir, dir, `post_${pad(num)}.md`);
    fs.writeFileSync(filePath, template(r, dir));
    console.log(`Created: ${dir}/post_${pad(num)}.md - ${r.title}`);
  });
  return resources.length;
}

let total = 0;
console.log('\n=== 音乐资源 (movies) ===');
total += createFiles(musicResources, 'movies');

console.log('\n=== 互联网项目教程 (curriculum) ===');
total += createFiles(curriculumResources, 'curriculum');

console.log('\n=== 工具资源 (tools) ===');
total += createFiles(toolsResources, 'tools');

console.log('\n=== 教育资源 (edu-knowlege) ===');
total += createFiles(eduResources, 'edu-knowlege');

console.log('\n=== 自媒体资源 (self-media) ===');
total += createFiles(selfMediaResources, 'self-media');

console.log(`\n✅ 共创建 ${total} 个资源文件`);
