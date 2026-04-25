require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const badgeRoutes = require('./routes/badgeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const { verifyToken } = require('./middleware/authMiddlewares');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/badges', badgeRoutes);

// AI routes with auth (for production)
app.use('/api/ai', verifyToken, aiRoutes);

// AI routes without auth (for testing)
app.use('/api/ai-test', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

app.get('/', (req, res) => {
  res.json({ message: 'LEAP API is running' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});