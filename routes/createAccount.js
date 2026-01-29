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
    const confirmPassword = req.body.confpsw;
    console.log("uname: " + username);
    console.log("psw: " + password);
    console.log("confpsw: " + confirmPassword);

    if (!(password === confirmPassword)) {
        console.log("Passwords do not match")
        res.redirect('../createAccount');
        return;
    }
    
    const salt = 10;

    bcrypt.hash(password, salt, async function(err, hash) {
        if (err) {
            console.error(err);
            return;
        }
        try {
            await db.query('INSERT INTO users (username, hash) VALUES ($1, $2)', [username, hash]);
            const result = await db.query('SELECT id FROM users WHERE username = $1', [username]);
            const userId = result.rows.at(0).id;
            await db.query('INSERT INTO leaderboard (user_id) VALUES ($1)', [userId]);
            res.redirect('../login');
        } catch (error) {
            res.redirect('../createAccount');
        }

    });
});

module.exports = router;