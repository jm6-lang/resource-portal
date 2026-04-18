const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const input = `Ai老照片修复懒人包old_photo_restoration https://pan.baidu.com/s/1OKRcT07QHKdxeCMzlmxCng?pwd=y15h
AI智能去水印 FliFlik KleanOut for Photo https://pan.baidu.com/s/1K6rDuhewZwOMGKVFIQctBg?pwd=1c3d
开源Ai批量抠图工具离线整合包rembg https://pan.baidu.com/s/1Kk3YqKHxfx5RVZ8eXUZDmw?pwd=yt5o
小智AI详细教程WIFI版本 https://pan.baidu.com/s/1KWwllYZmMJaXsYFoSWKtpQ?pwd=qwjs
Topaz Video Enhance AI https://pan.baidu.com/s/1zJQT_pA1M_xmHsXF8hYENQ?pwd=wn6u
Luminar Neo AI人工智能修图 https://pan.baidu.com/s/1U7DiqY22VaqudcuhGT0EcQ?pwd=rbeh
Radiant.Photo AI智能完美照片修图插件 https://pan.baidu.com/s/1Ua8GEAzM6sH_Vg4ilv2l4g?pwd=dtvi
视频号AI美女最新6.0玩法 https://pan.baidu.com/s/1BoalugDLmEa1EDhaqkvpZA?pwd=1234
DeepSeek实战手册（120集） https://pan.baidu.com/s/1uPlNW-PweWfOFplQCfzg1Q?pwd=1234
通过DeepSeek变现方式 https://pan.baidu.com/s/1mc_cPDVtnHeM5AqbCWfo4g?pwd=1234
DeepSeek玩转公众号流量主 https://pan.baidu.com/s/1b_wtxHwY6DgUfE3fSg70SA?pwd=1234
用DeepSeek结合今日头条 https://pan.baidu.com/s/1OyMTW2fOwzysbfQeZfOYHQ?pwd=1234`;

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
duplicates.forEach(d => console.log(`  ✓ ${d.title.slice(0, 30)}... -> ${d.file}`));

const unique = newResources.filter(r => r.id && !existingIds.has(r.id));
console.log('\n新增:', unique.length);

if (unique.length > 0) {
  console.log('\n新增资源:');
  unique.forEach(r => console.log(`  - ${r.title}`));
}
