const express = require('express');
const jwt = require('jsonwebtoken');

const { getConnection, getGame } = require("../../../libs/mysql.js")

const router = express.Router();

router.post('/', async (req, res) => {
    const {token, gameid} = req.body;

    if (!token) {
        return res.status(400).send({error: "invalid token"});
    }

    if (!gameid) {
        return res.status(400).send({error: "invalid gameid"});
    }

    try {
        const user = jwt.verify(token, process.env.JWTSecret);

        if (user.expiration < Date.now()) {
            return res.status(400).send({error: "token expired"});
        }
    } catch {
        return res.status(400).send({error: "invalid token"});
    }

    const connection = await getConnection();
    const game = await getGame(connection, gameid)
    connection.end();

    if (!game[0]) {
        return res.status(400).send({error: "this game doesn't exist in the data base"})
    };
    
    res.status(200).send(game[0]);
});

module.exports = router;