const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
};
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken in memory
    
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204); // No content
    }

    // Is refreshToken in db?
    const refreshToken = cookies.jwt;
    const foundUser = usersDB.users.find(u => u.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    const otherUsers = usersDB.users.filter(u => u.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken: ''};

    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
        path.join(__dirname, '..', 'models', 'users.json'),
        JSON.stringify(usersDB.users)
    );

    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true}); // secure: true - only serves on https
    res.sendStatus(204);
}

module.exports = {
    handleLogout
}