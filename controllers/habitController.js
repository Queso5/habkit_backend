const Habit = require('../models/Habit');

exports.createHabit = async (req, res) => {
  try {
    const { title, description, frequency } = req.body;
    const habit = new Habit({
      user: req.user.id,
      title,
      description,
      frequency
    });
    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({ startDate: -1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateHabit = async (req, res) => {
  try {
    const { title, description, frequency } = req.body;
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, description, frequency },
      { new: true }
    );
    res.json(habit);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteHabit = async (req, res) => {
  try {
    await Habit.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ msg: 'Habit deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.toggleHabitCompletion = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    if (!habit) return res.status(404).json({ msg: 'Habit not found' });

    const dateToToggle = new Date(req.body.date); // pass date like '2024-04-09'
    const dateStr = dateToToggle.toISOString().split('T')[0];

    const hasDate = habit.completedDates.some(
      (d) => d.toISOString().split('T')[0] === dateStr
    );

    if (hasDate) {
      habit.completedDates = habit.completedDates.filter(
        (d) => d.toISOString().split('T')[0] !== dateStr
      );
    } else {
      habit.completedDates.push(dateToToggle);
    }

    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
