const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const resources = [
  { title: '头尾批量剪切器 v2.0', id: '2892e3b9a4cf', cat: 'tools', keywords: '视频剪切, 批量剪切, 头尾剪切, 视频处理' },
  { title: '文件批量重命名工具大合集', id: '122ec7d173bc', cat: 'tools', keywords: '批量重命名, 文件重命名, 重命名工具' },
  { title: '超级护眼宝CareUeyes', id: '5cc7f4556eaa', cat: 'tools', keywords: '护眼宝, 护眼软件, 护眼工具, CareUeyes' },
  { title: 'Navicat Premium 16.2.10 多连接数据库管理开发', id: 'e8fb8ddf9592', cat: 'tools', keywords: 'Navicat, 数据库管理, 数据库开发, MySQL, PostgreSQL' },
  { title: '屏幕放大镜Zoomit', id: '1bb66c4320ac', cat: 'tools', keywords: 'Zoomit, 屏幕放大镜, 放大镜, 系统工具' },
  { title: 'PS人像精修磨皮插件 Ultimate Retouch Panel 3.9.2', id: '6eb902158f9f', cat: 'tools', keywords: 'Ultimate Retouch Panel, PS磨皮插件, 人像精修, Photoshop插件' },
  { title: 'PS AI 人工智能修图插件', id: '587844ac7d2f', cat: 'tools', keywords: 'PS AI, AI修图, Photoshop AI, 人工智能修图' },
  { title: '电视直播录制器 v2.0', id: '6f5c984ccad1', cat: 'tools', keywords: '电视直播录制, 直播录制, TV录制, 直播工具' },
  { title: '网络抓包工具Wireshark v4.2.0', id: '604866273962', cat: 'tools', keywords: 'Wireshark, 网络抓包, 抓包工具, 网络分析' },
  { title: '云萌Windows系统激活工具 支持Win10/11(x86/x64/ARM64)', id: '145362537ead', cat: 'tools', keywords: '系统激活, Windows激活, 云萌, KMS激活' },
  { title: '截图工具', id: 'b2b5a21d6df2', cat: 'tools', keywords: '截图工具, 截图软件, 截图, 屏幕截图' },
  { title: '重复文件查找与删除', id: 'ae61651e7de0', cat: 'tools', keywords: '重复文件, 文件查重, 清理工具, 重复文件删除' },
  { title: '开源字幕编辑器 Subtitle Edit v4.0.2 便携版', id: '6107c657bb9f', cat: 'tools', keywords: 'Subtitle Edit, 字幕编辑, 字幕工具, 开源字幕' },
  { title: '夸克云盘辅助工具', id: '975975434d9e', cat: 'tools', keywords: '夸克云盘, 云盘辅助, 网盘工具, 夸克网盘' },
  { title: '开心电视助手', id: '3b2786c6fd74', cat: 'tools', keywords: '开心电视助手, 电视助手, IPTV, 电视工具' },
  { title: '图片降噪Topaz Photo AI便携版', id: '299bbe231d12', cat: 'tools', keywords: 'Topaz Photo AI, 图片降噪, AI降噪, 图片处理' },
  { title: '电脑端splayer音乐播放器', id: '3739a3781d49', cat: 'movies', keywords: 'splayer, 音乐播放器, 音乐, 音频播放器' },
  { title: 'Photoshop CS6绿色版+单文件版', id: 'f0468113ee85', cat: 'tools', keywords: 'Photoshop CS6, PS绿色版, PS单文件, Photoshop' },
  { title: 'Adobe Photoshop 2023 AI版', id: '799611dd97fd', cat: 'tools', keywords: 'Adobe Photoshop 2023, PS AI版, Photoshop, Adobe' },
  { title: '剪映专业版剪辑学习教学课程', id: '6c7699e5c5dc', cat: 'curriculum', keywords: '剪映, 视频剪辑, 剪辑教程, 剪辑学习, 视频制作' },
  { title: '文件批量复制工具', id: '56fe7bbe2d51', cat: 'tools', keywords: '批量复制, 文件复制, 批量工具, 文件管理' },
  { title: 'Bandicam-8.0.0.2509-x64-Portable 录屏便携版', id: 'e2ecae8304a8', cat: 'tools', keywords: 'Bandicam, 录屏工具, 屏幕录制, 游戏录屏' },
  { title: 'Adobe Premiere Pro 2024 特别版', id: 'c9804016f0be', cat: 'tools', keywords: 'Premiere Pro 2024, PR 2024, 视频编辑, Adobe' },
  { title: 'My Family Tree 家谱族谱制作工具 v14.0.0.0', id: '42c4ce0ff26c', cat: 'tools', keywords: 'My Family Tree, 家谱制作, 族谱工具, 家谱软件' },
  { title: '素材获取工具高级版', id: 'd90337461e35', cat: 'tools', keywords: '素材获取, 素材下载, 设计素材, 素材工具' },
  { title: '视频增强工具 Topaz Video AI', id: '6c0921e6ae16', cat: 'tools', keywords: 'Topaz Video AI, 视频增强, AI视频增强, 视频修复' },
  { title: 'ImgDrive虚拟化光驱', id: '7c559ccedb45', cat: 'tools', keywords: 'ImgDrive, 虚拟光驱, 虚拟化光驱, 光驱工具' },
  { title: '12306Bypass分流抢票工具', id: '6d7b7394df74', cat: 'tools', keywords: '12306Bypass, 分流抢票, 抢票工具, 火车票抢票' },
];

// Check duplicates
const titles = resources.map(r => r.title.toLowerCase());
const seen = new Set();
const newResources = [];
const duplicates = [];

for (const r of resources) {
  const key = r.title;
  let found = false;
  for (const cat of ['tools', 'movies', 'curriculum', 'book', 'self-media', 'chinese-traditional', 'healthy', 'AIknowledge', 'edu-knowlege']) {
    const dir = path.join(docsDir, cat);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.startsWith('post_') && f.endsWith('.md'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(dir, file), 'utf8');
      if (content.includes(r.title)) {
        console.log(`[重复] ${r.title} → 已在 ${cat}/${file}`);
        found = true;
        break;
      }
    }
    if (found) break;
  }
  if (!found) {
    newResources.push(r);
  }
}

console.log(`\n重复: ${resources.length - newResources.length} 个`);
console.log(`新增: ${newResources.length} 个\n`);

if (newResources.length > 0) {
  newResources.forEach(r => {
    const dir = path.join(docsDir, r.cat);
    const files = fs.readdirSync(dir).filter(f => f.startsWith('post_') && f.endsWith('.md'));
    const nums = files.map(f => parseInt(f.match(/post_(\d+)/)[1])).filter(n => !isNaN(n));
    const maxNum = Math.max(0, ...nums);
    const pad = n => String(n).padStart(3, '0');
    const num = maxNum + 1;
    const fname = `post_${pad(num)}.md`;
    const content = `---
title: "${r.title}"
description: "点击免费下载 ${r.title}。小二郎资源分享站深度整理。"
keywords: "${r.keywords}"
---

# ${r.title}

<Badge type="tip" text="${r.cat === 'movies' ? '夸克网盘' : '夸克网盘'}" /> <Badge type="warning" text="精品资源" />

## 📋 资源介绍
欢迎访问小二郎资源分享站！本页面提供 **${r.title}** 的免费下载链接。

## 📥 资源详情
- **资源名称**: ${r.title}
- **更新日期**: 2026-04-21
- **网盘类型**: 夸克网盘
- **直达链接**: <a href="https://pan.quark.cn/s/${r.id}" target="_blank" rel="noopener noreferrer" class="download-link">🔗 点击获取网盘资源</a>

---

### 🛡️ 申明与反馈
- **版权申明**: 本站所有资源均收集自互联网，版权归原作者所有。仅供个人学习研究，请于下载后24小时内删除。
- **链接失效**: 如果发现下载链接失效，请联系管理员核实。

---
💡 **更多资源**: 返回 [小二郎资源分享站](/)
`;
    fs.writeFileSync(path.join(dir, fname), content);
    console.log(`✅ ${r.cat}/post_${pad(num)}.md - ${r.title}`);
  });

  // Regenerate indexes
  for (const cat of [...new Set(newResources.map(r => r.cat))]) {
    try {
      const { execSync } = require('child_process');
      execSync(`node scripts/gen_index.mjs ${cat}`, { cwd: path.join(__dirname, '..'), stdio: 'pipe' });
      console.log(`📋 已更新 ${cat}/index.md`);
    } catch(e) {}
  }
}

console.log(`\n共创建 ${newResources.length} 个资源文件`);
