const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key'
});

class AIService {
  // Generate AI-powered career roadmap with comprehensive analysis
  async generateComprehensiveRoadmap({ year, branch, skills, githubUsername, interests, goals, timeframe }) {
    try {
      const prompt = `
        Create a comprehensive ${timeframe}-month AI Career Operating System roadmap for:
        
        STUDENT PROFILE:
        - Year: ${year}/4 (${year <= 2 ? 'Early Stage' : 'Advanced Stage'})
        - Branch: ${branch}
        - Current Skills: ${skills}
        - GitHub: ${githubUsername || 'Not provided'}
        - Interests: ${interests}
        - Career Goal: ${goals}
        
        GENERATE DETAILED JSON WITH:
        
        1. SKILL GAP ANALYSIS:
        - Current skill level (1-10)
        - Required skills for goal
        - Priority skills to learn
        - Market demand score
        
        2. 3-MONTH ROADMAP:
        - Month 1: Foundation building
        - Month 2: Skill development  
        - Month 3: Portfolio & applications
        
        3. PROJECT RECOMMENDATIONS:
        - 3 beginner projects
        - 2 intermediate projects
        - 1 advanced capstone project
        - Each with tech stack, timeline, learning outcomes
        
        4. INTERNSHIP STRATEGY:
        - Target companies
        - Application timeline
        - Required preparations
        - Interview prep plan
        
        5. COURSE RECOMMENDATIONS:
        - Free courses (YouTube, freeCodeCamp)
        - Paid courses (Udemy, Coursera)
        - Certifications to pursue
        - Books and resources
        
        6. SALARY TRAJECTORY:
        - Current market rates
        - 1-year projection
        - 3-year projection
        - Factors affecting growth
        
        7. SUCCESS METRICS:
        - Weekly goals
        - Monthly milestones
        - Portfolio metrics
        - Skill assessments
        
        Make it highly specific for Indian engineering students and current market trends.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert AI Career Operating System for Indian engineering students. Provide comprehensive, actionable, and market-relevant career guidance."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.7
      });

      const aiResponse = completion.choices[0].message.content;
      
      try {
        return JSON.parse(aiResponse);
      } catch (parseError) {
        return this.getComprehensiveFallbackRoadmap({ year, branch, skills, goals, timeframe });
      }
    } catch (error) {
      console.error('Comprehensive Roadmap AI Error:', error);
      return this.getComprehensiveFallbackRoadmap({ year, branch, skills, goals, timeframe });
    }
  }

  // Comprehensive fallback roadmap
  getComprehensiveFallbackRoadmap({ year, branch, skills, goals, timeframe }) {
    const skillsArray = skills.split(',').map(s => s.trim());
    
    return {
      skillGapAnalysis: {
        currentLevel: Math.min(year * 2, 8),
        requiredSkills: this.getRequiredSkills(goals),
        prioritySkills: this.getPrioritySkills(goals, skillsArray),
        marketDemand: this.getMarketDemand(goals)
      },
      roadmap: {
        month1: {
          title: "Foundation & Skill Building",
          focus: "Core technologies and fundamentals",
          goals: [
            "Master fundamental concepts",
            "Set up development environment", 
            "Complete first project"
          ],
          projects: ["Personal Portfolio", "Basic CRUD App"],
          courses: ["JavaScript Fundamentals", "Git & GitHub"],
          timeAllocation: "40 hours/week"
        },
        month2: {
          title: "Advanced Development & Portfolio",
          focus: "Complex projects and real-world applications",
          goals: [
            "Build 2 intermediate projects",
            "Learn advanced frameworks",
            "Start open source contributions"
          ],
          projects: ["E-commerce Platform", "Real-time Chat App"],
          courses: ["React Advanced", "Node.js Backend"],
          timeAllocation: "45 hours/week"
        },
        month3: {
          title: "Job Preparation & Applications",
          focus: "Interview prep and job applications",
          goals: [
            "Complete capstone project",
            "Apply to 50+ companies",
            "Ace technical interviews"
          ],
          projects: ["Full-stack Capstone Project"],
          courses: ["System Design", "Interview Preparation"],
          timeAllocation: "50 hours/week"
        }
      },
      projectRecommendations: [
        {
          name: "Personal Portfolio Website",
          difficulty: "Beginner",
          techStack: ["HTML", "CSS", "JavaScript"],
          timeline: "1 week",
          learningOutcomes: ["Web fundamentals", "Responsive design", "Deployment"]
        },
        {
          name: "Task Management App",
          difficulty: "Intermediate", 
          techStack: ["React", "Node.js", "MongoDB"],
          timeline: "3 weeks",
          learningOutcomes: ["Full-stack development", "Database design", "API creation"]
        },
        {
          name: "Real-time Collaboration Platform",
          difficulty: "Advanced",
          techStack: ["React", "Socket.io", "Redis", "Docker"],
          timeline: "6 weeks", 
          learningOutcomes: ["Real-time systems", "Scalability", "DevOps"]
        }
      ],
      internshipStrategy: {
        targetCompanies: ["TCS", "Infosys", "Wipro", "Accenture", "Startups"],
        applicationTimeline: "Month 2-3",
        preparations: ["Resume optimization", "Portfolio completion", "Mock interviews"],
        interviewPrep: ["Data structures", "System design", "Behavioral questions"]
      },
      courseRecommendations: {
        free: [
          "freeCodeCamp Full Stack",
          "YouTube - Traversy Media",
          "MDN Web Docs"
        ],
        paid: [
          "The Complete Web Developer Course (Udemy)",
          "React - The Complete Guide (Udemy)",
          "Node.js Developer Course (Udemy)"
        ],
        certifications: [
          "AWS Cloud Practitioner",
          "Google Cloud Associate",
          "MongoDB Developer"
        ]
      },
      salaryTrajectory: {
        current: `₹${this.getSalaryRange(goals, year).min}-${this.getSalaryRange(goals, year).max} LPA`,
        year1: `₹${this.getSalaryRange(goals, year + 1).min}-${this.getSalaryRange(goals, year + 1).max} LPA`,
        year3: `₹${this.getSalaryRange(goals, year + 3).min}-${this.getSalaryRange(goals, year + 3).max} LPA`,
        factors: ["Skill level", "Company size", "Location", "Market demand"]
      },
      successMetrics: {
        weekly: ["Complete 2 coding challenges", "Study 10 hours", "Build 1 mini project"],
        monthly: ["Complete 1 major project", "Apply to 15 companies", "Learn 1 new technology"],
        portfolio: ["5+ projects", "Clean GitHub profile", "Live deployments"],
        skills: ["Technical interviews", "System design", "Problem solving"]
      },
      insights: [
        `Based on your ${year} year ${branch} profile, focus on practical projects`,
        `${goals} has ${this.getMarketDemand(goals)}% market demand growth`,
        `Your current skills give you a ${Math.min(year * 20 + 20, 80)}% job readiness score`,
        `Recommended focus: ${this.getPrioritySkills(goals, skillsArray).slice(0, 2).join(', ')}`
      ]
    };
  }

  // Helper methods for comprehensive roadmap
  getRequiredSkills(goal) {
    const skillMap = {
      'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Webpack'],
      'Backend Developer': ['Node.js', 'Python', 'Databases', 'APIs', 'Docker', 'AWS'],
      'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'Databases', 'Git', 'Docker'],
      'Data Scientist': ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Pandas', 'Visualization'],
      'DevOps Engineer': ['Linux', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Monitoring'],
      'Mobile Developer': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'APIs', 'App Store']
    };
    return skillMap[goal] || skillMap['Full Stack Developer'];
  }

  getPrioritySkills(goal, currentSkills) {
    const required = this.getRequiredSkills(goal);
    return required.filter(skill => 
      !currentSkills.some(current => 
        current.toLowerCase().includes(skill.toLowerCase())
      )
    ).slice(0, 5);
  }

  getMarketDemand(goal) {
    const demandMap = {
      'Frontend Developer': 85,
      'Backend Developer': 90,
      'Full Stack Developer': 95,
      'Data Scientist': 88,
      'DevOps Engineer': 92,
      'Mobile Developer': 80
    };
    return demandMap[goal] || 85;
  }

  getSalaryRange(goal, year) {
    const baseRanges = {
      'Frontend Developer': { min: 4, max: 8 },
      'Backend Developer': { min: 5, max: 10 },
      'Full Stack Developer': { min: 6, max: 12 },
      'Data Scientist': { min: 7, max: 15 },
      'DevOps Engineer': { min: 8, max: 16 },
      'Mobile Developer': { min: 5, max: 10 }
    };
    
    const base = baseRanges[goal] || baseRanges['Full Stack Developer'];
    const multiplier = Math.min(year * 0.5 + 1, 2.5);
    
    return {
      min: Math.round(base.min * multiplier),
      max: Math.round(base.max * multiplier)
    };
  }

  // Analyze GitHub profile with AI insights
  async analyzeGitHubProfile(githubData) {
    try {
      const { user, repos } = githubData;
      
      const prompt = `
        Analyze this GitHub profile and provide detailed insights:
        
        Profile: ${user.name || user.login}
        Public Repos: ${user.public_repos}
        Followers: ${user.followers}
        Account Age: ${Math.floor((Date.now() - new Date(user.created_at)) / (1000 * 60 * 60 * 24 * 365))} years
        
        Top Repositories:
        ${repos.slice(0, 10).map(repo => 
          `- ${repo.name}: ${repo.language || 'No language'}, ${repo.stargazers_count} stars, ${repo.description || 'No description'}`
        ).join('\n')}
        
        Provide analysis in JSON format with:
        1. strengths (array of strings)
        2. weaknesses (array of strings)  
        3. recommendations (array of strings)
        4. careerSuggestions (array of career paths)
        5. skillGaps (array of skills to learn)
        6. overallScore (0-100)
        
        Focus on actionable insights for career growth.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system", 
            content: "You are a senior software engineer and career mentor. Analyze GitHub profiles to provide career guidance."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.6
      });

      const aiResponse = completion.choices[0].message.content;
      
      try {
        return JSON.parse(aiResponse);
      } catch (parseError) {
        return this.getFallbackGitHubAnalysis(githubData);
      }
    } catch (error) {
      console.error('GitHub Analysis AI Error:', error);
      return this.getFallbackGitHubAnalysis(githubData);
    }
  }

  // Analyze resume with AI
  async analyzeResume(resumeText) {
    try {
      const prompt = `
        Analyze this resume and provide detailed feedback:
        
        Resume Content:
        ${resumeText}
        
        Provide analysis in JSON format with:
        1. overallScore (0-100)
        2. strengths (array of strings)
        3. weaknesses (array of strings)
        4. recommendations (array of specific improvements)
        5. missingElements (array of what's missing)
        6. skillsExtracted (array of technical skills found)
        7. experienceLevel (Junior/Mid/Senior)
        8. industryFit (array of suitable industries)
        
        Focus on actionable feedback for engineering students.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert HR professional and resume reviewer. Provide constructive feedback for engineering resumes."
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.5
      });

      const aiResponse = completion.choices[0].message.content;
      
      try {
        return JSON.parse(aiResponse);
      } catch (parseError) {
        return this.getFallbackResumeAnalysis(resumeText);
      }
    } catch (error) {
      console.error('Resume Analysis AI Error:', error);
      return this.getFallbackResumeAnalysis(resumeText);
    }
  }

  // Career chat assistant
  async chatResponse(message, context = {}) {
    try {
      const prompt = `
        User message: ${message}
        
        Context: ${JSON.stringify(context)}
        
        You are an AI career counselor for engineering students. Provide helpful, encouraging, and actionable advice.
        Keep responses concise but informative. Focus on practical next steps.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a friendly and knowledgeable career counselor specializing in engineering careers. Be encouraging, practical, and specific in your advice."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Chat AI Error:', error);
      return "I'm here to help with your career questions! Could you please rephrase your question?";
    }
  }

  // Fallback methods when AI is not available
  getFallbackRoadmap({ year, branch, skills, goals, timeframe }) {
    const skillsArray = skills.split(',').map(s => s.trim());
    
    return {
      milestones: [
        {
          title: `Master Core ${goals} Skills`,
          description: `Build strong foundation in ${goals} technologies and best practices`,
          category: 'Technical Skills',
          targetOutcome: `Proficiency in ${skillsArray.slice(0, 3).join(', ')} and related technologies`,
          pros: ['High demand in market', 'Good salary potential', 'Remote work opportunities'],
          cons: ['Steep learning curve', 'Rapidly changing technology'],
          actionSteps: [
            { task: `Complete ${goals} course`, duration: '3 weeks' },
            { task: 'Build 2 practice projects', duration: '4 weeks' },
            { task: 'Contribute to open source', duration: '1 week' }
          ]
        },
        {
          title: 'Build Portfolio Projects',
          description: 'Create impressive projects that showcase your skills to employers',
          category: 'Portfolio Development',
          targetOutcome: '3-4 production-ready projects with live demos',
          pros: ['Demonstrates practical skills', 'Great for interviews'],
          cons: ['Time-intensive', 'Requires self-motivation'],
          actionSteps: [
            { task: 'Plan project architecture', duration: '1 week' },
            { task: 'Develop MVP', duration: '3 weeks' },
            { task: 'Deploy and document', duration: '1 week' }
          ]
        }
      ],
      insights: [
        `Based on your ${year} year status, focus on practical projects`,
        `${branch} students have 85% success rate in ${goals} roles`,
        `Your skills in ${skillsArray.join(', ')} give you an advantage`,
        `Recommended timeline: ${timeframe} months for job readiness`
      ]
    };
  }

  getFallbackGitHubAnalysis({ user, repos }) {
    const languages = {};
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(languages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([lang]) => lang);

    return {
      strengths: [
        `Active developer with ${user.public_repos} repositories`,
        `Experienced with ${topLanguages.join(', ')}`,
        `${user.followers} followers show community engagement`
      ],
      weaknesses: [
        'Could benefit from more detailed project documentation',
        'Consider adding more diverse project types'
      ],
      recommendations: [
        'Add comprehensive README files to projects',
        'Contribute to open source projects',
        'Create projects that solve real-world problems'
      ],
      overallScore: Math.min(85, user.public_repos * 5 + user.followers * 2)
    };
  }

  getFallbackResumeAnalysis(resumeText) {
    const wordCount = resumeText.split(' ').length;
    const hasProjects = resumeText.toLowerCase().includes('project');
    const hasSkills = resumeText.toLowerCase().includes('skill');
    
    return {
      overallScore: hasProjects && hasSkills ? 75 : 60,
      strengths: [
        'Clear structure and formatting',
        hasProjects ? 'Includes relevant projects' : 'Professional presentation'
      ],
      weaknesses: [
        wordCount < 200 ? 'Resume could be more detailed' : 'Good length',
        !hasProjects ? 'Missing projects section' : 'Could add more quantifiable achievements'
      ],
      recommendations: [
        'Add specific metrics and achievements',
        'Include more technical projects',
        'Highlight leadership experiences'
      ],
      experienceLevel: wordCount > 500 ? 'Mid-level' : 'Junior'
    };
  }
}

module.exports = new AIService();