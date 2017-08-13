var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var todos = require('./routes/todos');

var port = 5000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/todos', todos);

app.listen(port, function(){
    console.log('Listening on port', port); 
});