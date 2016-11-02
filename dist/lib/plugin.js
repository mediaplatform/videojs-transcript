'use strict';

var _video = require('video.js');

var _video2 = _interopRequireDefault(_video);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import './options.js';

var transcript = function transcript(options) {
  my.player = this;
  my.validTracks = trackList.get();
  my.currentTrack = trackList.active(my.validTracks);
  my.settings = _video2.default.mergeOptions(defaults, options);
  my.widget = widget.create();
  var timeUpdate = function timeUpdate() {
    my.widget.setCue(my.player.currentTime());
  };
  var updateTrack = function updateTrack() {
    my.currentTrack = trackList.active(my.validTracks);
    my.widget.setTrack(my.currentTrack);
  };
  if (my.validTracks.length > 0) {
    updateTrack();
    my.player.on('timeupdate', timeUpdate);
    if (my.settings.followPlayerTrack) {
      my.player.on('captionstrackchange', updateTrack);
      my.player.on('subtitlestrackchange', updateTrack);
    }
  } else {
    throw new Error('videojs-transcript: No tracks found!');
  }
  return {
    el: function el() {
      return my.widget.el();
    },
    setTrack: my.widget.setTrack
  };
};
_video2.default.plugin('transcript', transcript);
