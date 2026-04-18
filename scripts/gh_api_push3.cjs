const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const owner = 'jm6-lang';
const repo = 'resource-portal';
const branch = 'main';

// Files to push
const files = [
  'docs/healthy/post_007.md',
  'docs/healthy/index.md',
  'scripts/check_tools.cjs',
  'scripts/check_xunlei.cjs',
  'scripts/check_xunlei2.cjs',
];

// Get current branch ref
const refData = execSync(`gh api repos/${owner}/${repo}/git/refs/heads/${branch}`, { encoding: 'utf8' });
const ref = JSON.parse(refData);
const baseCommitSha = ref.object.sha;
console.log('Base commit:', baseCommitSha.slice(0, 7));

// Get base tree
const commitData = execSync(`gh api repos/${owner}/${repo}/git/commits/${baseCommitSha}`, { encoding: 'utf8' });
const baseTreeSha = JSON.parse(commitData).tree.sha;
console.log('Base tree:', baseTreeSha.slice(0, 7));

// Create blobs for each file
const treeItems = [];
for (const file of files) {
  const content = fs.readFileSync(path.join(file), 'utf8');
  const encoded = Buffer.from(content).toString('base64');
  const blobResult = execSync(`gh api repos/${owner}/${repo}/git/blobs -f encoding=base64 -F content="${encoded}"`, { encoding: 'utf8' });
  const blobSha = JSON.parse(blobResult).sha;
  treeItems.push({
    mode: '100644',
    path: file,
    sha: blobSha,
    type: 'blob'
  });
  console.log('  Blob:', file);
}

// Create tree
const treeResult = execSync(`gh api repos/${owner}/${repo}/git/trees -f base_tree=${baseTreeSha} -F tree='${JSON.stringify(treeItems)}'`, { encoding: 'utf8' });
const newTreeSha = JSON.parse(treeResult).sha;
console.log('New tree:', newTreeSha.slice(0, 7));

// Create commit
const newCommitResult = execSync(`gh api repos/${owner}/${repo}/git/commits -f tree=${newTreeSha} -f message="feat: add 推拿手法技能 to healthy (post_007)

Skip 55 duplicates from xunlei batch" -f parents[]=${baseCommitSha}`, { encoding: 'utf8' });
const newCommitSha = JSON.parse(newCommitResult).sha;
console.log('New commit:', newCommitSha.slice(0, 7));

// Update ref
execSync(`gh api repos/${owner}/${repo}/git/refs/heads/${branch} -X PATCH -f sha=${newCommitSha}`, { encoding: 'utf8' });
console.log('✓ Pushed via GitHub API');
