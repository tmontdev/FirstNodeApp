var express = require('express'); //importa o Express
var app = express(); //controi e atribui a "instancia" do express para o app.
var port = 1997; // define uma variavel como 1997 que sera utilizada posteriomente como porta
var passport = require('passport'); //importa o passport
var passportLocal = require('passport-local'); // importa o Passport local (para autenticação em banco de dados)
var bodyParser = require('body-parser') // importa o body parser, para ler as credenciais dos body request
var cookieParser = require('cookie-parser')// importa o cookie parser para armazenar o ID de Sessão no navegador
var expressSession = require('express-session')// importa o express session para armazenar o Id de Sessão no serverSide, entre outros paranauê's'
const { Pool, Client } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'toor',
  port: 3211,
})

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'toor',
  port: 3211,
})
client.connect()

client.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  client.end()
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
  done(null, user);
  done(null, null);
  done(new Error('ouch!'));
}));



app.get('/', function(req, res){
    res.render('index',{
        isAuthenticated: false,
        user: req.user
    });
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', passport.authenticate('local'), function(re, res){

});

app.listen(port, function(){
    console.log('http://127.0.01:' + port +'/');
});
