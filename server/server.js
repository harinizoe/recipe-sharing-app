const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS configuration to allow frontend (http://localhost:3000)
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};
app.use(cors(corsOptions));

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

// ✅ Root route (optional)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
