/**
 * Article Server - stands up an HTTP server for local requests that allows our Curator to post
 * Last Updated June 2015 by Jason Carter
 */
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var async = require('async');
var morgan = require('morgan');

var model = require('../blogs/blog.model');

var app = express();

//We're going to use Body Parser JSON to parse the json sent to the server
app.use(bodyParser.json());
app.use(morgan('dev'));
   
var mongoose = require ("mongoose");
var  Blog = mongoose.model('Blog');

// connection string
var dbUrl = 'mongodb://localhost/crawler_data';

// connect to the database
mongoose.connect(dbUrl, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + dbUrl + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + dbUrl);
  }
});



app.post('/blog', function (req, res) {
  try {
    console.log("Recieved Request From: "+ req.ip);
    var blog = req.body;
    
    console.log('================================================');
	console.log('SAVING :: ' + blog.title);
    console.log('================================================');

    var b = new Blog();
    b.title = blog.title;
    b.text = blog.text;
    b.author = blog.author;
    b.initiative = blog.initiative;
    b.image = blog.image;
    b.save();

    res.json("saved");

  } catch (e) {
  	console.log(e.toString());
    res.status(400).send('Invalid JSON Supplied: ' + e.toString());
  }
});

app.get('/', function(req, res) {
  res.json("index");
});


//Set up our app to listen on port 3030
app.listen(3000);
