const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/enroll', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.body;
    
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: req.userId,
        courseId
      },
      include: { course: true }
    });
    
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/my-courses', authMiddleware, async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.userId },
      include: { course: true }
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
