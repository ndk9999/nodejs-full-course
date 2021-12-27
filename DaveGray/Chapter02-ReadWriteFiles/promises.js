const fsPromises = require('fs').promises;
const path = require('path');

const starterFilePath = path.join(__dirname, 'files', 'starter.txt');
const promiseFilePath = path.join(__dirname, 'files', 'promise.txt');

const fileOps = async() => {
    try {
        // Read data from file
        const data = await fsPromises.readFile(starterFilePath, 'utf8');
        console.log(data);

        // Delete file new-promise.txt
        await fsPromises.unlink(path.join(__dirname, 'files', 'new-promise.txt'));

        // Write it to a new file
        await fsPromises.writeFile(promiseFilePath, data);
        await fsPromises.appendFile(promiseFilePath, '\nNice to meet you');

        // Rename new file
        await fsPromises.rename(promiseFilePath, path.join(__dirname, 'files', 'new-promise.txt'));

        // Read data from new file
        const newData = await fsPromises.readFile(path.join(__dirname, 'files', 'new-promise.txt'), 'utf8');
        console.log(newData);
    } catch (error) {
        console.log(error);
    }
};

fileOps();