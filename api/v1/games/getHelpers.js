const express = require('express');
const jwt = require('jsonwebtoken');

const {getHelpers} = require("../../../libs/mysql.js")

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

    const helpers = await getHelpers(gameid)

    if (!helpers[0]) {
        return res.status(400).send({error: "this game doesn't exist in the data base"})
    };
    
    res.status(200).send(JSON.parse(helpers[0].helpers));
});

module.exports = router;