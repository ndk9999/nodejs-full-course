const { logEvents } = require('./log-events');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    logEvents(`${err.name}: ${err.message}`, 'errorLog.txt');
    res.status(500).send(err.message);
}

module.exports = errorHandler;