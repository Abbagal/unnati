'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navigation() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-xl border-b border-cyan-500/30"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-cyan-400">
          🚀 CareerGuide
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-white hover:text-cyan-400 transition-colors">
            Dashboard
          </Link>
          <Link href="/ai-career-system" className="text-white hover:text-cyan-400 transition-colors">
            🤖 AI Career OS
          </Link>
          <Link href="/roadmap-generator" className="text-white hover:text-cyan-400 transition-colors">
            📊 Roadmap
          </Link>
          <Link href="/github-analyzer" className="text-white hover:text-cyan-400 transition-colors">
            📊 GitHub
          </Link>
          <Link href="/assessment" className="text-white hover:text-cyan-400 transition-colors">
            📝 Assessment
          </Link>
          <Link href="/chat" className="text-white hover:text-cyan-400 transition-colors">
            💬 AI Chat
          </Link>
          <Link href="/profile" className="text-white hover:text-cyan-400 transition-colors">
            Profile
          </Link>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-700">
            <Link 
              href="/login" 
              className="px-4 py-2 text-white hover:text-cyan-400 transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all transform hover:scale-105"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}