const express = require('express');
const jwt = require('jsonwebtoken');

const { getConnection, getUnverifiedUsers } = require("../../../libs/mysql.js")

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

        if (!user.user.admin) {
            return res.status(400).send({error: "unauthorized"});
        }
    } catch {
        return res.status(400).send({error: "invalid token"});
    }

    const connection = await getConnection();
    const users = await getUnverifiedUsers(connection);
    connection.end();
    res.status(200).send(users);
});

module.exports = router;