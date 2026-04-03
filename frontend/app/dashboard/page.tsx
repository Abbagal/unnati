'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Scene3D from '@/components/Scene3D';
import NeonProgressBar from '@/components/NeonProgressBar';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalProgress: 65,
    skillsLearned: 12,
    projectsCompleted: 8,
    hoursSpent: 156,
    streak: 7,
    rank: 'Advanced Beginner'
  });

  // Mock data for demonstration
  const recentActivities = [
    { id: 1, type: 'course', title: 'Completed React Fundamentals', time: '2 hours ago', icon: '📚' },
    { id: 2, type: 'project', title: 'Built Todo App with TypeScript', time: '1 day ago', icon: '🚀' },
    { id: 3, type: 'skill', title: 'Mastered JavaScript ES6+', time: '2 days ago', icon: '⚡' },
    { id: 4, type: 'assessment', title: 'Completed Frontend Assessment', time: '3 days ago', icon: '🎯' }
  ];

  const currentGoals = [
    { id: 1, title: 'Master React Ecosystem', progress: 75, deadline: '2 weeks', priority: 'high' },
    { id: 2, title: 'Build Full-Stack Project', progress: 40, deadline: '1 month', priority: 'medium' },
    { id: 3, title: 'Learn System Design', progress: 20, deadline: '6 weeks', priority: 'low' }
  ];

  const skillProgress = [
    { skill: 'JavaScript', level: 8, maxLevel: 10, color: '#f7df1e' },
    { skill: 'React', level: 7, maxLevel: 10, color: '#61dafb' },
    { skill: 'Node.js', level: 6, maxLevel: 10, color: '#339933' },
    { skill: 'TypeScript', level: 5, maxLevel: 10, color: '#3178c6' },
    { skill: 'Python', level: 4, maxLevel: 10, color: '#3776ab' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Tech Interview Prep Session', date: 'Tomorrow', type: 'workshop' },
    { id: 2, title: 'React Advanced Patterns', date: 'Mar 15', type: 'course' },
    { id: 3, title: 'System Design Mock Interview', date: 'Mar 18', type: 'assessment' }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <Scene3D />
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            animate={{
              x: [0, Math.random() * 100, 0],
              y: [0, Math.random() * 100, 0],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Career Dashboard
          </h1>
          <p className="text-gray-400 text-lg">Track your engineering journey to success</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Progress', value: `${stats.totalProgress}%`, icon: '📈', color: 'cyan' },
            { label: 'Skills', value: stats.skillsLearned, icon: '⚡', color: 'purple' },
            { label: 'Projects', value: stats.projectsCompleted, icon: '🚀', color: 'pink' },
            { label: 'Hours', value: stats.hoursSpent, icon: '⏰', color: 'green' },
            { label: 'Streak', value: `${stats.streak} days`, icon: '🔥', color: 'orange' },
            { label: 'Rank', value: stats.rank, icon: '🏆', color: 'yellow' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gray-900/50 backdrop-blur-xl p-4 rounded-xl border border-${stat.color}-500/30 hover:border-${stat.color}-500/60 transition-all cursor-pointer`}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-900/30 p-1 rounded-xl backdrop-blur-xl">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'progress', label: 'Progress', icon: '📈' },
            { id: 'goals', label: 'Goals', icon: '🎯' },
            { id: 'activities', label: 'Activities', icon: '⚡' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Quick Actions */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-cyan-500/30">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-4">🚀 Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { title: 'AI Career System', desc: 'Get personalized roadmap', href: '/ai-career-system', color: 'cyan' },
                      { title: 'GitHub Analyzer', desc: 'Analyze your profile', href: '/github-analyzer', color: 'purple' },
                      { title: 'Take Assessment', desc: 'Test your skills', href: '/assessment', color: 'pink' },
                      { title: 'AI Chat', desc: 'Get instant help', href: '/chat', color: 'green' }
                    ].map((action, index) => (
                      <Link key={action.title} href={action.href}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className={`p-4 bg-gray-800/50 rounded-xl border border-${action.color}-500/30 hover:border-${action.color}-500/60 transition-all cursor-pointer`}
                        >
                          <h4 className={`font-semibold text-${action.color}-400 mb-1`}>{action.title}</h4>
                          <p className="text-gray-400 text-sm">{action.desc}</p>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/30">
                  <h3 className="text-2xl font-bold text-purple-400 mb-4">⚡ Recent Activities</h3>
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all"
                      >
                        <div className="text-2xl mr-3">{activity.icon}</div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{activity.title}</div>
                          <div className="text-gray-400 text-sm">{activity.time}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Upcoming Events */}
                <div className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-pink-500/30">
                  <h3 className="text-xl font-bold text-pink-400 mb-4">📅 Upcoming</h3>
                  <div className="space-y-3">
                    {upcomingEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-gray-800/30 rounded-lg"
                      >
                        <div className="text-white font-medium text-sm">{event.title}</div>
                        <div className="text-pink-400 text-xs">{event.date}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Skill Overview */}
                <div className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-green-500/30">
                  <h3 className="text-xl font-bold text-green-400 mb-4">💪 Skills</h3>
                  <div className="space-y-3">
                    {skillProgress.slice(0, 3).map((skill, index) => (
                      <div key={skill.skill}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">{skill.skill}</span>
                          <span className="text-gray-400">{skill.level}/{skill.maxLevel}</span>
                        </div>
                        <NeonProgressBar 
                          value={(skill.level / skill.maxLevel) * 100} 
                          color="green"
                          showPercentage={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-cyan-500/30">
                <h3 className="text-2xl font-bold text-cyan-400 mb-6">📈 Skill Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {skillProgress.map((skill, index) => (
                    <motion.div
                      key={skill.skill}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gray-800/30 rounded-xl"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-white font-semibold">{skill.skill}</span>
                        <span className="text-gray-400">{skill.level}/{skill.maxLevel}</span>
                      </div>
                      <NeonProgressBar 
                        value={(skill.level / skill.maxLevel) * 100} 
                        color="cyan"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/30">
                <h3 className="text-2xl font-bold text-purple-400 mb-6">🎯 Current Goals</h3>
                <div className="space-y-4">
                  {currentGoals.map((goal, index) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gray-800/30 rounded-xl"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-white font-semibold">{goal.title}</h4>
                          <p className="text-gray-400 text-sm">Deadline: {goal.deadline}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          goal.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          goal.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {goal.priority}
                        </span>
                      </div>
                      <NeonProgressBar 
                        value={goal.progress} 
                        color="purple"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'activities' && (
            <motion.div
              key="activities"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-pink-500/30">
                <h3 className="text-2xl font-bold text-pink-400 mb-6">⚡ Activity Timeline</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all"
                    >
                      <div className="text-3xl mr-4">{activity.icon}</div>
                      <div className="flex-1">
                        <div className="text-white font-semibold">{activity.title}</div>
                        <div className="text-gray-400">{activity.time}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
