require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const roadmapRoutes = require('./routes/roadmap');
const courseRoutes = require('./routes/course');
const chatRoutes = require('./routes/chat');
const assessmentRoutes = require('./routes/assessment');
const roadmapGeneratorRoutes = require('./routes/roadmapGenerator');
const githubAnalyzerRoutes = require('./routes/githubAnalyzer');
const resumeAnalyzerRoutes = require('./routes/resumeAnalyzer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/roadmap-generator', roadmapGeneratorRoutes);
app.use('/api/github-analyzer', githubAnalyzerRoutes);
app.use('/api/resume-analyzer', resumeAnalyzerRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
