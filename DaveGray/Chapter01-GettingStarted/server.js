// Run: node ./server.js

// How NodeJS differs from Vanilla JS
// 1. Node runs on a server - not in a browser (backend not front end)
// 2. The console is the terminal window
console.log("Hello World!");

// 3. Global object instead of window object
console.log(global);

// 4. Has common core modules that we will explore
// 5. CommonJS modules instead of ES6 modules
// 6. Missing some JS API like fetch

const os = require('os');
const path = require('path');
const math = require('./math');

console.log(os.type());     // Get OS type
console.log(os.version());  // Get OS version
console.log(os.homedir());  // Get home directory for terminal

console.log(__dirname);     // Current directory path
console.log(__filename);    // Current file path

console.log(path.dirname(__filename));      // Get path to the directory containing the file
console.log(path.basename(__filename));     // Get full file name
console.log(path.extname(__filename));      // Get file extension

console.log(path.parse(__filename));        // Get JSON object representing the file

console.log(math.add(5, 2));
console.log(math.subtract(5, 2));
console.log(math.multiply(5, 2));
console.log(math.divide(5, 2));