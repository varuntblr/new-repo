var express = require("express");
var app = express();
var path = require('path')
var port = 3000;
app.set('views', path.join(__dirname));
app.set('view engine', 'pug');
var mongodb     = require('mongodb');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/node", { useNewUrlParser: true })

var nameSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String
});

var User = mongoose.model("User", nameSchema,);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/addname", (req, res)=>{
  User.find({}, function(err, docs){
    if(err) res.json(err);
    else    res.render('view', {foo: docs});
  })
})
app.post("/addname", (req, res) => {
  var myData = new User(req.body);
  myData.save()
    .then(item => {
        User.find({}, function(err, docs){
        if(err) res.json(err);
        else    res.render('view', {foo: docs});
      }); 
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});
app.get('/delete', function(req, res, next) {
  var id = req.query.id;
  // console.log('id', id)

      // console.log('users', User)
      User.deleteOne({_id: id}, function(err){
        // console.log('delete')
      if (err){
        console.log(err)
      }else{

         res.redirect('/addname');
      }
    })
  });
app.listen(port, () => {
  console.log("Server listening on port " + port);
});
