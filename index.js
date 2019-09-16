let express = require('express');
let app = express();
let bodyParser = require('body-parser')
const exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'))


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// app.get("/", function(req, res){
//   res.send("Basic ExpressJS Server Template");
// });

app.get('/', function (req, res) {
    res.render('home');
});

app.post('/settings', function(req, res){
    let smsCost = req.body.smsCost;
    let callCost = req.body.callCost;
    let warningLevel = req.body.warningLevel;
    let criticalLevel = req.body.criticalLevel;

    var settings = {
      smsCost,
      callCost,
      warningLevel,
      criticalLevel
    };

    // process data
    globalSetings = settings;

    // note that data can be sent to the template
    res.render('home', {settings})
});


let PORT = process.env.PORT || 3007;

app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});