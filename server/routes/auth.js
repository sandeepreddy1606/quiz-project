const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user (simplified)
router.post('/register', async (req, res) => {
  console.log('📝 Registration request received:', req.body);
  
  try {
    const { email, password, confirmPassword } = req.body;
    
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Please fill out all fields." });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        field: 'confirmPassword', 
        message: "Passwords do not match." 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        field: 'password', 
        message: "Password must be at least 6 characters long." 
      });
    }
    
    // Check for existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        field: 'email', 
        message: "This email is already registered." 
      });
    }
    
    // Create new user (simplified fields)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({ 
      firstName: email.split('@')[0], // Use email prefix as first name
      lastName: 'User', // Default last name
      email: email.toLowerCase().trim(),
      phoneNumber: Date.now().toString(), // Generate unique phone number
      gender: 'other', // Default value
      password: hashedPassword 
    });
    
    const savedUser = await newUser.save();
    console.log('✅ User created successfully:', savedUser.email);
    
    res.status(201).json({ 
      success: true,
      message: "User registered successfully!" 
    });
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// Login a user - FIXED VERSION
router.post('/login', async (req, res) => {
  console.log('🔑 Login attempt for:', req.body.email);
  
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ message: "Please provide email and password." });
    }
    
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('🔍 User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(400).json({ message: "Invalid credentials." });
    }
    
    // Check if user has password
    if (!user.password) {
      console.log('❌ User has no password');
      return res.status(400).json({ message: "Invalid credentials." });
    }
    
    console.log('🔐 Comparing passwords...');
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('🔐 Password valid:', validPassword ? 'Yes' : 'No');
    
    if (!validPassword) {
      console.log('❌ Invalid password for user:', email);
      return res.status(400).json({ message: "Invalid credentials." });
    }
    
    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is missing!');
      return res.status(500).json({ message: "Server configuration error." });
    }
    
    console.log('🎫 Generating JWT token...');
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('✅ Login successful for:', user.email);
    
    // FIXED: Return user data with the token
    res.json({ 
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('❌ Error details:', error.message);
    res.status(500).json({ message: "Server error during login." });
  }
});

module.exports = router;
