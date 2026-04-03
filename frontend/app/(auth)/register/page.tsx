'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Scene3D from '@/components/Scene3D';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <Scene3D />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl border border-cyan-500/30 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-cyan-400 mb-6 text-center">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-3 bg-gray-900 border border-cyan-500/50 rounded-lg text-white focus:outline-none focus:border-cyan-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-3 bg-gray-900 border border-cyan-500/50 rounded-lg text-white focus:outline-none focus:border-cyan-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-4 py-3 bg-gray-900 border border-cyan-500/50 rounded-lg text-white focus:outline-none focus:border-cyan-400"
          />
          <select
            value={formData.branch}
            onChange={(e) => setFormData({...formData, branch: e.target.value})}
            className="w-full px-4 py-3 bg-gray-900 border border-cyan-500/50 rounded-lg text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="">Select Branch</option>
            <option value="CSE">Computer Science</option>
            <option value="ECE">Electronics</option>
            <option value="ME">Mechanical</option>
          </select>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-semibold"
          >
            Register
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}