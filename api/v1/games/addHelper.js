const express = require('express');
const jwt = require('jsonwebtoken');

const { getConnection, addHelper, getGame } = require("../../../libs/mysql.js")

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

        const connection = getConnection();
        
        const game = await getGame(connection, gameid);

        if (!game[0]) {
            return res.status(400).send({error: "this game doesn't exist"});
        }

        if (JSON.parse(game[0].helpers).includes(user.user.username)) {
            return res.status(400).send({error: "you are already an helper for this game"});
        }

        await addHelper(connection, user.user.username, gameid);
        connection.end();
    } catch (error) {
        console.log(error);
        return res.status(400).send({error: "invalid token"});
    }

    res.status(200).send({message: "success"});
});

module.exports = router;