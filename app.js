const express = require('express'),
      login   = require('./routes/login.js');

const session = require('express-session');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'baines_secret_key'
}));

app.use(express.static(__dirname + '/public'));
app.use('/login', login);

user = null;
app.get('/', (req, res) => {
  user = req.session.user;
  res.render('home');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});