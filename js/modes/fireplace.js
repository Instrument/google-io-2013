goog.require('ww.mode.Core');
goog.provide('ww.mode.FireplaceMode');

/**
 * @constructor
 */
ww.mode.FireplaceMode = function() {
  goog.base(this, 'fireplace', true);
  this.preloadSound('fire.mp3');
};
goog.inherits(ww.mode.FireplaceMode, ww.mode.Core);

ww.mode.FireplaceMode.prototype.init = function() {
  goog.base(this, 'init');

  $(document.body).css({
    backgroundImage: 'url(../img/fireplace/fire.gif)',
    backgroundRepeat: 'no-repeat',
    'background-size': '100% 100%'
  });
};

ww.mode.FireplaceMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  var self = this;
  this.playSound('fire.mp3', function(source) {
    self.sourceSource_ = source;
  }, true);
};

ww.mode.FireplaceMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  if (this.sourceSource_) {
    this.sourceSource_.disconnect(0);
  }
};