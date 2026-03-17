const router = require('express').Router();
const model = require('../models/userModel');
const { updateProfile, changePassword } = require('../validation/userValidation');
const validate = require('../middleware/validator');
const apiKeyMiddleware = require('../middleware/apiKey');
const tokenMiddleware = require('../middleware/auth');

router.get('/me', apiKeyMiddleware, tokenMiddleware, model.getProfile);
router.put('/me', apiKeyMiddleware, tokenMiddleware, model.upload, validate(updateProfile), model.updateProfile);
router.post('/change-password', apiKeyMiddleware, tokenMiddleware, validate(changePassword), model.changePassword);

module.exports = router;
