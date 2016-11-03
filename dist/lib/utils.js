'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _options = require('./options.js');

/*
 *  Utils
 */

/*global my*/
var utils = function (plugin) {
  return {
    secondsToTime: function secondsToTime(timeInSeconds) {
      var hour = Math.floor(timeInSeconds / 3600);
      var min = Math.floor(timeInSeconds % 3600 / 60);
      var sec = Math.floor(timeInSeconds % 60);
      sec = sec < 10 ? '0' + sec : sec;
      min = hour > 0 && min < 10 ? '0' + min : min;
      if (hour > 0) {
        return hour + ':' + min + ':' + sec;
      }
      return min + ':' + sec;
    },
    localize: function localize(string) {
      return string; // TODO: do something here;
    },
    createEl: function createEl(elementName, classSuffix) {
      classSuffix = classSuffix || '';
      var el = document.createElement(elementName);
      el.className = plugin.prefix + classSuffix;
      return el;
    },
    extend: function extend(obj) {
      var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
      if (!(type === 'function' || type === 'object' && !!obj)) {
        return obj;
      }
      var source, prop;
      for (var i = 1, length = arguments.length; i < length; i++) {
        source = arguments[i];
        for (prop in source) {
          obj[prop] = source[prop];
        }
      }
      return obj;
    }
  };
}(_options.my);

exports.default = utils;
