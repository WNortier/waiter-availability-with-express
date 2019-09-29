let express = require('express');
let app = express();
let bodyParser = require('body-parser')
const exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'))


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/", function(req, res){
  res.send("Basic ExpressJS Server Template");
});

app.get('/', function (req, res) {
    res.render('home');
});

app.post('/settings', function(req, res){
    res.render('home')
});


let PORT = process.env.PORT || 3007;

app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});