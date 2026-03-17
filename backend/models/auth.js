const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');
const jwt = require('jsonwebtoken');

function generateTokens(userId) {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { token, refreshToken };
}

const auth = {
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await userModel.findOne({ email });
            if (!user) return res.status(400).json({ error: 'Invalid email or password' });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });
            const { token, refreshToken } = generateTokens(user._id);
            user.refreshToken = refreshToken;
            await user.save();
            res.json({ token, refreshToken });
        } catch (err) {
            console.log("---------",err);
            res.status(500).json({ error: 'Server error' });
        }
    },

    registerUser: async (req, res) => {
        try {
            const { first_name, last_name, email, password, agreeTerms } = req.body;
            const existingUser = await userModel.findOne({ email });
            if (existingUser) return res.status(400).json({ error: 'Email already exists' });
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new userModel({ first_name, last_name, email, password: hashedPassword, agreeTerms });
            await newUser.save();
            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            console.log("---------",err);
            res.status(500).json({ error: 'Server error' });
        }
    },

    logoutUser: async (req, res) => {
        try {
            await userModel.findByIdAndUpdate(req.user.id, { refreshToken: null });
            res.json({ message: 'User logged out successfully' });
        } catch (err) {
            console.log(" error in logut---------",err);
            res.status(500).json({ error: 'Server error' });
        }
    },

    refreshToken: async (req, res) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await userModel.findById(decoded.id);
            if (!user || user.refreshToken !== refreshToken) return res.status(403).json({ error: 'Invalid refresh token' });
            const tokens = generateTokens(user._id);
            user.refreshToken = tokens.refreshToken;
            await user.save();
            res.json(tokens);
        } catch (err) {
            console.log("error in refersh---------",err);
            res.status(403).json({ error: 'Invalid refresh token' });
        }
    }
};

module.exports = auth;
