const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const input = `12个月从0赚到100万美金 https://pan.baidu.com/s/1irl6ngoJPEeMjoCQrBEkgA?pwd=24d2
百万富翁快车道 https://pan.baidu.com/s/1JAHYYJ2z0TVAXxeWPWaEUA?pwd=mc8r
炒股养家传记新版 https://pan.baidu.com/s/13uAyoPifs2vI-BHL5L7O5g?pwd=4397
Solidworks新手练习教程 https://pan.baidu.com/s/1QPPwZ87Vd7XJcoAAtY32YA?pwd=n77n
PPT简历模板免费下载 https://pan.baidu.com/s/18uSBrfYeRJLAqjncYlUUYw?pwd=1234
超级个体·普通人创造财富的无限游戏 https://pan.baidu.com/s/1qf3PRuEd8B7lNUprOztwyQ?pwd=1234
新手入行互联网月入6000完全指南 https://pan.baidu.com/s/1BWa_zHOAlDH2695UZbIPgg?pwd=1234
中医笔记 https://pan.baidu.com/s/1fRk2ImfY3W-E7akzWkFYxQ?pwd=1234
变频空调维修技术资料 https://pan.baidu.com/s/13fn_zLJgSkcV6phBeZA9Dg?pwd=1234
小家电维修从入门到精通 https://pan.baidu.com/s/1PfhiIBk1jfbSh2L6GUjAtw?pwd=1234
Ai扣子coze自动化工作流教程 https://pan.baidu.com/s/1K6auy23mhGe8Ab2J8St7ag?pwd=1234
知乎小说项目详细教程 https://pan.baidu.com/s/1H-FtZZtDe9ByonoChH6JzA?pwd=9tk5
小红书电商项目教程 https://pan.baidu.com/s/1MW9xHKjxCMVHV94Ghm1lIA?pwd=je38
爆款电影解说教程 https://pan.baidu.com/s/1edQS5ssNBN64NwozUzpN8g?pwd=1234
闲鱼冷门跑步项目 https://pan.baidu.com/s/1nm32PbjqybgSh-fEb4Mguw?pwd=1234
爆款自媒体起号训练营 https://pan.baidu.com/s/1Q_6UUhM8qG8Iud7DYY9svQ?pwd=1234
Ai图文带货实操课 https://pan.baidu.com/s/1vtmiXvBWCq9B37ckyZApUg?pwd=1234
小红书店铺课程 https://pan.baidu.com/s/1qTRWL99KKV1OPYIELsdNWQ?pwd=1234
微头条+公众号小绿书 https://pan.baidu.com/s/1tsyTteNPY37fgOL53MzE6w?pwd=1234`;

const newResources = input.split('\n').map(line => {
  const match = line.match(/^(.+?)\s+https:\/\/pan\.baidu\.com\/s\/([A-Za-z0-9_-]+)/);
  if (match) {
    const pwdMatch = line.match(/pwd=([a-zA-Z0-9]+)/);
    return { 
      title: match[1].trim(), 
      id: match[2], 
      link: `https://pan.baidu.com/s/${match[2]}`,
      pwd: pwdMatch ? pwdMatch[1] : ''
    };
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
duplicates.forEach(d => console.log(`  ✓ ${d.title.slice(0, 35)}... -> ${d.file}`));

const unique = newResources.filter(r => r.id && !existingIds.has(r.id));
console.log('\n新增:', unique.length);

if (unique.length > 0) {
  console.log('\n新增资源:');
  unique.forEach(r => console.log(`  - ${r.title}`));
}
