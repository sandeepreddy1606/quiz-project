const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { type: String }, // For Google Sign-In
  profilePicture: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phoneNumber: { type: String, required: true, unique: true },
  gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
  password: { type: String, required: false, minlength: 6 },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);