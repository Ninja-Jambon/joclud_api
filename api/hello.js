const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.use(express.json());
router.use(cookieParser());
router.use(cors());

router.get('/', (req, res) => {
    res.send('Hello World!');
});

module.exports = router;