import express from 'express';

const app = express();

// Middleware
app.use(express.json());

// Example HTTP route
app.get('/api', (req, res) => {
    res.send({ message: 'Welcome to the API!' });
});

export default app;
