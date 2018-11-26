var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var fs = require('fs');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.engine('xyz', function(filepath, options, callback){
    // console.log(2222222222222222222222,filepath)
    fs.readFile(filepath, function(err, content){
        if(err) return callback(err)
        var rendered = content.toString().replace('&title&', '<title>' + options.title + '</title>')
        .replace('&message&','<h1>' + options. message + '</h1>')
        .replace('&abc&','<article>' + options.abc + '</article>')
        return callback(null, rendered)
    })
})

app.set('views', './views');
app.set('view engine', 'xyz')

module.exports = app;
