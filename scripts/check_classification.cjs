const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

// Category definitions: directory -> expected content keywords
const categories = {
  'AIknowledge': { name: 'AI知识/人工智能', keywords: /ai|人工智能|机器学习|深度学习|gpt|chatgpt|claude|llm|大模型|midjourney|stable.diffusion|aigc|prompt|chatbot|神经网络|训练|模型|绘画|换脸|数字人|智能|自动化|rpa|copilot|编程助手|cursor/i },
  'book': { name: '书籍文献库', keywords: /书|阅读|小说|文献|古籍|电子书|pdf|epub|kindle|藏书|阅读器|图书|百科|词典|字典|经典|名著|国学|道德经|论语|诗经|周易|易经/i },
  'chinese-traditional': { name: '传统文化阁', keywords: /传统文化|紫微斗数|八字|风水|命理|易经|周易|六爻|奇门|梅花|占卜|国学|古琴|书法|国画|茶道|中医|针灸|本草|黄帝内经/i },
  'curriculum': { name: '学习课程/职场技能', keywords: /课程|教程|学习|考研|考公|考研|考试|培训|技能|职场|面试|简历|公务员|英语|编程课|ppt|excel|word|ps教程|设计课|提升|逆袭|记忆力|学习方法/i },
  'edu-knowlege': { name: '教育资料馆', keywords: /教育|考试|试题|试卷|真题|教材|教辅|小学|初中|高中|大学|四六级|雅思|托福|gre|gmat|sat|ap|奥数|幼教|亲子|育儿|作文/i },
  'movies': { name: '在线影视/音乐', keywords: /电影|影视|视频|剧集|动漫|综艺|纪录片|音乐|歌曲|歌单|mv|网易云|酷狗|酷我|qq音乐|spotify|音源|无损|听歌|唱片|专辑|播放器|追剧|netflix|youtube|b站|直播/i },
  'self-media': { name: '自媒体/电商专栏', keywords: /自媒体|电商|抖音|快手|小红书|b站|公众号|视频号|直播带货|运营|涨粉|变现|店铺|淘宝|拼多多|京东|跨境|闲鱼|带货|私域|社群|流量|副业|赚钱|创业|项目|互联网项目/i },
  'tools': { name: '常用工具/会员版', keywords: /工具|软件|插件|会员|vip|svip|破解|绿色|免安装|激活|办公|pdf|压缩|下载|网盘|翻译|截图|录屏|恢复|清理|优化|vpn|代理|科学上网|加速|adobe|office|windows|安卓|ios|mac|vpn|翻墙|梯子|密码|输入法|浏览器|编辑器|清理|卸载|驱动/i },
  'healthy': { name: '健康', keywords: /健康|养生|中医|健身|减肥|瑜伽|冥想|营养|食疗|按摩|针灸|保健|体检|心理|睡眠|美容|护肤|护发|减脂|增肌|跑步/i },
  'cross-border': { name: '跨境电商', keywords: /跨境|amazon|亚马逊|shopify|独立站|外贸|出口|进口|海外|物流|清关|支付|汇率/i },
};

// Scan all post files in all directories
const results = [];
const dirs = fs.readdirSync(docsDir).filter(d => {
  return fs.statSync(path.join(docsDir, d)).isDirectory() && d !== '.vitepress';
});

for (const dir of dirs) {
  const dirPath = path.join(docsDir, dir);
  // Recursively find all post files
  function findPosts(p) {
    const entries = fs.readdirSync(p, { withFileTypes: true });
    for (const e of entries) {
      const fullPath = path.join(p, e.name);
      if (e.isDirectory()) {
        findPosts(fullPath);
      } else if (e.name.startsWith('post_') && e.name.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const titleM = content.match(/^#\s+(.+)$/m);
        const title = titleM ? titleM[1].trim() : '';
        const descM = content.match(/description:\s*"([^"]+)"/);
        const desc = descM ? descM[1] : '';
        const kwM = content.match(/keywords:\s*"([^"]+)"/);
        const kw = kwM ? kwM[1] : '';
        const badgeM = content.match(/<Badge[^>]*text="([^"]+)"[^>]*\/>/);
        const platform = badgeM ? badgeM[1] : '';
        const catM = content.match(/分类[：:]\s*([^\n。]+)/);
        const catLabel = catM ? catM[1].trim() : '';

        results.push({
          dir,
          file: e.name,
          relPath: path.relative(docsDir, fullPath).replace(/\\/g, '/'),
          title,
          desc,
          kw,
          platform,
          catLabel,
          content: title + ' ' + desc + ' ' + kw
        });
      }
    }
  }
  findPosts(dirPath);
}

// Find misclassified resources
console.log('=== TOTAL RESOURCES:', results.length, '===\n');

// For each resource, check if it's in the right directory
const misclassified = [];
for (const r of results) {
  const cat = categories[r.dir];
  if (!cat) continue; // Skip unknown directories

  // Check against ALL other categories to find better match
  let bestMatch = r.dir;
  let bestScore = 0;

  for (const [dir, def] of Object.entries(categories)) {
    const matches = def.keywords.test(r.content);
    if (matches && dir !== r.dir) {
      // This resource matches a different category better
      const score = 1;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = dir;
      }
    }
  }

  // Check if current category is a good match
  const currentMatch = cat.keywords.test(r.content);

  if (!currentMatch && bestMatch !== r.dir) {
    misclassified.push({
      ...r,
      suggestedDir: bestMatch,
      suggestedName: categories[bestMatch].name
    });
  }
}

// Also check for specific cross-category issues
// 1. Music items in non-movies directories
// 2. Book/literature items in non-book directories  
// 3. Education items in non-edu directories
// 4. Self-media/e-commerce items in wrong directories
// 5. Tool items in non-tools directories

const specialChecks = [];
for (const r of results) {
  const t = r.content.toLowerCase();
  const titleLower = r.title.toLowerCase();
  
  // Music items not in movies
  if (r.dir !== 'movies' && /音乐|歌曲|歌单|mv|网易云|酷狗|酷我|qq音乐|spotify|音源|无损音乐|听歌|唱片|专辑/.test(titleLower)) {
    specialChecks.push({ ...r, reason: '音乐资源应属于在线影视/音乐', suggestedDir: 'movies' });
  }
  
  // Book/literature items not in book
  if (r.dir !== 'book' && r.dir !== 'chinese-traditional' && /电子书|epub|kindle|藏书|阅读器|图书/.test(titleLower)) {
    specialChecks.push({ ...r, reason: '书籍/阅读资源应属于书籍文献库', suggestedDir: 'book' });
  }

  // Education/exam items not in curriculum or edu
  if (r.dir !== 'curriculum' && r.dir !== 'edu-knowlege' && /考研|考公|四六级|雅思|托福|试题|试卷|真题/.test(titleLower)) {
    specialChecks.push({ ...r, reason: '教育/考试资源应属于教育资料馆或学习课程', suggestedDir: 'edu-knowlege' });
  }

  // Self-media/e-commerce items in wrong place
  if (r.dir !== 'self-media' && /自媒体|抖音|小红书|直播带货|涨粉|私域|副业|赚钱项目|互联网项目/.test(titleLower)) {
    specialChecks.push({ ...r, reason: '自媒体/电商资源应属于自媒体/电商专栏', suggestedDir: 'self-media' });
  }

  // Tool/software items not in tools
  if (r.dir !== 'tools' && /会员版|vip|svip|破解|绿色版|免安装|激活工具|科学上网|vpn|翻墙|梯子/.test(titleLower)) {
    specialChecks.push({ ...r, reason: '工具/会员版资源应属于常用工具', suggestedDir: 'tools' });
  }

  // Movie/video items not in movies
  if (r.dir !== 'movies' && r.dir !== 'self-media' && /电影|影视|追剧|netflix|动漫|动漫合集|纪录片/.test(titleLower)) {
    specialChecks.push({ ...r, reason: '影视资源应属于在线影视/音乐', suggestedDir: 'movies' });
  }
}

// Merge and deduplicate
const allIssues = [...misclassified];
const seen = new Set(misclassified.map(m => m.relPath));
for (const s of specialChecks) {
  if (!seen.has(s.relPath)) {
    allIssues.push(s);
    seen.add(s.relPath);
  }
}

// Sort by current directory then title
allIssues.sort((a, b) => a.dir.localeCompare(b.dir) || a.title.localeCompare(b.title));

console.log('=== MISCLASSIFIED RESOURCES (' + allIssues.length + ') ===\n');
for (const item of allIssues) {
  console.log(`[${item.dir}/${item.file}] ${item.title}`);
  console.log(`  → Suggested: ${item.suggestedDir} (${item.suggestedName || categories[item.suggestedDir]?.name || ''})`);
  if (item.reason) console.log(`  Reason: ${item.reason}`);
  console.log();
}
