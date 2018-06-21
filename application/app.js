var express = require('express'); //importa o Express
var app = express(); //controi e atribui a "instancia" do express para o app.
var port = 1997; // define uma variavel como 1997 que sera utilizada posteriomente como porta
var passport = require('passport'); //importa o passport
var passportLocal = require('passport-local'); // importa o Passport local (para autenticação em banco de dados)
var passportHttp = require('passport-http');
var bodyParser = require('body-parser'); // importa o body parser, para ler as credenciais dos body request
var cookieParser = require('cookie-parser');// importa o cookie parser para armazenar o ID de Sessão no navegador
var expressSession = require('express-session');// importa o express session para armazenar o Id de Sessão no serverSide, entre outros paranauê's'
var db = require('db.js');
authCallback =function(err,res){
  if (err) {
    // error handling code goes here
    console.log("ERROR : ",res);
  } else {
    // code to execute on data retrieval
    console.log("result from db is : ",res);
  }
}
var flash = require('connect-flash');
app.use(flash());

app.set('view engine', 'ejs');//define o viewEngine (Embeed JS)
app.use(express.static('public'));

//estes procedimentos precisam ser feitos antes do passport.initialize e session serem construidos
app.use(bodyParser.urlencoded({ extender: false}));
app.use(cookieParser());
app.use(expressSession({
  secret: 'secret',
  resave:  false,
  saveuninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy(db.userPassAuth));

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  db.findUserById(id, function(err, user) {
    done(err, user);
  });
});

app.get('/', function(req, res){
  res.render('index',{
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  });
});

app.get('/login', function(req, res) {
    // res.send();
    res.render('login', {message: req.flash('error')});


});

app.post('/login', passport.authenticate('local', { successRedirect: '/',
failureRedirect: '/login',
failureFlash: true }), function(req, res, next){
  if (err) {
    return next(err); // Error 500
  }

  if (!user) {
    //Authentication failed
    return res.json(401, { "error": info.message });
  }
  //Authentication successful
  res.send(200);
});

app.listen(port, function(){
  console.log('http://127.0.01:' + port +'/');
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
