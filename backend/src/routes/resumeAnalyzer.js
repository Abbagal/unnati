const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/resumes/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

// Upload and Analyze Resume
router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    const userId = req.user.id;
    const resumePath = req.file.path;
    
    // Extract text from resume (simplified - in production use proper PDF/DOC parsers)
    const resumeText = await extractTextFromResume(resumePath);
    
    // Analyze resume content
    const analysis = analyzeResumeContent(resumeText);
    
    // Update user profile
    await prisma.profile.upsert({
      where: { userId },
      update: {
        resumeUrl: resumePath,
        resumeAnalysis: JSON.stringify(analysis)
      },
      create: {
        userId,
        resumeUrl: resumePath,
        resumeAnalysis: JSON.stringify(analysis),
        skills: '',
        interests: ''
      }
    });

    res.json({
      success: true,
      analysis,
      recommendations: generateResumeRecommendations(analysis),
      score: calculateResumeScore(analysis)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Extract text from resume (simplified version)
async function extractTextFromResume(filePath) {
  // In production, use libraries like pdf-parse, mammoth, etc.
  // For now, return mock text for demonstration
  return `
    John Doe
    Software Engineer
    Email: john@example.com
    Phone: +1234567890
    
    EXPERIENCE
    Software Developer at Tech Corp (2022-2024)
    - Developed web applications using React and Node.js
    - Collaborated with cross-functional teams
    - Improved application performance by 30%
    
    EDUCATION
    Bachelor of Technology in Computer Science
    XYZ University (2018-2022)
    CGPA: 8.5/10
    
    SKILLS
    JavaScript, Python, React, Node.js, MongoDB, Git
    
    PROJECTS
    E-commerce Website - Built using MERN stack
    Task Management App - React Native mobile application
  `;
}

// Analyze Resume Content
function analyzeResumeContent(resumeText) {
  const text = resumeText.toLowerCase();
  
  // Extract sections
  const sections = {
    hasContactInfo: checkContactInfo(text),
    hasExperience: text.includes('experience') || text.includes('work'),
    hasEducation: text.includes('education') || text.includes('degree'),
    hasSkills: text.includes('skills') || text.includes('technologies'),
    hasProjects: text.includes('projects') || text.includes('portfolio'),
    hasCertifications: text.includes('certification') || text.includes('certified')
  };
  
  // Extract skills
  const skills = extractSkills(text);
  
  // Calculate experience level
  const experienceLevel = calculateExperienceLevel(text);
  
  // Check formatting and structure
  const formatting = analyzeFormatting(resumeText);
  
  // Analyze content quality
  const contentQuality = analyzeContentQuality(text);
  
  return {
    sections,
    skills,
    experienceLevel,
    formatting,
    contentQuality,
    wordCount: resumeText.split(' ').length,
    strengthAreas: identifyStrengthAreas(skills, text),
    improvementAreas: identifyImprovementAreas(sections, contentQuality)
  };
}

function checkContactInfo(text) {
  const hasEmail = /@/.test(text);
  const hasPhone = /\+?\d{10,}/.test(text);
  return { hasEmail, hasPhone, complete: hasEmail && hasPhone };
}

function extractSkills(text) {
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'node.js', 'angular', 'vue',
    'html', 'css', 'mongodb', 'mysql', 'postgresql', 'git', 'docker',
    'kubernetes', 'aws', 'azure', 'machine learning', 'data science'
  ];
  
  const foundSkills = commonSkills.filter(skill => text.includes(skill));
  
  return {
    technical: foundSkills,
    count: foundSkills.length,
    categories: categorizeSkills(foundSkills)
  };
}

function categorizeSkills(skills) {
  const categories = {
    'Frontend': ['javascript', 'react', 'angular', 'vue', 'html', 'css'],
    'Backend': ['node.js', 'python', 'java', 'express'],
    'Database': ['mongodb', 'mysql', 'postgresql'],
    'DevOps': ['docker', 'kubernetes', 'aws', 'azure', 'git'],
    'Data Science': ['machine learning', 'data science', 'python']
  };
  
  const result = {};
  Object.entries(categories).forEach(([category, categorySkills]) => {
    const matches = skills.filter(skill => categorySkills.includes(skill));
    if (matches.length > 0) {
      result[category] = matches;
    }
  });
  
  return result;
}

function calculateExperienceLevel(text) {
  const yearMatches = text.match(/(\d{4})/g) || [];
  const currentYear = new Date().getFullYear();
  const years = yearMatches.map(year => parseInt(year)).filter(year => year > 2000 && year <= currentYear);
  
  if (years.length >= 4) {
    const experienceYears = currentYear - Math.min(...years);
    return {
      years: experienceYears,
      level: experienceYears > 5 ? 'Senior' : experienceYears > 2 ? 'Mid-level' : 'Junior'
    };
  }
  
  return { years: 0, level: 'Entry-level' };
}

function analyzeFormatting(text) {
  return {
    length: text.length,
    isAppropriateLength: text.length > 500 && text.length < 3000,
    hasStructure: text.includes('\n') && text.split('\n').length > 10,
    readability: calculateReadabilityScore(text)
  };
}

function calculateReadabilityScore(text) {
  const sentences = text.split(/[.!?]+/).length;
  const words = text.split(' ').length;
  const avgWordsPerSentence = words / sentences;
  
  // Simple readability score (0-100)
  return Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 15) * 2));
}

function analyzeContentQuality(text) {
  const actionWords = ['developed', 'created', 'implemented', 'designed', 'managed', 'led', 'improved'];
  const quantifiers = text.match(/\d+%|\d+x|increased|decreased|reduced/g) || [];
  
  return {
    hasActionWords: actionWords.some(word => text.includes(word)),
    hasQuantifiableResults: quantifiers.length > 0,
    quantifierCount: quantifiers.length,
    overallQuality: actionWords.some(word => text.includes(word)) && quantifiers.length > 0 ? 'Good' : 'Needs Improvement'
  };
}

function identifyStrengthAreas(skills, text) {
  const strengths = [];
  
  if (skills.count > 8) strengths.push('Strong technical skill set');
  if (text.includes('team') || text.includes('collaboration')) strengths.push('Team collaboration experience');
  if (text.includes('project') && text.includes('led')) strengths.push('Leadership experience');
  if (skills.categories['Frontend'] && skills.categories['Backend']) strengths.push('Full-stack capabilities');
  
  return strengths.length > 0 ? strengths : ['Shows technical foundation'];
}

function identifyImprovementAreas(sections, contentQuality) {
  const improvements = [];
  
  if (!sections.hasProjects) improvements.push('Add relevant projects section');
  if (!sections.hasCertifications) improvements.push('Include relevant certifications');
  if (!contentQuality.hasQuantifiableResults) improvements.push('Add quantifiable achievements');
  if (!contentQuality.hasActionWords) improvements.push('Use more action-oriented language');
  
  return improvements.length > 0 ? improvements : ['Overall strong resume structure'];
}

function generateResumeRecommendations(analysis) {
  const recommendations = [];
  
  // Section-based recommendations
  if (!analysis.sections.hasProjects) {
    recommendations.push('Add a projects section showcasing your practical work');
  }
  
  if (analysis.skills.count < 5) {
    recommendations.push('Include more relevant technical skills');
  }
  
  if (!analysis.contentQuality.hasQuantifiableResults) {
    recommendations.push('Add specific metrics and achievements (e.g., "Improved performance by 30%")');
  }
  
  if (!analysis.formatting.isAppropriateLength) {
    if (analysis.formatting.length < 500) {
      recommendations.push('Expand your resume with more detailed descriptions');
    } else {
      recommendations.push('Consider condensing your resume to 1-2 pages');
    }
  }
  
  // Skill-based recommendations
  const skillCategories = Object.keys(analysis.skills.categories);
  if (skillCategories.length < 2) {
    recommendations.push('Diversify your skill set across different technology areas');
  }
  
  recommendations.push('Ensure your contact information is clearly visible');
  recommendations.push('Use consistent formatting and professional language');
  
  return recommendations;
}

function calculateResumeScore(analysis) {
  let score = 0;
  
  // Section completeness (40 points)
  if (analysis.sections.hasContactInfo.complete) score += 8;
  if (analysis.sections.hasExperience) score += 8;
  if (analysis.sections.hasEducation) score += 8;
  if (analysis.sections.hasSkills) score += 8;
  if (analysis.sections.hasProjects) score += 8;
  
  // Skills (20 points)
  score += Math.min(20, analysis.skills.count * 2);
  
  // Content quality (25 points)
  if (analysis.contentQuality.hasActionWords) score += 10;
  if (analysis.contentQuality.hasQuantifiableResults) score += 15;
  
  // Formatting (15 points)
  if (analysis.formatting.isAppropriateLength) score += 8;
  if (analysis.formatting.readability > 70) score += 7;
  
  return {
    score: Math.min(100, score),
    grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F',
    level: score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 55 ? 'Average' : 'Needs Improvement'
  };
}

module.exports = router;