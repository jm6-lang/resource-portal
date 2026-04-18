const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const newResources = [
  { title: '各种酿酒教程合集', link: 'https://pan.quark.cn/s/73e248320385' },
  { title: '八十种各种快餐类美食做法技术大全', link: 'https://pan.quark.cn/s/416411e8cb11' },
  { title: '笔记本电脑维修完全手册', link: 'https://pan.quark.cn/s/0b28a167e109' },
  { title: '美食实体店配方（合集）', link: 'https://pan.quark.cn/s/5b7444819477' },
  { title: '99套小吃配方+创业落地指南', link: 'https://pan.quark.cn/s/1866e2ec8103' },
  { title: '美食实体店配方专题，价值上万！', link: 'https://pan.quark.cn/s/e8d828090e8f' },
  { title: '30多套小吃技术全套视频教程合集', link: 'https://pan.quark.cn/s/2153af3ea584' },
  { title: '手办制作视频教程', link: 'https://pan.quark.cn/s/f26e42bd23ca' },
  { title: '超详细生存指南', link: 'https://pan.quark.cn/s/e82d53c5a7ef' },
  { title: '编绳手工坊：编绳基础结法', link: 'https://pan.quark.cn/s/aba89bae4edb' },
  { title: '零基础钩针教程-（视频+PDF教程）', link: 'https://pan.quark.cn/s/bfd2acf4b881' },
  { title: '麻将学技术训练与技巧（完结）', link: 'https://pan.quark.cn/s/de4f133a1549' },
  { title: '厨师长教你做菜系列合集【71GB】', link: 'https://pan.quark.cn/s/8363225a0eed' },
  { title: '精品凉拌菜系列热卤系列课程', link: 'https://pan.quark.cn/s/e91162128386' },
  { title: '饭店常点的35套菜 详细视频教学', link: 'https://pan.quark.cn/s/83a2aface3a4' },
  { title: '招牌菜36套教学视频（人人变大厨）', link: 'https://pan.quark.cn/s/c5cf90a62b23' },
  { title: '摄影超全付费课程合集（335GB）', link: 'https://pan.quark.cn/s/d24f483a8390' },
  { title: '创业资料价值几万的小吃美食教程（522道美食）', link: 'https://pan.quark.cn/s/2cc0a730c8d4' },
  { title: '国宴大师教做菜（120道菜合集）', link: 'https://pan.quark.cn/s/d9177079608f' },
  { title: '普通人翻身逆袭指南50讲', link: 'https://pan.quark.cn/s/9a4c600af5de' },
  { title: '花束花艺教程', link: 'https://pan.quark.cn/s/f03e2660a537' },
  { title: '汽车新能源汽车三电实战维修', link: 'https://pan.quark.cn/s/c4c14e2d4eed' },
  { title: '民谣吉他课程入门+进阶139集', link: 'https://pan.quark.cn/s/d2d214209334' },
  { title: '小白一学就会的短视频剪辑课', link: 'https://pan.quark.cn/s/bc481341f362' },
  { title: '制作超有爱迷你宠物玩法', link: 'https://pan.quark.cn/s/34e5cfb0c69c' },
  { title: '职场办公技能总教程', link: 'https://pan.quark.cn/s/329d2145d56d' },
  { title: 'PS教程初、中、高1', link: 'https://pan.quark.cn/s/8db083799b67' },
  { title: '用搜索提升收入，掌握最热门的职场技能', link: 'https://pan.quark.cn/s/a9939f39515f' },
  { title: '龙舌兰放克iPad基础（人物插画课程）', link: 'https://pan.quark.cn/s/e30142534809' },
  { title: 'Blender3.0零基础快速入门课程', link: 'https://pan.quark.cn/s/84812fc41aac' },
  { title: 'office教程和office模板（合集）', link: 'https://pan.quark.cn/s/965b309d3a40' },
  { title: '职场102项技能课程合集', link: 'https://pan.quark.cn/s/2d934cc344c9' },
  { title: '沙雕动画制作教学课程', link: 'https://pan.quark.cn/s/819283319088' },
  { title: '全网最全-付费声乐技巧 唱歌技巧 乐理课程', link: 'https://pan.quark.cn/s/1fcd03215800' },
  { title: 'Pr速成3小时学会视频剪辑', link: 'https://pan.quark.cn/s/3f552246e46b' },
  { title: 'StableDiffusion零基础入门课', link: 'https://pan.quark.cn/s/ae7ba4bd1999' },
  { title: '摄影剪辑教程大合集', link: 'https://pan.quark.cn/s/e8d651ec735d' },
  { title: '大万万老师PS功能精通课', link: 'https://pan.quark.cn/s/df4f8acc5070' },
  { title: '短剧剪辑解说课实操班29节', link: 'https://pan.quark.cn/s/eea2c124596b' },
  { title: '谷歌优化师部落·GoogleSEO零基础入门系列教程', link: 'https://pan.quark.cn/s/afdf5a0a2b2c' },
  { title: '少儿编程scratch3.0全套课程214节', link: 'https://pan.quark.cn/s/8969377e00eb' },
];

const newIds = newResources.map(r => {
  const m = r.link.match(/\/s\/([a-f0-9]+)/);
  return { id: m ? m[1] : null, title: r.title, link: r.link };
});

const categories = ['curriculum', 'self-media', 'tools', 'movies', 'AIknowledge', 'healthy', 'book', 'chinese-traditional', 'edu-knowlege'];
const existingIds = new Map();
const duplicates = [];

for (const cat of categories) {
  const catDir = path.join(docsDir, cat);
  if (!fs.existsSync(catDir)) continue;
  const files = fs.readdirSync(catDir).filter(f => f.startsWith('post_') && f.endsWith('.md'));
  for (const f of files) {
    const content = fs.readFileSync(path.join(catDir, f), 'utf8');
    for (const r of newIds) {
      if (r.id && content.includes(r.id)) {
        duplicates.push({ id: r.id, title: r.title, file: `${cat}/${f}` });
        existingIds.set(r.id, true);
      }
    }
  }
}

console.log('检查', newResources.length, '个资源...');
console.log('重复:', duplicates.length);
duplicates.forEach(d => console.log(`  ✓ ${d.title.slice(0, 25)}... -> ${d.file}`));

const unique = newIds.filter(r => r.id && !existingIds.has(r.id));
console.log('\n新增:', unique.length);

// 分类
const classify = (title) => {
  const t = title.toLowerCase();
  if (t.includes('美食') || t.includes('做菜') || t.includes('小吃') || t.includes('凉拌') || t.includes('厨师') || t.includes('酿酒') || t.includes('配方')) return 'healthy';
  if (t.includes('ps') || t.includes('pr') || t.includes('剪辑') || t.includes('摄影') || t.includes('blender') || t.includes('stable') || t.includes('动画制作')) return 'curriculum';
  if (t.includes('职场') || t.includes('办公') || t.includes('office') || t.includes('吉他') || t.includes('声乐') || t.includes('编程') || t.includes('seo')) return 'curriculum';
  if (t.includes('创业') || t.includes('翻身')) return 'self-media';
  if (t.includes('维修') || t.includes('汽车')) return 'tools';
  return 'curriculum';
};

console.log('\n分类建议:');
const grouped = {};
unique.forEach(r => {
  const cat = classify(r.title);
  if (!grouped[cat]) grouped[cat] = [];
  grouped[cat].push(r);
  console.log(`  [${cat}] ${r.title.slice(0, 30)}`);
});

console.log('\n按分类统计:');
Object.entries(grouped).forEach(([cat, items]) => console.log(`  ${cat}: ${items.length}个`));
