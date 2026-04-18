const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

// Resources to check
const resources = [
  { title: '健身房私教内部视频课程', cat: 'healthy' },
  { title: '健身新手入门训练经验视频课程', cat: 'healthy' },
  { title: '一人公司：失业潮中的高新技术工作者', cat: 'curriculum' },
  { title: '27种盈利模式课程合集', cat: 'self-media' },
  { title: '年赚百万的知识付费网站搭建', cat: 'self-media' },
  { title: '颈椎保养课', cat: 'healthy' },
  { title: '女性必备的20堂情趣指南课', cat: 'curriculum' },
  { title: '心理控制术', cat: 'curriculum' },
  { title: '66个赚钱技巧', cat: 'self-media' },
  { title: '零基础趣学Linux', cat: 'curriculum' },
  { title: '八节课帮你攻克社交障碍', cat: 'curriculum' },
  { title: '高情商沟通技巧视频课程', cat: 'curriculum' },
  { title: '国内34个省的近300个城市景区旅游攻略', cat: 'curriculum' },
  { title: '全国旅游攻略 国内穷游自驾游', cat: 'curriculum' },
  { title: '副业起跑营第2期', cat: 'self-media' },
  { title: '上班族必备的瑜伽减肥训练营', cat: 'healthy' },
  { title: '普通人的精致生活修炼手册', cat: 'curriculum' },
  { title: '学习有说服力的工作汇报课程', cat: 'curriculum' },
  { title: '办公设计教程合集', cat: 'curriculum' },
  { title: '知识星球 付费课程', cat: 'curriculum' },
  { title: '小白创业指南老板商业必修课', cat: 'self-media' },
  { title: '未来三十年', cat: 'curriculum' },
  { title: '天下剧变爆发前', cat: 'curriculum' },
  { title: '从 0 开发一款 iOS App', cat: 'curriculum' },
  { title: '12堂视频课程，教你最全脱单穿搭技巧', cat: 'curriculum' },
  { title: '性感黑丝', cat: 'curriculum' },
  { title: '软件插件汇总', cat: 'tools' },
  { title: '餐饮人轻松同城引流必学课', cat: 'curriculum' },
  { title: '八段锦详细视频课程', cat: 'healthy' },
  { title: '168套Android项目源码', cat: 'curriculum' },
  { title: '188套微信小程序源码', cat: 'curriculum' },
  { title: '108套别墅新农村自建房图纸', cat: 'tools' },
  { title: '离婚合同离婚协议书模板', cat: 'tools' }
];

// Scan all post files
const existing = [];
function scan(dir) {
  const dirPath = path.join(docsDir, dir);
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath).filter(f => f.startsWith('post_') && f.endsWith('.md'));
  for (const f of files) {
    const content = fs.readFileSync(path.join(dirPath, f), 'utf8');
    const titleM = content.match(/^title:\s*["']?([^"'\n]+)["']?/m);
    if (titleM) {
      existing.push({ file: `${dir}/${f}`, title: titleM[1].trim() });
    }
  }
}

['AIknowledge', 'book', 'chinese-traditional', 'curriculum', 'edu-knowlege', 'movies', 'self-media', 'tools', 'healthy'].forEach(scan);

// Check duplicates
console.log('=== Checking duplicates ===\n');
const newResources = [];
for (const r of resources) {
  const found = existing.find(e => e.title.includes(r.title) || r.title.includes(e.title.split(/[：:]/)[0]));
  if (found) {
    console.log(`DUPLICATE: ${r.title}`);
    console.log(`  -> Found in ${found.file}: ${found.title}\n`);
  } else {
    newResources.push(r);
  }
}

console.log(`\n=== NEW RESOURCES: ${newResources.length} ===\n`);
for (const r of newResources) {
  console.log(`[${r.cat}] ${r.title}`);
}
