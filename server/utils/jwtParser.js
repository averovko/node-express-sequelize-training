const jwt = require('jsonwebtoken');
const jwt_secret = require('../config/passport').jwt_secret;

exports.getAuthenticatedUserId = (req, res) => {
    if (req.headers && req.headers.authorization) {
        const authorization = req.headers.authorization;
        console.log(authorization);
        try {
            const user = jwt.decode(authorization.split(' ')[1], jwt_secret);
            return user.id;
        } catch (e) {
            return res.status(401).send('Unauthorized');
        }
    }
    return res.send(500);
};