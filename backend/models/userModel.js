const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/')) });

const userMode = {
    upload: upload.single('profilePicture'),

    getProfile: async (req, res) => {
        try {
            const user = await userModel.findById(req.user.id).select('-password -refreshToken');
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json({ user });
        } catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const { first_name, last_name, email } = req.body;
            const updateData = { first_name, last_name, email };
            if (req.file) updateData.profilePicture = `/uploads/${req.file.filename}`;
            if (req.body.removeProfilePicture === 'true') updateData.profilePicture = null;
            const user = await userModel.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password -refreshToken');
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json({ message: 'Profile updated successfully', user });
        } catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    },

    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await userModel.findById(req.user.id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();
            res.json({ message: 'Password changed successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    }
};

module.exports = userMode;
