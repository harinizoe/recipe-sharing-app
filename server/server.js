const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const shoppingListRoutes = require('./routes/shoppingListRoutes');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS configuration to allow local and deployed frontends
const allowedOrigins = [
  'http://localhost:3000',
  'https://recipe-sharing-c36eqh2tx-harinizoes-projects.vercel.app',
  // Add other Vercel aliases or custom domains here if applicable
  process.env.FRONTEND_URL // optional: configure in environment
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl) or same-origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
};

app.use(cors(corsOptions));
// Handle preflight for all routes
app.options('*', cors(corsOptions));

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ✅ API Routes
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/shopping-lists', shoppingListRoutes);
// ✅ Root route (optional)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
