goog.require('ww.mode.Core');
goog.provide('ww.mode.ExplodeMode');

/**
 * @constructor
 */
ww.mode.ExplodeMode = function() {
  goog.base(this, 'explode', true);
  this.preloadSound('bomb.wav');
};
goog.inherits(ww.mode.ExplodeMode, ww.mode.Core);

ww.mode.ExplodeMode.prototype.init = function() {
  goog.base(this, 'init');

  $(document.body).css({
    backgroundImage: 'url(../img/explode/1.gif)',
    backgroundRepeat: 'no-repeat',
    'background-size': '100% 100%'
  });

  var self = this;
  setInterval(function() {
    self.playSound('bomb.wav');
  }, 2000);
};
