goog.require('ww.mode.Core');
goog.provide('ww.mode.RocketMode');


/**
 * @constructor
 */
ww.mode.RocketMode = function() {
  goog.base(this, 'rocket', true, true, false);

  this.preloadSound('rocket-launch.mp3');

  this.moon_ = document.getElementById('moon-1');

  // mooon over used to make the rocket look like it's going behind the moon
  this.moonOver_ = $('#letter-o').clone().attr('id', 'letter-o-over');
  this.moonOver_.css('opacity', 0);

  $('#letter-i').after(this.moonOver_);

  this.moonOver_.find('#moon-1').attr('id', "moon-2");
  this.moonOver_.find('#face-1').attr('id', "face-2");
  this.moonOver_ = this.moonOver_[0];

  this.faces_ = $('[id*=face-]');
  this.moons_ = $('[id*=moon-]');
};
goog.inherits(ww.mode.RocketMode, ww.mode.Core);


/**
 * Method called when activating the I.
 * Launch the rocket and land.
 */
ww.mode.RocketMode.prototype.activateI = function() {
  goog.base(this, 'activateI');

  this.playSound('rocket-launch.mp3');

  var self = this,
      delay = 100,
      duration = 400,
      moonBounds = this.$letterO_[0].getBoundingClientRect(),
      rocketBounds = self.$letterI_[0].getBoundingClientRect(),
      distance = ~~(moonBounds['right'] - rocketBounds['left'] +
                    + moonBounds['width'] / 2),
      transform, prevTransform;

  var rotateIn = new TWEEN.Tween({ 'rotate': 0 });
  rotateIn.to({ 'rotate': 90 }, delay);
  rotateIn.onUpdate(function() {
    transform = 'rotate(' + this['rotate'] + 'deg) ';
    self.transformElem_(self.$letterI_[0], transform);
  });
  rotateIn.onComplete(function() {
    prevTransform = transform;
  });

  var orbitOver = new TWEEN.Tween({ 'translateY': 0, 'scale': 1 });
  orbitOver.to({ 'translateY': distance, 'scale': 0.25 }, duration);
  orbitOver.delay(delay);
  orbitOver.onUpdate(function() {
    transform = prevTransform + 'scale(' + this['scale'] + ') ' +
                'translateY(-' + this['translateY'] + 'px) ';
    self.transformElem_(self.$letterI_[0], transform);
  });
  orbitOver.onComplete(function() {
    transform = transform + 'scaleY(-1) ';
    prevTransform = transform;
    self.transformElem_(self.$letterI_[0], transform);
  });

  delay += duration;

  var orbitBack = new TWEEN.Tween({ 'translateY': 0, 'scale': 1 });
  orbitBack.to({ 'translateY': distance, 'scale': 4 }, duration);
  orbitBack.delay(delay);
  orbitBack.onStart(function() {
    self.moonOver_.style['opacity'] = 1;
  });
  orbitBack.onUpdate(function() {
    transform = prevTransform + 'translateY(-' + this['translateY'] + 'px) ' +
                'scale(' + this['scale'] + ') ';
    self.transformElem_(self.$letterI_[0], transform);
  });
  orbitBack.onComplete(function() {
    prevTransform = transform;
    self.moonOver_.style['opacity'] = 0;
  });

  delay += duration;

  var rotateBack = new TWEEN.Tween({ 'rotate': 0 });
  rotateBack.to({ 'rotate': -90 }, 100);
  rotateBack.onStart(function() {
    prevTransform = prevTransform + ' scaleY(-1) ';
    self.transformElem_(self.$letterI_[0], prevTransform);
  });
  rotateBack.delay(delay);
  rotateBack.onUpdate(function() {
    transform = prevTransform + 'rotate(' + this['rotate'] + 'deg) ';
    self.transformElem_(self.$letterI_[0], transform);
  });

  this.addTween(rotateIn);
  this.addTween(orbitOver);
  this.addTween(orbitBack);
  this.addTween(rotateBack);
};


/**
 * Method called when activating the O.
 * Rotate the moon.
 */
ww.mode.RocketMode.prototype.activateO = function() {
  goog.base(this, 'activateO');

  var self = this,
      duration = 2000,
      deg = this.moons_[0].style[self.prefix_].split('rotate(')[1];
      deg = parseInt(deg) || 0,
      opacity = self.faces_[0].style['opacity'] || 0,
      opacity = parseFloat(opacity);

  var rotateAround = new TWEEN.Tween({ 'rotate': deg });
  rotateAround.to({ 'rotate': deg + 360 * 2 }, duration);
  rotateAround.onUpdate(function() {
    self.moons_.css(self.prefix_, 'rotate(' + this['rotate'] + 'deg)');
  });
  rotateAround.onComplete(function() {
    self.moons_.css(self.prefix_, 'rotate(0deg)');
  });

  var fadeIn = new TWEEN.Tween({ 'opacity': opacity });
  fadeIn.to({ 'opacity': 1 }, duration / 2);
  fadeIn.onUpdate(function() {
    self.faces_.css('opacity', this['opacity']);
  });

  var fadeOut = new TWEEN.Tween({ 'opacity': 1 });
  fadeOut.to({ 'opacity': 0 }, duration / 2);
  fadeOut.delay(duration / 2);
  fadeOut.onUpdate(function() {
    self.faces_.css('opacity', this['opacity']);
  });

  self.addTween(rotateAround);
  self.addTween(fadeIn);
  self.addTween(fadeOut);
};
