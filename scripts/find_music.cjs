const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'docs', 'tools');
const files = fs.readdirSync(dir)
  .filter(f => f.startsWith('post_') && f.endsWith('.md'))
  .sort((a, b) => parseInt(a.match(/post_(\d+)/)[1]) - parseInt(b.match(/post_(\d+)/)[1]));

const musicFiles = [];
for (const f of files) {
  const c = fs.readFileSync(path.join(dir, f), 'utf8');
  const titleM = c.match(/^#\s+(.+)$/m);
  const title = titleM ? titleM[1].trim() : '';
  const descM = c.match(/description:\s*"([^"]+)"/);
  const desc = descM ? descM[1] : '';
  const kwM = c.match(/keywords:\s*"([^"]+)"/);
  const kw = kwM ? kwM[1] : '';
  const all = title + ' ' + desc + ' ' + kw;
  if (/音乐|歌曲|新歌|歌单|MV|唱片|专辑|听歌|网易云|酷狗|酷我|QQ音乐|Spotify|音源|无损|音乐播放|music/i.test(all)) {
    musicFiles.push({ file: f, title: title });
  }
}

for (const m of musicFiles) {
  console.log(m.file + ' | ' + m.title);
}
console.log('---');
console.log('Count:', musicFiles.length);
