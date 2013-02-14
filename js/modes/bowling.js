goog.require('ww.mode.Core');
goog.provide('ww.mode.BowlingMode');


/**
 * @constructor
 * @param {Element} containerElem The containing element.
 * @param {String} assetPrefix The containing element.
 */
ww.mode.BowlingMode = function(containerElem, assetPrefix) {
  this.preloadSound('strike.m4a');
  this.preloadSound('whoosh-1.wav');

  goog.base(this, containerElem, assetPrefix, 'bowling', true, true, false);
};
goog.inherits(ww.mode.BowlingMode, ww.mode.Core);


/**
 * Initailize BowlingMode.
 */
ww.mode.BowlingMode.prototype.init = function() {
  goog.base(this, 'init');
  this.ballWrapper_ = this.find('.letter-o-wrapper');
  this.centerX_ = this.$letterO_.attr('cx');
  this.centerY_ = this.$letterO_.attr('cy');
  this.ballCenter_ = [this.centerX_, this.centerY_];
};

/**
 * Plays a sound and stretches the letter i when activated.
 * Wiggle tease.
 */
ww.mode.BowlingMode.prototype.activateI = function() {
  goog.base(this, 'activateI');

  var self = this;
  var wiggle = 5;

  var wiggleLeft = new TWEEN.Tween({ 'rotate': 0 });
  wiggleLeft.to({ 'rotate': -wiggle }, 100);
  wiggleLeft.onUpdate(function() {
    self.transformElem_(self.$letterI_[0], 'rotate(' + this['rotate'] + 'deg)');
  });

  var wiggleRight = new TWEEN.Tween({ 'rotate': -wiggle });
  wiggleRight.to({ 'rotate': wiggle }, 200);
  wiggleRight.onStart(function() {
    self.playSound('whoosh-1.wav');
  });
  wiggleRight.delay(100);
  wiggleRight.onUpdate(function() {
    self.transformElem_(self.$letterI_[0], 'rotate(' + this['rotate'] + 'deg)');
  });

  var wiggleBack = new TWEEN.Tween({ 'rotate': wiggle });
  wiggleBack.to({ 'rotate': 0 }, 100);
  wiggleBack.delay(300);
  wiggleBack.onUpdate(function() {
    self.transformElem_(self.$letterI_[0], 'rotate(' + this['rotate'] + 'deg)');
  });

  this.addTween(wiggleLeft);
  this.addTween(wiggleRight);
  this.addTween(wiggleBack);
};

/**
 * Plays a sound and stretches the letter o when activated.
 * Rolling ball and knocking out the one pin.
 */
ww.mode.BowlingMode.prototype.activateO = function() {
  goog.base(this, 'activateO');

  this.playSound('strike.m4a');

  var self = this;
  var deg = ~~Random(400, 490);

  var animateSpin = new TWEEN.Tween({ 'rotate': 0 });
  animateSpin.to({ 'rotate': 360 * 10 }, 1500);
  animateSpin.onUpdate(function() {
    self.$letterO_.attr('transform', 'rotate(' + (this['rotate'] % 360) + ', ' +
                            self.centerX_ + ', ' + self.centerY_ + ')');
  });

  var animateMove = new TWEEN.Tween({ 'translateX': 0 });
  animateMove.to({ 'translateX': 180 }, 500);
  animateMove.delay(1000);
  animateMove.easing(TWEEN.Easing.Exponential.In);
  animateMove.onUpdate(function() {
    self.centerX_ = self.centerX_ - this['translateX'];
    self.transformElem_(self.ballWrapper_[0],
                          'translateX(-' + this['translateX'] + '%)');
  });

  var animatePin = new TWEEN.Tween({ 'rotate': 0, 'scale': 1, 'x': 0 });
  animatePin.to({ 'rotate': -deg, 'scale': 0.65, 'x': -175 }, 300);
  animatePin.delay(1500);
  animatePin.onUpdate(function() {
    var transform = 'scale(' + this['scale'] + ') ' +
                    'rotate(' + this['rotate'] + 'deg) ' +
                    'translateX(' + this['x'] + '%)';
    self.transformElem_(self.$letterI_[0], transform);
  });

  var reset = new TWEEN.Tween({ 'opacity': 0 });
  reset.to({ 'opacity': 1 }, 500);
  reset.delay(3500);
  reset.onStart(function() {
    self.$letterO_.attr('transform', 'rotate(0, ' + self.ballCenter_[0] + ', ' +
                        self.ballCenter_[1] + ')');
    self.centerX_ = self.ballCenter_[0];
    self.transformElem_(self.ballWrapper_[0], 'translate(0px, 0px)');
    self.transformElem_(self.$letterI_[0], 'scale(1) rotate(0deg)');
  });
  reset.onUpdate(function() {
    self.$letterO_[0].style['opacity'] = this['opacity'];
    self.$letterI_[0].style['opacity'] = this['opacity'];
    self.ballWrapper_[0].style['opacity'] = this['opacity'];
  });

  this.addTween(animateSpin);
  this.addTween(animateMove);
  this.addTween(animatePin);
  this.addTween(reset);
};
