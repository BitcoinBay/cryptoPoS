const express = require('express');
const axios = require('axios');

const wrap = require('../middlewares/wrap');
const sampleRoute = require('./api/sampleRoute');

const router = express.Router();

router.get('/', wrap(async (req, res) => {
    res.status(200).json({
        data: "Bitbox Express Boilerplate"
    });
}));

router.use('/sample', sampleRoute);

module.exports = router;
