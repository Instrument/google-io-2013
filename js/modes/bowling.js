goog.require('ww.mode.Core');
goog.provide('ww.mode.BowlingMode');


/**
 * @constructor
 * @param {Element} containerElem The containing element.
 * @param {String} assetPrefix The containing element.
 */
ww.mode.BowlingMode = function(containerElem, assetPrefix) {
  this.preloadSound('strike.mp3');
  this.preloadSound('whoosh-1.mp3');

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
  this.pinCenter_ = [this.$letterI_.attr('cx'), this.$letterI_.attr('cy')];
  this.isBowling_ = false;
};

/**
 * Plays a sound and stretches the letter i when activated.
 * Wiggle tease.
 */
ww.mode.BowlingMode.prototype.activateI = function() {
  goog.base(this, 'activateI');

  if (!this.isBowling_) {
    var self = this;
    var wiggle = 5;

    var wiggleLeft = new TWEEN.Tween({ 'rotate': 0 });
    wiggleLeft.to({ 'rotate': -wiggle }, 100);
    wiggleLeft.onUpdate(function() {
      self.$letterI_.attr('transform',
        'rotate(' + this['rotate'] + ', ' +
          self.pinCenter_[0] + ', ' + self.pinCenter_[1] + ')');
    });

    var wiggleRight = new TWEEN.Tween({ 'rotate': -wiggle });
    wiggleRight.to({ 'rotate': wiggle }, 200);
    wiggleRight.onStart(function() {
      self.playSound('whoosh-1.mp3');
    });
    wiggleRight.delay(100);
    wiggleRight.onUpdate(function() {
      self.$letterI_.attr('transform',
        'rotate(' + this['rotate'] + ', ' +
          self.pinCenter_[0] + ', ' + self.pinCenter_[1] + ')');
    });

    var wiggleBack = new TWEEN.Tween({ 'rotate': wiggle });
    wiggleBack.to({ 'rotate': 0 }, 100);
    wiggleBack.delay(300);
    wiggleBack.onUpdate(function() {
      self.$letterI_.attr('transform',
        'rotate(' + this['rotate'] + ', ' +
         self.pinCenter_[0] + ', ' + self.pinCenter_[1] + ')');
    });

    this.addTween(wiggleLeft);
    this.addTween(wiggleRight);
    this.addTween(wiggleBack);
  }
};

/**
 * Plays a sound and stretches the letter o when activated.
 * Rolling ball and knocking out the one pin.
 */
ww.mode.BowlingMode.prototype.activateO = function() {
  goog.base(this, 'activateO');

  this.playSound('strike.mp3');
  if (!this.isBowling_) {
    this.isBowling_ = true;

    var self = this;
    var deg = ~~Random(360, 380);
    var ballBounds = this.ballWrapper_[0].getBoundingClientRect();
    var pinBounds = this.$letterI_[0].getBoundingClientRect();
    var distance = (ballBounds['width'] / 3) +
                    ballBounds['left'] - pinBounds['right'];

    var animateSpin = new TWEEN.Tween({ 'rotate': 0 });
    animateSpin.to({ 'rotate': 360 * 5 }, 1500);
    animateSpin.onUpdate(function() {
      self.$letterO_.attr('transform',
        'rotate(' + (this['rotate'] % 360) + ', ' +
          self.centerX_ + ', ' + self.centerY_ + ')');
    });

    var animateMove = new TWEEN.Tween({ 'translateX': 0 });
    animateMove.to({ 'translateX': distance }, 600);
    animateMove.delay(1000);
    animateMove.easing(TWEEN.Easing.Exponential.In);
    animateMove.onUpdate(function() {
      self.ballWrapper_.attr('transform',
        'translate(' + -this['translateX'] + ', 0)');
    });

    var animatePin = new TWEEN.Tween({ 'rotate': 0, 'scale': 1, 'posX': 0 });
    animatePin.to({ 'rotate': deg, 'scale': 0.5, 'posX': -20 }, 300);
    animatePin.delay(1500);
    animatePin.onUpdate(function() {
      self.$letterI_.attr('transform', 'scale(' + this['scale'] + ') ' +
        'rotate(' + this['rotate'] + ', ' + self.pinCenter_[0] + ', ' +
        self.pinCenter_[1] + ') ' + 'translate(' + this['posX'] + ', 0)');
    });

    var reset = new TWEEN.Tween({ 'opacity': 0 });
    reset.to({ 'opacity': 1 }, 500);
    reset.delay(3000);
    reset.onStart(function() {
      self.ballWrapper_.attr('transform', 'translate(0, 0)');
      self.$letterO_.attr('transform',
        'rotate(0, ' + self.ballCenter_[0] + ', ' + self.ballCenter_[1] + ')');

      self.$letterI_.attr('transform', 'scale(1) ' +
        'rotate(0, ' + self.pinCenter_[0] + ', ' + self.pinCenter_[1] + ') ' +
        'translate(0, 0)');
    });
    reset.onUpdate(function() {
      self.$letterO_[0].style['opacity'] = this['opacity'];
      self.$letterI_[0].style['opacity'] = this['opacity'];
      self.ballWrapper_[0].style['opacity'] = this['opacity'];
    });
    reset.onComplete(function() {
      self.isBowling_ = false;
    });

    this.addTween(animateSpin);
    this.addTween(animateMove);
    this.addTween(animatePin);
    this.addTween(reset);
  }
};
