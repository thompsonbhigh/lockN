const express = require('express');
const router = express.Router();
const { auth } = require('./login');

router.get('/', auth, function(req, res){
    res.render('planSelection');
});

module.exports = router;