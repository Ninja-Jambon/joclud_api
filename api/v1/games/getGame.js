const express = require('express');
const jwt = require('jsonwebtoken');

const {getGame} = require("../../../libs/mysql.js")

const router = express.Router();

router.post('/', async (req, res) => {
    const {token, gameid} = req.body;

    if (!token) {
        return res.status(400).send({error: "invalid token"});
    }

    try {
        jwt.verify(token, process.env.JWTSecret);
    } catch {
        return res.status(400).send({error: "invalid token"});
    }

    const game = await getGame(gameid)

    if (!game[0]) {
        return res.status(400).send({error: "this game doesn't exist in the data base"})
    };
    
    res.status(200).send(game[0]);
});

module.exports = router;