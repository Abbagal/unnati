#!/usr/bin/env node

const http = require('http');

console.log('🔍 Checking project status...\n');

// Check backend
const checkBackend = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000', (res) => {
      console.log('✅ Backend: Running on http://localhost:5000');
      resolve(true);
    });
    
    req.on('error', () => {
      console.log('❌ Backend: Not running on http://localhost:5000');
      resolve(false);
    });
    
    req.setTimeout(2000, () => {
      console.log('⏰ Backend: Timeout - may still be starting');
      req.destroy();
      resolve(false);
    });
  });
};

// Check frontend
const checkFrontend = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000', (res) => {
      console.log('✅ Frontend: Running on http://localhost:3000');
      resolve(true);
    });
    
    req.on('error', () => {
      console.log('❌ Frontend: Not running on http://localhost:3000');
      resolve(false);
    });
    
    req.setTimeout(2000, () => {
      console.log('⏰ Frontend: Timeout - may still be starting');
      req.destroy();
      resolve(false);
    });
  });
};

async function checkStatus() {
  const backendStatus = await checkBackend();
  const frontendStatus = await checkFrontend();
  
  console.log('\n📊 Status Summary:');
  console.log(`Backend: ${backendStatus ? '🟢 Running' : '🔴 Not Running'}`);
  console.log(`Frontend: ${frontendStatus ? '🟢 Running' : '🔴 Not Running'}`);
  
  if (backendStatus && frontendStatus) {
    console.log('\n🎉 Project is running successfully!');
    console.log('🌐 Open http://localhost:3000 in your browser');
  } else {
    console.log('\n⚠️  Some services are not running. Check the terminal outputs.');
  }
}

checkStatus();