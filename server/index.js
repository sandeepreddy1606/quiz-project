const dotenv = require('dotenv');
dotenv.config(); // This MUST be at the top

const express = require('express');
const cors = require('cors'); // We will configure this
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
require('./config/passport-setup');
const authRoutes = require('./routes/auth');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch((error) => console.error('Error connecting to MongoDB: ', error));

const app = express();

// --- NEW CORS Configuration ---
// This tells the backend to accept requests only from your frontend
// and to allow cookies to be sent.
app.use(cors({
  origin: 'http://localhost:3000', // The address of your frontend
  credentials: true, // Allow cookies and sessions
}));

app.use(express.json());

// Express session
app.use(session({
  secret: 'a_separate_secret_for_session',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));