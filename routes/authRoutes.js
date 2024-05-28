import express from 'express';
import { renderSignup, signup, renderSignin, signin, signout, renderForgotPassword, forgotPassword, renderResetPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Default Route
router.get('/', (req, res) => {
    res.send("Nothing to view here");
});

// Signup routes
router.get('/signup', renderSignup);
router.post('/signup', signup);

// Signin routes
router.get('/signin', renderSignin);
router.post('/signin', signin);

// Signout route
router.get('/signout', signout);

// Forgot password routes
router.get('/forgot-password', renderForgotPassword);
router.post('/forgot-password', forgotPassword);

// Reset password routes
router.get('/reset-password', renderResetPassword);
router.post('/reset-password', resetPassword);

export default router;
