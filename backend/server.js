const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from React frontend (CORS)
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Simple logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Task 1: Basic endpoints
app.get('/', (req, res) => {
    res.json({ message: 'User Management Backend API' });
});

app.get('/api/status', (req, res) => {
    res.json({ status: 'Backend is running successfully' });
});

// Mount the user routes
app.use('/api/users', userRoutes);

// Bonus: Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong on the server' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});