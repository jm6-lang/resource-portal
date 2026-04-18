const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const repo = 'jm6-lang/resource-portal';
const docsDir = path.join(__dirname, '..', 'docs');

function ghApi(endpoint, method, payload) {
  const args = ['api', endpoint];
  if (method && method !== 'GET') args.push('-X', method);
  const result = spawnSync('gh', args, {
    input: payload ? JSON.stringify(payload) : undefined,
    encoding: 'utf8'
  });
  console.log('STDOUT:', result.stdout.slice(0, 500));
  console.log('STDERR:', result.stderr.slice(0, 500));
  if (result.status !== 0) throw new Error(result.stderr);
  return JSON.parse(result.stdout);
}

// Test with a small file
const testFile = path.join(docsDir, 'healthy/post_001.md');
const content = fs.readFileSync(testFile, 'utf8');
console.log('File size:', content.length);

const base64 = Buffer.from(content).toString('base64');
console.log('Base64 size:', base64.length);

try {
  const blob = ghApi(`repos/${repo}/git/blobs`, 'POST', {
    content: base64,
    encoding: 'base64'
  });
  console.log('Blob SHA:', blob.sha);
} catch (e) {
  console.log('Error:', e.message);
}
