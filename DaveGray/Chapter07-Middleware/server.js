const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
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
const whitelist = ['https://www.yoursite.com', 'https://www.google.com.vn', 'http://127.0.0.1:5500', 'http://localhost:3500'];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Built-in middleware to handle url encoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({extended: false}));

// Built-in middleware for json
app.use(express.json());

// Built-in middleware for serving static files
app.use(express.static(path.join(__dirname, '/public')));

app.get('^/$|^/index(.html)?', (req, res) => {
    //res.send('Hello World!');
    //res.sendFile('./views/index.html', { root: __dirname });
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

// Redirect (302 by default)
app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html');
});

// Route handlers
app.get('/hello(.html)?', (req, res, next) => {
    console.log('Attempt to load hello.html');
    next();
}, (req, res) => {
    res.send('Helo world!');
});

// Chaining route handlers
const one = (req, res, next) => {
    console.log('one');
    next();
};

const two = (req, res, next) => {
    console.log('two');
    next();
};

const three = (req, res) => {
    console.log('three');
    res.send('Finished!');
};

app.get('/chain(.html)?', [one, two, three]);

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
