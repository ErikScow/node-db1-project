const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

//Request handlers:

server.get('/api/accounts', (req, res) => {
    db.select('*').from('accounts')
        .then(accounts => {
            res.status(200).json(accounts)
        })
        .catch(error => {
            res.status(500).json({ message: 'Failed to get accounts'})
        })
})

module.exports = server;
