const bcrypt = require('bcrypt-nodejs');
const models = require('../models');
const getAuthenticatedUserId = require('../utils/jwtParser').getAuthenticatedUserId;
const Op = models.Sequelize.Op;

module.exports = {

    create: (req, res) => {
        return models.User.findOrCreate( {
            where: {
                [Op.and]: [
                    {email: req.body.email}, 
                    {isEnabled: false},
                ]
            },
            defaults: {
                email:      req.body.email,
                password:   req.body.password,
                firstName:  req.body.firstName,
                lastName:   req.body.lastName,
                gender:     req.body.gender,
                position:   req.body.position,
            }
        })
        .spread( (user, created) => {
            if (!created) {
                user.update({
                    password:   req.body.password   || user.password,
                    isEnabled:  true,
                })
                .then( () => res.status(200).send(user))
                .catch( (error) => res.status(400).send(error));
            } else {
                res.status(200).send(user);
            }
        })
        .catch( (error) => res.status(400).send(error));
    },

    getUser: (req, res) => {
        if (getAuthenticatedUserId(req, res) != req.params.id) return res.status(403).send({message: 'Forbidden'});
        return models.User.findById(req.params.id, {
            include: [{
                all: true, 
                nested: true,
            }],
        })
        .then( (user) => {
            if (!user) {
                return res.status(404).send({message: 'User not found.'});
            }
            return res.status(200).send(user);
        })
        .catch( (error) => res.status(400).send(error));
    },

    updateUser: (req, res) =>{
        if (getAuthenticatedUserId(req, res) != req.params.id) return res.status(403).send({message: 'Forbidden'});
        return models.User.findById(req.params.id)
        .then( (user) => {
            if (!user) return res.status(404).send({message: 'User not found'});
            return user.update({
                email:      req.body.email      || user.email,
                password:   req.body.password   || user.password,
                firstName:  req.body.firstName  || user.firstName,
                lastName:   req.body.lastName   || user.lastName,
                gender:     req.body.gender     || user.gender,
                position:   req.body.position   || user.position,
            })
            .then( () => res.status(200).send(user))
            .catch( (error) => res.status(400).send(error));
        })
        .catch( (error) => res.status(400).send(error));
    },

    deleteUser: (req, res) => {
        if (getAuthenticatedUserId(req, res) != req.params.id) return res.status(403).send({message: 'Forbidden'});
        return models.User.findById(req.params.id)
        .then( (user) => {
            if (!user) return res.status(404).send({message: 'User not found'});
            return user.update({
                isEnabled: false,
            })
            .then( () => res.status(200).send(user))
            .catch( (error) => res.status(400).send(error));
        })
        .catch( (error) => res.status(400).send(error));
    },

    setUserAddress: (req, res) => {
        const user_id = getAuthenticatedUserId(req, res);
        return models.User.findById(user_id, {
            include: [{
                all: true, 
                nested: true,
            }],
        })
        .then( (user) => {
            const address = user.address;
            if (!address) {
                return user.createAddress({
                    addressLine1: req.body.addressLine1,
                    addressLine2: req.body.addressLine2,
                    city:        req.body.city,
                    state:       req.body.state,
                    postalCode:  req.body.postalCode,
                    country:     req.body.country,
                })
                .then( () => {return user.reload().then(() => res.status(200).send(user));})
                .catch( (error) => res.status(400).send(error));
            } else {
                return address.update({
                    addressLine1: req.body.addressLine1,
                    addressLine2: req.body.addressLine2,
                    city:        req.body.city,
                    state:       req.body.state,
                    postalCode:  req.body.postalCode,
                    country:     req.body.country,
                })
                .then( () => res.status(200).send(user))
                .catch( (error) => res.status(400).send(error));
            }
        })
        .catch( (error) => res.status(400).send(error));
    },

};
