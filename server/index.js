// Load environment variables FIRST. This is crucial.
const dotenv = require('dotenv');
dotenv.config();

// Import all necessary packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

// Import your configurations and routes
require('./config/passport-setup'); // Sets up Google Strategy
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user'); // Import the user route

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB Atlas!'))
  .catch((error) => console.error('❌ Error connecting to MongoDB: ', error));

// --- Initialize Express App ---
const app = express();

// --- Middleware Configuration (In the Correct Order) ---

// 1. CORS: This is the complete and final configuration.
// It explicitly allows your frontend's origin, allows credentials,
// and tells the browser which headers are safe to send.
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'auth-token'], // IMPORTANT: Allow the auth-token header
};
app.use(cors(corsOptions));

// 2. Body Parser: To understand JSON data
app.use(express.json());

// 3. Express Session: Required for Passport
app.use(session({
  secret: 'a_very_secret_key_for_session_management',
  resave: false,
  saveUninitialized: false,
}));

// 4. Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// --- API Routes ---

// 5. Test Route
app.get('/', (req, res) => {
  res.send('✅ Quiz App Backend is running and accessible!');
});

// 6. Authentication Routes
app.use('/api/auth', authRoutes);

// 7. User Profile Route
app.use('/api/user', userRoutes);


// --- Start the Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});