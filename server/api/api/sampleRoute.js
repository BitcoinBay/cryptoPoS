const express = require('express');
const axios = require('axios');

const BITBOXSDK = require("bitbox-sdk");
const BITBOX = new BITBOXSDK();

const wrap = require('../../middlewares/wrap');

const router = express.Router();


router.get('/', wrap(async (req, res) => {
    try {
        const info = await BITBOX.Blockchain.getBlockchainInfo();
        res.status(200).json({
            status: info
        });
    } catch (err) {
        res.status(404).json({
            error: err
        });
    }
}));

module.exports = router;
