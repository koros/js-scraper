/**
 * Crawler data Server
 */
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var async = require('async');
var morgan = require('morgan');

var chrono = require('chrono-node');

var blogModel = require('../blogs/blog.model');
var eventModel = require('../events/events.model');
var jobModel = require('../jobs/jobs.model');
var siteInfoModel = require('../sites/sitemap.model');
var _ = require('lodash');

var app = express();

//We're going to use Body Parser JSON to parse the json sent to the server
app.use(bodyParser.json());
app.use(morgan('dev'));
   
var mongoose = require ("mongoose");
var Blog = mongoose.model('Blog');
var Event = mongoose.model('Event');
var Job = mongoose.model('Job');
var SiteInfo = mongoose.model('SiteInfo');

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

app.post('/event', function (req, res) {
  try {
    console.log("Recieved Request From: "+ req.ip);
    var event = req.body;
    
    console.log('================================================');
    console.log('RECEIVED EVENT :: ' + event.title);
    console.log('================================================');

    // Check if the event already exist; if not then save this
    // find each event with the url matching 'url'
    var query = Event.findOne({ 'url': event.url }).select('_id url').exec(function (err, _event) {
      if (err){
        console.log(e.toString());
        res.status(400).send(e.toString());
      }
      else {
        if (!_event) {
          console.log('SAVING EVENT:: ' + event.url);
          var ev = new Event();
          ev.url = event.url;
          ev.title = event.title;
          ev.text = event.text;
          ev.organiser = event.organiser;
          ev.date = chrono.parseDate(event.date);
          ev.time = event.time;
          ev.venue = event.venue;
          ev.hostname = event.hostname;
          ev.img = event.img;
          ev.save();
              
        } 
        res.json("event saved sucessfully");
      }
      
    });


  } catch (e) {
    console.log(e.toString());
    res.status(400).send('Invalid JSON Supplied: ' + e.toString());
  }
});

app.post('/job', function (req, res) {
  try {
    console.log("Recieved Request From: "+ req.ip);
    var job = req.body;
    
    console.log('================================================');
    console.log('RECEIVED JOB :: ' + job.title);
    console.log('================================================');

    // Check if the job already exist; if not then save this
    // find each job with the url matching 'url'
    var query = Job.findOne({ 'url': job.url }).select('_id url').exec(function (err, _job) {
      if (err){
        console.log(e.toString());
        res.status(400).send(e.toString());
      }
      else {
        if (!_job) {
          console.log('SAVING JOB:: ' + job.url);
          var jb = new Job();
          jb.url = job.url;
          jb.title = job.title;
          jb.text = job.text;
          jb.postedBy = job.postedBy;
          jb.added = chrono.parseDate(job.added);
          jb.applyBy = chrono.parseDate(job.applyBy);
          jb.location = job.location;
          jb.companyWebsite = job.companyWebsite;
          jb.category = job.category;
          jb.save();
          
        } 
        res.json("job saved sucessfully");
      }
      
    });

  } catch (e) {
    console.log(e.toString());
    res.status(400).send('Invalid JSON Supplied: ' + e.toString());
  }
});

app.post('/siteinfo', function (req, res) {
  try {
    console.log("Recieved Request From: "+ req.ip);
    var siteinfo = req.body;
    var category = siteinfo.category;
    var siteUrl = siteinfo.url;
    var urls = siteinfo.urls;
    
    console.log('================================================');
    console.log('RECEIVED SITE INFO :: ' + JSON.stringify(siteinfo));
    console.log('================================================');

    // Remove items nolonger in the site
    SiteInfo.find({ "itemUrl": { "$nin": urls } }).where('category').equals(category).remove().exec();

    _.map(urls, function(url) {
      console.log('saving url --> %s', url);

      // find each siteinfo with the url matching 'url'
      var query = SiteInfo.findOne({ 'itemUrl': url }).select('_id itemUrl').exec(function (err, _siteinfo) {
        if (err) {
          console.log(e.toString());
          res.status(400).send(e.toString());
        }
        else {
          if (!_siteinfo) {
            console.log('SAVING SITE INFO :: ' + url);
            var si = new SiteInfo();
            si.category = category;
            si.itemUrl = url;
            si.url = siteUrl;
            si.save();
          }
        }
      });
    });

    res.json("siteinfo saved sucessfully"); // Probably not! things are still executing on the loop above

  } catch (e) {
    console.log(e.toString());
    res.status(400).send('Invalid JSON Supplied: ' + e.toString());
  }
});

app.get('/', function(req, res) {
  res.json("Hello");
});


//Set up our app to listen on port 3000
app.listen(3000);
