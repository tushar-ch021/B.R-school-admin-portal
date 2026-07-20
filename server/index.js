const path = require('path');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Resolve the React production build directory (supports both server/dist and client/dist)
const serverDistPath = path.join(__dirname, 'dist');
const clientDistPath = path.join(__dirname, '../client/dist');
const clientBuildPath = fs.existsSync(serverDistPath)
  ? serverDistPath
  : fs.existsSync(clientDistPath)
  ? clientDistPath
  : serverDistPath;

// Validate critical security environment variables immediately on load
if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  console.error('CRITICAL SECURITY ERROR: ADMIN_EMAIL and ADMIN_PASSWORD must be configured in environment variables.');
  process.exit(1);
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('CRITICAL SECURITY ERROR: JWT_SECRET must be configured and contain at least 32 characters.');
  process.exit(1);
}

const app = express();

// Connect to MongoDB Database
connectDB().then(() => {
  // Seed first admin if database is empty
  const Admin = require('./models/Admin');
  const bcrypt = require('bcryptjs');
  
  Admin.countDocuments()
    .then(async (count) => {
      if (count === 0) {
        console.log('No administrator found. Seeding admin account using credentials from environment variables...');
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
        await Admin.create({
          name: 'School Administrator',
          email: process.env.ADMIN_EMAIL.toLowerCase(),
          password: hashedPassword
        });
        console.log(`Admin account seeded successfully with email: ${process.env.ADMIN_EMAIL}`);
      }
    })
    .catch((err) => {
      console.error('Failed to query or seed Administrator data:', err);
    });
}).catch((err) => {
  console.error('Failed to connect to MongoDB database:', err);
  process.exit(1);
});

// Configure Security Middleware with customized Content Security Policy (CSP)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'", "https://api.cloudinary.com"]
    }
  }
}));
app.use(mongoSanitize());

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Express request parser setup
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set up general API request rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api/', apiLimiter);

// Serve React production static assets (CSS, JS, images, fonts, etc.) with strict MIME type headers
app.use(express.static(clientBuildPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=UTF-8');
    }
  }
}));

// Define API Route handlers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/tc', require('./routes/tcRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));

// Root endpoint ping check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// SPA catch-all: For any GET request that doesn't match an API route or static file,
// serve the React index.html so client-side routing can handle the URL.
// This prevents 404 errors when users reload the page on routes like /students, /fees, etc.
app.get('*', (req, res, next) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    next();
  }
});

// Centralized error handling middleware (must be registered last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
