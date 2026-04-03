'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Scene3D from '@/components/Scene3D';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    branch: '',
    year: '',
    skills: [],
    interests: []
  });

  useEffect(() => {
    // Fetch user profile
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setProfile(data));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="absolute top-20 right-0 w-1/3 h-1/3 opacity-10">
        <Scene3D />
      </div>
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold text-cyan-400 mb-8"
        >
          My Profile
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-cyan-500/30"
          >
            <h3 className="text-2xl font-semibold text-cyan-400 mb-4">Personal Info</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900 border border-cyan-500/50 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900 border border-cyan-500/50 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Branch</label>
                <select
                  value={profile.branch}
                  onChange={(e) => setProfile({...profile, branch: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900 border border-cyan-500/50 rounded-lg text-white"
                >
                  <option value="">Select Branch</option>
                  <option value="CSE">Computer Science</option>
                  <option value="ECE">Electronics</option>
                  <option value="ME">Mechanical</option>
                  <option value="CE">Civil</option>
                </select>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-purple-500/30"
          >
            <h3 className="text-2xl font-semibold text-purple-400 mb-4">Skills & Interests</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {['JavaScript', 'Python', 'React', 'Node.js'].map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {['Web Development', 'AI/ML', 'Mobile Apps'].map((interest) => (
                    <span key={interest} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}