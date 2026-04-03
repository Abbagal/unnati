'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Scene3D from '../../components/Scene3D';
import SkillRadarChart from '../../components/SkillRadarChart';
import NeonProgressBar from '../../components/NeonProgressBar';
import AnimatedRoadmapTimeline from '../../components/AnimatedRoadmapTimeline';

export default function AICareerSystemPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    year: '',
    branch: '',
    skills: '',
    githubUsername: '',
    interests: '',
    goals: '',
    timeframe: 3
  });
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/roadmap-generator/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        setRoadmapData(data);
        setStep(4); // Go to results
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Mock skill data for demonstration
  const mockSkillData = [
    { skill: 'JavaScript', current: 6, required: 9, market: 8 },
    { skill: 'React', current: 5, required: 8, market: 9 },
    { skill: 'Node.js', current: 4, required: 7, market: 7 },
    { skill: 'Database', current: 3, required: 6, market: 6 },
    { skill: 'DevOps', current: 2, required: 5, market: 8 },
    { skill: 'System Design', current: 2, required: 7, market: 9 }
  ];

  // Mock roadmap data for timeline
  const mockRoadmapData = {
    month1: {
      title: "Foundation Building",
      focus: "Core technologies and fundamentals",
      goals: ["Master JavaScript ES6+", "Learn React basics", "Build first project"],
      projects: ["Personal Portfolio", "Todo App"],
      courses: ["JavaScript Fundamentals", "React Basics"],
      timeAllocation: "40 hours/week"
    },
    month2: {
      title: "Skill Development",
      focus: "Advanced concepts and real-world projects",
      goals: ["Master React ecosystem", "Learn backend development", "Build complex projects"],
      projects: ["E-commerce Platform", "Real-time Chat App"],
      courses: ["Advanced React", "Node.js & Express"],
      timeAllocation: "45 hours/week"
    },
    month3: {
      title: "Job Preparation",
      focus: "Portfolio completion and job applications",
      goals: ["Complete capstone project", "Apply to companies", "Ace interviews"],
      projects: ["Full-stack Capstone"],
      courses: ["System Design", "Interview Prep"],
      timeAllocation: "50 hours/week"
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <Scene3D />
      </div>
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4">
        <NeonProgressBar 
          value={(step / 4) * 100} 
          color="cyan" 
          showPercentage={false}
        />
      </div>

      <div className="relative z-10 pt-24">
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="container mx-auto px-6 py-8 max-w-4xl"
            >
              <div className="text-center mb-12">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                  AI Career Operating System
                </h1>
                <p className="text-xl text-gray-300">
                  Your personalized AI-powered career guidance platform
                </p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-8">
                <h2 className="text-3xl font-bold text-cyan-400 mb-6">Tell us about yourself</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Current Year</label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-cyan-500/50 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Branch</label>
                    <select
                      value={formData.branch}
                      onChange={(e) => setFormData({...formData, branch: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-cyan-500/50 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      required
                    >
                      <option value="">Select Branch</option>
                      <option value="CSE">Computer Science</option>
                      <option value="ECE">Electronics</option>
                      <option value="ME">Mechanical</option>
                      <option value="CE">Civil</option>
                      <option value="EE">Electrical</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-300 mb-2">Current Skills</label>
                    <input
                      type="text"
                      placeholder="e.g., JavaScript, Python, React (comma separated)"
                      value={formData.skills}
                      onChange={(e) => setFormData({...formData, skills: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-cyan-500/50 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <motion.button
                    onClick={nextStep}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-semibold"
                  >
                    Next Step →
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Goals & Interests */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="container mx-auto px-6 py-8 max-w-4xl"
            >
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8">
                <h2 className="text-3xl font-bold text-purple-400 mb-6">Your Goals & Interests</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-2">GitHub Username (Optional)</label>
                    <input
                      type="text"
                      placeholder="Your GitHub username for profile analysis"
                      value={formData.githubUsername}
                      onChange={(e) => setFormData({...formData, githubUsername: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Interests</label>
                    <input
                      type="text"
                      placeholder="e.g., Web Development, AI/ML, Mobile Apps"
                      value={formData.interests}
                      onChange={(e) => setFormData({...formData, interests: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:border-purple-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Career Goal</label>
                    <select
                      value={formData.goals}
                      onChange={(e) => setFormData({...formData, goals: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:border-purple-400"
                      required
                    >
                      <option value="">Select Goal</option>
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="DevOps Engineer">DevOps Engineer</option>
                      <option value="Mobile Developer">Mobile Developer</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <motion.button
                    onClick={prevStep}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gray-700 rounded-lg text-white font-semibold"
                  >
                    ← Previous
                  </motion.button>
                  <motion.button
                    onClick={nextStep}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold"
                  >
                    Analyze Skills →
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Skill Analysis */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="container mx-auto px-6 py-8 max-w-6xl"
            >
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-pink-400 mb-4">Skill Gap Analysis</h2>
                <p className="text-gray-300">AI-powered analysis of your current skills vs market requirements</p>
              </div>

              <SkillRadarChart skills={mockSkillData} title="Your Skill Profile" />

              <div className="flex justify-between mt-8">
                <motion.button
                  onClick={prevStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gray-700 rounded-lg text-white font-semibold"
                >
                  ← Previous
                </motion.button>
                <motion.button
                  onClick={handleSubmit}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg text-white font-semibold disabled:opacity-50"
                >
                  {loading ? '🤖 Generating...' : 'Generate AI Roadmap →'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 4: AI Roadmap Results */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full h-screen"
            >
              <AnimatedRoadmapTimeline roadmapData={mockRoadmapData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}