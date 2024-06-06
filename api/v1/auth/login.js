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

    if (!user[0].verified) {
        return res.status(400).send({error: "you need to be verified to login"})
    }

    const expiration = new Date().getTime() + 1000 * 60 * 60 * 24 * 7;

    res.status(200).send({message: "connection successful", token: jwt.sign({user: {id: user[0].id, username: user[0].username, name: user[0].name, lastname: user[0].lastname, admin: user[0].admin}, expiration: expiration}, process.env.JWTSecret)});
});

module.exports = router;