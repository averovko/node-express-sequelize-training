const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwt_secret = require('../config/passport').jwt_secret;

exports.authenticate = (req, res, next) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(404).send({message: 'Provided user not found'});
        req.logIn(user, {session: false}, (err) => {
            if (err) return next(err);
            const token = jwt.sign(user.dataValues, jwt_secret);
            return res.json({user, token});
        });
    })(req, res, next);
};
