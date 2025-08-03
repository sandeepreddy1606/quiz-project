const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/authMiddleware'); // Import our new middleware

// This route gets the current user's data using a token
router.get('/me', auth, async (req, res) => {
  try {
    // req.user is added by the authMiddleware
    // .select('-password') removes the password from the data sent back
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;