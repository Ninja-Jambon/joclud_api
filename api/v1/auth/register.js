const express = require('express');
const sha256 = require("sha256");

const { getConnection, getUser, addUser } = require("../../../libs/mysql");

const router = express.Router();

router.post('/', async (req, res) => {
    const {username, name, lastname, password} = req.body;

    if (!username || !name || !lastname || !password) {
        return res.status(400).send({error: "invalid request"});
    }

    const connection = await getConnection();

    const user = await getUser(connection, username);

    if (user[0]) {
        return res.status(400).send({error: "user already exist"});
    }

    await addUser(connection, username, name, lastname, sha256(password));
    connection.end();
    res.status(200).send({message: "success"});
});

module.exports = router;