'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Scene3D from '../../components/Scene3D';

export default function GitHubAnalyzerPage() {
  const [username, setUsername] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/github-analyzer/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ githubUsername: username })
      });
      
      const data = await res.json();
      if (data.success) {
        setAnalysis(data);
      }
    } catch (error) {
      console.error('Error analyzing GitHub:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="absolute top-20 left-0 w-1/4 h-1/4 opacity-10">
        <Scene3D />
      </div>
      
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold text-cyan-400 mb-8"
        >
          📊 GitHub Profile Analyzer
        </motion.h1>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-cyan-500/30 mb-8"
        >
          <form onSubmit={handleAnalyze} className="flex gap-4">
            <input
              type="text"
              placeholder="Enter GitHub username (e.g., octocat)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-900 border border-cyan-500/50 rounded-lg text-white"
              required
            />
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-semibold disabled:opacity-50"
            >
              {loading ? '🔍 Analyzing...' : '🚀 Analyze'}
            </motion.button>
          </form>
        </motion.div>

        {analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-cyan-500/30"
            >
              <h2 className="text-2xl font-semibold text-cyan-400 mb-6">📈 Profile Overview</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-cyan-400">{analysis.analysis.overview.totalRepos}</div>
                  <div className="text-gray-300 text-sm">Repositories</div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-400">{analysis.analysis.overview.totalStars}</div>
                  <div className="text-gray-300 text-sm">Total Stars</div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-pink-400">{analysis.analysis.overview.followers}</div>
                  <div className="text-gray-300 text-sm">Followers</div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-400">{analysis.analysis.activityScore.score}</div>
                  <div className="text-gray-300 text-sm">Activity Score</div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-cyan-400 mb-3">🏆 Top Languages</h3>
                <div className="space-y-2">
                  {analysis.analysis.languages.slice(0, 5).map((lang: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-300">{lang.language}</span>
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-sm">
                        {lang.count} repos
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Analysis Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-purple-500/30"
            >
              <h2 className="text-2xl font-semibold text-purple-400 mb-6">🎯 AI Analysis</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-3">💪 Strengths</h3>
                  <ul className="space-y-2">
                    {analysis.analysis.strengths.map((strength: string, index: number) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-orange-400 mb-3">🎯 Areas for Improvement</h3>
                  <ul className="space-y-2">
                    {analysis.analysis.weaknesses.map((weakness: string, index: number) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start">
                        <span className="text-orange-400 mr-2">→</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">💡 Recommendations</h3>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start">
                        <span className="text-cyan-400 mr-2">💡</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">📊 Activity Level</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{analysis.analysis.activityScore.level}</span>
                    <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${analysis.analysis.activityScore.score}%` }}
                      />
                    </div>
                    <span className="text-cyan-400 font-semibold">{analysis.analysis.activityScore.score}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {!analysis && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">🐙</div>
            <h2 className="text-2xl font-semibold text-gray-400 mb-4">
              Analyze Your GitHub Profile
            </h2>
            <p className="text-gray-500">
              Get AI-powered insights about your coding journey, skills, and areas for improvement
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}