const express = require('express');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const initDb = require('./utils/initDb');
const authRoutes = require('./routes/auth');
const electionRoutes = require('./routes/election');
const candidateRoutes = require('./routes/candidate');
const voteRoutes = require('./routes/vote');
const logsRoutes = require('./routes/logs');
const biometricRoutes = require('./routes/biometric');
const encryptedVoteRoutes = require('./routes/encryptedVote');
const analyticsRoutes = require('./routes/analytics');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();

// Trust proxy for Render deployment
app.set('trust proxy', 1);

// CORS configuration - must be before helmet
app.use(cors({ 
  origin: [
    'http://localhost:3000',
    'https://securevotex.vercel.app',
    /\.vercel\.app$/  // Allow all Vercel preview deployments
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security middleware - with relaxed CORS for development
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Increased for development (reduce to 10 in production)
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts, please try again later.'
});

app.use(express.json({ limit: '10mb' })); // Increased for biometric data
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

// Initialize database schema on startup
console.log('📚 Initializing database...');
initDb().then(() => {
  console.log('✅ Database initialized');
}).catch(err => {
  console.error('❌ Database initialization failed:', err.message);
  process.exit(1);
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/biometric', biometricRoutes);
app.use('/api/encrypted-vote', encryptedVoteRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Blockchain Voting System Backend Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Security: Helmet enabled');
  console.log('Security: Rate limiting enabled');
});
