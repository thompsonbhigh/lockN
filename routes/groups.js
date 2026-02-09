const express = require('express');
const router = express.Router();
const { auth } = require('./login');

router.get('/', auth, async (req, res) => {
    res.render('groups');
});

router.get('/create', async (req, res) => {
    res.render('createGroup');
});

module.exports = router;