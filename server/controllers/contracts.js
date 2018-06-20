const models = require('../models');
const getAuthenticatedUserId = require('../utils/jwtParser').getAuthenticatedUserId;
const Op = models.Sequelize.Op;

module.exports = {

    create: (req, res) => {
        return models.Contract.create({
            projectName: req.body.projectName,
            value: req.body.value,
            duration: req.body.duration,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            status: req.body.status,
            userId: getAuthenticatedUserId(req, res),
            clientId: req.body.clientId,
        })
        .then( (contract) => res.status(201).send(contract) )
        .catch( (error) => res.status(400).send(error) );
    },

    getAll: (req, res) => {
        return models.Contract.findAll( { where: { userId: getAuthenticatedUserId(req, res) } } )
        .then( (contracts) => res.status(200).send(contracts) )
        .catch( (error) => res.status(400).send(error) );
    },

    getById: (req, res) => {
        return models.Contract.findById(req.params.id)
        .then( (contract) => {
            if (!contract) {
                return res.status(404).send({message: 'Contract not found.'});
            }
            if (contract.userId != getAuthenticatedUserId(req, res)) {
                return res.status(403).send('Forbidden');
            }
            return res.status(200).send(contract);
        })
        .catch( (error) => res.status(400).send(error) );
    },

    update: (req, res) => {
        return models.Contract.findById(req.params.id)
        .then( (contract) => {
            if (!contract) return res.status(404).send({message: 'Contract not found'});
            if (contract.userId != getAuthenticatedUserId(req, res)) return res.status(403).send({message: 'Forbidden'});
            if (contract.status !== 'active') return res.status(410).send({message: 'Contract has ' + contract.status + ' status.'});

            return contract.update({
                projectName: req.body.projectName || contract.projectName, 
                value:       req.body.value       || contract.value,
                duration:    req.body.duration    || contract.duration,
                startDate:   req.body.startDate   || contract.startDate,
                endDate:     req.body.endDate     || contract.endDate,
                status:      req.body.status      || contract.status,
                clientId:    req.body.clientId    || contract.clientId,
            })
            .then( () => res.status(200).send(contract))
            .catch( (error) => res.status(400).send(error));
        })
        .catch( (error) => res.status(400).send(error));
    },

    delete: (req, res) => {
        return models.Contract.destroy({
            where: {
                [Op.and]: [
                    {id: req.params.id}, 
                    {status: 'active'},
                    {userId: getAuthenticatedUserId(req, res)},
                ]
            }
        })
        .then( (count) => {
            if(count === 1){
                res.status(200).send({message:"Contract deleted successfully"});          
            }
            else
            {
                res.status(404).send({message:"Contract record not found"});
            }
        })
        .catch( (error) => res.status(400).send(error));
    },
    
};
