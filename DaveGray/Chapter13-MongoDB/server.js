require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/log-events');
const errorHandler = require('./middleware/error-handler');
const verifyJwt = require('./middleware/verify-jwt');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDatabase = require('./config/dbConnection');

const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDatabase();

// Custom middleware for logging
// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.path}`);
//     logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
//     next();
// });
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Third-party middleware
// Cross-Origin Resource Sharing
app.use(cors(corsOptions));

// Built-in middleware to handle url encoded data
// in other words, form data: 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({extended: false}));

// Built-in middleware for json
app.use(express.json());

// Add middleware for cookies
app.use(cookieParser());

// Built-in middleware for serving static files
app.use(express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

// Routes
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/auth', require('./routes/api/auth'));
app.use('/logout', require('./routes/api/logout'));
app.use('/refresh', require('./routes/api/refresh'));
app.use('/register', require('./routes/api/register'));

app.use(verifyJwt);
app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({error: '404 Not Found'});
    } else {
        res.type('txt').send('404 Not Found');
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
