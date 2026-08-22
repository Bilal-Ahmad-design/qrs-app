import http from 'http';

async function checkPort(port, name) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/`, (res) => {
      console.log(`✓ Port ${port} (${name}): Responding`);
      resolve(true);
    });
    
    req.on('error', () => {
      console.log(`✗ Port ${port} (${name}): Not running`);
      resolve(false);
    });
    
    req.setTimeout(500);
  });
}

async function check() {
  console.log('\n🔍 Service Status Check\n');
  await checkPort(3000, 'Next.js Frontend');
  await checkPort(3001, 'Payload CMS');
  console.log('\n');
}

check();
