const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const newResources = [
  { title: 'Reface一键换脸 v4.5.0 AI换脸工具', link: 'https://pan.quark.cn/s/a54960efcf08' },
  { title: '上班摸鱼_老板键（软件）', link: 'https://pan.quark.cn/s/19ea6c40d155' },
  { title: 'Listen1（全网音乐免费听）', link: 'https://pan.quark.cn/s/0f19852eab83' },
  { title: 'Autodesk AutoCAD 2024', link: 'https://pan.quark.cn/s/648e797ff85b' },
  { title: '酒店防窥检测1.26 解锁会员版', link: 'https://pan.quark.cn/s/a55f9d261f02' },
  { title: '去水印工具', link: 'https://pan.quark.cn/s/24d6f26bb2d0' },
  { title: 'AI Chat', link: 'https://pan.quark.cn/s/3ebb19f720cc' },
  { title: '驾考题库大全会员版', link: 'https://pan.quark.cn/s/9394c429b093' },
  { title: '呐噗助眠', link: 'https://pan.quark.cn/s/8e95a99ab039' },
  { title: '嗅觉浏览器', link: 'https://pan.quark.cn/s/e159f31feb5e' },
  { title: '扫描全能王 解锁付费版', link: 'https://pan.quark.cn/s/9f1a2cb69dcd' },
  { title: '洛雪音乐（附最新可用音源）', link: 'https://pan.quark.cn/s/7d199c18f040' },
  { title: '全新推出的免费音乐听歌软件-尼卡音乐', link: 'https://pan.quark.cn/s/852813bc1eb9' },
  { title: '车机', link: 'https://pan.quark.cn/s/1828d0268644' },
  { title: '漫漫漫画 v5.2.43', link: 'https://pan.quark.cn/s/2c9aa2031ed5' },
  { title: '手机照片恢复管家_7.5.0_VIP版', link: 'https://pan.quark.cn/s/6eb35751e6d1' },
  { title: '福昕高级PDF编辑器', link: 'https://pan.quark.cn/s/88398fa94928' },
  { title: '微信对话生成器', link: 'https://pan.quark.cn/s/e681e222ae6c' },
  { title: '傻瓜英语VIP解锁版', link: 'https://pan.quark.cn/s/0f69354ca70f' },
  { title: '酷我音乐_破解版', link: 'https://pan.quark.cn/s/2921e8a1b59c' },
  { title: 'Windows系统永久激活最新密钥', link: 'https://pan.quark.cn/s/275d58007c5e' },
  { title: '畅听FM_2.3.2', link: 'https://pan.quark.cn/s/b7046489b6b0' },
  { title: 'Android 健身教练 v1.1.5', link: 'https://pan.quark.cn/s/1826d7020682' },
  { title: '开发全能工具箱He3', link: 'https://pan.quark.cn/s/44ead176505a' },
  { title: '情侣飞行棋', link: 'https://pan.quark.cn/s/e7686d3af590' },
  { title: '万能格式转换', link: 'https://pan.quark.cn/s/bc01151338ab' },
  { title: '解析机器人_破解版', link: 'https://pan.quark.cn/s/1a7eb2d5e97c' },
  { title: 'GET漫画v2.1.1绿化版', link: 'https://pan.quark.cn/s/7ecfc9951415' },
  { title: '任小聊天话术APP', link: 'https://pan.quark.cn/s/b3f5ed71e705' },
  { title: '视频音频批量格式转换器 v2.0', link: 'https://pan.quark.cn/s/504ba86954a3' },
  { title: '微信聊天恢复_4.6.0', link: 'https://pan.quark.cn/s/422a8656030e' },
  { title: '万象聚搜 v1.5', link: 'https://pan.quark.cn/s/e5d3418ec0c1' },
  { title: '风云录屏大师-VIP版', link: 'https://pan.quark.cn/s/0cb1bbec039c' },
  { title: '视频去重', link: 'https://pan.quark.cn/s/ccee65cc166f' },
  { title: '黑神话悟空', link: 'https://pan.quark.cn/s/bf63e69e7ac4' },
  { title: 'AutoGLM', link: 'https://pan.quark.cn/s/2846843621eb' },
  { title: '博看书苑安卓（附36个授权码）', link: 'https://pan.quark.cn/s/a2daac82453e' },
  { title: '夸父工具箱', link: 'https://pan.quark.cn/s/dc45d88e2e97' },
  { title: '工具魔盒_2.4.2', link: 'https://pan.quark.cn/s/cdce324e9439' },
  { title: '安卓解析机器人高级版', link: 'https://pan.quark.cn/s/e9e7a37395af' },
  { title: '太极工具箱', link: 'https://pan.quark.cn/s/d8647b53e016' },
  { title: '快影剪辑_纯净版', link: 'https://pan.quark.cn/s/de8c3c44f755' },
  { title: 'Xmind思维导图模板331个', link: 'https://pan.quark.cn/s/b31c5d0863d5' },
];

const newIds = newResources.map(r => {
  const m = r.link.match(/\/s\/([a-f0-9]+)/);
  return { id: m ? m[1] : null, title: r.title, link: r.link };
});

const categories = ['tools', 'movies', 'curriculum', 'self-media', 'AIknowledge', 'healthy', 'book', 'chinese-traditional', 'edu-knowlege'];
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

if (unique.length > 0) {
  console.log('\n新增资源列表:');
  unique.forEach(r => console.log(`  - ${r.title}`));
}
