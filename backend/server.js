require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

const loginLimiter = rateLimit({ windowMs: 60 * 1000, max: 5, message: { error: 'Too many login attempts, please try again after a minute' } });
app.use('/api/auth/login', loginLimiter);

app.use('/api/auth', require('./routes/authRouter'));
app.use('/api/users', require('./routes/userRouter'));

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
