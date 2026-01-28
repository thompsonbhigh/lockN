const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');
router.get('/', (req, res) => {
    res.render('createAccount.ejs');
});

router.post('/', async (req, res) => {
    const username = req.body.uname;
    const password = req.body.psw;
    
    const salt = 10;

    bcrypt.hash(password, salt, async function(err, hash) {
        if (err) {
            console.error(err);
            return;
        }
        try {
            console.log(username);
            console.log(hash);
            await db.query('INSERT INTO users (username, hash) VALUES ($1, $2)', [username, hash]);
            res.redirect('../login');
        } catch (error) {
            res.redirect('../createAccount');
        }

    });
});

module.exports = router;