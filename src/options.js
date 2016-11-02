/*
 *  Shared Setup
 */

// Global settings
let my = {};
my.settings = {};
my.prefix = 'transcript';
my.player = this;

// Defaults
let defaults = {
  autoscroll: true,
  clickArea: 'text',
  showTitle: true,
  showTrackSelector: true,
  followPlayerTrack: true,
  stopScrollWhenInUse: true,
};

export {my, defaults};
