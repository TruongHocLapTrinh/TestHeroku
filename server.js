const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

const app = express();

// MongoDB connection
mongoose.connect('mongodb+srv://truong123:truong123@truongcluster.nq3ga4g.mongodb.net/?retryWrites=true&w=majority&appName=truongcluster', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: 'mongodb://localhost/event_db',
    collectionName: 'sessions',
    ttl: 24 * 60 * 60 // 1 day in seconds
  }),
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: false // Set to true in production with HTTPS
  }
}));

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/registrations', registrationRoutes);

app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Server error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));