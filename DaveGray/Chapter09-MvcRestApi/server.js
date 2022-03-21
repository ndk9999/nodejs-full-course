const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/log-events');
const errorHandler = require('./middleware/error-handler');

const PORT = process.env.PORT || 3500;

// Custom middleware for logging
// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.path}`);
//     logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
//     next();
// });
app.use(logger);

// Third-party middleware
// Cross-Origin Resource Sharing
app.use(cors(corsOptions));

// Built-in middleware to handle url encoded data
// in other words, form data: 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({extended: false}));

// Built-in middleware for json
app.use(express.json());

// Built-in middleware for serving static files
app.use(express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

// Routes
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
