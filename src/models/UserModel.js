const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  last_name: { type: String, required: true },
  nick: { type: String, required: true },
  bio: { type: String, required: false },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'guest', 'client'], default: 'guest' }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
