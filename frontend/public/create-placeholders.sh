#!/bin/bash

# Create SVG placeholder images
mkdir -p public/uploads

# Platform Hero Placeholder
cat > public/placeholder-platform-hero.png << 'IMGEOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
  <rect width="1200" height="600" fill="#f5f5f5"/>
  <text x="600" y="300" font-size="32" text-anchor="middle" fill="#999">Platform Dashboard Screenshot</text>
</svg>
IMGEOF

# Risk Map Placeholder
cat > public/placeholder-risk-map.png << 'IMGEOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
  <rect width="1200" height="600" fill="#1a1a1a"/>
  <text x="600" y="300" font-size="32" text-anchor="middle" fill="#666">Risk Map Visualization</text>
</svg>
IMGEOF

# EP Curve Placeholder
cat > public/placeholder-ep-curve.png << 'IMGEOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
  <rect width="1200" height="600" fill="#1a1a1a"/>
  <text x="600" y="300" font-size="32" text-anchor="middle" fill="#666">EP Curve Analysis</text>
</svg>
IMGEOF

# War Room Placeholder
cat > public/placeholder-war-room.png << 'IMGEOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
  <rect width="1200" height="600" fill="#1a1a1a"/>
  <text x="600" y="300" font-size="32" text-anchor="middle" fill="#666">War Room Dashboard</text>
</svg>
IMGEOF

# Quantum Architecture Placeholder
cat > public/placeholder-quantum-arch.png << 'IMGEOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
  <rect width="1200" height="600" fill="#f5f5f5"/>
  <text x="600" y="300" font-size="32" text-anchor="middle" fill="#999">Architecture Diagram</text>
</svg>
IMGEOF

echo "Placeholder images created"
