const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
};
const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;

    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and password are required.' })
    }

    // check for duplicate usernames in the database
    const duplicate = usersDB.users.find(u => u.username === user);
    if (duplicate) {
        return res.sendStatus(409); // Conflict
    }

    try {
        // Encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        
        // Store the new user into database
        var newUser = { 
            'username': user, 
            'password': hashedPwd,
            'roles': { 'User': 4096 }
        };
        usersDB.setUsers([...usersDB.users, newUser]);

        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDB.users)
        );

        console.log(usersDB.users);
        res.status(201).json({'success': `New user ${user} created!`});
    } catch (err) {
        res.status(500).json({'message': err.message});
    }
}

module.exports = {
    handleNewUser
};