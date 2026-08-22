const http = require('http');

async function checkPort(port, name) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/api/users`, (res) => {
      console.log(`✓ ${name} (port ${port}): ${res.statusCode}`);
      resolve(true);
    });
    
    req.on('error', () => {
      console.log(`✗ ${name} (port ${port}): Not running`);
      resolve(false);
    });
    
    req.setTimeout(1000);
  });
}

async function check() {
  console.log('\n🔍 Service Status Check\n');
  await checkPort(3000, 'Next.js Frontend');
  await checkPort(3001, 'Payload CMS Server');
  await checkPort(3003, 'Payload CMS (Legacy)');
  console.log('\n');
}

check();
