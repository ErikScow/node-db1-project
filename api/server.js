const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

//Request handlers:

server.post('/api/accounts', validateAccount, (req, res) => {
    console.log(req.body)
    db('accounts').insert(req.body)
    .then( accountId => {
        res.status(201).json(accountId)
    })
    .catch( error => {
        console.log('could not post to database', error)
        res.status(500).json({ message: 'could not post to database' })
    })
})

server.get('/api/accounts', (req, res) => {
    db.select('*').from('accounts')
        .then(accounts => {
            res.status(200).json(accounts)
        })
        .catch(error => {
            res.status(500).json({ message: 'Failed to get accounts'})
        })
})

//Middlewares:

function validateAccount(req, res, next){
    if(!req.body){
        res.status(400).json({ message: 'missing account data'})
    } else if (!req.body.name){
        res.status(400).json({ message: 'missing account name data'})
    } else if (!req.body.budget) {
        res.status(400).json({ message: 'missing budget data'})
    } else {
        next()
    }
}

function validateId(req, res, next){
    const { id } = req.params.id
    db('accounts').where( {id})
        .then( account => {
            if(account){
                req.account = account
                next()
            } else {
                res.status(400).json({ message: 'invalid account id'})
            }
        })
        .catch( error => {
           res.status(500).json({ message: 'could not retrieve from database'})
        })
    
}

module.exports = server;
