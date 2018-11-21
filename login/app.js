var express = require("express");
var app = express();
var path = require("path");
var port = 4000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.set('views', path.join(__dirname));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

mongoose.connect("mongodb://localhost:27017/login", { useNewUrlParser: true });
mongoose.Promise = global.Promise;

var Schema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: {
        type: String,
        unique: true,
        index: {
            unique: true
            }
        },
    username : {
        type: String,
        unique: true,
        index: {
            unique: true
            }
        },
    password: String,
});

var Data = mongoose.model('Data', Schema)

app.get('/', function(req, res){
    res.sendFile(__dirname + '/home.html');
});

app.get('/home', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.get('/signup',function(req,res){
    res.sendFile(__dirname + '/signup.html');
})
app.post('/signup', function(req, res){
    var dbs = new Data(req.body);
    dbs.save()
        .then(item =>{
            Data.find({}, function(err, docs){
                 console.log(docs)
                if(err) res.json(err);
                else     res.render('sucess', {login:docs});
            });
        })
        .catch(err=>{
            res.status(400).send('Username or Email already exist');
        });
});
app.get('/login', function(req, res){
    res.sendFile(__dirname + '/login.html');
});

app.post('/loginsucess', function(req, res){
    Data.findOne({username: req.body.username}, function(err, user){
        if(user == null){
            res.send('no data found')
        }
        else if(user.username === req.body.username && user.password === req.body.password)
        {
            res.sendFile(__dirname + '/loginsuccess.html');
        }
        else
        {
            res.send("login invalid");
        }
    });
});


app.listen(port, ()=>{
    console.log("server listening to port " + port)
});