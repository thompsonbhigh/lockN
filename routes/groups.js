const express = require('express');
const router = express.Router();
const { auth } = require('./login');
const db = require('../db');

router.get('/', auth, async (req, res) => {
    res.render('groups');
});

router.get('/create', async (req, res) => {
    const userGroup = await db.query('SELECT group_name FROM users WHERE id = $1', [req.cookies.user.id]);
    if (userGroup) {
        res.redirect('/groups');
        return;
    }
    res.render('createGroup');
});

router.post('/create', async (req, res) => {
    const groupName = req.body.gname;
    if (!req.body.inviteonly) {
        inviteOnly = false;
    } else {
        inviteOnly = true;
    }
    await db.query('INSERT INTO groups (name, invite_only) VALUES ($1, $2)', [groupName, inviteOnly]);
    await db.query('UPDATE users SET group_name = $1 WHERE id = $2', [groupName, req.cookies.user.id]);
    res.redirect('/groups');
});

module.exports = router;