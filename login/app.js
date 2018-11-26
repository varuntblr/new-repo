var express = require("express");
var app = express();
var path = require("path");
var port = 4000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var redis = require("redis"); 
var client  = redis.createClient();


app.set('views', path.join(__dirname));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 4000, client: client,ttl :  260}),
    saveUninitialized: false,
    resave: false
}));
mongoose.connect("mongodb://localhost:27017/login", { useNewUrlParser: true });
mongoose.Promise = global.Promise;

var sess;

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

Schema.pre('save', function(next){
    var user =this;
    if(!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);
            user.password = hash;
            next();

        });
    });
});

Schema.methods.comparePassword = function(bodypassword, cb){
    var user =this;
    bcrypt.compare(bodypassword, user.password, function (err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
        });
};

var Data = mongoose.model('Data', Schema)

app.get('/', function(req, res){
    res.sendFile(__dirname + '/home.html');
    console.log(sess);
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
                //  console.log(docs)
                if(err) res.json(err);
                else     res.render('sucess', {login:docs});
            });
        })
        .catch(err=>{
            res.status(400).sendFile(__dirname + '/signupfailed.html'); 
        });
});
app.get('/check',function(req,res){
    console.log(req.session.ur)
     if(req.session.ur == undefined)
    { 
        res.redirect("/login");
    }else{
        res.status(400).sendFile(__dirname + '/allogin.html');
    }

})
app.get('/login', function(req, res){
    res.sendFile(__dirname + '/login.html');
   
});

app.post('/loginsucess', function(req, res){
    sess = req.session;
    Data.findOne({username: req.body.username}, function(err, user){
        sess.ur = user;
        // console.log(sess)
        if(sess.ur == null){
            res.sendFile(__dirname + '/err.html'); 
        }
        else if(user.username === req.body.username)
        {
            user.comparePassword(req.body.password, function(err, isMatch) {
                if(isMatch){
                    res.sendFile(__dirname + '/loginsuccess.html');
                }else {
                    res.sendFile(__dirname + '/err.html'); 
                }
            });
        }  
        else
        {
            res.sendFile(__dirname + '/err.html'); 
        }
    });
});

app.get('/logout', function(req, res){
    req.session.destroy(function(err){
        if(err){
            res.sendFile(__dirname + '/err.html');
        }else{
            req.session = null
            // console.log(sess)
            res.sendFile(__dirname + '/logout.html');        
        }
    });
});

app.get('/delete', function(req, res){
    res.sendFile(__dirname + '/delete.html');
});
app.post('/deletesuccess', function(req, res){
    // console.log(sess)
    Data.findOne({username: req.body.username}, function(err, user){
        if(user == null){
            res.sendFile(__dirname + '/err.html'); 
        }
        else if(user.username === req.body.username)
        {
            user.comparePassword(req.body.password, function(err, isMatch) {
                if(isMatch){
                    var id = user._id;
                    Data.deleteOne({_id:id}, function(err){
                        if(err){
                            console.log(err)
                        }else{
                            res.sendFile(__dirname + '/deletesuccess.html');
                        }
                    });
                }else {
                    res.sendFile(__dirname + '/err.html'); 
                }
            });
        }
        else
        {
            res.sendFile(__dirname + '/err.html'); 
        }
    });
 });

app.listen(port, ()=>{
    console.log("server listening to port " + port)
});