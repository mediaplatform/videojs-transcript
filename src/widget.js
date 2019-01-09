import {my} from './options.js';
import utils from './utils.js';
import scroller from './scroller.js';
import eventEmitter from './events.js';
/*
 *  Create and Manipulate DOM Widgets
 */

/*globals utils, eventEmitter, my, scrollable*/

var widget = function (plugin) {
  var my = {};
  my.element = {};
  my.body = {};
  var on = function (event, callback) {
    eventEmitter.on(this, event, callback);
  };
  var trigger = function (event) {
    eventEmitter.trigger(this, event);
  };
  var createTitle = function () {
    var header = utils.createEl('header', '-header');
    header.textContent = utils.localize('Transcript');
    return header;
  };
  var createSelector = function createSelector(downloadBtn) {
    var selector = utils.createEl('select', '-selector');
    plugin.validTracks.forEach(function (track, i) {
      var option = document.createElement('option');
      option.value = i;
      if (i == 0 && track.download != "") {
        downloadBtn.style.display = "inline-block";
      }
      option.setAttribute('data-download', track.download);
      option.textContent = track.label;
      selector.appendChild(option);
    });
    selector.addEventListener('change', function (e) {
      var selected = document.querySelector('#' + plugin.prefix + '-' + plugin.player.id() + ' option:checked');
      if (!selected.dataset.download || selected.dataset.download == undefined || selected.dataset.download == "undefined") {
        document.querySelector('.transcript-download-btn').style.display = "none";
      }
      else {
        document.querySelector('.transcript-download-btn').style.display = "inline-block";
      }
      setTrack(document.querySelector('#' + plugin.prefix + '-' + plugin.player.id() + ' option:checked').value);
      trigger('trackchanged');
    });
    return selector;
  };
  var createDownloadTrackButton = function createDownloadTrackButton() {
    var downloadBtn = utils.createEl('a', '-download-btn');
    var t = document.createTextNode("download");
    downloadBtn.setAttribute('target', "_blank");
    downloadBtn.style.display = "none";
    downloadBtn.appendChild(t);
    downloadBtn.addEventListener('click', function (e) {
      this.setAttribute('download', document.querySelector('.transcript-selector option:checked').innerHTML);
      this.setAttribute('href', document.querySelector('.transcript-selector option:checked').dataset.download);
    });
    return downloadBtn;
  };
  var clickToSeekHandler = function (event) {
    var clickedClasses = event.target.classList;
    var clickedTime = event.target.getAttribute('data-begin') || event.target.parentElement.getAttribute('data-begin');
    if (clickedTime !== undefined && clickedTime !== null) { // can be zero
      if ((plugin.settings.clickArea === 'line') || // clickArea: 'line' activates on all elements
        (plugin.settings.clickArea === 'timestamp' && clickedClasses.contains(plugin.prefix + '-timestamp')) ||
        (plugin.settings.clickArea === 'text' && clickedClasses.contains(plugin.prefix + '-text'))) {
        plugin.player.currentTime(clickedTime);
      }
    }
  };
  var createLine = function (cue) {
    var line = utils.createEl('div', '-line');
    var timestamp = utils.createEl('span', '-timestamp');
    var text = utils.createEl('span', '-text');
    line.setAttribute('data-begin', cue.startTime);
    timestamp.textContent = utils.secondsToTime(cue.startTime);
    text.innerHTML = cue.text;
    line.appendChild(timestamp);
    line.appendChild(text);
    return line;
  };
  var createTranscriptBody = function (track) {
    if (typeof track !== 'object') {
      track = plugin.player.textTracks()[track];
    }
    var body = utils.createEl('div', '-body');
    var line, i;
    var fragment = document.createDocumentFragment();
    // activeCues returns null when the track isn't loaded (for now?)
    if (!track.activeCues || (track.cues && track.cues.length == 0)) {
      // If cues aren't loaded, set mode to hidden, wait, and try again.
      // But don't hide an active track. In that case, just wait and try again.
      if (track.mode !== 'showing') {
        track.mode = 'hidden';
      }
      window.setTimeout(function() {
        createTranscriptBody(track);
      }, 100);
    } else {
      var cues = track.cues;
      for (i = 0; i < cues.length; i++) {
        line = createLine(cues[i]);
        fragment.appendChild(line);
      }
      body.innerHTML = '';
      body.appendChild(fragment);
      body.setAttribute('lang', track.language);
      body.scroll = scroller(body);
      body.addEventListener('click', clickToSeekHandler);
      my.element.replaceChild(body, my.body);
      my.body = body;
    }

  };
  var create = function create() {
    var el = document.createElement('div');
    var headerEl = utils.createEl('div', '-header-container');
    my.element = el;
    el.setAttribute('id', plugin.prefix + '-' + plugin.player.id());
    if (plugin.settings.showTitle) {
      var title = createTitle();
      headerEl.appendChild(title);
    }
    var downloadBtn = createDownloadTrackButton();

    if (plugin.settings.showTrackSelector) {
      var selector = createSelector(downloadBtn);
      headerEl.appendChild(selector);
      headerEl.appendChild(downloadBtn);
    }

    my.body = utils.createEl('div', '-body');
    el.appendChild(headerEl);
    el.appendChild(my.body);
    setTrack(plugin.currentTrack);
    return this;
  };
  var setTrack = function (track, trackCreated) {
    createTranscriptBody(track, trackCreated);
  };
  var setCue = function (time) {
    var active, i, line, begin, end;
    var lines = my.body.children;
    for (i = 0; i < lines.length; i++) {
      line = lines[i];
      begin = line.getAttribute('data-begin');
      if (i < lines.length - 1) {
        end = lines[i + 1].getAttribute('data-begin');
      } else {
        end = plugin.player.duration() || Infinity;
      }
      if (time > begin && time < end) {
        if (!line.classList.contains('is-active')) { // don't update if it hasn't changed
          line.classList.add('is-active');
          if (plugin.settings.autoscroll && !(plugin.settings.stopScrollWhenInUse && my.body.scroll.inUse())) {
              my.body.scroll.to(line);
          }
        }
      } else {
        line.classList.remove('is-active');
      }
    }
  };
  var el = function () {
    return my.element;
  };
  return {
    create: create,
    setTrack: setTrack,
    setCue: setCue,
    el : el,
    on: on,
    trigger: trigger,
  };

}(my);

export default widget;
