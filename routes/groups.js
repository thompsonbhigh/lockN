const express = require('express');
const router = express.Router();
const { auth } = require('./login');

router.get('/', auth, async (req, res) => {
    res.render('groups');
});

module.exports = router;