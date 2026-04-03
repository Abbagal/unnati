const express = require('express');
const { PrismaClient } = require('@prisma/client');
const aiService = require('../services/aiService');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();

// AI Chat endpoint
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId;

    // Get user context for better responses
    const userProfile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { name: true, year: true, branch: true }
        }
      }
    });

    const context = {
      userName: userProfile?.user?.name || 'Student',
      year: userProfile?.user?.year,
      branch: userProfile?.user?.branch,
      skills: userProfile?.skills?.split(',') || [],
      interests: userProfile?.interests?.split(',') || [],
      careerGoals: userProfile?.careerGoals
    };

    // Get AI response
    const aiResponse = await aiService.chatResponse(message, context);

    // Save chat session
    let chatSession = await prisma.chatSession.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });

    const newMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    const aiMessage = {
      role: 'assistant', 
      content: aiResponse,
      timestamp: new Date().toISOString()
    };

    if (chatSession) {
      const existingMessages = JSON.parse(chatSession.messages || '[]');
      const updatedMessages = [...existingMessages, newMessage, aiMessage];
      
      await prisma.chatSession.update({
        where: { id: chatSession.id },
        data: {
          messages: JSON.stringify(updatedMessages),
          context: JSON.stringify(context)
        }
      });
    } else {
      await prisma.chatSession.create({
        data: {
          userId,
          messages: JSON.stringify([newMessage, aiMessage]),
          context: JSON.stringify(context)
        }
      });
    }

    res.json({
      success: true,
      response: aiResponse,
      context: {
        userProfile: context,
        suggestions: generateSuggestions(message, context)
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      response: "I'm here to help with your career questions! Could you please try asking again?"
    });
  }
});

// Legacy message endpoint for compatibility
router.post('/message', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId;

    // Get AI response using the new service
    const aiResponse = await aiService.chatResponse(message, {});

    res.json({
      success: true,
      response: aiResponse
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      response: "I'm here to help with your career questions!"
    });
  }
});

// Get chat history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    
    const chatSessions = await prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 5
    });

    const history = chatSessions.map(session => ({
      id: session.id,
      messages: JSON.parse(session.messages || '[]'),
      context: JSON.parse(session.context || '{}'),
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    }));

    res.json({
      success: true,
      history
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat sessions (legacy)
router.get('/sessions', authMiddleware, async (req, res) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      where: { userId: req.userId },
      orderBy: { updatedAt: 'desc' }
    });
    
    const sessionsWithParsedMessages = sessions.map(session => ({
      ...session,
      messages: JSON.parse(session.messages || '[]')
    }));
    
    res.json(sessionsWithParsedMessages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function generateSuggestions(message, context) {
  const suggestions = [];
  
  if (message.toLowerCase().includes('roadmap')) {
    suggestions.push('Can you create a detailed roadmap for my career goal?');
    suggestions.push('What skills should I focus on next?');
  }
  
  if (message.toLowerCase().includes('job') || message.toLowerCase().includes('career')) {
    suggestions.push('What are the current market trends in my field?');
    suggestions.push('How can I prepare for technical interviews?');
  }
  
  if (message.toLowerCase().includes('project')) {
    suggestions.push('What projects would look good on my resume?');
    suggestions.push('How can I make my projects stand out?');
  }
  
  // Default suggestions based on user profile
  if (context.year) {
    if (context.year <= 2) {
      suggestions.push('What should I focus on in my early college years?');
    } else {
      suggestions.push('How should I prepare for placements?');
    }
  }
  
  return suggestions.slice(0, 3);
}

module.exports = router;