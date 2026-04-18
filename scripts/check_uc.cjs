const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const input = `高品质车载DJ【音乐大碟】 https://drive.uc.cn/s/6b6622c1d37d4
精选音乐Mp3合集 https://drive.uc.cn/s/15e7b0d47d884
Html5+Css3由浅入深教程 https://drive.uc.cn/s/4b1848d6e36b4
黑帽SEO全套课程 https://drive.uc.cn/s/a5a5518113484
6天掌握mysql基础视频教程 https://drive.uc.cn/s/4d9b7c9b416a4
最新C#零基础入门全集 https://drive.uc.cn/s/545c4bad670b4
JavaWeb新版1 https://drive.uc.cn/s/04fd9d90bf654
Web前端全栈HTML5+大神之路 https://drive.uc.cn/s/2f1e49b28a674
正则表达式入门 https://drive.uc.cn/s/e5179da8a5d74
FCPX全套资源 https://drive.uc.cn/s/383419a0c2694
记忆大师之李威教程 打造最强记忆 https://drive.uc.cn/s/f9e96afb1f7f4
PS 100款简易字体特效制作教程+源文件+字体 https://drive.uc.cn/s/1208958b6fd94
C4D渲染器合集 https://drive.uc.cn/s/88809affa5454
平面设计速成，从小白到大神（完结） https://drive.uc.cn/s/f33174c45c424
PS抠图0基础从入门到精通教学 秒变大神 https://drive.uc.cn/s/d444f96adca34
全套高清photoshop网上收费教程 https://drive.uc.cn/s/144eaaa307314
AI软件系统教程，大神带你感受AI的矢量魔法 https://drive.uc.cn/s/1500f5a08f744
电商合成案例教程，大神带你掌握合成技法 https://drive.uc.cn/s/5458d031f4cc4
某宝买的PS资源 https://drive.uc.cn/s/e0148855f0dd4
电脑工具合集 https://drive.uc.cn/s/af1d7a0351a54
JAVA基础到高级全套教程 https://drive.uc.cn/s/3a02d35a08244
python全套教程 https://drive.uc.cn/s/786079f453dc4
Dreamweaver CC网页设计从入门到精通 https://drive.uc.cn/s/f7b84e2f7d5a4
游戏内购合集资源 https://drive.uc.cn/s/7f7b570ae8ef4
软件合集 https://drive.uc.cn/s/759efdc1128a4
英语四六级保命班 https://drive.uc.cn/s/0b3f5fbf37c84
下半年瑞思拜四六级讲义（针对12月考试） https://drive.uc.cn/s/b58cb4261b5e4
小程序开发教程大合集从零基础到精通视频课程 https://drive.uc.cn/s/5e7c7ed278b04
2025医学类视频课程合集 https://drive.uc.cn/s/fec141e4b2394
16节实用性爆棚的PS教学-走进PhotoshopCC https://drive.uc.cn/s/781b0df66f524
淘宝开店教程100节课 https://drive.uc.cn/s/b0f8461696e74
抖音引流课程：日引300粉实战操作方法 https://drive.uc.cn/s/6e0472d6fb964
哔哩实操运营从0到20万粉【已完结】 https://drive.uc.cn/s/6c2d2a9040204
抖音电商（抖音小红书电商最新玩法！）（完结） https://drive.uc.cn/s/c553800a1e144`;

const newResources = input.split('\n').map(line => {
  const match = line.match(/^(.+?)\s+https:\/\/drive\.uc\.cn\/s\/([a-f0-9]+)/);
  if (match) {
    return { title: match[1].trim(), id: match[2], link: `https://drive.uc.cn/s/${match[2]}` };
  }
  return null;
}).filter(Boolean);

const categories = ['book', 'tools', 'movies', 'curriculum', 'self-media', 'AIknowledge', 'healthy', 'chinese-traditional', 'edu-knowlege'];
const existingIds = new Map();
const duplicates = [];

for (const cat of categories) {
  const catDir = path.join(docsDir, cat);
  if (!fs.existsSync(catDir)) continue;
  const files = fs.readdirSync(catDir).filter(f => f.startsWith('post_') && f.endsWith('.md'));
  for (const f of files) {
    const content = fs.readFileSync(path.join(catDir, f), 'utf8');
    for (const r of newResources) {
      if (r.id && content.includes(r.id)) {
        duplicates.push({ id: r.id, title: r.title, file: `${cat}/${f}` });
        existingIds.set(r.id, true);
      }
    }
  }
}

console.log('检查', newResources.length, '个资源...');
console.log('重复:', duplicates.length);
duplicates.forEach(d => console.log(`  ✓ ${d.title.slice(0, 30)}... -> ${d.file}`));

const unique = newResources.filter(r => r.id && !existingIds.has(r.id));
console.log('\n新增:', unique.length);

if (unique.length > 0) {
  console.log('\n新增资源:');
  unique.forEach(r => console.log(`  - ${r.title}`));
}
