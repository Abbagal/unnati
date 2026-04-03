'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Scene3D from '../../components/Scene3D';

export default function RoadmapGeneratorPage() {
  const [formData, setFormData] = useState({
    year: '',
    branch: '',
    skills: '',
    goals: '',
    timeframe: 3
  });
  const [roadmap, setRoadmap] = useState(null);
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
        setRoadmap(data);
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="absolute top-20 right-0 w-1/4 h-1/4 opacity-10">
        <Scene3D />
      </div>
      
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold text-cyan-400 mb-8"
        >
          🤖 AI Roadmap Generator
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-cyan-500/30"
          >
            <h2 className="text-2xl font-semibold text-cyan-400 mb-6">Tell us about yourself</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Current Year</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900 border border-cyan-500/50 rounded-lg text-white"
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
                  className="w-full px-4 py-3 bg-gray-900 border border-cyan-500/50 rounded-lg text-white"
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

              <div>
                <label className="block text-gray-300 mb-2">Current Skills</label>
                <input
                  type="text"
                  placeholder="e.g., JavaScript, Python, React (comma separated)"
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900 border border-cyan-500/50 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Career Goal</label>
                <select
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900 border border-cyan-500/50 rounded-lg text-white"
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

              <div>
                <label className="block text-gray-300 mb-2">Timeframe (months)</label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={formData.timeframe}
                  onChange={(e) => setFormData({...formData, timeframe: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="text-center text-cyan-400 font-semibold">{formData.timeframe} months</div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-semibold disabled:opacity-50"
              >
                {loading ? '🤖 Generating...' : '🚀 Generate My Roadmap'}
              </motion.button>
            </form>
          </motion.div>

          {/* Generated Roadmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-purple-500/30"
          >
            <h2 className="text-2xl font-semibold text-purple-400 mb-6">Your AI-Generated Roadmap</h2>
            
            {roadmap ? (
              <div className="space-y-6">
                {/* AI Insights */}
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">🤖 AI Insights</h3>
                  <ul className="space-y-2">
                    {roadmap.aiInsights.map((insight: string, index: number) => (
                      <motion.li 
                        key={index} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-gray-300 text-sm flex items-start"
                      >
                        <span className="text-cyan-400 mr-2">•</span>
                        {insight}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* 3D Timeline Visualization */}
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">📊 Interactive Timeline</h3>
                  <div className="h-64 bg-black/30 rounded-lg border border-cyan-500/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🚀</div>
                      <p className="text-gray-400">3D Timeline Visualization</p>
                      <p className="text-gray-500 text-sm">Interactive roadmap coming soon</p>
                    </div>
                  </div>
                </div>

                {/* Milestones List */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-purple-400">🎯 Milestones</h3>
                  {roadmap.roadmap.milestones.map((milestone: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-900/50 p-4 rounded-lg border-l-4 border-cyan-400 hover:bg-gray-800/50 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-white">{milestone.title}</h4>
                        <span className="text-xs text-gray-400">
                          {new Date(milestone.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{milestone.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                          {milestone.category}
                        </span>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                          {milestone.targetOutcome}
                        </span>
                      </div>

                      {/* Action Steps */}
                      {milestone.actionSteps && milestone.actionSteps.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-sm font-semibold text-gray-300 mb-2">Action Steps:</h5>
                          <div className="space-y-1">
                            {milestone.actionSteps.map((step: any, stepIndex: number) => (
                              <div key={stepIndex} className="flex items-center text-xs text-gray-400">
                                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                                {step.task} ({step.duration})
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Metadata */}
                {roadmap.metadata && (
                  <div className="bg-gray-900/30 p-3 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Generated by: {roadmap.metadata.generatedBy}</span>
                      <span>Confidence: {Math.round(roadmap.metadata.confidence * 100)}%</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <div className="text-6xl mb-4">🤖</div>
                <p className="mb-2">Fill out the form to generate your personalized roadmap</p>
                <p className="text-sm text-gray-500">Powered by advanced AI algorithms</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}