const { execSync } = require('child_process');
const https = require('https');

const REPO = 'jm6-lang/resource-portal';
const TOKEN = process.env.GH_TOKEN || execSync('gh auth token').toString().trim();

// Get commit SHA
const sha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
const message = execSync('git log -1 --pretty=format:"%s"', { encoding: 'utf8' }).trim();

console.log('Pushing commit:', sha.slice(0, 7), message);

// Get remote HEAD
const options = {
  hostname: 'api.github.com',
  path: `/repos/${REPO}/git/refs/heads/main`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'User-Agent': 'OpenClaw-Agent',
    'Accept': 'application/vnd.github+json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error('Failed to get remote HEAD:', res.statusCode, data);
      process.exit(1);
    }

    const ref = JSON.parse(data);
    const remoteSha = ref.object.sha;
    console.log('Remote HEAD:', remoteSha.slice(0, 7));

    // Update ref
    const updateOptions = {
      hostname: 'api.github.com',
      path: `/repos/${REPO}/git/refs/heads/main`,
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'User-Agent': 'OpenClaw-Agent',
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      }
    };

    const updateReq = https.request(updateOptions, (updateRes) => {
      let updateData = '';
      updateRes.on('data', chunk => updateData += chunk);
      updateRes.on('end', () => {
        if (updateRes.statusCode === 200) {
          console.log('✓ Push successful');
        } else {
          console.error('Push failed:', updateRes.statusCode, updateData);
          process.exit(1);
        }
      });
    });

    updateReq.on('error', console.error);
    updateReq.write(JSON.stringify({ sha: sha, force: false }));
    updateReq.end();
  });
});

req.on('error', console.error);
req.end();
