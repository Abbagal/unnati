const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Get Assessment Questions
router.get('/questions/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const questions = getAssessmentQuestions(type);
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit Assessment
router.post('/submit', async (req, res) => {
  try {
    const { type, answers } = req.body;
    const userId = req.user.id;

    // Calculate results based on answers
    const results = calculateAssessmentResults(type, answers);
    
    // Save assessment
    const assessment = await prisma.assessment.create({
      data: {
        userId,
        type,
        questions: getAssessmentQuestions(type),
        answers,
        results,
        score: results.overallScore
      }
    });

    res.json({
      success: true,
      results,
      recommendations: generateRecommendations(results)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assessment Questions Database
function getAssessmentQuestions(type) {
  const questionBank = {
    'skills': [
      {
        id: 1,
        question: "How comfortable are you with programming?",
        options: ["Beginner", "Intermediate", "Advanced", "Expert"],
        category: "technical"
      },
      {
        id: 2,
        question: "Which programming language interests you most?",
        options: ["JavaScript", "Python", "Java", "C++"],
        category: "technical"
      },
      {
        id: 3,
        question: "How do you prefer to learn new concepts?",
        options: ["Hands-on projects", "Theory first", "Video tutorials", "Reading documentation"],
        category: "learning_style"
      }
    ],
    'personality': [
      {
        id: 1,
        question: "Do you prefer working alone or in teams?",
        options: ["Strongly prefer alone", "Prefer alone", "Prefer teams", "Strongly prefer teams"],
        category: "collaboration"
      },
      {
        id: 2,
        question: "How do you handle challenging problems?",
        options: ["Break into smaller parts", "Research extensively", "Ask for help", "Trial and error"],
        category: "problem_solving"
      }
    ],
    'interests': [
      {
        id: 1,
        question: "What type of projects excite you most?",
        options: ["Web applications", "Mobile apps", "Data analysis", "AI/ML projects"],
        category: "project_type"
      },
      {
        id: 2,
        question: "Which industry interests you?",
        options: ["Tech startups", "Finance", "Healthcare", "Gaming"],
        category: "industry"
      }
    ]
  };

  return questionBank[type] || questionBank['skills'];
}

// Calculate Assessment Results
function calculateAssessmentResults(type, answers) {
  let scores = {
    technical: 0,
    creativity: 0,
    leadership: 0,
    analytical: 0,
    communication: 0
  };

  // Simple scoring logic
  answers.forEach((answer, index) => {
    switch (answer) {
      case 'Advanced':
      case 'Expert':
        scores.technical += 3;
        break;
      case 'Intermediate':
        scores.technical += 2;
        break;
      case 'Beginner':
        scores.technical += 1;
        break;
    }
  });

  const overallScore = Object.values(scores).reduce((a, b) => a + b, 0);
  
  return {
    scores,
    overallScore,
    strengths: getTopStrengths(scores),
    careerMatches: getCareerMatches(scores)
  };
}

function getTopStrengths(scores) {
  return Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([skill]) => skill);
}

function getCareerMatches(scores) {
  const careers = [
    { role: 'Frontend Developer', match: scores.technical + scores.creativity },
    { role: 'Backend Developer', match: scores.technical + scores.analytical },
    { role: 'Data Scientist', match: scores.analytical + scores.technical },
    { role: 'Product Manager', match: scores.leadership + scores.communication }
  ];

  return careers
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);
}

function generateRecommendations(results) {
  return [
    `Your top strength is ${results.strengths[0]}`,
    `Consider focusing on ${results.careerMatches[0].role} path`,
    `Develop your ${results.strengths[2]} skills further`,
    `Take courses in areas where you scored lower`
  ];
}

module.exports = router;