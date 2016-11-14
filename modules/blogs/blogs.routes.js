var express = require('express');
var router = express.Router();


var blogModel = require('./blogs.model');
var _ = require('lodash');

var mongoose = require ("mongoose");
var Blog = mongoose.model('Blog');

router.get('/', function(req, res) {
  var ids = req.body;
  
  console.log('================================================');
  console.log('RETRIEVING ALL BLOGS');
  console.log('================================================');

  Blog.find().exec(function (err, _blogs) {
    if (err){
      console.log(e.toString());
      res.status(400).send(e.toString());
    }else {
      res.jsonp(_blogs);
    }
  });
});

router.post('/sync', function(req, res) {
  var ids = req.body;
  
  console.log('================================================');
  console.log('RETRIEVING BLOGS WITH IDS :: ' + JSON.stringify(ids));
  console.log('================================================');

  Blog.find({ "_id": { "$in": ids } }).exec(function (err, _blogs) {
    if (err){
      console.log(e.toString());
      res.status(400).send(e.toString());
    }else {
      res.jsonp(_blogs);
    }
  });

});

router.post('/', function (req, res) {
  try {
    console.log("Recieved Request From: "+ req.ip);
    var blog = req.body;
    
    console.log('================================================');
	  console.log('RECEIVED BLOG :: ' + blog.title);
    console.log('================================================');

    // Check if the blog already exist; if not then save this
    // find each blog with the url matching 'url'
    var query = Blog.findOne({ 'url': blog.url }).select('_id url').exec(function (err, _blog) {
      if (err){
        console.log(e.toString());
        res.status(400).send(e.toString());
      }
      else {
        if (!_blog) {
          console.log('SAVING BLOG :: ' + blog.url);
          var b = new Blog();
          b.url = blog.url;
          b.title = blog.title;
          b.text = blog.text;
          b.author = blog.author;
          b.initiative = blog.initiative;
          b.image = blog.image;
          b.save();

        }
        res.json("blog saved sucessfully");
      }
      
    });

  } catch (e) {
  	console.log(e.toString());
    res.status(400).send('Invalid JSON Supplied: ' + e.toString());
  }
});

module.exports = router;