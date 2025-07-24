#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create placeholder icons for the nodes
const iconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="24" height="24" rx="4" fill="#2563eb"/>
  <text x="12" y="16" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="middle" fill="white">N8N</text>
</svg>`;

const nodeDirectories = [
  'nodes/N8nToolsPdf',
  'nodes/N8nToolsScraper', 
  'nodes/N8nToolsDocument'
];

nodeDirectories.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  const iconPath = path.join(dirPath, `${path.basename(dir).toLowerCase()}.svg`);
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  if (!fs.existsSync(iconPath)) {
    fs.writeFileSync(iconPath, iconSvg);
    console.log(`Created icon: ${iconPath}`);
  }
});

console.log('Icons prepared successfully!');