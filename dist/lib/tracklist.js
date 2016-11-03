'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('./options.js');

/*
 *  Tracklist Helper
 */

/*global my*/
var trackList = function (plugin) {
  var activeTrack;
  return {
    get: function get() {
      var validTracks = [];
      var i, track;
      _options.my.tracks = _options.my.player.textTracks();
      for (i = 0; i < _options.my.tracks.length; i++) {
        track = _options.my.tracks[i];
        if (track.kind === 'captions' || track.kind === 'subtitles') {
          validTracks.push(track);
        }
      }
      return validTracks;
    },
    active: function active(tracks) {
      var i, track;
      for (i = 0; i < _options.my.tracks.length; i++) {
        track = _options.my.tracks[i];
        if (track.mode === 'showing') {
          activeTrack = track;
          return track;
        }
      }
      // fallback to first track
      return activeTrack || tracks[0];
    }
  };
}(_options.my);

exports.default = trackList;
