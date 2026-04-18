const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs', 'tools');

const newResources = [
  { title: 'UC网盘批量转存工具', link: 'https://pan.xunlei.com/s/VOQ6LDS8IEc-3wd4nNsUs6ZpA1?pwd=6ezx', keywords: '网盘工具, UC网盘, 批量转存, 效率工具' },
  { title: '夸克网盘批量转存分享工具', link: 'https://pan.xunlei.com/s/VOQ6LIBchwbqjdXwYUw4zaeBA1?pwd=n8hd', keywords: '网盘工具, 夸克网盘, 批量转存, 分享工具' },
  { title: '金铲铲单机版（超详细的最强教程，9999+金币）', link: 'https://pan.xunlei.com/s/VOQ6Mckoft4N8Zuq13Rr67HKA1?pwd=hvcq', keywords: '游戏, 金铲铲, 单机版, 游戏攻略' },
  { title: '图片批量处理', link: 'https://pan.xunlei.com/s/VOXW6jHtze9Rl3yZAc9OfK0tA1?pwd=6qcd', keywords: '图片处理, 批量处理, 效率工具, 图片编辑' },
  { title: '文件批量重命名', link: 'https://pan.xunlei.com/s/VOXW6r92yNaOLWrUcv2qljKzA1?pwd=7hza', keywords: '文件管理, 批量重命名, 效率工具, 文件处理' },
  { title: '手机刷机工具箱', link: 'https://pan.xunlei.com/s/VOXaFh7CRwAxaJVLO94ZJrKiA1?pwd=ppf6', keywords: '刷机工具, 手机工具, 系统工具, Android' },
  { title: 'CDR2023中文会员版CorelDRAW', link: 'https://pan.xunlei.com/s/VOXfSJnKcx4UdHEqZS9f5viOA1?pwd=2z4i', keywords: 'CorelDRAW, CDR, 设计软件, 图形设计, 矢量图' },
  { title: '打卡软件神器', link: 'https://pan.xunlei.com/s/VOXumZU5y-6A2bPiWO5dRzkrA1?pwd=88aq', keywords: '打卡工具, 考勤工具, 效率工具, 自动打卡' },
  { title: '查企业查信息（限制注册即送5年SVIP）', link: 'https://pan.xunlei.com/s/VOY--vv8UsLDxjyOGMSyLOd5A1?pwd=48gy', keywords: '企业查询, 工商信息, 商务工具, 企业征信' },
  { title: '笔趣阁完美修改去广告高级版', link: 'https://pan.xunlei.com/s/VOY42lVZqub9V_5XZd13WCacA1?pwd=g4yv', keywords: '阅读软件, 小说阅读, 笔趣阁, 去广告' },
  { title: '公众号爆文机器人', link: 'https://pan.xunlei.com/s/VOY9Bprql6UfhKDIxYVptHbWA1?pwd=pjji', keywords: '公众号, 自动化工具, 爆文, 自媒体, 运营工具' },
  { title: '七星虚拟机', link: 'https://pan.xunlei.com/s/VOYEPeKFTst6XWzYArT8HCa2A1?pwd=hqgu', keywords: '虚拟机, 安卓模拟器, 多开工具, 手机模拟' },
  { title: '电商图片采集工具', link: 'https://pan.xunlei.com/s/VOYTyGNoQmx9ciEhFbMA1afdA1?pwd=zru2', keywords: '电商工具, 图片采集, 淘宝京东, 批量下载' },
  { title: '场控助手', link: 'https://pan.xunlei.com/s/VOYZ1P6cokb4EjBfQXAsjmo8A1?pwd=rkhe', keywords: '直播工具, 场控, 直播助手, 互动管理' },
  { title: 'TVBOX+最新接口', link: 'https://pan.xunlei.com/s/VOYdALqV30NTW53quTQfWHhmA1?pwd=beb8', keywords: 'TVBox, 电视盒子, 影视软件, IPTV, 免费影视' },
  { title: '【AI唱歌软件】AI翻唱', link: 'https://pan.xunlei.com/s/VOYiL6cH2GCVrbv91FRy7uEZA1?pwd=whn8', keywords: 'AI唱歌, AI翻唱, 声音克隆, AI音乐, 变声' },
  { title: 'SolidWorks2025 最新完整版', link: 'https://pan.xunlei.com/s/VOYnT0SsriDNDGjCciy_H67PA1?pwd=9jbk', keywords: 'SolidWorks, CAD软件, 三维建模, 机械设计, 工程软件' },
];

const maxNum = 224;
const pad = n => String(n).padStart(3, '0');

const template = (r, i) => `---
title: "${r.title}"
description: "点击免费下载 ${r.title}。小二郎资源分享站深度整理，分类：实用工具 / 常用软件。"
keywords: "${r.keywords}"
---

# ${r.title}

<Badge type="tip" text="Xunlei" /> <Badge type="warning" text="精品资源" />

## 📋 资源介绍
欢迎访问小二郎资源分享站！本页面提供 **${r.title}** 的免费下载链接。该资源经过深度整理，旨在为您提供优质的学习与研究素材。

## 📥 资源详情
- **资源名称**: ${r.title}
- **所属分类**: 实用工具 / 常用软件
- **更新日期**: 2026-04-18
- **网盘类型**: 迅雷网盘
- **直达链接**: <a href="${r.link}" target="_blank" rel="noopener noreferrer" class="download-link">🔗 点击获取网盘资源</a>

---

### 🛡️ 申明与反馈
- **版权申明**: 本站所有资源均收集自互联网，版权归原作者所有。仅供个人学习研究，请于下载后24小时内删除。
- **链接失效**: 如果您发现下载链接已失效，请联系管理员核实。

---
💡 **更多资源**: 返回 [小二郎资源分享站](/)
`;

newResources.forEach((r, i) => {
  const num = maxNum + i + 1;
  const filePath = path.join(docsDir, `post_${pad(num)}.md`);
  fs.writeFileSync(filePath, template(r, i));
  console.log(`Created: post_${pad(num)}.md - ${r.title}`);
});

console.log('\nTotal:', newResources.length, 'files created');
