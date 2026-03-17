const router = require('express').Router();
const model = require('../models/auth');
const { register, login } = require('../validation/userValidation');
const validate = require('../middleware/validator');
const apiKeyMiddleware = require('../middleware/apiKey');
const tokenMiddleware = require('../middleware/auth');

router.post('/register', apiKeyMiddleware, validate(register), model.registerUser);
router.post('/login', apiKeyMiddleware, validate(login), model.loginUser);
router.post('/logout', apiKeyMiddleware, tokenMiddleware, model.logoutUser);
router.post('/refresh-token', apiKeyMiddleware, model.refreshToken);

module.exports = router;
