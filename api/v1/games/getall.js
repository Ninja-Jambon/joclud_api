const express = require('express');
const jwt = require('jsonwebtoken');

const {getGames} = require("../../../libs/mysql.js")

const router = express.Router();

router.post('/', async (req, res) => {
    const {token} = req.body;

    if (!token) {
        return res.status(400).send({error: "invalid token"});
    }

    try {
        const user = jwt.verify(token, process.env.JWTSecret);

        if (user.expiration < Date.now()) {
            return res.status(400).send({error: "token expired"});
        }
    } catch {
        return res.status(400).send({error: "invalid token"});
    }

    const games = await getGames();
    res.status(200).send(games);
});

module.exports = router;