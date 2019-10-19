'use strict';
//Express
const express = require('express');
const app = express();
//Flashmessaging
const flash = require('express-flash');
const session = require('express-session');
app.use(session({
  secret: "<add a secret string here>",
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
//Handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//Postgresql
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}
const pg = require("pg");
const connectionString = process.env.DATABASE_URL || 'postgresql://warwick:pg123@localhost:5432/coffeshop';

const Pool = pg.Pool;
const pool = new Pool({
  connectionString,
  ssl: useSSL
});
//Views
app.use(express.static(path.join(__dirname + '/public')));
//Bodyparser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//Logins
const LoginsFactory = require('./services/logins-factory')
const LoginsRoutes = require('./routes/logins-routes')
const loginsFactory = LoginsFactory(pool)
const loginsRoutes = LoginsRoutes(loginsFactory)
//Waiters
const WaitersFactory = require('./services/waiters-factory')
const WaitersRoutes = require('./routes/waiters-routes')
const waitersFactory = WaitersFactory(pool)
const waitersRoutes = WaitersRoutes(waitersFactory)
//Logins Routes
//app.get("/", mockRoutes.sendRoute);
app.get('/', loginsRoutes.primary);
app.get('/about', loginsRoutes.aboutRoute)
app.get('/home', loginsRoutes.homeRoute)
app.post('/aPostRoute', loginsRoutes.aPostRoute);
//Waiters Routes

let portNumber = process.env.PORT || 4007;

app.listen(portNumber, function () {
  console.log('App starting on port', portNumber);
});