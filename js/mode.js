goog.provide('ww.mode');
goog.provide('ww.mode.modes');
goog.require('ww.mode.BaconMode');
goog.require('ww.mode.CatMode');
goog.require('ww.mode.ExplodeMode');
goog.require('ww.mode.HomeMode');
goog.require('ww.mode.PinataMode');
goog.require('ww.mode.PongMode');
goog.require('ww.mode.SimoneMode');
goog.require('ww.mode.SpaceMode');

/** @define {boolean} */
var DEBUG_MODE = false;

ww.mode.modes = {};

ww.mode.register = function(name, klass, pattern, len) {
  ww.mode.modes[name] = {
    klass: klass,
    pattern: pattern,
    len: len
  };
};

ww.mode.findModeByName = function(name) {
  return ww.mode.modes[name];
};

ww.mode.register('bacon', ww.mode.BaconMode, 7, 4);          // 0111
ww.mode.register('cat', ww.mode.CatMode, 2, 4);              // 0010
ww.mode.register('explode', ww.mode.ExplodeMode, 5, 4);      // 0101
ww.mode.register('home', ww.mode.HomeMode, null);
ww.mode.register('pinata', ww.mode.PinataMode, 6, 4);        // 0110
ww.mode.register('pong', ww.mode.PongMode, 4, 4);            // 0100
ww.mode.register('simone', ww.mode.SimoneMode, 8, 4);        // 1000
ww.mode.register('space', ww.mode.SpaceMode, 3, 4);          // 0011

jQuery(function() {
  var parts = window.location.href.split('/');
  var page = parts[parts.length - 1];
  var scriptName = page.replace('_test.html', '.html').replace(/\.html(.*)/, '');

  var pair = ww.mode.findModeByName(scriptName);
  var klass = pair.klass;

  // Initialize
  var controller = new klass();
});
