var express = require('express');
var router = express.Router();

var _ = require('lodash');
var chrono = require('chrono-node');
var mongoose = require ("mongoose");

var eventModel = require('./events.model');
var Event = mongoose.model('Event');

router.get('/', function(req, res) {
  res.json("Events");
});

router.post('/', function (req, res) {
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

module.exports = router;