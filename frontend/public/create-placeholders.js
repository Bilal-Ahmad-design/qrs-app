const fs = require('fs');
const path = require('path');

// Create simple SVG placeholder images
const placeholders = {
  'placeholder-platform-hero.png': '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600"><rect width="1200" height="600" fill="#f0f0f0"/><text x="600" y="300" font-size="48" text-anchor="middle" fill="#999" font-family="Arial">Platform Dashboard</text></svg>',
  'placeholder-risk-map.png': '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600"><rect width="1200" height="600" fill="#1a1a1a"/><text x="600" y="300" font-size="48" text-anchor="middle" fill="#666" font-family="Arial">Risk Map</text></svg>',
  'placeholder-ep-curve.png': '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600"><rect width="1200" height="600" fill="#1a1a1a"/><text x="600" y="300" font-size="48" text-anchor="middle" fill="#666" font-family="Arial">EP Curve</text></svg>',
  'placeholder-war-room.png': '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600"><rect width="1200" height="600" fill="#1a1a1a"/><text x="600" y="300" font-size="48" text-anchor="middle" fill="#666" font-family="Arial">War Room</text></svg>',
  'placeholder-quantum-arch.png': '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600"><rect width="1200" height="600" fill="#f0f0f0"/><text x="600" y="300" font-size="48" text-anchor="middle" fill="#999" font-family="Arial">Architecture</text></svg>',
};

Object.entries(placeholders).forEach(([name, svg]) => {
  fs.writeFileSync(path.join(__dirname, name), svg);
  console.log(`Created ${name}`);
});
