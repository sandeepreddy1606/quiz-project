const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Register a new user
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, gender, password, confirmPassword } = req.body;
  if (!firstName || !lastName || !email || !phoneNumber || !gender || !password) {
    return res.status(400).json({ message: "Please fill out all fields." });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ field: 'confirmPassword', message: "Passwords do not match." });
  }
  try {
    if (await User.findOne({ email })) return res.status(400).json({ field: 'email', message: "This email is already registered." });
    if (await User.findOne({ phoneNumber })) return res.status(400).json({ field: 'phoneNumber', message: "This phone number is already registered." });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ firstName, lastName, email, phoneNumber, gender, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration." });
  }
});

// Login a user (manual)
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });
    if (!user.password) return res.status(400).json({ message: "Please sign in with Google." });
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid credentials." });
    
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error during login." });
  }
});

// Google Auth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { 
    failureRedirect: 'http://localhost:3000/auth',
    session: false 
  }),
  (req, res) => {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:3000/auth?token=${token}`);
  }
);

module.exports = router;