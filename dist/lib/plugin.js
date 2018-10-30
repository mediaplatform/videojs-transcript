'use strict';

var _video = require('video.js');

var _video2 = _interopRequireDefault(_video);

var _options = require('./options.js');

var _tracklist = require('./tracklist.js');

var _tracklist2 = _interopRequireDefault(_tracklist);

var _widget = require('./widget.js');

var _widget2 = _interopRequireDefault(_widget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transcript = function transcript(options) {
  var _this = this;

  this.ready(function () {
    _options.my.player = _this;
    _options.my.validTracks = _tracklist2.default.get();
    _options.my.currentTrack = _tracklist2.default.active(_options.my.validTracks);
    _options.my.settings = _video2.default.mergeOptions(_options.defaults, options);
    _options.my.widget = _widget2.default.create();
    var timeUpdate = function timeUpdate() {
      _options.my.widget.setCue(_options.my.player.currentTime());
    };
    var updateTrack = function updateTrack() {
      _options.my.currentTrack = _tracklist2.default.active(_options.my.validTracks);
      _options.my.widget.setTrack(_options.my.currentTrack);
    };
    if (_options.my.validTracks.length > 0) {
      updateTrack();
      _options.my.player.on('timeupdate', timeUpdate);
      if (_options.my.settings.followPlayerTrack) {
        _options.my.player.on('captionstrackchange', updateTrack);
        _options.my.player.on('subtitlestrackchange', updateTrack);
      }
    } else {
      throw new Error('videojs-transcript: No tracks found!');
    }

    var transcriptContainer = options.el;
    transcriptContainer.appendChild(_options.my.widget.el());
  });
};
_video2.default.registerPlugin('transcript', transcript);
