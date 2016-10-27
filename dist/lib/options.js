'use strict';

/*
 *  Shared Setup
 */

// Global settings
var my = {};
my.settings = {};
my.prefix = 'transcript';
my.player = undefined;

// Defaults
var defaults = {
  autoscroll: true,
  clickArea: 'text',
  showTitle: true,
  showTrackSelector: true,
  followPlayerTrack: true,
  stopScrollWhenInUse: true
};
