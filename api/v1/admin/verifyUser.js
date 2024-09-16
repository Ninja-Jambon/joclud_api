const express = require('express');
const jwt = require('jsonwebtoken');

const { getConnection, setVerified, getUser } = require("../../../libs/mysql.js")

const router = express.Router();

router.post('/', async (req, res) => {
    const {token, username} = req.body;

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

    const user = await getUser(connection, username);

    if (!user[0]) {
        return res.status(400).send({error: "invalid userid"});
    }

    if (user[0].verified) {
        return res.status(400).send({error: "user already verified"});
    }

    await setVerified(username);
    connection.end()
    res.status(200).send({message: "user verified"});
});

module.exports = router;