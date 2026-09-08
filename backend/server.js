const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to allow React to talk to Backend
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// CUSTOM LOGGER MIDDLEWARE
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Basic endpoints
app.get('/', (req, res) => {
    res.json({ message: 'User Management Backend API' });
});

app.get('/api/status', (req, res) => {
    res.json({ status: 'Backend is running successfully' });
});

// Mount the user routes
app.use('/api/users', userRoutes);

// 404 HANDLING MIDDLEWARE (This catches any route that doesn't exist)
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

// GLOBAL ERROR HANDLING MIDDLEWARE (Catches all errors)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong on the server' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});