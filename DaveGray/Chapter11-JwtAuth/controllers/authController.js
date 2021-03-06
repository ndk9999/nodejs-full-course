const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');

require('dotenv').config();

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;

    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and password are required.' });
    }

    const foundUser = usersDB.users.find(u => u.username === user);
    if (!foundUser) {
        return res.sendStatus(401); // Unauthorized
    }

    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        // Create JWT token
        const accessToken = jwt.sign(
            { 'username': foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { 'username': foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Saving refreshToken with current user
        const otherUsers = usersDB.users.filter(u => u.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };

        usersDB.setUsers([...otherUsers, currentUser]);

        // Save list of users to file
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDB.users)
        );

        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});

        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = {
    handleLogin
}