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
};

ww.mode.ExplodeMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  var self = this;
  this.playSound('bomb.wav', function(source) {
    self.sourceSource_ = source;
  }, true);
};

ww.mode.ExplodeMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  if (this.sourceSource_) {
    this.sourceSource_.disconnect(0);
  }
};