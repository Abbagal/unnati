const express = require('express');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const aiService = require('../services/aiService');
const router = express.Router();
const prisma = new PrismaClient();

// Analyze GitHub Profile with AI
router.post('/analyze', async (req, res) => {
  try {
    const { githubUsername } = req.body;
    const userId = req.user.id;

    // Fetch GitHub data
    const githubData = await fetchGitHubData(githubUsername);
    
    // Get basic analysis
    const basicAnalysis = analyzeGitHubProfile(githubData);
    
    // Get AI-powered insights
    const aiAnalysis = await aiService.analyzeGitHubProfile(githubData);
    
    // Combine analyses
    const combinedAnalysis = {
      ...basicAnalysis,
      aiInsights: aiAnalysis,
      enhancedRecommendations: aiAnalysis.recommendations || basicAnalysis.recommendations,
      careerSuggestions: aiAnalysis.careerSuggestions || [],
      skillGaps: aiAnalysis.skillGaps || [],
      overallScore: aiAnalysis.overallScore || basicAnalysis.activityScore.score
    };
    
    // Update user profile with GitHub analysis
    await prisma.profile.upsert({
      where: { userId },
      update: {
        githubUsername,
        githubAnalysis: JSON.stringify(combinedAnalysis)
      },
      create: {
        userId,
        githubUsername,
        githubAnalysis: JSON.stringify(combinedAnalysis),
        skills: '',
        interests: ''
      }
    });

    res.json({
      success: true,
      analysis: combinedAnalysis,
      recommendations: aiAnalysis.recommendations || generateGitHubRecommendations(basicAnalysis),
      metadata: {
        analyzedBy: 'AI + Analytics',
        confidence: 0.9,
        lastAnalyzed: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('GitHub analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze GitHub profile',
      message: error.message 
    });
  }
});

// Get GitHub trending repositories for inspiration
router.get('/trending/:language?', async (req, res) => {
  try {
    const { language } = req.params;
    const languageQuery = language ? `+language:${language}` : '';
    
    const response = await axios.get(
      `https://api.github.com/search/repositories?q=created:>2024-01-01${languageQuery}&sort=stars&order=desc&per_page=10`
    );

    const trendingRepos = response.data.items.map(repo => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      url: repo.html_url,
      topics: repo.topics
    }));

    res.json({
      success: true,
      trending: trendingRepos,
      language: language || 'all'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch GitHub Data with enhanced metrics
async function fetchGitHubData(username) {
  try {
    const [userResponse, reposResponse, eventsResponse] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`),
      axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50`),
      axios.get(`https://api.github.com/users/${username}/events/public?per_page=30`).catch(() => ({ data: [] }))
    ]);

    return {
      user: userResponse.data,
      repos: reposResponse.data,
      events: eventsResponse.data || []
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('GitHub profile not found');
    }
    throw new Error('GitHub API error: ' + error.message);
  }
}

// Enhanced GitHub Profile Analysis
function analyzeGitHubProfile({ user, repos, events }) {
  // Calculate comprehensive metrics
  const totalRepos = repos.length;
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  
  // Analyze languages with weights
  const languages = {};
  repos.forEach(repo => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });

  const topLanguages = Object.entries(languages)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([lang, count]) => ({ language: lang, count, percentage: Math.round((count / totalRepos) * 100) }));

  // Analyze commit frequency from events
  const recentCommits = events.filter(event => event.type === 'PushEvent').length;
  const commitFrequency = calculateCommitFrequency(events);
  
  // Analyze project types and complexity
  const projectTypes = categorizeProjects(repos);
  const complexityScore = calculateComplexityScore(repos);
  
  // Calculate activity score with multiple factors
  const activityScore = calculateEnhancedActivityScore(user, repos, events);
  
  // Analyze code quality indicators
  const qualityMetrics = analyzeCodeQuality(repos);
  
  // Collaboration metrics
  const collaborationScore = calculateCollaborationScore(repos, user);

  return {
    overview: {
      totalRepos,
      totalStars,
      totalForks,
      followers: user.followers,
      following: user.following,
      accountAge: Math.floor((Date.now() - new Date(user.created_at)) / (1000 * 60 * 60 * 24 * 365)),
      recentCommits,
      commitFrequency
    },
    languages: topLanguages,
    projectTypes,
    activityScore,
    qualityMetrics,
    collaborationScore,
    complexityScore,
    strengths: identifyStrengths({ totalRepos, totalStars, topLanguages, activityScore, qualityMetrics }),
    weaknesses: identifyWeaknesses({ totalRepos, totalStars, qualityMetrics, collaborationScore }),
    techStack: analyzeTechStack(repos),
    careerReadiness: assessCareerReadiness({ totalRepos, totalStars, qualityMetrics, complexityScore })
  };
}

function calculateCommitFrequency(events) {
  const pushEvents = events.filter(event => event.type === 'PushEvent');
  const daysWithCommits = new Set(pushEvents.map(event => 
    new Date(event.created_at).toDateString()
  )).size;
  
  return {
    recentDays: daysWithCommits,
    frequency: daysWithCommits > 20 ? 'Very Active' : daysWithCommits > 10 ? 'Active' : daysWithCommits > 5 ? 'Moderate' : 'Low'
  };
}

function calculateComplexityScore(repos) {
  let score = 0;
  
  repos.forEach(repo => {
    // Size indicators
    if (repo.size > 10000) score += 3;
    else if (repo.size > 1000) score += 2;
    else if (repo.size > 100) score += 1;
    
    // Collaboration indicators
    if (repo.forks_count > 5) score += 2;
    if (repo.stargazers_count > 10) score += 2;
    
    // Documentation
    if (repo.description && repo.description.length > 50) score += 1;
  });
  
  return Math.min(100, score);
}

function calculateEnhancedActivityScore(user, repos, events) {
  const recentRepos = repos.filter(repo => 
    new Date(repo.updated_at) > new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
  ).length;
  
  const recentEvents = events.length;
  const consistencyBonus = events.length > 20 ? 10 : 0;
  
  const score = Math.min(100, 
    (recentRepos * 8) + 
    (user.public_repos * 2) + 
    (recentEvents * 1) + 
    consistencyBonus
  );
  
  return {
    score,
    level: score > 80 ? 'Very Active' : score > 60 ? 'Active' : score > 40 ? 'Moderate' : 'Low',
    factors: {
      recentRepos,
      totalRepos: user.public_repos,
      recentActivity: recentEvents
    }
  };
}

function calculateCollaborationScore(repos, user) {
  const forkedRepos = repos.filter(repo => repo.fork).length;
  const originalRepos = repos.filter(repo => !repo.fork).length;
  const reposWithContributors = repos.filter(repo => repo.forks_count > 0).length;
  
  const score = Math.min(100, 
    (forkedRepos * 5) + 
    (reposWithContributors * 10) + 
    (user.followers * 2)
  );
  
  return {
    score,
    level: score > 70 ? 'Highly Collaborative' : score > 40 ? 'Collaborative' : score > 20 ? 'Somewhat Collaborative' : 'Individual',
    metrics: {
      forkedRepos,
      originalRepos,
      reposWithContributors
    }
  };
}

function analyzeTechStack(repos) {
  const frameworks = {};
  const tools = {};
  
  repos.forEach(repo => {
    const name = repo.name.toLowerCase();
    const description = (repo.description || '').toLowerCase();
    
    // Detect frameworks
    if (name.includes('react') || description.includes('react')) frameworks['React'] = (frameworks['React'] || 0) + 1;
    if (name.includes('vue') || description.includes('vue')) frameworks['Vue.js'] = (frameworks['Vue.js'] || 0) + 1;
    if (name.includes('angular') || description.includes('angular')) frameworks['Angular'] = (frameworks['Angular'] || 0) + 1;
    if (name.includes('node') || description.includes('node')) frameworks['Node.js'] = (frameworks['Node.js'] || 0) + 1;
    if (name.includes('django') || description.includes('django')) frameworks['Django'] = (frameworks['Django'] || 0) + 1;
    if (name.includes('flask') || description.includes('flask')) frameworks['Flask'] = (frameworks['Flask'] || 0) + 1;
    
    // Detect tools
    if (name.includes('docker') || description.includes('docker')) tools['Docker'] = (tools['Docker'] || 0) + 1;
    if (name.includes('kubernetes') || description.includes('k8s')) tools['Kubernetes'] = (tools['Kubernetes'] || 0) + 1;
    if (description.includes('aws') || description.includes('amazon')) tools['AWS'] = (tools['AWS'] || 0) + 1;
  });
  
  return {
    frameworks: Object.entries(frameworks).sort(([,a], [,b]) => b - a).slice(0, 5),
    tools: Object.entries(tools).sort(([,a], [,b]) => b - a).slice(0, 5)
  };
}

function assessCareerReadiness({ totalRepos, totalStars, qualityMetrics, complexityScore }) {
  let readinessScore = 0;
  
  // Portfolio size
  if (totalRepos >= 10) readinessScore += 25;
  else if (totalRepos >= 5) readinessScore += 15;
  else if (totalRepos >= 3) readinessScore += 10;
  
  // Quality indicators
  if (qualityMetrics.documentationScore > 70) readinessScore += 20;
  if (qualityMetrics.maintenanceScore > 60) readinessScore += 15;
  
  // Complexity and impact
  if (complexityScore > 50) readinessScore += 20;
  if (totalStars > 20) readinessScore += 20;
  
  return {
    score: readinessScore,
    level: readinessScore >= 80 ? 'Job Ready' : readinessScore >= 60 ? 'Nearly Ready' : readinessScore >= 40 ? 'Developing' : 'Beginner',
    recommendations: getCareerReadinessRecommendations(readinessScore)
  };
}

function getCareerReadinessRecommendations(score) {
  if (score >= 80) {
    return ['Start applying for jobs', 'Prepare for technical interviews', 'Network with industry professionals'];
  } else if (score >= 60) {
    return ['Add 2-3 more complex projects', 'Improve documentation', 'Contribute to open source'];
  } else if (score >= 40) {
    return ['Build more diverse projects', 'Focus on code quality', 'Learn industry-standard tools'];
  } else {
    return ['Start with basic projects', 'Learn fundamental programming concepts', 'Build a consistent coding habit'];
  }
}

// Keep existing helper functions but enhance them
function categorizeProjects(repos) {
  const categories = {
    'Web Development': 0,
    'Mobile Development': 0,
    'Data Science': 0,
    'Machine Learning': 0,
    'DevOps': 0,
    'Game Development': 0,
    'Desktop Applications': 0,
    'Other': 0
  };

  repos.forEach(repo => {
    const name = repo.name.toLowerCase();
    const description = (repo.description || '').toLowerCase();
    const language = repo.language || '';

    if (language.includes('JavaScript') || language.includes('TypeScript') || 
        name.includes('web') || name.includes('react') || name.includes('vue') || name.includes('angular')) {
      categories['Web Development']++;
    } else if (language.includes('Swift') || language.includes('Kotlin') || language.includes('Dart') ||
               name.includes('android') || name.includes('ios') || name.includes('flutter')) {
      categories['Mobile Development']++;
    } else if (language.includes('Python') && (description.includes('data') || 
               description.includes('analysis') || name.includes('data') || description.includes('pandas'))) {
      categories['Data Science']++;
    } else if (description.includes('machine learning') || description.includes('ai') || 
               name.includes('ml') || name.includes('neural') || description.includes('tensorflow')) {
      categories['Machine Learning']++;
    } else if (name.includes('docker') || name.includes('kubernetes') || 
               description.includes('devops') || description.includes('ci/cd') || name.includes('terraform')) {
      categories['DevOps']++;
    } else if (language.includes('C#') || language.includes('Unity') || 
               description.includes('game') || name.includes('game')) {
      categories['Game Development']++;
    } else if (language.includes('C++') || language.includes('Java') || language.includes('C') ||
               description.includes('desktop') || name.includes('gui')) {
      categories['Desktop Applications']++;
    } else {
      categories['Other']++;
    }
  });

  return Object.entries(categories)
    .map(([category, count]) => ({ category, count, percentage: Math.round((count / repos.length) * 100) }))
    .sort((a, b) => b.count - a.count);
}

function analyzeCodeQuality(repos) {
  const hasReadme = repos.filter(repo => repo.description && repo.description.length > 10).length;
  const hasLicense = repos.filter(repo => repo.license).length;
  const recentActivity = repos.filter(repo => 
    new Date(repo.updated_at) > new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000)
  ).length;
  const hasTopics = repos.filter(repo => repo.topics && repo.topics.length > 0).length;

  return {
    documentationScore: Math.round((hasReadme / repos.length) * 100),
    licenseUsage: Math.round((hasLicense / repos.length) * 100),
    maintenanceScore: Math.round((recentActivity / repos.length) * 100),
    topicsUsage: Math.round((hasTopics / repos.length) * 100),
    overallQuality: Math.round(((hasReadme + hasLicense + hasTopics) / (repos.length * 3)) * 100)
  };
}

function identifyStrengths({ totalRepos, totalStars, topLanguages, activityScore, qualityMetrics }) {
  const strengths = [];
  
  if (totalRepos > 15) strengths.push('Prolific developer with extensive project portfolio');
  if (totalStars > 50) strengths.push('Creates popular and impactful projects');
  if (topLanguages.length > 4) strengths.push('Versatile with multiple programming languages');
  if (activityScore.score > 70) strengths.push('Consistently active and engaged developer');
  if (qualityMetrics.documentationScore > 80) strengths.push('Excellent documentation practices');
  if (qualityMetrics.overallQuality > 70) strengths.push('High code quality standards');
  
  return strengths.length > 0 ? strengths : ['Shows commitment to software development'];
}

function identifyWeaknesses({ totalRepos, totalStars, qualityMetrics, collaborationScore }) {
  const weaknesses = [];
  
  if (totalRepos < 5) weaknesses.push('Limited project portfolio - build more projects');
  if (totalStars < 10) weaknesses.push('Projects need better visibility and marketing');
  if (qualityMetrics.documentationScore < 50) weaknesses.push('Improve project documentation and README files');
  if (qualityMetrics.licenseUsage < 30) weaknesses.push('Add appropriate licenses to projects');
  if (collaborationScore.score < 30) weaknesses.push('Increase collaboration and open source contributions');
  if (qualityMetrics.topicsUsage < 40) weaknesses.push('Add relevant topics/tags to repositories');
  
  return weaknesses.length > 0 ? weaknesses : ['Continue building and improving projects'];
}

function generateGitHubRecommendations(analysis) {
  const recommendations = [];
  
  if (analysis.overview.totalRepos < 10) {
    recommendations.push('🎯 Build more projects to showcase diverse skills');
  }
  
  if (analysis.qualityMetrics.documentationScore < 70) {
    recommendations.push('📚 Add comprehensive README files with setup instructions');
  }
  
  if (analysis.languages.length < 3) {
    recommendations.push('🔧 Learn additional programming languages and frameworks');
  }
  
  if (analysis.overview.totalStars < 20) {
    recommendations.push('⭐ Focus on creating useful, shareable projects');
  }
  
  if (analysis.collaborationScore.score < 50) {
    recommendations.push('🤝 Contribute to open source projects and collaborate more');
  }
  
  recommendations.push('🚀 Add live demos and deployment links to projects');
  recommendations.push('🏷️ Use relevant topics and tags for better discoverability');
  
  return recommendations;
}

module.exports = router;