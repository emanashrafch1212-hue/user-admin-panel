const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Basic endpoints
app.get('/', (req, res) => {
  res.json({ message: 'User Management Backend API' });
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is running successfully' });
});

// Mount the user routes
app.use('/api/users', userRoutes);

// 404 & Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});