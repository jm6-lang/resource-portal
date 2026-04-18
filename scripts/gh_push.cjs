const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const repo = 'jm6-lang/resource-portal';
const docsDir = path.join(__dirname, '..', 'docs');
const scriptsDir = path.join(__dirname, '..', 'scripts');

const files = [
  { path: 'docs/healthy/post_001.md', local: path.join(docsDir, 'healthy/post_001.md') },
  { path: 'docs/healthy/post_002.md', local: path.join(docsDir, 'healthy/post_002.md') },
  { path: 'docs/healthy/post_003.md', local: path.join(docsDir, 'healthy/post_003.md') },
  { path: 'docs/healthy/post_004.md', local: path.join(docsDir, 'healthy/post_004.md') },
  { path: 'docs/healthy/post_005.md', local: path.join(docsDir, 'healthy/post_005.md') },
  { path: 'docs/healthy/index.md', local: path.join(docsDir, 'healthy/index.md') },
  { path: 'docs/curriculum/post_108.md', local: path.join(docsDir, 'curriculum/post_108.md') },
  { path: 'docs/curriculum/post_155.md', local: path.join(docsDir, 'curriculum/post_155.md') },
  { path: 'docs/curriculum/index.md', local: path.join(docsDir, 'curriculum/index.md') },
  { path: 'docs/movies/index.md', local: path.join(docsDir, 'movies/index.md') },
  { path: 'docs/self-media/post_050.md', local: path.join(docsDir, 'self-media/post_050.md') },
  { path: 'docs/self-media/index.md', local: path.join(docsDir, 'self-media/index.md') },
  { path: 'docs/tools/index.md', local: path.join(docsDir, 'tools/index.md') },
  { path: 'scripts/check_new_resources.cjs', local: path.join(scriptsDir, 'check_new_resources.cjs') },
  { path: 'scripts/fix_health_migrate.cjs', local: path.join(scriptsDir, 'fix_health_migrate.cjs') },
  { path: 'scripts/fix_keywords.cjs', local: path.join(scriptsDir, 'fix_keywords.cjs') },
];

function ghApi(endpoint, method, payload) {
  const args = ['api', endpoint];
  if (method && method !== 'GET') args.push('-X', method);
  const result = spawnSync('gh', args, {
    input: payload ? JSON.stringify(payload) : undefined,
    encoding: 'utf8'
  });
  if (result.status !== 0) throw new Error(result.stderr);
  return JSON.parse(result.stdout);
}

const currentCommit = ghApi(`repos/${repo}/commits/main`);
const currentSha = currentCommit.sha;
console.log('Current main SHA:', currentSha);

const baseTreeSha = currentCommit.commit.tree.sha;
console.log('Base tree SHA:', baseTreeSha);

// Create blobs
const tree = [];
for (const f of files) {
  const content = fs.readFileSync(f.local, 'utf8');
  const blob = ghApi(`repos/${repo}/git/blobs`, 'POST', {
    content: Buffer.from(content).toString('base64'),
    encoding: 'base64'
  });
  tree.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha });
  console.log('Blob:', f.path, blob.sha.slice(0, 7));
}

const deletes = [
  'docs/curriculum/post_022.md',
  'docs/movies/post_018.md',
  'docs/movies/post_023.md',
  'docs/movies/post_024.md',
  'docs/movies/post_028.md',
  'docs/movies/post_126.md',
  'docs/tools/post_050.md',
];

// Create tree
const newTree = ghApi(`repos/${repo}/git/trees`, 'POST', {
  base_tree: baseTreeSha,
  tree: [
    ...tree,
    ...deletes.map(p => ({ path: p, mode: '100644', type: 'blob', sha: null }))
  ]
});
console.log('New tree SHA:', newTree.sha);

// Create commit
const newCommit = ghApi(`repos/${repo}/git/commits`, 'POST', {
  message: 'feat: add 心理控制术 + migrate 7 misclassified resources',
  tree: newTree.sha,
  parents: [currentSha]
});
console.log('New commit SHA:', newCommit.sha);

// Update ref
ghApi(`repos/${repo}/git/refs/heads/main`, 'PATCH', { sha: newCommit.sha });
console.log('Pushed successfully!');
