const express = require('express');
const jwt = require('jsonwebtoken');

const {addHelper, getGame} = require("../../../libs/mysql.js")

const router = express.Router();

router.post('/', async (req, res) => {
    const {token, gameid} = req.body;

    if (!token) {
        return res.status(400).send({error: "invalid token"});
    }

    try {
        const user = jwt.verify(token, process.env.JWTSecret);
        
        const game = await getGame(gameid);

        if (!game[0]) {
            return res.status(400).send({error: "this game doesn't exist"});
        }

        if (JSON.parse(game[0].helpers).includes(user.user.id)) {
            return res.status(400).send({error: "you are already an helper for this game"});
        }

        await addHelper(user.user.id, gameid);
    } catch {
        return res.status(400).send({error: "invalid token"});
    }

    res.status(200).send({message: "success"});
});

module.exports = router;