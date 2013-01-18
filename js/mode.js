goog.provide('ww.mode');
goog.provide('ww.mode.modes');
goog.require('ww.util');
goog.require('ww.mode.BaconMode');
goog.require('ww.mode.CatMode');
goog.require('ww.mode.ExplodeMode');
goog.require('ww.mode.HomeMode');
goog.require('ww.mode.MetaBallMode');
goog.require('ww.mode.PinataMode');
goog.require('ww.mode.PongMode');
goog.require('ww.mode.SimoneMode');
goog.require('ww.mode.SongMode');
goog.require('ww.mode.SpaceMode');
goog.require('ww.mode.EightBitMode');

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

ww.mode.register('home',     ww.mode.HomeMode,    null);

ww.mode.register('song',     ww.mode.SongMode,     1, 8); // 00000001
ww.mode.register('cat',      ww.mode.CatMode,      2, 8); // 00000010
ww.mode.register('space',    ww.mode.SpaceMode,    3, 8); // 00000011
ww.mode.register('pong',     ww.mode.PongMode,     4, 8); // 00000100
ww.mode.register('explode',  ww.mode.ExplodeMode,  5, 8); // 00000101
ww.mode.register('pinata',   ww.mode.PinataMode,   6, 8); // 00000110
ww.mode.register('bacon',    ww.mode.BaconMode,    7, 8); // 00000111
ww.mode.register('simone',   ww.mode.SimoneMode,   8, 8); // 00001000
ww.mode.register('eightbit', ww.mode.EightBitMode, 9, 8); // 00001001
ww.mode.register('metaball', ww.mode.MetaBallMode, 10, 8); // 00001010

jQuery(function() {
  var parts = window.location.href.split('/');
  var page = parts[parts.length - 1];
  var scriptName = page.replace('_test.html', '.html').replace(/\.html(.*)/, '');

  var pair = ww.mode.findModeByName(scriptName);
  var klass = pair.klass;

  // Initialize
  var controller = new klass();
});
