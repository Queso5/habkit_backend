const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: String,
  icon: String,
  color: String,
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
  completions: [{ date: String }], // ISO date string
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);
