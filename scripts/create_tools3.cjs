const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');
const pad = n => String(n).padStart(3, '0');

const resources = [
  { title: '宇宙工具箱', id: '08f5ed35d546', keywords: '工具箱, 综合工具, 实用工具' },
  { title: '小学初中高中电子版教科书下载器', id: 'ec6e312bc935', keywords: '教科书, 电子课本, 教材下载' },
  { title: '万兴优转UniConverter', id: '31c6a79a74db', keywords: '视频转换, 万兴优转, 格式转换' },
  { title: '网站数据一键爬取导出下载神器（后羿采集器）', id: '5f1d66eb58b9', keywords: '数据采集, 爬虫, 后羿采集器' },
  { title: '腾讯4K抓包下载工具附视频教程', id: 'a0f0c78638d2', keywords: '腾讯视频, 抓包下载, 4K下载' },
  { title: '视频下载及转换工具(腾迅qlv、爱奇艺qsv、优酷kux转MP4)', id: '3ce2741d224f', keywords: '视频下载, 格式转换, qlv转mp4' },
  { title: '央视网视频下载器 v2.2', id: 'eafca88efa39', keywords: '央视, 视频下载, CCTV' },
  { title: 'Youtube油管视频下载器', id: 'e13c4e30e564', keywords: 'YouTube, 油管, 视频下载' },
  { title: '知乎盐选下载器', id: '56c7a1294556', keywords: '知乎, 盐选, 下载器' },
  { title: '王者荣耀采集器', id: '6acab679e127', keywords: '王者荣耀, 游戏采集, 数据采集' },
  { title: 'M3U8视频下载', id: '0140bd724838', keywords: 'M3U8, 视频下载, 流媒体' },
  { title: '公众号文章下载', id: '7317f2504f7e', keywords: '公众号, 文章下载, 微信' },
  { title: 'CCTV央视网视频下载工具（下电视新闻超实用）', id: '68e51e74640f', keywords: 'CCTV, 央视, 新闻下载' },
  { title: '多平台万能下载器（B站、A站、油管、腾讯、爱奇艺、优酷、西瓜、芒果TV、搜狐、微博、抖音、快手等）', id: '9b385bdbac8c', keywords: '万能下载, 多平台, 视频下载' },
  { title: '磁力下载软件（含迅雷破解版）', id: 'bce768b612a4', keywords: '磁力下载, 迅雷, BT下载' },
  { title: '音乐免费下载神器（全网范围）', id: '0751297f3832', keywords: '音乐下载, 免费音乐, 下载神器' },
  { title: 'B站视频下载工具大全（可批量下载）', id: '132fa8ac7098', keywords: 'B站, 批量下载, 视频下载' },
  { title: '中小学电子课本下载器 v2.1', id: '6a29f7a5e914', keywords: '电子课本, 中小学, 教材下载' },
  { title: '四叶草有声小说下载器V1.1.0', id: 'fda93a45cae4', keywords: '有声小说, 下载器, 四叶草' },
  { title: 'WPS精品课搜索下载器（部分vip可观看）', id: 'e6f07b5306fd', keywords: 'WPS, 精品课, 下载器' },
  { title: '原创力文档下载器', id: '4c8c527abf5f', keywords: '原创力, 文档下载, 下载器' },
  { title: '喜马拉雅FM专辑下载工具', id: 'd2320b81ce3a', keywords: '喜马拉雅, 有声书, 下载工具' },
  { title: '西瓜视频下载工具', id: 'dd56dfe5c87d', keywords: '西瓜视频, 视频下载, 下载工具' },
  { title: '微信视频号视频下载工具', id: '1375177ff43e', keywords: '视频号, 微信, 视频下载' },
  { title: '阿里云盘资源搜索下载神器', id: '21248edcdc06', keywords: '阿里云盘, 资源搜索, 下载神器' },
  { title: '下载神器IDM（含破解版）', id: 'e3d39d21a0b5', keywords: 'IDM, 下载加速, 破解版' },
  { title: '抖音视频批量下载工具（支持作者主页所有作品）', id: 'c4a31ef8d882', keywords: '抖音, 批量下载, 视频下载' },
  { title: 'B站图片下载工具', id: '90952f17160a', keywords: 'B站, 图片下载, 下载工具' },
  { title: '全网热点要闻采集器 v3.1', id: '2c7a8ba67f6c', keywords: '热点采集, 新闻采集, 数据采集' },
  { title: '高清图片壁纸搜索下载神器（全网范围）', id: 'd5639a170458', keywords: '壁纸, 图片下载, 高清图片' },
  { title: '百度文库文档下载工具（不保证不会失效）', id: 'a0b576a53ca9', keywords: '百度文库, 文档下载, 下载工具' },
];

// Get max post number in tools
const toolsDir = path.join(docsDir, 'tools');
const files = fs.readdirSync(toolsDir).filter(f => f.startsWith('post_') && f.endsWith('.md'));
let maxNum = Math.max(...files.map(f => parseInt(f.match(/post_(\d+)/)?.[1] || '0')));

resources.forEach((r, i) => {
  maxNum++;
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
- **更新日期**: 2026-04-20
- **网盘类型**: 夸克网盘
- **直达链接**: <a href="https://pan.quark.cn/s/${r.id}" target="_blank" rel="noopener noreferrer" class="download-link">🔗 点击获取网盘资源</a>

---

### 🛡️ 申明与反馈
- **版权申明**: 本站所有资源均收集自互联网，版权归原作者所有。仅供个人学习研究，请于下载后24小时内删除。
- **链接失效**: 如果您发现下载链接已失效，请联系管理员核实。

---
💡 **更多资源**: 返回 [小二郎资源分享站](/)
`;
  const filePath = path.join(toolsDir, `post_${pad(maxNum)}.md`);
  fs.writeFileSync(filePath, content);
  console.log(`✅ tools/post_${pad(maxNum)}.md - ${r.title}`);
});

console.log(`\n共创建 ${resources.length} 个资源文件`);
