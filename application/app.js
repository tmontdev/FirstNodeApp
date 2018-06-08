var express = require('express'); //importa o Express
var app = express(); //controi e atribui a "instancia" do express para o app.
var port = 1997; // define uma variavel como 1997 que sera utilizada posteriomente como porta
var passport = require('passport'); //importa o passport
var passportLocal = require('passport-local'); // importa o Passport local (para autenticação em banco de dados)
var passportHttp = require('passport-http');
var bodyParser = require('body-parser'); // importa o body parser, para ler as credenciais dos body request
var cookieParser = require('cookie-parser');// importa o cookie parser para armazenar o ID de Sessão no navegador
var expressSession = require('express-session');// importa o express session para armazenar o Id de Sessão no serverSide, entre outros paranauê's'
const {Pool} = require('pg')
const connectionString = 'postgresql://postgres:toor@localhost:5432/postgres'

const pool = new Pool({
  connectionString: connectionString,
});

pool.query('SELECT * from teste where username = \'tmontdv\' and password = \'Blusterysnail360\' ', (err, res) => {
  res.rows.length
  res.rows.forEach(row => {
    console.log("user"+row.username)
  });
  pool.end()
});

app.set('view engine', 'ejs');//define o viewEngine (Embeed JS)

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

passport.use(new passportLocal.Strategy(function(username, password, done){

  if(username === password){
    done(null, { id: username, name: username});
  }else{
    done(null, null);
  }
}));

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  done(null, {id: id, name: id});
});

app.get('/', function(req, res){
    res.render('index',{
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', passport.authenticate('local'), function(re, res){
  res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})

app.listen(port, function(){
    console.log('http://127.0.01:' + port +'/');
});
