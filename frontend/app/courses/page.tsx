'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold text-cyan-400 mb-8"
        >
          Courses
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-cyan-500/30 hover:border-cyan-400 transition-all"
            >
              <h3 className="text-xl font-semibold text-cyan-400 mb-2">{course.title}</h3>
              <p className="text-gray-300 mb-4">{course.description}</p>
              <span className="text-purple-400">{course.duration}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
