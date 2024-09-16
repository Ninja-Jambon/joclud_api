const express = require('express');
const jwt = require('jsonwebtoken');

const { getConnection, getHelpers } = require("../../../libs/mysql.js")

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

    const connection = getConnection();
    const helpers = await getHelpers(gameid)
    connection.end();

    if (!helpers[0]) {
        return res.status(400).send({error: "this game doesn't exist in the data base"})
    };
    
    res.status(200).send(JSON.parse(helpers[0].helpers));
});

module.exports = router;