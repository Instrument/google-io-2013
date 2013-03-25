goog.require('ww.mode.Core');
goog.provide('ww.mode.RocketMode');


/**
 * @constructor
 * @param {Element} containerElem The containing element.
 * @param {String} assetPrefix The containing element.
 */
ww.mode.RocketMode = function(containerElem, assetPrefix) {
  this.preloadSound('rocket-launch.mp3');
  this.preloadSound('rumble.mp3');
  this.preloadSound('sci-fi-door.mp3');

  goog.base(this, containerElem, assetPrefix, 'rocket', true, true, false);

  var i = this.find('.letter-i');
  var o = this.find('.letter-o');
  this.centerO_ = o.attr('cx') + ', ' + o.attr('cy');
  this.centerI_ = i.attr('cx') + ', ' + i.attr('cy');

  this.rocket_ = this.find('.letter-i-wrapper');

  this.moons_ = $('#moon-1');
  this.fires_ = $('[id*=fire-]').css('opacity', 0);
  this.maxFires_ = this.fires_.length;
  this.currentFire_ = 0;
  this.hasLanded_ = false;
  this.isAnimating_ = false;
};
goog.inherits(ww.mode.RocketMode, ww.mode.Core);


/**
 * Method called when activating the I.
 * Launch the rocket and land.
 */
ww.mode.RocketMode.prototype.activateI = function() {
  goog.base(this, 'activateI');

  if (this.isAnimating_) {
    return;
  }

  if (this.currentFire_ < this.maxFires_) {
    this.animateWiggle_();
  } else if (!this.hasLanded_) {
    this.animateLanding_();
  }
};


/**
 * Animates rocket launch wiggle.
 * @private
 */
ww.mode.RocketMode.prototype.animateWiggle_ = function() {
  if (!this.isAnimating_) {
    var self = this;

    this.playSound('rumble.mp3');

    this.fires_[this.currentFire_].style['opacity'] = 1;
    this.fires_[this.currentFire_ + 1].style['opacity'] = 1;
    this.fires_[this.currentFire_ + 2].style['opacity'] = 1;

    var wiggle = ~~(Random(2, 2 * this.currentFire_ + 2));

    var wiggleLeft = new TWEEN.Tween({ 'rotate': 0 });
    wiggleLeft.to({ 'rotate': -wiggle }, 100);
    wiggleLeft.onUpdate(function() {
      self.$letterI_.attr('transform',
        'rotate(' + this['rotate'] + ', ' + self.centerI_ + ')');
    });

    var wiggleRight = new TWEEN.Tween({ 'rotate': -wiggle });
    wiggleRight.to({ 'rotate': wiggle }, 200);
    wiggleRight.delay(100);
    wiggleRight.onUpdate(function() {
      self.$letterI_.attr('transform',
        'rotate(' + this['rotate'] + ', ' + self.centerI_ + ')');
    });

    var wiggleBack = new TWEEN.Tween({ 'rotate': wiggle });
    wiggleBack.to({ 'rotate': 0 }, 100);
    wiggleBack.delay(300);
    wiggleBack.onUpdate(function() {
      self.$letterI_.attr('transform',
        'rotate(' + this['rotate'] + ', ' + self.centerI_ + ')');
    });
    wiggleBack.onComplete(function() {
      self.currentFire_ += 3;
      self.isAnimating_ = false;
    });

    this.isAnimating_ = true;
    this.addTween(wiggleLeft);
    this.addTween(wiggleRight);
    this.addTween(wiggleBack);
  }
};


/**
 * Animates rocket landing on the moon.
 * @private
 */
ww.mode.RocketMode.prototype.animateLanding_ = function() {
  this.playSound('rocket-launch.mp3');

  var self = this,
      delay = 100,
      duration = 400,
      moonBounds = this.$letterO_[0].getBoundingClientRect(),
      rocketBounds = this.$letterI_[0].getBoundingClientRect(),
      distance = ~~((moonBounds['left'] + moonBounds['width'] / 2)
                    - rocketBounds['height'])
      transform = '', prevTransform = '';

  var flyUp = new TWEEN.Tween({ 'translateY': 0 });
  flyUp.to({ 'translateY': 20 }, duration);

  var rotateIn = new TWEEN.Tween({ 'rotate': 0 });
  rotateIn.to({ 'rotate': 90 }, delay);
  rotateIn.onUpdate(function() {
    self.$letterI_.attr('transform',
      'rotate(' + this['rotate'] + ', ' + self.centerI_ + ')');
  });

  var orbitOver = new TWEEN.Tween({ 'translateY': 0, 'scale': 1 });
  orbitOver.to({ 'translateY': distance, 'scale': 0.25 }, duration);
  orbitOver.delay(delay);
  orbitOver.onUpdate(function() {
    transform = 'scale(' + this['scale'] + ') ' +
                'translate(0, ' + (-1 * this['translateY']) + ')';
    self.rocket_.attr('transform', transform);
  });
  orbitOver.onComplete(function() {
    prevTransform = transform;
  });

  delay += duration;

  var rotateLand = new TWEEN.Tween({ 'rotate': 0 });
  rotateLand.to({ 'rotate': -90 }, duration);
  rotateLand.delay(delay);
  rotateLand.onUpdate(function() {
    transform = prevTransform + ' rotate(' +
                this['rotate'] + ', ' + self.centerI_ + ')';
    self.rocket_.attr('transform', transform);
  });
  rotateLand.onComplete(function() {
    self.fires_.css('opacity', 0);
    self.activateO();
  });

  delay += duration;

  var reset = new TWEEN.Tween({ 'opacity': 0 });
  reset.to({ 'opacity': 1 }, 200);
  reset.delay(delay + duration + 2000);
  reset.onStart(function() {
    self.rocket_.attr('transform', '');
    self.$letterI_.attr('transform', '');
  });
  reset.onUpdate(function() {
    self.$letterI_.css('opacity', this['opacity']);
  });
  reset.onComplete(function() {
    self.currentFire_ = 0;
    self.hasLanded_ = false;
  });

  this.hasLanded_ = true;
  this.addTween(rotateIn);
  this.addTween(orbitOver);
  this.addTween(rotateLand);
  this.addTween(reset);
};


/**
 * Method called when activating the O.
 * Rotate the moon.
 */
ww.mode.RocketMode.prototype.activateO = function() {
  goog.base(this, 'activateO');

  this.playSound('sci-fi-door.mp3');

  var self = this,
      duration = 1000,
      deg = this.moons_[0].style[self.prefix_].split('rotate(')[1];
      deg = parseInt(deg) || 0;

  var rotateAround = new TWEEN.Tween({ 'rotate': deg });
  rotateAround.to({ 'rotate': deg + 360 * 2 }, duration);
  rotateAround.onUpdate(function() {
    self.moons_.attr('transform', 'rotate(' +
                      this['rotate'] + ', ' + self.centerO_ + ')');
  });
  rotateAround.onComplete(function() {
    self.moons_.attr('transform', 'rotate(0, ' + self.centerO_ + ')');
  });

  self.addTween(rotateAround);
};
