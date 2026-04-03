'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Scene3D from '../components/Scene3D'
import ParticleField from '../components/ParticleField'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Animated Particle Background */}
      <ParticleField />
      
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Scene3D />
      </div>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="text-center max-w-6xl mx-auto">
            {/* Floating Logo */}
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, type: "spring" }}
              className="mb-8"
            >
              <div className="text-8xl mb-4">🚀</div>
              <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                CAREER
              </h1>
              <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                GUIDE
              </h1>
            </motion.div>

            {/* Subtitle with Typewriter Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mb-12"
            >
              <p className="text-2xl md:text-4xl text-gray-300 mb-4">
                Next-Gen AI-Powered Career Guidance
              </p>
              <p className="text-lg md:text-xl text-gray-400">
                Transform your engineering journey with personalized roadmaps, AI insights, and futuristic tools
              </p>
            </motion.div>

            {/* Glowing CTA Buttons */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link href="/ai-career-system">
                <motion.button
                  whileHover={{ 
                    scale: 1.1, 
                    boxShadow: "0 0 50px #00ffff",
                    textShadow: "0 0 20px #00ffff"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-xl font-bold text-white border-2 border-cyan-400 hover:border-cyan-300 transition-all duration-300 shadow-lg shadow-cyan-500/50"
                >
                  🤖 AI CAREER OPERATING SYSTEM
                </motion.button>
              </Link>
              
              <Link href="/roadmap-generator">
                <motion.button
                  whileHover={{ 
                    scale: 1.1, 
                    boxShadow: "0 0 50px #ff00ff",
                    textShadow: "0 0 20px #ff00ff"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full text-xl font-bold text-white border-2 border-purple-400 hover:border-purple-300 transition-all duration-300 shadow-lg shadow-purple-500/50"
                >
                   AI ROADMAP
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Floating Feature Cards */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
            >
              Next-Gen Features
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  icon: '🤖', 
                  title: 'AI Roadmap Generator', 
                  desc: 'Personalized 3-month career paths powered by advanced AI',
                  color: 'from-cyan-500 to-blue-600',
                  delay: 0.1
                },
                { 
                  icon: '📊', 
                  title: 'GitHub Analyzer', 
                  desc: 'Deep analysis of your coding profile with actionable insights',
                  color: 'from-purple-500 to-pink-600',
                  delay: 0.2
                },
                { 
                  icon: '📝', 
                  title: 'Smart Assessment', 
                  desc: 'AI-driven personality and skill evaluation system',
                  color: 'from-green-500 to-teal-600',
                  delay: 0.3
                },
                { 
                  icon: '💬', 
                  title: 'AI Career Coach', 
                  desc: '24/7 intelligent guidance for your engineering journey',
                  color: 'from-orange-500 to-red-600',
                  delay: 0.4
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 100, rotateX: -30 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: feature.delay, duration: 0.8 }}
                  whileHover={{ 
                    y: -20, 
                    rotateY: 10,
                    boxShadow: "0 20px 40px rgba(0,255,255,0.3)"
                  }}
                  className="relative group"
                >
                  <div className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-700 hover:border-cyan-400 transition-all duration-500 h-full">
                    {/* Glowing Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section with Animated Numbers */}
        <section className="py-20 px-6 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold mb-16 text-white"
            >
              Trusted by Engineering Students Worldwide
            </motion.h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { number: '10K+', label: 'Students Guided', color: 'text-cyan-400' },
                { number: '95%', label: 'Success Rate', color: 'text-green-400' },
                { number: '500+', label: 'Career Paths', color: 'text-purple-400' },
                { number: '24/7', label: 'AI Support', color: 'text-pink-400' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                  className="text-center"
                >
                  <div className={`text-5xl font-bold ${stat.color} mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-lg">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Join thousands of engineering students who've accelerated their careers with AI-powered guidance
            </p>
            
            <Link href="/register">
              <motion.button
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 0 100px rgba(0,255,255,0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-16 py-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full text-2xl font-bold text-white shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500"
              >
                🚀 BEGIN YOUR TRANSFORMATION
              </motion.button>
            </Link>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
