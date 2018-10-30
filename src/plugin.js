import videojs from 'video.js';
import {my, defaults} from './options.js';
import trackList from './tracklist.js';
import widget from './widget.js';

const transcript = function (options) {
  this.ready(() => {
    my.player = this;
    my.validTracks = trackList.get();
    my.currentTrack = trackList.active(my.validTracks);
    my.settings = videojs.mergeOptions(defaults, options);
    my.widget = widget.create();
    var timeUpdate = function () {
      my.widget.setCue(my.player.currentTime());
    };
    var updateTrack = function () {
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

    let transcriptContainer = options.el;
    transcriptContainer.appendChild(my.widget.el());

  });
};
videojs.registerPlugin('transcript', transcript);
