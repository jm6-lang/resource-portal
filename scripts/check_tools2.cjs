const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const input = `版软件（找软件请看这里，可根据时间排序查找，每日更新实用软件请来挑选）.. https://pan.xunlei.com/s/VOOaMJ54DvaNOzRoOLlxR5o2A1?pwd=a6ub
TikTokMod会员版 https://pan.xunlei.com/s/VOU7rQiMuAdJSBAnyq_Nm2ZtA1?pwd=ky3z
一键迁移网盘资源百度转迅雷.. https://pan.xunlei.com/s/VOOaMRjWtx2hjdy5BesUfxSnA1?pwd=cjtj
[win]迅雷最新不限速版.. https://pan.xunlei.com/s/VOOaMd0Syh9lX_tN9sdXs7xcA1?pwd=475j
wifi万能钥匙SVIP版.. https://pan.xunlei.com/s/VOOuLKYI6SticUyS536Y85X2A1?pwd=sdm8
UC网盘批量转存工具.. https://pan.xunlei.com/s/VOQ6LDS8IEc-3wd4nNsUs6ZpA1?pwd=6ezx
夸克网盘批量转存分享工具.. https://pan.xunlei.com/s/VOQ6LIBchwbqjdXwYUw4zaeBA1?pwd=n8hd
金铲铲单机版（超详细的最强教程，9999+金币）.. https://pan.xunlei.com/s/VOQ6Mckoft4N8Zuq13Rr67HKA1?pwd=hvcq
骗子酒馆手机版.. https://pan.xunlei.com/s/VOQBZq70LnlUbHA45Jg4GXKcA1?pwd=x4sh
可灵无限灵感值.. https://pan.xunlei.com/s/VOQBZwUyKUAl4DNNfMGcsABPA1?pwd=c2g4
全网最全机顶盒视频教程.. https://pan.xunlei.com/s/VOQB_yHrz7MdEh5qGBzMq6KiA1?pwd=9fn3
迅雷VIP会员版 https://pan.xunlei.com/s/VOUCp8cC0hTpuOaP6-RwTTTjA1?pwd=psyh
微信好友检测工具 李跳跳真实好友 https://pan.xunlei.com/s/VOUCs9zzzro06gxXj-OeRpgeA1?pwd=zayh
影梭，定位修改大师 https://pan.xunlei.com/s/VOUIMuAtd8aW70HVfIb_pG62A1?pwd=5fh6
抢福袋工具 https://pan.xunlei.com/s/VOUIqHXWiH86exGXkPLRSPDtA1?pwd=8v5z
微粉大师 https://pan.xunlei.com/s/VOUNDvC01nsSdn0t7wIaNlyCA1?pwd=8d5r
李跳跳（跳广告神器，非常好用） https://pan.xunlei.com/s/VOUNExYviH86exGXkPLTs92OA1?pwd=jve7
WPS会员版 https://pan.xunlei.com/s/VOUNGDCYsyKaLN-PfIQOX7_3A1?pwd=2ygu
Windows纯净版系统镜像大合集 https://pan.xunlei.com/s/VOVQ1ijdL8qAx5s7vkZ5kTQuA1?pwd=e5c9
国外最火应用 app 合集 https://pan.xunlei.com/s/VOVVM2TMrCI1e6xO09VDc1JuA1?pwd=m4eu
电脑系统安装工具包 https://pan.xunlei.com/s/VOVeYGpND22zWV5oqAn7nqJJA1?pwd=4qa9
抖音短视频下载提取 https://pan.xunlei.com/s/VOVjsNkfZafTzbx1_YscGDyYA1?pwd=399y
去除马赛克软件 https://pan.xunlei.com/s/VOVp3RqvUtVuXKoLFgchvdgPA1?pwd=6h68
AI写作鱼_手机号登录终身VIP https://pan.xunlei.com/s/VOVun5tFShvSW39OHUi_mDjQA1?pwd=vaxg
3D动态照片v4.0.0.6会员版 https://pan.xunlei.com/s/VOVz9TwDFoIhJcrKIoZuY1vHA1?pwd=s489
变声器大师会员版 https://pan.xunlei.com/s/VOW3JS-k4-8tmbnwfgZfFBqFA1?pwd=qijb
梨园行戏曲TV版v995.7.2会员版 https://pan.xunlei.com/s/VOW8VTmvEiWTwdiuF1dxE9pyA1?pwd=spnp
马克全能去水印v1.1.5绿化会员版 https://pan.xunlei.com/s/VOWD_nrQwZcva3xhSMZUf062A1?pwd=j3ed
Zapya快牙v6.5.5(US)会员版 https://pan.xunlei.com/s/VOWIs-iGNCOKKEYQ-SO7zRKZA1?pwd=j5d3
作业帮v13.61.0绿化免费版 https://pan.xunlei.com/s/VOWOBNPwn0pAejN8kN4ulJJ9A1?pwd=vgq4
TVBox_takagen99免费版 https://pan.xunlei.com/s/VOWTCi3XrUcu62wAnKAvVD4jA1?pwd=efu4
酷我音乐_6.0.1.0-Mod车机版 https://pan.xunlei.com/s/VOWYC39PkmCwNNOZD-ixu68QA1?pwd=8nbv
Youtube油管视频下载器 https://pan.xunlei.com/s/VOWYEH0EkmCwNNOZD-ixvJFYA1?pwd=jjj2
视频去水印神器-HitPaw Watermark Remover https://pan.xunlei.com/s/VOWYHlx03_HvPduhhAQFlYaLA1?pwd=edax
轻听音乐v2.2.6免费版 https://pan.xunlei.com/s/VOWcbhIhc3ogRlnOhWz16z-lA1?pwd=3nbk
全球卫星电视TV garden https://pan.xunlei.com/s/VOWrpwtWTK_RkTvQWYTGJ2pJA1?pwd=s8a8
即梦Ai会员版无限积分 https://pan.xunlei.com/s/VOWrq9oLeoQT89x8UX6ZS-cFA1?pwd=h48t
动物翻译器 https://pan.xunlei.com/s/VOWrqDLfYa-Iuq5t6PKsOHgYA1?pwd=fi2t
搬运工具包 https://pan.xunlei.com/s/VOX6JDhMOOp5Lb8QDfV7mxp4A1?pwd=cx78
电脑密码处理工具 https://pan.xunlei.com/s/VOXBRniSZWYhuK2DRAmIJ3HLA1?pwd=gy5h
手机版闲鱼助手自动发货 https://pan.xunlei.com/s/VOXGks0nYB0jDG4ROtTuoiJ0A1?pwd=edim
图片批量处理 https://pan.xunlei.com/s/VOXW6jHtze9Rl3yZAc9OfK0tA1?pwd=6qcd
文件批量重命名 https://pan.xunlei.com/s/VOXW6r92yNaOLWrUcv2qljKzA1?pwd=7hza
手机刷机工具箱 https://pan.xunlei.com/s/VOXaFh7CRwAxaJVLO94ZJrKiA1?pwd=ppf6
CDR2023中文会员版CorelDRAW https://pan.xunlei.com/s/VOXfSJnKcx4UdHEqZS9f5viOA1?pwd=2z4i
打卡软件神器 https://pan.xunlei.com/s/VOXumZU5y-6A2bPiWO5dRzkrA1?pwd=88aq
查企业查信息（限制注册即送5年SVIP） https://pan.xunlei.com/s/VOY--vv8UsLDxjyOGMSyLOd5A1?pwd=48gy
笔趣阁完美修改去广告高级版 https://pan.xunlei.com/s/VOY42lVZqub9V_5XZd13WCacA1?pwd=g4yv
公众号爆文机器人 https://pan.xunlei.com/s/VOY9Bprql6UfhKDIxYVptHbWA1?pwd=pjji
七星虚拟机 https://pan.xunlei.com/s/VOYEPeKFTst6XWzYArT8HCa2A1?pwd=hqgu
电商图片采集工具 https://pan.xunlei.com/s/VOYTyGNoQmx9ciEhFbMA1afdA1?pwd=zru2
场控助手 https://pan.xunlei.com/s/VOYZ1P6cokb4EjBfQXAsjmo8A1?pwd=rkhe
TVBOX+最新接口 https://pan.xunlei.com/s/VOYdALqV30NTW53quTQfWHhmA1?pwd=beb8
【AI唱歌软件】AI翻唱 https://pan.xunlei.com/s/VOYiL6cH2GCVrbv91FRy7uEZA1?pwd=whn8
SolidWorks2025 最新完整版 https://pan.xunlei.com/s/VOYnT0SsriDNDGjCciy_H67PA1?pwd=9jbk`;

const newResources = input.split('\n').map(line => {
  const match = line.match(/^(.+?)\s+https:\/\/pan\.xunlei\.com\/s\/([A-Za-z0-9_-]+)/);
  if (match) {
    return { title: match[1].trim(), id: match[2], link: `https://pan.xunlei.com/s/${match[2]}` };
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
