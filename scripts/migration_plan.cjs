// Final migration plan - hand-verified
const migrations = {
  // AIknowledge -> self-media (AI+自媒体变现类)
  'AIknowledge/post_002.md': { target: 'self-media', reason: 'AI+自媒体+RPA变现训练营' },
  'AIknowledge/post_056.md': { target: 'self-media', reason: 'DeepSeek小红书导流私域变现' },

  // AIknowledge -> tools (会员版工具)
  'AIknowledge/post_025.md': { target: 'tools', reason: 'AI去字幕会员版' },

  // curriculum -> self-media (自媒体/电商/赚钱项目)
  'curriculum/post_032.md': { target: 'self-media', reason: '副业起跑营' },
  'curriculum/post_063.md': { target: 'self-media', reason: '小红书玩法教程' },
  'curriculum/post_064.md': { target: 'self-media', reason: '小红书带货42天训练营' },
  'curriculum/post_065.md': { target: 'self-media', reason: '小红书店铺课程' },
  'curriculum/post_066.md': { target: 'self-media', reason: '小红书爆款文案' },
  'curriculum/post_072.md': { target: 'self-media', reason: '抖音玩法教程' },
  'curriculum/post_083.md': { target: 'self-media', reason: '爆款自媒体起号训练营' },
  'curriculum/post_110.md': { target: 'self-media', reason: '闲鱼买卖折扣卡项目' },
  'curriculum/post_112.md': { target: 'self-media', reason: '短剧推文带货神器' },
  'curriculum/post_115.md': { target: 'self-media', reason: '淘宝虚拟类目蓝海赛道' },
  'curriculum/post_118.md': { target: 'self-media', reason: '百家号带货野路子玩法' },
  'curriculum/post_120.md': { target: 'self-media', reason: '淘宝开店0基础视频' },
  'curriculum/post_124.md': { target: 'self-media', reason: '表情包日入1500+项目' },
  'curriculum/post_127.md': { target: 'self-media', reason: '视频号带货中老年人赛道' },
  'curriculum/post_128.md': { target: 'self-media', reason: '无脑搬砖项目' },
  'curriculum/post_129.md': { target: 'self-media', reason: '电商运营表格合集' },
  'curriculum/post_131.md': { target: 'self-media', reason: '下班后100个赚钱小生意' },
  'curriculum/post_134.md': { target: 'self-media', reason: '闲鱼买卖折扣卡项目(重复)' },
  'curriculum/post_139.md': { target: 'self-media', reason: '淘宝虚拟类目(重复)' },
  'curriculum/post_140.md': { target: 'self-media', reason: '清华博士互联网创业课(重复)' },
  'curriculum/post_142.md': { target: 'self-media', reason: '百家号带货(重复)' },
  'curriculum/post_143.md': { target: 'self-media', reason: '快手引流创业粉' },
  'curriculum/post_144.md': { target: 'self-media', reason: '淘宝开店(重复)' },
  'curriculum/post_148.md': { target: 'self-media', reason: '表情包项目(重复)' },
  'curriculum/post_150.md': { target: 'self-media', reason: '36个赚钱金点子(重复)' },
  'curriculum/post_151.md': { target: 'self-media', reason: '视频号带货(重复)' },
  'curriculum/post_152.md': { target: 'self-media', reason: '无脑搬砖(重复)' },
  'curriculum/post_153.md': { target: 'self-media', reason: '电商运营表格(重复)' },
  'curriculum/post_155.md': { target: 'self-media', reason: '100个赚钱小生意(重复)' },
  'curriculum/post_116.md': { target: 'self-media', reason: '清华博士互联网创业课' },
  'curriculum/post_126.md': { target: 'self-media', reason: '36个赚钱金点子' },
  'curriculum/post_146.md': { target: 'self-media', reason: '微信朋友圈引流创业粉' },

  // curriculum -> movies (音乐)
  'curriculum/post_096.md': { target: 'movies', reason: '读书学习听的音乐合集' },

  // movies -> tools (会员版工具)
  'movies/post_176.md': { target: 'tools', reason: '酷我音乐会员版' },

  // movies -> self-media
  'movies/post_050.md': { target: 'self-media', reason: '影视解说自媒体训练营' },

  // edu -> tools
  'edu-knowlege/post_006.md': { target: 'tools', reason: '傻瓜英语VIP解锁版' },

  // self-media -> tools
  'self-media/post_008.md': { target: 'tools', reason: '群发宝会员版' },

  // tools -> edu
  'tools/post_102.md': { target: 'edu-knowlege', reason: '雅思旗舰VIP直达7分班' },

  // tools -> self-media
  'tools/post_210.md': { target: 'self-media', reason: '任小聊天话术APP' },
  'tools/post_215.md': { target: 'self-media', reason: '视频去重' },
};

module.exports = migrations;
