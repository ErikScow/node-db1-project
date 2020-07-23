const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

//handlers

server.post('/api/accounts', validateAccount, (req, res) => {
    db('accounts').insert(req.body)
        .then(accountId => {
            res.status(201).json(accountId)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({message: 'failed to post to database'})
        })
})

server.get('/api/accounts', (req, res) => {
    db('accounts')
        .then(accounts => {
            res.status(200).json(accounts)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({message: 'falied to get accounts'})
        })
})

server.delete('/api/accounts/:id', validateId, (req, res) => {
    db('accounts').where( { id: req.params.id}).del()
        .then(() => res.status(200).json({message: 'successfully deleted'}))
        .catch(err => {
            console.log(err)
            res.status(500).json({message: 'could not delete from database'})
        })
})

server.put('/api/accounts/id', (req, res) => {
    
})

//middleware

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
    db('accounts').where( {id: req.params.id} )
        .then(account => {
            if(account.length > 0){
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
