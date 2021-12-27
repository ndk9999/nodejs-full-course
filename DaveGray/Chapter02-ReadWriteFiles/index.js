const fs = require('fs');
const path = require('path');

const starterFilePath = path.join(__dirname, 'files', 'starter.txt');
const replyFilePath = path.join(__dirname, 'files', 'reply.txt');

fs.readFile(starterFilePath, (err, data) => {
    if (err) throw err;
    console.log(data);              // Output buffer in bytes
    console.log(data.toString());   // Output content as string
});

// Read UTF-8 string directly
fs.readFile(starterFilePath, 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);              // Output content as string
});

// // Demonstrate how to catch the error
// fs.readFile('./files/file-not-found.txt', 'utf8', (err, data) => {
//     if (err) throw err;
//     console.log(data);              // Output content as string
// });

// Write data to file
// fs.writeFile(replyFilePath, 'This is the data to be saved to the file', (err) => {
//     if (err) throw err;
//     console.log('Write complete');
// });

// fs.appendFile(replyFilePath, 'String to be appended to the file', (err) => {
//     if (err) throw err;
//     console.log('Append complete');
// });

fs.writeFile(replyFilePath, 'This is the data to be saved to the file\n', (err) => {
    if (err) throw err;
    console.log('Write complete');

    fs.appendFile(replyFilePath, 'String to be appended to the file', (err) => {
        if (err) throw err;
        console.log('Append complete');

        fs.rename(replyFilePath, path.join(__dirname, 'files', 'new-reply.txt'), (err) => {
            if (err) throw err;
            console.log('Rename complete');
        });
    });
});

// Exit on uncaught errors
process.on('uncaughtException', err => {
    console.error(`There was an uncaught error: ${err}`);
    process.exit(1);
});