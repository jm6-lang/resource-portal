const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const resources = [
  { title: '宇宙工具箱', id: '08f5ed35d546' },
  { title: '小学初中高中电子版教科书下载器', id: 'ec6e312bc935' },
  { title: '万兴优转UniConverter', id: '31c6a79a74db' },
  { title: '网站数据一键爬取导出下载神器（后羿采集器）', id: '5f1d66eb58b9' },
  { title: '腾讯4K抓包下载工具附视频教程', id: 'a0f0c78638d2' },
  { title: '视频下载及转换工具(腾迅qlv、爱奇艺qsv、优酷kux转MP4)', id: '3ce2741d224f' },
  { title: '央视网视频下载器 v2.2', id: 'eafca88efa39' },
  { title: 'Youtube油管视频下载器', id: 'e13c4e30e564' },
  { title: '知乎盐选下载器', id: '56c7a1294556' },
  { title: '王者荣耀采集器', id: '6acab679e127' },
  { title: 'M3U8视频下载', id: '0140bd724838' },
  { title: '公众号文章下载', id: '7317f2504f7e' },
  { title: 'CCTV央视网视频下载工具（下电视新闻超实用）', id: '68e51e74640f' },
  { title: '多平台万能下载器（B站、A站、油管、腾讯、爱奇艺、优酷、西瓜、芒果TV、搜狐、微博、抖音、快手等）', id: '9b385bdbac8c' },
  { title: '磁力下载软件（含迅雷破解版）', id: 'bce768b612a4' },
  { title: '音乐免费下载神器（全网范围）', id: '0751297f3832' },
  { title: 'B站视频下载工具大全（可批量下载）', id: '132fa8ac7098' },
  { title: '中小学电子课本下载器 v2.1', id: '6a29f7a5e914' },
  { title: '四叶草有声小说下载器V1.1.0', id: 'fda93a45cae4' },
  { title: 'WPS精品课搜索下载器（部分vip可观看）', id: 'e6f07b5306fd' },
  { title: '原创力文档下载器', id: '4c8c527abf5f' },
  { title: '喜马拉雅FM专辑下载工具', id: 'd2320b81ce3a' },
  { title: '西瓜视频下载工具', id: 'dd56dfe5c87d' },
  { title: '微信视频号视频下载工具', id: '1375177ff43e' },
  { title: '阿里云盘资源搜索下载神器', id: '21248edcdc06' },
  { title: '下载神器IDM（含破解版）', id: 'e3d39d21a0b5' },
  { title: '抖音视频批量下载工具（支持作者主页所有作品）', id: 'c4a31ef8d882' },
  { title: 'B站图片下载工具', id: '90952f17160a' },
  { title: '全网热点要闻采集器 v3.1', id: '2c7a8ba67f6c' },
  { title: '高清图片壁纸搜索下载神器（全网范围）', id: 'd5639a170458' },
  { title: '百度文库文档下载工具（不保证不会失效）', id: 'a0b576a53ca9' },
];

const categories = ['book', 'tools', 'movies', 'curriculum', 'self-media', 'AIknowledge', 'healthy', 'chinese-traditional', 'edu-knowlege'];
const existingIds = new Set();
const duplicates = [];

for (const cat of categories) {
  const catDir = path.join(docsDir, cat);
  if (!fs.existsSync(catDir)) continue;
  const files = fs.readdirSync(catDir).filter(f => f.startsWith('post_') && f.endsWith('.md'));
  for (const f of files) {
    const content = fs.readFileSync(path.join(catDir, f), 'utf8');
    for (const r of resources) {
      if (content.includes(r.id)) {
        duplicates.push({ title: r.title, file: `${cat}/${f}` });
        existingIds.add(r.id);
      }
    }
  }
}

console.log(`检查 ${resources.length} 个资源...`);
console.log(`重复: ${duplicates.length}`);
duplicates.forEach(d => console.log(`  ✓ ${d.title.slice(0,35)} -> ${d.file}`));

const unique = resources.filter(r => !existingIds.has(r.id));
console.log(`\n新增: ${unique.length}`);
unique.forEach(r => console.log(`  - ${r.title}`));
