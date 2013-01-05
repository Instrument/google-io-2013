goog.provide('ww.mode');
goog.require('ww.mode.BaconMode');
goog.require('ww.mode.CatMode');
goog.require('ww.mode.DogMode');
goog.require('ww.mode.ExplodeMode');
goog.require('ww.mode.PinataMode');
goog.require('ww.mode.PongMode');

/** @define {boolean} */
var DEBUG_MODE = false;

ww.mode.modes_ = {};

ww.mode.register = function(name, klass) {
  ww.mode.modes_[name] = klass;
};

ww.mode.findModeByName = function(name) {
  return ww.mode.modes_[name];
};

ww.mode.register('bacon', ww.mode.BaconMode);
ww.mode.register('cat', ww.mode.CatMode);
ww.mode.register('dog', ww.mode.DogMode);
ww.mode.register('explode', ww.mode.ExplodeMode);
ww.mode.register('pinata', ww.mode.PinataMode);
ww.mode.register('pong', ww.mode.PongMode);

jQuery(function() {
  var parts = window.location.href.split('/');
  var page = parts[parts.length-1];
  var scriptName = page.replace('.html', '');

  var klass = ww.mode.findModeByName(scriptName);
  
  // Initialize
  var controller = new klass();
});