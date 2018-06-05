var express = require('express');
var app = express();
var port = 1997;

app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('index',{
        isAuthenticated: false,
        user: req.user
    });
});

app.get('/login', function(req, res){
    res.render('login');
});

app.listen(port, function(){
    console.log('http://127.0.0.1:'+port+'/');
});