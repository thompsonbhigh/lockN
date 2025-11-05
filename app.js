const express = require('express'),
      login   = require('./routes/login.js');

const app = express();
const port = 3000;

app.use(express.static(__dirname + '/styles'));
app.use('/login', login);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});