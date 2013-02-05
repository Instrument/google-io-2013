goog.require('ww.mode.Core');
goog.provide('ww.mode.BurgerMode');


/**
 * @constructor
 */
ww.mode.BurgerMode = function() {
  goog.base(this, 'burger', true, true, false);

  this.preloadSound('bite.wav');
  this.preloadSound('sad-trombone.wav');
};
goog.inherits(ww.mode.BurgerMode, ww.mode.Core);


/**
 * Initailize BurgerMode.
 */
ww.mode.BurgerMode.prototype.init = function() {
  goog.base(this, 'init');

  this.bites_ = $('[id*=bite-]');
  this.maxBites_ = this.bites_.length;
  this.biteIndex_ = 0;
};

/**
 * Focus is gained.
 */
ww.mode.PinataMode.prototype.didFocus = function() {
  this.bites_.css('opacity', 0);
  this.biteIndex_ = 0;
};


/**
 * Takes a bite out of the burger or brings a new burger!
 */
ww.mode.BurgerMode.prototype.activateO = function() {
  goog.base(this, 'activateO');

  if (this.biteIndex_ < this.maxBites_) {
    this.bites_[this.biteIndex_].style['opacity'] = 1;
    this.biteIndex_++;
    this.playSound('bite.wav');
  } else {
    this.playSound('sad-trombone.wav');

    var self = this;
    var reset = new TWEEN.Tween({ 'dummy': 0 });
    reset.to({ 'dummy': 10 }, 2000);
    reset.onComplete(function() {
      self.bites_.css('opacity', 0);
      self.biteIndex_ = 0;
    });

    this.addTween(reset);
  }
};
