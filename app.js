const express         = require('express'),
      { login, auth } = require('./routes/login.js'),
      plan            = require('./routes/plan.js'),
      addExercise     = require('./routes/addExercise.js'),
      createAccount   = require('./routes/createAccount.js'),
      logout          = require('./routes/logout.js'),
      tasks           = require('./routes/tasks.js'),
      goals           = require('./routes/goals.js'),
      leaderboard     = require('./routes/leaderboard.js');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');   
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(session({
    secret: '72Ghis^%&nDjhs8@^bDj8',
    resave: false,
    saveUninitialized: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use('/login', login);
app.use('/plan', plan);
app.use('/addExercise', addExercise);
app.use('/createAccount', createAccount);
app.use('/logout', logout);
app.use('/tasks', tasks);
app.use('/goals', goals);
app.use('/leaderboard', leaderboard);

user = null;
app.get('/', (req, res) => {
  user = req.cookies.user;
  console.log(user);
  res.render('home', user);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});