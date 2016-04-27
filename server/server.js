var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// var session = require('express-session');
var morgan = require('morgan');

var app = express();

var mongoURI = process.env.MONGO_URI || 'mongodb://localhost/boorish';

mongoose.connect(mongoURI);

// Middleware. Add below as needed

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client')); // this serves all the static assests in the /client folder
// app.use(express.cookieParser('shhhh, very secret'));// used for Auth uncomment when ready
// app.use(session({secret: 'somesecret'})); // used for Auth

require('./config/routes.js')(app, express);

var port = process.env.PORT || 5000;

app.listen(port);

module.exports = app;