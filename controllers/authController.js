import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendEmail } from '../utils/mailer.js';
import { generateRandomPassword } from '../utils/helper.js';
import { JWT_SECRET } from '../config.js';

// Render Signup Page
export const renderSignup = (req, res) => {
    res.render('signup', { message: null });
};

// Signup
export const signup = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.render('signup', { message: 'Passwords do not match!' });
        }

        const user = new User({ email, password });
        await user.save();
        res.redirect('/signin');
    } catch (error) {
        res.render('signup', { message: 'Error signing up!' });
    }
};

// Render Signin Page
export const renderSignin = (req, res) => {
    res.render('signin', { message: null });
};

// Signin
export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('signin', { message: 'Invalid email or password!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('signin', { message: 'Invalid email or password!' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');
    } catch (error) {
        res.render('signin', { message: 'Error signing in!' });
    }
};

// Signout
export const signout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/signin');
};

// Render Forgot Password Page
export const renderForgotPassword = (req, res) => {
    res.render('forgotPassword', { message: null });
};

// Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('forgotPassword', { message: 'Email not found!' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        const resetLink = `http://localhost:3000/reset-password?token=${token}`;
        await sendEmail(user.email, 'Password Reset', `Click here to reset your password: ${resetLink}`);
        res.render('forgotPassword', { message: 'Password reset email sent!' });
    } catch (error) {
        res.render('forgotPassword', { message: 'Error sending reset email!' });
    }
};

// Render Reset Password Page
export const renderResetPassword = (req, res) => {
    const { token } = req.query;
    res.render('resetPassword', { token, message: null });
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.render('resetPassword', { token, message: 'Passwords do not match!' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.render('resetPassword', { token, message: 'Invalid token!' });
        }

        user.password = password;
        await user.save();
        res.redirect('/signin');
    } catch (error) {
        res.render('resetPassword', { token, message: 'Error resetting password!' });
    }
};
