const express = require('express');
const router = express.Router();
const hash = require('pbkdf2-password')();
const session = require('express-session');

router.use(express.urlencoded());
router.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'fyhuv2@#&@b32ubfdf2dj393mj3k'
}));

router.use(function(req, res, next){
    var err  = req.session.error;
    var msg  = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

var users = {
    thompson: {name: 'thompson'}
};

hash({password: 'baines'}, function(err, pass, salt, hash) {
    if (err) throw err;
    users.thompson.salt = salt;
    users.thompson.hash = hash;
});

function authenticate(name, pass, fn) {
    if (!module.main) console.log('authenticating %s:%s', name, pass);
    var user = users[name];
    // query db for username
    if (!user) return fn(null, null);
    hash({password: pass, salt: user.salt}, function(err, pass, salt, hash) {
        if (err) return fn(err);
        if (hash == user.hash) return fn(null, user);
        fn(null, null);
    });
}

function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

router.get('/', function(req, res){
    res.render('login');
});

router.get('/restricted', restrict, function(req, res){
    res.send('Wahoo! restricted area, ' + req.session.user.name + '!');
});

router.get('/logout', function(req, res){
    req.session.destroy(function(){
        res.redirect('/home');
    });
});

router.post('/', function(req, res, next){
    if (!req.body) return res.sendStatus(400);
    authenticate(req.body.username, req.body.password, function(err, user){
        if (err) return next(err);
        if (user){
            req.session.regenerate(function(){
                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.name
                  + ' click to <a href="/logout">logout</a>. '
                  + ' You may now access <a href="/login/restricted">/login/restricted</a>.';
                res.redirect('/');
            });
        } else {
            req.session.error = 'Authentication failed, please check your '
              + ' username and password.';
            res.redirect('/login');
        }
    });
});

module.exports = router;