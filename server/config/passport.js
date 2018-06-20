const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const db = require('../models');

const jwt_secret = 'your_jwt_secret';
exports.jwt_secret = jwt_secret;

//For Authentication Purposes
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    (email, password, done) => {
        db.User.findOne({where: {email: email, isEnabled: true}})
        .then(user => {
            passwd = user ? user.password : '';
            isMatch = db.User.validPassword(password, passwd, done, user);
        });
    }
));

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : jwt_secret
    },
    (jwtPayload, done) => {

        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return db.User.findById(jwtPayload.id)
            .then(user => {
                return done(null, user);
            })
            .catch(err => {
                return done(err);
            });
    }
));