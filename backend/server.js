const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

app.get('/api/config', (req, res) => {
  res.json({
    success: true,
    cost_per_credit: parseInt(process.env.COST_PER_CREDIT) || 500,
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running!' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
