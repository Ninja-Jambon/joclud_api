const express = require('express');
const jwt = require('jsonwebtoken');
const sha256 = require("sha256");

const { getUser } = require("../../../libs/mysql");

const router = express.Router();

router.post('/', async (req, res) => {
    const {username, password} = req.body;

    const user = await getUser(username);

    if (!user[0]) {
        return res.status(400).send({error: "wrong login informations"});
    }
    
    if (!(sha256(password) == user[0].password)) {
        return res.status(400).send({error: "wrong login informations"});
    }

    res.status(200).send({message: "connection successful", token: jwt.sign({username: username, expiration: 20000}, process.env.JWTSecret)});
});

module.exports = router;