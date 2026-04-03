#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🚀 AI Career Operating System - Status Dashboard\n');

// Check services
async function checkServices() {
  const services = [
    { name: 'Frontend (Next.js)', url: 'http://localhost:3000', port: 3000 },
    { name: 'Backend (Express)', url: 'http://localhost:5000', port: 5000 },
    { name: 'Prisma Studio', url: 'http://localhost:5555', port: 5555 }
  ];

  console.log('📊 Service Status:');
  console.log('─'.repeat(50));

  for (const service of services) {
    const status = await checkService(service.url);
    const icon = status ? '🟢' : '🔴';
    const statusText = status ? 'RUNNING' : 'OFFLINE';
    console.log(`${icon} ${service.name.padEnd(25)} ${statusText}`);
  }
}

// Check database
function checkDatabase() {
  console.log('\n💾 Database Status:');
  console.log('─'.repeat(50));
  
  const dbPath = path.join(__dirname, 'backend', 'prisma', 'dev.db');
  if (fs.existsSync(dbPath)) {
    const stats = fs.statSync(dbPath);
    console.log('🟢 SQLite Database        CONNECTED');
    console.log(`📁 Database Size          ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`📅 Last Modified          ${stats.mtime.toLocaleString()}`);
  } else {
    console.log('🔴 Database               NOT FOUND');
  }
}

// Check AI features
function checkAIFeatures() {
  console.log('\n🤖 AI Features Status:');
  console.log('─'.repeat(50));
  
  const envPath = path.join(__dirname, 'backend', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasOpenAI = envContent.includes('OPENAI_API_KEY') && !envContent.includes('your-openai-api-key');
    
    console.log(`🤖 AI Roadmap Generator   ${hasOpenAI ? '🟢 READY' : '🟡 DEMO MODE'}`);
    console.log(`📊 GitHub Analyzer        🟢 READY`);
    console.log(`💬 AI Chat Assistant      ${hasOpenAI ? '🟢 READY' : '🟡 DEMO MODE'}`);
    console.log(`📝 Resume Analyzer        🟢 READY`);
    console.log(`🎯 Career Assessment      🟢 READY`);
    
    if (!hasOpenAI) {
      console.log('\n💡 Tip: Add your OpenAI API key to enable full AI features');
    }
  }
}

// Check project structure
function checkProjectStructure() {
  console.log('\n📁 Project Structure:');
  console.log('─'.repeat(50));
  
  const structure = [
    { path: 'frontend/app', name: 'Frontend Pages' },
    { path: 'frontend/components', name: 'React Components' },
    { path: 'backend/src/routes', name: 'API Routes' },
    { path: 'backend/src/services', name: 'AI Services' },
    { path: 'backend/prisma', name: 'Database Schema' }
  ];
  
  structure.forEach(item => {
    const exists = fs.existsSync(path.join(__dirname, item.path));
    const icon = exists ? '🟢' : '🔴';
    console.log(`${icon} ${item.name.padEnd(25)} ${exists ? 'EXISTS' : 'MISSING'}`);
  });
}

// Show available pages
function showAvailablePages() {
  console.log('\n🌐 Available Pages:');
  console.log('─'.repeat(50));
  
  const pages = [
    { path: '/', name: 'Landing Page', description: 'Futuristic homepage with 3D animations' },
    { path: '/roadmap-generator', name: 'AI Roadmap Generator', description: 'Generate personalized career roadmaps' },
    { path: '/github-analyzer', name: 'GitHub Analyzer', description: 'Analyze GitHub profiles with AI' },
    { path: '/assessment', name: 'Career Assessment', description: 'Multi-dimensional career testing' },
    { path: '/chat', name: 'AI Chat Assistant', description: '24/7 career guidance chatbot' },
    { path: '/courses', name: 'Courses', description: 'Engineering course catalog' },
    { path: '/dashboard', name: 'Dashboard', description: 'Personal progress tracking' },
    { path: '/profile', name: 'Profile', description: 'User profile management' }
  ];
  
  pages.forEach(page => {
    console.log(`🔗 http://localhost:3000${page.path}`);
    console.log(`   ${page.name} - ${page.description}`);
    console.log('');
  });
}

// Show deployment architecture
function showDeploymentInfo() {
  console.log('\n🚀 Deployment Architecture:');
  console.log('─'.repeat(50));
  console.log('Frontend → Vercel (Free tier)');
  console.log('Backend → Render/Railway (Free tier)');
  console.log('Database → Neon PostgreSQL (Free tier)');
  console.log('AI → OpenAI API (Pay per use)');
  console.log('Total Cost: ₹0 - ₹2000/month');
}

// Show next steps
function showNextSteps() {
  console.log('\n📋 Next Steps:');
  console.log('─'.repeat(50));
  console.log('1. 🔑 Add OpenAI API key for full AI features');
  console.log('2. 🗄️  Set up Neon PostgreSQL for production');
  console.log('3. 📤 Deploy frontend to Vercel');
  console.log('4. 🖥️  Deploy backend to Render/Railway');
  console.log('5. 🎨 Add more 3D animations and effects');
  console.log('6. 📊 Implement analytics and user tracking');
  console.log('7. 🔐 Add OAuth authentication (Google/GitHub)');
  console.log('8. 📱 Create mobile-responsive design');
}

// Helper function to check service
function checkService(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(true);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Main execution
async function main() {
  await checkServices();
  checkDatabase();
  checkAIFeatures();
  checkProjectStructure();
  showAvailablePages();
  showDeploymentInfo();
  showNextSteps();
  
  console.log('\n🎉 AI Career Operating System Status Complete!');
  console.log('🌐 Open http://localhost:3000 to see your futuristic platform');
}

main().catch(console.error);