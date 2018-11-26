var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!', abc: 'fdzaffchjnhvjvdnjsdbvjnnnnnnnnnnnnnnnddddddddddddddddddddddddddddbvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvuuuuuuuuuuuuuuuuuuuuuuuu,fsgjjjjjjjjjag' })
});

module.exports = router;
