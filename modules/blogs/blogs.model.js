'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Blog Schema
 */
var BlogSchema = new Schema({
  url: {
    type: String,
    unique: true,
    default: '',
    trim: true
  },
  title: {
    type: String,
    default: '',
    trim: true
  },
  text: {
    type: String,
    default: '',
    trim: true
  },
  author: {
    type: String,
    default: '',
    trim: true
  },
  initiative: {
    type: String,
    default: '',
    trim: true
  },
  image: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Blog', BlogSchema);
