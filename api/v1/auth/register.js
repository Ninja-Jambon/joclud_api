const express = require('express');
const sha256 = require("sha256");

const { getUser, addUser } = require("../../../libs/mysql");

const router = express.Router();

router.post('/', async (req, res) => {
    const {username, name, lastname, password} = req.body;

    if (!username || !name || !lastname || !password) {
        return res.status(500).send({error: "invalid request"});
    }

    const user = await getUser(username);

    if (user[0]) {
        return res.status(500).send({error: "user already exist"});
    }

    await addUser(username, name, lastname, sha256(password));
    res.status(200).send({message: "success"});
});

module.exports = router;