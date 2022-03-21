const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
    const now = `${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}`;
    const logItem = `${now}\t${uuid()}\t${message}\n`;

    console.log(logItem);

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, 'logs'));
        }

        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
    } catch (err) {
        console.error(err);
    }
};

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    next();
};

module.exports = { logger, logEvents };