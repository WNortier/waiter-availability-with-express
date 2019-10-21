'use strict';
//Express
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser')
const LoginsRoutes = require('./routes/logins-routes')
const WaitersRoutes = require('./routes/waiters-routes')
const app = express();
const session = require('express-session');
const flash = require('express-flash');
const LoginsFactory = require('./services/logins-factory')
const WaitersFactory = require('./services/waiters-factory')
//Postgresql
const pg = require("pg");
const Pool = pg.Pool;
//Should we use an SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}
//Which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://warwick:pg123@localhost:5432/javascriptcafe';
const pool = new Pool({
  connectionString,
  ssl: useSSL
});

const loginsFactory = LoginsFactory(pool)
const waitersFactory = WaitersFactory(pool)
const loginsRoutes = LoginsRoutes(loginsFactory)
const waitersRoutes = WaitersRoutes(waitersFactory)

app.use(session({
  secret: "<add a secret string here>",
  resave: false,
  saveUninitialized: true
}));
//Flashmessaging
app.use(flash());
//Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
//Bodyparser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Logins Routes
//app.get("/", mockRoutes.sendRoute);
app.get('/', loginsRoutes.home);
app.get('/home', loginsRoutes.returnHome)
app.get('/about', loginsRoutes.about)
app.get('/displayCreateAccount', loginsRoutes.displayCreateAccount)
app.post('/getCreateAccount', loginsRoutes.getCreateAccount)
app.post('/login', loginsRoutes.getLogin);
app.post("/reset", loginsRoutes.getReset);
//Waiters Routes

let portNumber = process.env.PORT || 4007;

app.listen(portNumber, function () {
  console.log('App starting on port', portNumber);
});