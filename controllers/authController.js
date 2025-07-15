const User = require('../models/userModel');

exports.showLogin = (req, res) => {
  res.render('login', { error: null });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('Login failed: User not found');
      return res.render('login', { error: 'Invalid username or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Login failed: Incorrect password');
      return res.render('login', { error: 'Invalid username or password' });
    }
    req.session.userId = user._id;
    req.session.role = user.role;
    console.log('Session set:', req.session); // Debug session
    console.log('Redirecting to:', user.role === 'admin' ? '/registrations/list' : '/events/register');
    if (user.role === 'admin') {
      res.redirect('/registrations/list');
    } else {
      res.redirect('/events/register');
    }
  } catch (err) {
    console.error('Login error:', err);
    res.render('login', { error: 'Server error' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/auth/login');
  });
};