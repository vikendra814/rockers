const validator = require('validator');

function register(data) {
    if (!data.first_name || !data.last_name || !data.email || !data.password || data.agreeTerms === undefined)
        return { error: { details: [{ message: 'All fields are required' }] } };
    if (!validator.isEmail(data.email))
        return { error: { details: [{ message: 'Invalid email format' }] } };
    if (data.password.length < 6)
        return { error: { details: [{ message: 'Password must be at least 6 characters' }] } };
    return {};
}

function login(data) {
    if (!data.email || !data.password)
        return { error: { details: [{ message: 'Email and password are required' }] } };
    if (!validator.isEmail(data.email))
        return { error: { details: [{ message: 'Invalid email format' }] } };
    return {};
}

function changePassword(data) {
    if (!data.currentPassword || !data.newPassword)
        return { error: { details: [{ message: 'Current password and new password are required' }] } };
    if (data.newPassword.length < 6)
        return { error: { details: [{ message: 'New password must be at least 6 characters' }] } };
    return {};
}

function updateProfile(data) {
    if (!data.first_name || !data.last_name || !data.email)
        return { error: { details: [{ message: 'First name, last name and email are required' }] } };
    if (!validator.isEmail(data.email))
        return { error: { details: [{ message: 'Invalid email format' }] } };
    return {};
}

module.exports = { register, login, changePassword, updateProfile };
