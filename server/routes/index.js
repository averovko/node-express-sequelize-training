const passport = require('passport');
const passportConfig = require('../config/passport');
const authenticate = require('./auth').authenticate;

const usersController = require('../controllers').users;
const clientsController = require('../controllers').clients;
const contractsController = require('../controllers').contracts;

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    app.post('/users', usersController.create);
    app.post('/users/authenticate', authenticate);
    app.put('/users/address',    passport.authenticate('jwt', {session: false}), usersController.setUserAddress);
    app.get('/users/:id',        passport.authenticate('jwt', {session: false}), usersController.getUser);
    app.put('/users/:id',        passport.authenticate('jwt', {session: false}), usersController.updateUser);
    app.delete('/users/:id',     passport.authenticate('jwt', {session: false}), usersController.deleteUser);

    app.post('/clients',         passport.authenticate('jwt', {session: false}), clientsController.create);
    app.get('/clients',          passport.authenticate('jwt', {session: false}), clientsController.getAll);
    app.put('/clients/address',  passport.authenticate('jwt', {session: false}), clientsController.setAddress);
    app.get('/clients/:id',      passport.authenticate('jwt', {session: false}), clientsController.getById);
    app.put('/clients/:id',      passport.authenticate('jwt', {session: false}), clientsController.update);
    app.delete('/clients/:id',   passport.authenticate('jwt', {session: false}), clientsController.delete);

    app.post('/contracts',       passport.authenticate('jwt', {session: false}), contractsController.create);
    app.get('/contracts',        passport.authenticate('jwt', {session: false}), contractsController.getAll);
    app.get('/contracts/:id',    passport.authenticate('jwt', {session: false}), contractsController.getById);
    app.put('/contracts/:id',    passport.authenticate('jwt', {session: false}), contractsController.update);
    app.delete('/contracts/:id', passport.authenticate('jwt', {session: false}), contractsController.delete);
};
