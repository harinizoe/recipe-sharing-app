const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Basic validation
    if (!name || !email || !password || !confirmPassword)
      return res.status(400).json({ message: 'All fields required' });

    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'User registered', userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'All fields required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin endpoints
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Google OAuth handler
exports.googleAuth = async (req, res) => {
  try {
    const { googleId, name, email, picture } = req.body;

    if (!googleId || !email || !name) {
      return res.status(400).json({ message: 'Missing required Google OAuth data' });
    }

    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId });
    
    if (user) {
      return res.status(200).json({ 
        message: 'User already registered with Google', 
        userId: user._id,
        isExisting: true 
      });
    }

    // Check if user exists with same email but different auth method
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res.status(400).json({ 
        message: 'Email already registered with different method. Please use regular login.' 
      });
    }

    // Create new user with Google OAuth
    user = await User.create({
      name,
      email,
      googleId,
      picture: picture || null
    });

    res.status(201).json({ 
      message: 'Google registration successful', 
      userId: user._id,
      isNew: true 
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ message: 'Server error during Google authentication', error: error.message });
  }
};
