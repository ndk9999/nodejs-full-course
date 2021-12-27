const fs = require('fs');
const path = require('path');

// Create full path to files
const loremFilePath = path.join(__dirname, 'files', 'lorem.txt');
const newLoremFilePath = path.join(__dirname, 'files', 'new-lorem.txt');

// Create stream reader and writer
const rs = fs.createReadStream(loremFilePath, {encoding: 'utf8'});
const ws = fs.createWriteStream(newLoremFilePath);

// Read data from stream
// rs.on('data', (dataChunk) => {
//     // And write to another stream
//     ws.write(dataChunk);
// });

// Another way to copy content
rs.pipe(ws);