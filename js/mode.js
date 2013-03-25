goog.provide('ww.mode');
goog.provide('ww.mode.modes');
goog.require('ww.mode.AsciiMode');
goog.require('ww.mode.BaconMode');
goog.require('ww.mode.BowlingMode');
goog.require('ww.mode.BurgerMode');
goog.require('ww.mode.CatMode');
goog.require('ww.mode.DonutMode');
goog.require('ww.mode.EightBitMode');
goog.require('ww.mode.HomeMode');
goog.require('ww.mode.MetaBallMode');
goog.require('ww.mode.PongMode');
goog.require('ww.mode.RocketMode');
goog.require('ww.mode.SimoneMode');
goog.require('ww.mode.SongMode');
goog.require('ww.mode.SpaceMode');
goog.require('ww.mode.SynthMode');
goog.require('ww.util');

/**
 * Global list of registered modes.
 * @type {Object}
 */
ww.mode.modes = {};

/**
 * Register a mode.
 * @param {String} name Mode name.
 * @param {Function} klass The mode controller.
 * @param {Number} pattern Pattern base10 representation.
 * @param {Number} len Binary padding length.
 */
ww.mode.register = function(name, klass, pattern, len) {
  ww.mode.modes[name] = {
    klass: klass,
    pattern: pattern,
    len: len
  };
};

/**
 * Convenience function to recover a mode by name.
 * @param {String} name Key name of the mode.
 * @return {Object} Mode details.
 */
ww.mode.findModeByName = function(name) {
  return ww.mode.modes[name];
};

// Home mode.
ww.mode.register('home', ww.mode.HomeMode, null);

// Other modes.
ww.mode.register('cat', ww.mode.CatMode, 231, 8); // 11100111

var isJellyBean = navigator.userAgent.match(/Android\ 4\.2/);
var isChrome = navigator.userAgent.match(/Chrome/);
var isBrowerOnJellyBean = isJellyBean && !isChrome;

// This combination has GPU bugs
if (!isBrowerOnJellyBean) {
  ww.mode.register('space', ww.mode.SpaceMode, 42, 8); // 00101010
}

ww.mode.register('pong', ww.mode.PongMode, 129, 8); // 10000001
ww.mode.register('bacon', ww.mode.BaconMode, 144, 8); // 10010000
ww.mode.register('simone', ww.mode.SimoneMode, 211, 8); // 11010011
ww.mode.register('eightbit', ww.mode.EightBitMode, 83, 8); // 01010011
ww.mode.register('metaball', ww.mode.MetaBallMode, 170, 8); // 10101010

// Audio available?
if (ww.util.getAudioContextConstructor()) {
  ww.mode.register('song', ww.mode.SongMode, 219, 8); // 11011011
  ww.mode.register('synth', ww.mode.SynthMode, 136, 8); // 10001000
}

ww.mode.register('ascii', ww.mode.AsciiMode, 127, 8); // 01111111
ww.mode.register('bowling', ww.mode.BowlingMode, 117, 8); // 01110101
ww.mode.register('rocket', ww.mode.RocketMode, 69, 8); // 01000101
ww.mode.register('donut', ww.mode.DonutMode, 150, 8); // 10010110
ww.mode.register('burger', ww.mode.BurgerMode, 57, 8); // 00111001

if (((window.location.href.indexOf('modes') >= 0) && DEBUG_MODE) ||
    ww.testMode) {
  // On DocumentReady (direct access only)
  $(function() {
    // Extract the name from the URL.
    var parts = window.location.href.split('/'),
        page = parts[parts.length - 1],
        scriptName =
          page.replace('_test.html', '.html').replace(/\.html(.*)/, '');

    // Look up the mode by name.
    var pair = ww.mode.findModeByName(scriptName);

    // Initialize
    if (pair && pair.klass) {
      var w = $(window).width();
      var h = $(window).height();
      if (h < 1) { h = w; }

      var wrapperElem =
        $('<div></div>').addClass('mode').addClass(scriptName + '-mode');
      wrapperElem.css({ 'width': w, 'height': h });

      $('body > *').wrapAll(wrapperElem);

      window['currentMode'] = new pair.klass($('.mode')[0], ww.testMode ? '../../' : '../');

      var self = this;
      $(window).resize(ww.util.throttle(function() {
        $('.mode').css({ 'width': $(window).width(),
          'height': $(window).height() });
        window['currentMode'].onResize(true);
      }, 50));
    }
  });
}
