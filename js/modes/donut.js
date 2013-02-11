goog.require('ww.mode.Core');
goog.provide('ww.mode.DonutMode');


/**
 * @constructor
 */
ww.mode.DonutMode = function(containerElem, assetPrefix) {
  goog.base(this, containerElem, assetPrefix, 'donut', true, true, false);

  this.preloadSound('bite-1.wav');
  this.preloadSound('bite-2.wav');
};
goog.inherits(ww.mode.DonutMode, ww.mode.Core);


/**
 * Initailize DonutMode.
 */
ww.mode.DonutMode.prototype.init = function() {
  goog.base(this, 'init');

  this.bitesI_ = $('[id*=bar-bite-]');
  this.maxBitesI_ = this.bitesI_.length;

  this.bitesO_ = $('[id*=donut-bite-]');
  this.maxBitesO_ = this.bitesO_.length;
};

/**
 * Focus is gained.
 */
ww.mode.DonutMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  this.bitesI_.css('opacity', 0);
  this.biteIIndex_ = 0;

  this.bitesO_.css('opacity', 0);
  this.biteOIndex_ = 0;
};


/**
 * Takes a bite out of the ice cream sandwich or brings a new one!
 */
ww.mode.DonutMode.prototype.activateI = function() {
  goog.base(this, 'activateI');

  if (this.biteIIndex_ < this.maxBitesI_) {
    this.bitesI_[this.biteIIndex_].style['opacity'] = 1;
    this.biteIIndex_++;
    this.playSound('bite-2.wav');
  } else {
    var self = this;
    var reset = new TWEEN.Tween({ 'opacity': 0 });

    reset.to({ 'opacity': 1 }, 200);

    reset.onStart(function() {
      self.bitesI_.css('opacity', 0);
    });

    reset.onUpdate(function() {
      self.$letterI_.css('opacity', this['opacity']);
    });

    reset.onComplete(function() {
      self.biteIIndex_ = 0;
    });

    this.addTween(reset);
  }
};


/**
 * Takes a bite out of the donut or brings a new one!
 */
ww.mode.DonutMode.prototype.activateO = function() {
  goog.base(this, 'activateO');

  if (this.biteOIndex_ < this.maxBitesO_) {
    this.bitesO_[this.biteOIndex_].style['opacity'] = 1;
    this.biteOIndex_++;
    this.playSound('bite-1.wav');
  } else {
    var self = this;
    var reset = new TWEEN.Tween({ 'opacity': 0 });

    reset.to({ 'opacity': 1 }, 200);

    reset.onStart(function() {
      self.bitesO_.css('opacity', 0);
    });

    reset.onUpdate(function() {
      self.$letterO_.css('opacity', this['opacity']);
    });

    reset.onComplete(function() {
      self.biteOIndex_ = 0;
    });

    this.addTween(reset);
  }
};
