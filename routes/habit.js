const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Habit = require('../models/Habit');

router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    console.error('Fetch habits error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});
// Toggle habit completion for a date
router.post('/:id/toggle', auth, async (req, res) => {
  const habitId = req.params.id;
  const { date } = req.body;

  console.log(`Toggle route hit. Habit ID: ${habitId} Date: ${date}`);

  try {
    const habit = await Habit.findById(habitId);
    if (!habit) return res.status(404).json({ msg: 'Habit not found' });

    const existingIndex = habit.completions.findIndex(c => c.date === date);

    if (existingIndex > -1) {
      habit.completions.splice(existingIndex, 1); // Unmark
    } else {
      habit.completions.push({ date }); // Mark as complete
    }

    await habit.save();
    res.json(habit);
  } catch (err) {
    console.error('Toggle error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
