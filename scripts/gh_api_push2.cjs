const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const owner = 'jm6-lang';
const repo = 'resource-portal';
const branch = 'main';

// Get current commit
const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
const commitMsg = execSync('git log -1 --format=%s', { encoding: 'utf8' }).trim();
const commitBody = execSync('git log -1 --format=%b', { encoding: 'utf8' }).trim();

console.log('Commit:', commitHash.slice(0, 7), commitMsg);

// Get list of changed files
const changedFiles = execSync('git diff HEAD~1 --name-only', { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
console.log('Changed files:', changedFiles.length);

// Read file contents and encode base64
const readFile = (filePath) => {
  const content = fs.readFileSync(path.join(filePath), 'utf8');
  return Buffer.from(content).toString('base64');
};

// Get old tree SHA
const oldTree = execSync(`git rev-parse HEAD~1^{tree}`, { encoding: 'utf8' }).trim();
console.log('Old tree:', oldTree.slice(0, 7));

// Create tree entries
const treeEntries = [];
for (const file of changedFiles) {
  const sha = execSync(`git ls-tree HEAD "${file}"`, { encoding: 'utf8' });
  const mode = '100644';
  const blobSha = execSync(`git rev-parse HEAD:"${file}"`, { encoding: 'utf8' }).trim();
  treeEntries.push({ mode, path: file, sha: blobSha, type: 'blob' });
  console.log('  Tree entry:', file);
}

// Create new tree
const treeJson = treeEntries.map(e => ({
  mode: e.mode,
  path: e.path,
  sha: e.sha,
  type: e.type
}));

const treeResult = execSync(`gh api repos/${owner}/${repo}/git/trees -f base_tree=${oldTree} -F tree='${JSON.stringify(treeJson)}'`, { encoding: 'utf8' });
const treeData = JSON.parse(treeResult);
console.log('New tree:', treeData.sha.slice(0, 7));

// Create commit
const commitResult = execSync(`gh api repos/${owner}/${repo}/git/commits -f tree=${treeData.sha} -f message="${commitMsg}" -f author.name="OpenClaw Bot" -f author.email="bot@openclaw.ai"`, { encoding: 'utf8' });
const commitData = JSON.parse(commitResult);
console.log('New commit:', commitData.sha.slice(0, 7));

// Update ref
execSync(`gh api repos/${owner}/${repo}/git/refs/heads/${branch} -X PATCH -f sha=${commitData.sha}`, { encoding: 'utf8' });
console.log('✓ Pushed via GitHub API');
