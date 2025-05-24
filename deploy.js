
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const runCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    process.exit(1);
  }
};

console.log('🚀 Starting deployment to GitHub Pages...');

// Build the project
console.log('📦 Building the project...');
runCommand('npm run build');

// Deploy to gh-pages branch
console.log('🌐 Deploying to GitHub Pages...');
runCommand('npx gh-pages -d dist');

console.log('✅ Deployment completed successfully!');
console.log('🔗 Your site will be available at: https://mordifox223.github.io/skygruppen-smart-compare/');
