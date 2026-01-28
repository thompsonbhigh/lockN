const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const session = require('express-session');
const bcrypt = require('bcrypt');
const db = require('../db');
require('dotenv').config();

const authJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        return res.redirect('login');;
    }
};

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', async (req, res) => {
    const username = req.body.uname;
    const password = req.body.psw;
    let user;

    try {
        const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        user = {
            id: rows.at(0).id,
            username: rows.at(0).username
        };
        const hashedPassword = rows.at(0).hash;
        console.log(hashedPassword);
        bcrypt.compare(password, hashedPassword, async function(err, result) {
            if (!result) {
                console.log("Incorrect Password");
            }
        });
    } catch (error) {
        console.error(error);
    }

    console.log(user);
    if (!user) {
        return res.redirect('/login');
    }

    const payload = {
        id: user.id,
        username: user.username
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '24h'});
    res.cookie('token', token, {httpOnly: true});

    res.redirect('../');
});

module.exports = {
    login: router, 
    auth: authJWT
}