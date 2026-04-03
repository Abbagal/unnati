const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const roadmaps = await prisma.roadmap.findMany({
      where: { userId: req.userId },
      include: { milestones: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(roadmaps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, startDate, endDate, milestones } = req.body;
    
    const roadmap = await prisma.roadmap.create({
      data: {
        userId: req.userId,
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        milestones: {
          create: milestones
        }
      },
      include: { milestones: true }
    });
    
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/milestone/:id', authMiddleware, async (req, res) => {
  try {
    const { completed } = req.body;
    
    const milestone = await prisma.milestone.update({
      where: { id: req.params.id },
      data: { completed }
    });
    
    res.json(milestone);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
