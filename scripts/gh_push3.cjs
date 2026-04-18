const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');

const REPO = 'jm6-lang/resource-portal';
const BRANCH = 'main';

// Get last remote commit
const lastRemote = execSync(`gh api repos/${REPO}/commits/${BRANCH} --jq .sha`).toString().trim();
console.log('Remote HEAD:', lastRemote.slice(0,7));

// Get local HEAD
const localHead = execSync('git rev-parse HEAD').toString().trim();
console.log('Local HEAD:', localHead.slice(0,7));

if (localHead === lastRemote) {
  console.log('Already in sync');
  process.exit(0);
}

// Get merge base to find common ancestor
let baseCommit;
try {
  baseCommit = execSync(`git merge-base ${lastRemote} HEAD 2>/dev/null`).toString().trim();
  console.log('Merge base:', baseCommit.slice(0,7));
} catch {
  // No common ancestor, push all files
  baseCommit = null;
}

// Get files changed
let diffFiles;
if (baseCommit) {
  diffFiles = execSync(`git diff --name-status ${lastRemote}..HEAD`).toString().trim().split('\n').filter(Boolean);
} else {
  // No common ancestor - just push new/modified files
  diffFiles = execSync(`git diff --name-status HEAD~1..HEAD`).toString().trim().split('\n').filter(Boolean);
}

console.log('\nFiles changed:', diffFiles.length);

const additions = [];
const deletions = [];

for (const line of diffFiles) {
  const [status, ...parts] = line.split('\t');
  const filePath = parts[parts.length - 1];
  
  if (status === 'D') {
    deletions.push({ path: filePath });
    console.log('  D', filePath);
  } else if ((status === 'A' || status === 'M') && fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'base64');
    additions.push({
      path: filePath,
      contents: content
    });
    console.log(' ', status, filePath);
  }
}

console.log('\nCreating commit via GitHub GraphQL API...');

const query = `
mutation($input: CreateCommitOnBranchInput!) {
  createCommitOnBranch(input: $input) {
    commit { oid url }
  }
}
`;

// Get commit message
const commitMsg = execSync('git log -1 --format=%s').toString().trim();

const input = {
  branch: { repositoryNameWithOwner: REPO, branchName: BRANCH },
  message: { headline: commitMsg },
  expectedHeadOid: lastRemote,
  fileChanges: { additions, deletions }
};

const body = JSON.stringify({ query, variables: { input } });
const token = execSync('gh auth token').toString().trim();

const req = https.request({
  hostname: 'api.github.com',
  path: '/graphql',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'Node.js'
  }
}, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const result = JSON.parse(data);
    if (result.errors) {
      console.error('GraphQL errors:', JSON.stringify(result.errors, null, 2));
      process.exit(1);
    }
    console.log('\n✅ Success!');
    console.log('Commit:', result.data.createCommitOnBranch.commit.oid.slice(0,7));
    console.log('URL:', result.data.createCommitOnBranch.commit.url);
  });
});

req.on('error', e => {
  console.error('Request error:', e.message);
  process.exit(1);
});

req.write(body);
req.end();
