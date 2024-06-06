const express = require('express');
const jwt = require('jsonwebtoken');

const {getUnverifiedUsers} = require("../../../libs/mysql.js")

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

        if (!user.admin) {
            return res.status(400).send({error: "unauthorized"});
        }
    } catch {
        return res.status(400).send({error: "invalid token"});
    }

    const users = await getUnverifiedUsers();
    res.status(200).send(users);
});

module.exports = router;