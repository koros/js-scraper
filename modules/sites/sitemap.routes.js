var express = require('express');
var router = express.Router();

var siteInfoModel = require('./sitemap.model');
var _ = require('lodash');

var mongoose = require ("mongoose");
var SiteInfo = mongoose.model('SiteInfo');


router.get('/', function(req, res) {
  // get the ids of all items currently active on the site
  SiteInfo.find().distinct('category', function(error, categories) {
    var catgs = {};
    if (error) {
      res.status(400).send(e.toString());
    }
    else if (!categories) {
      res.jsonp(catgs);
    }
    
    _.map(categories, function(item, index) {
      var query = SiteInfo.find({ 'category': item }).select('_id').exec(function (err, _siteinfo) {
        if (err) {
          console.log(e.toString());
          res.status(400).send(e.toString());
        }
        else {
          if (_siteinfo) {
            console.log('%s = %s', item, _siteinfo);
            catgs[item] = _siteinfo;
          }
          // retrun if we have reached the end
          if (index == categories.length - 1) {
            res.jsonp(catgs);
          }
        }
      });

    });
  });
});

router.post('/', function (req, res) {
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

module.exports = router;