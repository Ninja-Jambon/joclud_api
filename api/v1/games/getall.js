const express = require('express');
const jwt = require('jsonwebtoken');

const {getGames} = require("../../../libs/mysql.js")

const router = express.Router();

router.post('/', async (req, res) => {
    const {token} = req.body;

    let user;

    try {
        user = jwt.verify(token, process.env.JWTSecret);
    } catch {
        return res.status(500).send({error: "invalid token"});
    }

    const games = await getGames();
    res.status(200).send(games);
});

module.exports = router;