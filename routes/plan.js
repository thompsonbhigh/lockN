const express = require('express');
const router = express.Router();
const { EventEmitter } = require('events');
const eventEmitter = new EventEmitter();

router.get('/', function(req, res){
    res.render('plan');
});

router.get('/custom', function(req, res){
    const planType = 'Custom';
    res.redirect('/plan');
});

eventEmitter.on('add', () => {
    console.log('Add!');
});

module.exports = router;