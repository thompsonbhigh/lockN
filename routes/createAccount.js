const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

let passwordMismatch = null;
let usernameShort = null;
let passwordWeak = null;
let usernameExists = null;

router.get('/', (req, res) => {
    res.render('createAccount.ejs', {passwordMismatch: passwordMismatch, usernameShort: usernameShort, passwordWeak: passwordWeak, usernameExists: usernameExists});
});

router.post('/', async (req, res) => {
    passwordMismatch = null;
    usernameExists = null;
    usernameShort = null;
    passwordWeak = null;
    const username = req.body.uname;
    const password = req.body.psw;
    const confirmPassword = req.body.confpsw;

    const usernameExistsInfo = await db.query('SELECT COUNT(*) FROM users WHERE username = $1', [username]);
    usernameExistsCount = usernameExistsInfo.rows.at(0).count;
    if (usernameExistsCount) {
        usernameExists = 'That username is taken'
        res.redirect('../createAccount');
        return;
    }
    if (!(password === confirmPassword)) {
        passwordMismatch = 'Passwords do not match';
        res.redirect('../createAccount');
        return;
    }
    if (username.length < 5) {
        usernameShort = 'Username must be at least 5 characters';
        res.redirect('../createAccount');
        return;
    }
    if (!(password.length >= 8 && /[a-z]+/.test(password) && /[A-Z]+/.test(password) && /\d+/.test(password) && /[^\w\d\s]+/.test(password))) {
        passwordWeak = 'Passwords must be at least 8 characters long and contain: uppercase, lowercase, number, special character';
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
            res.redirect('../login');
        } catch (error) {
            console.error(error);
            res.redirect('../createAccount');
        }

    });
});

module.exports = router;