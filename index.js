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
const loginsRoutes = LoginsRoutes(waitersFactory, loginsFactory, pool)
const waitersRoutes = WaitersRoutes(waitersFactory, loginsFactory)
const two_hours = 1000 * 60 * 60 * 2
const sessionName = 'sid'

app.use(session({
    secret: "ssshfoxdawgs",
    resave: false,
    saveUninitialized: false,
    name: 'sessionName',
    cookie: { maxAge: two_hours,
    secure: false }
}));

//Flashmessaging
app.use(flash());
//Handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
//Bodyparser
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

//Logins Routes
app.get('/', loginsRoutes.home);
app.get('/home', loginsRoutes.returnHome)
app.get('/about', loginsRoutes.displayAbout)
app.post('/login', loginsRoutes.getLogin);
app.get('/displayCreateAccount', loginsRoutes.displayCreateAccount)
app.post('/getCreateAccount', loginsRoutes.getCreateAccount)
app.post("/reset", loginsRoutes.getReset);
app.get("/logout/:email", loginsRoutes.getLogout)
//Waiters Routes
app.post("/getWorkdays/:id/:email", waitersRoutes.getWorkdays)
app.post("/getWorkdays/reset/:id/:email", waitersRoutes.getWaiterReset)

let portNumber = process.env.PORT || 4007;

app.listen(portNumber, function () {
  console.log('App starting on port', portNumber);
});