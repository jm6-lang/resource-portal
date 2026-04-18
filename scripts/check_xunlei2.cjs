const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const newResources = [
  // 音乐类
  { title: '超全音乐合集', link: 'https://pan.xunlei.com/s/VOQ6EmI-iQ_8twVbXwFaP3siA1' },
  { title: '上万首音乐合集', link: 'https://pan.xunlei.com/s/VOQ6F5Yc2esiP0XWBKwJilRRA1' },
  { title: '003车载高清MV【持续更新】', link: 'https://pan.xunlei.com/s/VOQ6FJquhmy4r_XKAnK9GkWqA1' },
  { title: '经典老歌1020首', link: 'https://pan.xunlei.com/s/VOQ6JtR3TsH5kZ03S1gE8TPWA1' },
  { title: '零基础学唱粤语歌曲KTV', link: 'https://pan.xunlei.com/s/VOQ6K-KHNSmMb1YsHO_RG5U5A1' },
  // 学习课程类
  { title: 'office 全套学习资料', link: 'https://pan.xunlei.com/s/VOOaLurmDvaNOzRoOLlxQu97A1' },
  { title: '创业副业引流必备', link: 'https://pan.xunlei.com/s/VOOaMBk3aNeIhBhmUKznB4VvA1' },
  { title: '剪映预设专场+蒙版+调色合集', link: 'https://pan.xunlei.com/s/VOOaMF1xtx2hjdy5BesUfrv4A1' },
  { title: '瑜伽从初级到高级（100课）', link: 'https://pan.xunlei.com/s/VOOeoLyukJX_aZwoiNkWleI7A1' },
  { title: '小学初中教辅资料合集', link: 'https://pan.xunlei.com/s/VOOetwrUNr60xSX58xAhyVOwA1' },
  { title: '素材库合集｜音频音效视频CG图片', link: 'https://pan.xunlei.com/s/VOOeu6UWYpy8J5er-4UwSJDjA1' },
  { title: '《电工技术自学一本通》', link: 'https://pan.xunlei.com/s/VOOk9yp5rK69yZ7BxcLcQmvtA1' },
  { title: '全新手机维修课程合集', link: 'https://pan.xunlei.com/s/VOOkA4PFdxoVSJw1VI9gXX--A1' },
  { title: '推拿手法技能（中医护理）', link: 'https://pan.xunlei.com/s/VOOkAt1C_mrrD5nVVcf7R4naA1' },
  { title: '零基础化妆入门课程', link: 'https://pan.xunlei.com/s/VOOkB-rFnr_4W6s7-XT9hDpkA1' },
  { title: '陈式太极拳视频教程', link: 'https://pan.xunlei.com/s/VOOuKnMFlFjUlpMDhOty4N25A1' },
  { title: '小红书图文批量生成', link: 'https://pan.xunlei.com/s/VOOuLP7RcTHXBSgoQ8TUE9u5A1' },
  { title: '木工雕刻学习课程', link: 'https://pan.xunlei.com/s/VOOuLibJYdubhdMd9PHS0dSGA1' },
  { title: '《老中医的传世小偏方》', link: 'https://pan.xunlei.com/s/VOOuLxqpkJX_aZwoiNkd1ABcA1' },
  { title: '家庭实用菜谱《家庭自制美味辣酱》', link: 'https://pan.xunlei.com/s/VOOuM32D4_-Pa6ix4UC9NF-YA1' },
  { title: '60种编程语言学习书籍', link: 'https://pan.xunlei.com/s/VOP3plym1uIGNBJn5Z3gGQP4A1' },
  { title: '人人有用的零基础理财入门课', link: 'https://pan.xunlei.com/s/VOP3qirJQOdVHsoV-juXOSLJA1' },
  { title: '零基础学剪映', link: 'https://pan.xunlei.com/s/VOP3qubpQVZ1ur1_zvuQE3zEA1' },
  { title: '零基础学唱歌', link: 'https://pan.xunlei.com/s/VOP3r1GPeb6v-im-wVm3VuSSA1' },
  { title: '零基础学炒股', link: 'https://pan.xunlei.com/s/VOP3rBMsNUlzBbd7cRYvoK_7A1' },
  { title: '零基础学航拍', link: 'https://pan.xunlei.com/s/VOP3rIlTNUlzBbd7cRYvoMgbA1' },
  { title: '零基础摄影班', link: 'https://pan.xunlei.com/s/VOP3rRY7cT3EWLjpt5L_S4WGA1' },
  { title: '零基础学手语', link: 'https://pan.xunlei.com/s/VOP3rYTukWzziTqwUC0y_PoFA1' },
  { title: '零基础学绘画', link: 'https://pan.xunlei.com/s/VOP3rdYA3WwJwAbr3_ZNNM-fA1' },
  { title: '恋爱修炼秘籍', link: 'https://pan.xunlei.com/s/VOP3s7G4eHRZY2IUihc2W4QTA1' },
  { title: '成人修炼手册', link: 'https://pan.xunlei.com/s/VOP3sG8COZ7sHno8EpjIv6eyA1' },
  { title: '正妹博士性学教室', link: 'https://pan.xunlei.com/s/VOP3sN3WRLFd38dbpR7EvtPoA1' },
  { title: '爱爱技巧', link: 'https://pan.xunlei.com/s/VOP3sStc1dckpi3HngYIQBEGA1' },
  { title: '【SVIP】房中技巧班-高级研修班', link: 'https://pan.xunlei.com/s/VOP3sqXERLFd38dbpR7Ew2dUA1' },
  { title: '吴小飘15堂G点愉悦手册', link: 'https://pan.xunlei.com/s/VOP4439m8veTkcQsuuxTDzHfA1' },
  { title: '男性x技宝典', link: 'https://pan.xunlei.com/s/VOP44rwnFXPj87MPK2PWwnuSA1' },
  { title: '公司文员必存资源', link: 'https://pan.xunlei.com/s/VOQ6FBWvNSmMb1YsHO_REEqUA1' },
  { title: '钓鱼视频教程实战大全技巧', link: 'https://pan.xunlei.com/s/VOQ6K54BUcNz3Mu_oHtAebFcA1' },
  { title: '计算机考证课程', link: 'https://pan.xunlei.com/s/VOQ6KRJJPV5TjTtqcfU8aDB7A1' },
  { title: '2024女性必备的20堂情趣指南课', link: 'https://pan.xunlei.com/s/VOQ6KYFJOM4F_E1Lcbt86a6MA1' },
  { title: '女生呵护指南', link: 'https://pan.xunlei.com/s/VOQ6KdJB7MK-8MadlJlaxUbtA1' },
  { title: '李银河：这才是你想要的性', link: 'https://pan.xunlei.com/s/VOQ6Kt9-LVQRsktvQtBSUTdjA1' },
  { title: '按摩教学', link: 'https://pan.xunlei.com/s/VOQ6LX14udm-6ik46ZifNZOkA1' },
  { title: '医学课程', link: 'https://pan.xunlei.com/s/VOQ6M187aY8k8FITC81_h0zEA1' },
  { title: '教资', link: 'https://pan.xunlei.com/s/VOQ6M9e8DzxF93hrLeszFuS9A1' },
  { title: '美丽芭蕾孕期特辑', link: 'https://pan.xunlei.com/s/VOQ6N8Wl829Ak4YZiGHD686aA1' },
  { title: '如何辨别渣男渣女训练营', link: 'https://pan.xunlei.com/s/VOQBYCnJcn-7E-aYxlZZT0AJA1' },
  { title: '微信机器人工具+视频教程', link: 'https://pan.xunlei.com/s/VOQBYMouy5qFuBJcHF8Opc-yA1' },
  { title: '最新剪映从入门到精通100课', link: 'https://pan.xunlei.com/s/VOQBZ9_kWkj3fzJHr6mj76i4A1' },
  { title: '国际象棋入门教程', link: 'https://pan.xunlei.com/s/VOQBZOdbLnlUbHA45Jg4GN4FA1' },
  { title: '扑克牌千术揭秘', link: 'https://pan.xunlei.com/s/VOQBZfk-Cu0rmDZIdzUW2wcgA1' },
  { title: '围棋入门课程大全', link: 'https://pan.xunlei.com/s/VOQB_QhgUGArPcbdUIa6wLE9A1' },
  { title: '书法教程零基础写出一手漂亮好字', link: 'https://pan.xunlei.com/s/VOQB_XeOc5OUVTauZez_fwDUA1' },
  { title: '用科学的心理学通识看透人性', link: 'https://pan.xunlei.com/s/VOQB_osJCu0rmDZIdzUW3KrCA1' },
  { title: '日语零基础直达N1', link: 'https://pan.xunlei.com/s/VOU7snTWH66jxoSBFoNZopvAA1' },
  { title: 'U盘重装系统到电脑系统维护维修', link: 'https://pan.xunlei.com/s/VOYJVgSoUAhvX4E4C5QPoo0wA1' },
];

const newIds = newResources.map(r => {
  const m = r.link.match(/\/s\/([A-Za-z0-9_-]+)/);
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
  console.log('\n新增资源:');
  unique.forEach(r => console.log(`  - ${r.title}`));
}
