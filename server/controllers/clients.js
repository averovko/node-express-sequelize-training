const models = require('../models');
const getAuthenticatedUserId = require('../utils/jwtParser').getAuthenticatedUserId;

module.exports = {

    create: (req, res) => {
        return models.Client.create({
            firstName: req.body.firstName,
            lastName:  req.body.lastName,
            orgName:   req.body.orgName,
            type:      req.body.type,
            userId:    getAuthenticatedUserId(req, res),
        })
        .then( (client) => res.status(201).send(client) )
        .catch( (error) => res.status(400).send(error) );

    },

    getAll: (req, res) => {
        return models.Client.findAll( { where: { userId: getAuthenticatedUserId(req, res) } } )
        .then( (clients) => res.status(200).send(clients) )
        .catch( (error) => res.status(400).send(error) );
    },

    getById: (req, res) => {
        return models.Client.findById(req.params.id)
        .then( (client) => {
            if (!client) {
                return res.status(404).send({message: 'Client not found.'});
            }
            if (client.userId != getAuthenticatedUserId(req, res)) {
                return res.status(403).send('Forbidden');
            }
            return res.status(200).send(client);
        })
        .catch( (error) => res.status(400).send(error) );
    },

    update: (req, res) => {
        return models.Client.findById(req.params.id)
        .then( (client) => {
            if (!client) return res.status(404).send({message: 'Client not found'});
            if (client.userId != getAuthenticatedUserId(req, res)) return res.status(403).send({message: 'Forbidden'});

            return client.update({
                firstName:      req.body.firstName      || client.firstName,
                lastName:       req.body.lastName       || client.lastName,
                orgName:        req.body.orgName        || client.orgName,
                type:           req.body.type           || client.type,
            })
            .then( () => res.status(200).send(client))
            .catch( (error) => res.status(400).send(error));
        })
        .catch( (error) => res.status(400).send(error));
    },

    delete: (req, res) => {
        return models.Client.findById(req.params.id)
        .then( (client) => {
            if (!client) return res.status(404).send({message: 'Client not found'});
            if (client.userId != getAuthenticatedUserId(req, res)) return res.status(403).send({message: 'Forbidden'});

            return client.update({
                isEnabled: false,
            })
            .then( () => res.status(200).send(client))
            .catch( (error) => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    },

    setAddress: (req, res) => {
        return models.Client.findById(req.body.clientId, {
            include: [{
                all: true, 
                nested: true,
            }],
        })
        .then( (client) => {
            if (!client) return res.status(404).send({message: 'Client not found'});
            if (client.userId != getAuthenticatedUserId(req, res)) return res.status(403).send({message: 'Forbidden'});

            const address = client.address;
            if (!address) {
                return client.createAddress({
                    addressLine1: req.body.addressLine1,
                    addressLine2: req.body.addressLine2,
                    city:        req.body.city,
                    state:       req.body.state,
                    postalCode:  req.body.postalCode,
                    country:     req.body.country,
                })
                .then( () => client.reload().then( () => res.status(200).send(client)))
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
                .then( () => res.status(200).send(client))
                .catch( (error) => res.status(400).send(error));
            }
        })
        .catch( (error) => res.status(400).send(error));
    },

};
