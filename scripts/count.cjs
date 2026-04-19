const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');
const categories = fs.readdirSync(docsDir).filter(f => fs.statSync(path.join(docsDir, f)).isDirectory());

let total = 0;
const stats = {};

for (const cat of categories) {
  const catDir = path.join(docsDir, cat);
  const files = fs.readdirSync(catDir).filter(f => f.startsWith('post_') && f.endsWith('.md'));
  if (files.length > 0) {
    stats[cat] = files.length;
    total += files.length;
  }
}

console.log('\n=== 资源统计 ===\n');
const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
for (const [cat, count] of sorted) {
  console.log(`${cat.padEnd(20)} ${String(count).padStart(4)} 个`);
}
console.log('─'.repeat(26));
console.log(`${'总计'.padEnd(20)} ${String(total).padStart(4)} 个`);
