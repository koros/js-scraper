'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * SiteInfo Schema
 */
var SiteInfoSchema = new Schema({
  
  url: {
    type: String,
    default: '',
    trim: true
  },
  category: {
    type: String,
    default: '',
    trim: true
  },
  itemUrl: {
    type: String,
    unique: true,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('SiteInfo', SiteInfoSchema);