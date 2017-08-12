var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var tasks = require('./routes/tasks');

var port = 5000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/tasks', tasks);

app.listen(port, function(){
    console.log('Listening on port', port); 
});