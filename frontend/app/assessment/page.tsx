'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Scene3D from '@/components/Scene3D';

const questions = [
  {
    id: 1,
    question: "What interests you most?",
    options: ["Web Development", "Mobile Apps", "Data Science", "DevOps"]
  },
  {
    id: 2,
    question: "Your preferred programming language?",
    options: ["JavaScript", "Python", "Java", "C++"]
  },
  {
    id: 3,
    question: "What's your career goal?",
    options: ["Frontend Developer", "Backend Developer", "Full Stack", "Data Scientist"]
  }
];

export default function AssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Assessment complete
      console.log('Assessment complete:', newAnswers);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="absolute top-20 right-0 w-1/4 h-1/4 opacity-10">
        <Scene3D />
      </div>
      
      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold text-cyan-400 mb-8 text-center"
        >
          Career Assessment
        </motion.h1>

        <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-xl border border-cyan-500/30">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              {questions[currentQuestion]?.question}
            </h2>
            
            <div className="space-y-3">
              {questions[currentQuestion]?.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full p-4 text-left bg-gray-700/50 hover:bg-gray-600/50 rounded-lg border border-gray-600 hover:border-cyan-400 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}