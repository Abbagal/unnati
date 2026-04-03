#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Engineering Career Guide Platform...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 18) {
  console.error('❌ Node.js 18+ is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed');

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('npm install', { cwd: 'backend', stdio: 'inherit' });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('npm install', { cwd: 'frontend', stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Check if .env exists in backend
const envPath = path.join('backend', '.env');
if (!fs.existsSync(envPath)) {
  console.log('\n⚠️  Creating .env file from template...');
  const envExample = path.join('backend', '.env.example');
  if (fs.existsSync(envExample)) {
    fs.copyFileSync(envExample, envPath);
    console.log('✅ .env file created. Please update with your database credentials.');
  }
}

console.log('\n🎉 Setup complete!');
console.log('\nNext steps:');
console.log('1. Update backend/.env with your PostgreSQL credentials');
console.log('2. Run: cd backend && npx prisma migrate dev');
console.log('3. Start backend: cd backend && npm run dev');
console.log('4. Start frontend: cd frontend && npm run dev');
console.log('\nThe app will be available at:');
console.log('- Frontend: http://localhost:3000');
console.log('- Backend: http://localhost:5000');