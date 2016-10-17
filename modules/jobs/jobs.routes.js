var express = require('express');
var router = express.Router();

var jobModel = require('./jobs.model');
var _ = require('lodash');
var chrono = require('chrono-node');

var mongoose = require ("mongoose");
var Job = mongoose.model('Job');

router.get('/', function(req, res) {
  res.json("Jobs");
});

router.post('/', function (req, res) {
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

module.exports = router;