import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import path from 'path';
import flash from 'connect-flash';
import authRoutes from './routes/authRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import { JWT_SECRET } from './config.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(flash());  // Add flash middleware

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', './views');


// Passport configuration
app.use(session({ secret: JWT_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', homeRoutes);
app.use('/', authRoutes);

// Database connection and server start
mongoose.connect('mongodb+srv://hckmigo:gQ0PY6F5fRU7tovQ@authdata.fvk6wr7.mongodb.net/?retryWrites=true&w=majority&appName=AuthData', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(3000, () => console.log('Server running on port 3000')))
    .catch(err => console.log(err));