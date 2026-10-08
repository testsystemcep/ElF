const path = require('path');
const dotenv = require('dotenv');
// Ensure .env is loaded in serverless/test environments
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB, isDatabaseConnected } = require('./utils/mongodb');
const { errorHandler } = require('./middleware/errorMiddleware');

// Routes
const scheduleRoutes = require('./schedule/routes');
const subjectsRoutes = require('./subjects/routes');
const notesRoutes = require('./notes/routes');
const assignmentsRoutes = require('./assignments/routes');
const examRoutes = require('./exam/routes');
const notificationsRoutes = require('./notifications/routes');
const syllabusRoutes = require('./syllabus/routes');
const impRoutes = require('./imp/routes');
const newsRoutes = require('./news/routes');

const adminRoutes = require('./admin/routes');

const app = express();

// DB connection middleware for serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(new Error("Database connection unavailable"));
  }
});

// Middleware
app.use(cors({
  origin: true, // Echoes the request origin, perfectly handles 'null' and 'file://'
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Explicit CORS headers as requested
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (Object.keys(req.query).length > 0) {
    console.log(`Query Params:`, req.query);
  }
  next();
});

app.use(express.json());
// app.use(helmet({ contentSecurityPolicy: false })); // Temporarily disabled for CORS troubleshooting
app.use(morgan('dev'));

// Static files (Optional: only if you have shared public assets)
// app.use('/admin', express.static(path.join(__dirname, 'admin'))); 


// Main Routes
app.use('/api/admin', adminRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/exam-timetable', examRoutes);
app.use('/api/exams', examRoutes); // Alias for Flutter frontend
app.use('/api/notifications', notificationsRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/imp', impRoutes);
app.use('/api/news', newsRoutes);

// Root
app.get('/', (req, res) => {
  res.json({ message: "Welcome to NoteHub Backend API", status: "Running" });
});

// Health Check
app.get('/health', (req, res) => {
  const isConnected = isDatabaseConnected();
  return res.status(isConnected ? 200 : 503).json({
    status: isConnected ? "ok" : "error",
    database: isConnected ? "connected" : "disconnected"
  });
});

app.get('/api/health', (req, res) => {
  const isConnected = isDatabaseConnected();
  return res.status(isConnected ? 200 : 503).json({
    status: isConnected ? "ok" : "error",
    database: isConnected ? "connected" : "disconnected"
  });
});

// Error Handling
app.use(errorHandler);

module.exports = app;
