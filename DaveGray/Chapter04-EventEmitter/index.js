const logEvents = require('./log-events');
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {

}

// Initialize object
const myEmitter = new MyEmitter();

// Add listener for the log event
myEmitter.on('log', (msg) => logEvents(msg));

// Emit event
setTimeout(() => {
    myEmitter.emit('log', 'Log event emitted!');
}, 2000);