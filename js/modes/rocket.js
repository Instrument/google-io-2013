goog.require('ww.mode.Core');
goog.provide('ww.mode.RocketMode');


/**
 * @constructor
 * @param {Element} containerElem The containing element.
 * @param {String} assetPrefix The containing element.
 */
ww.mode.RocketMode = function(containerElem, assetPrefix) {
  this.preloadSound('rocket-launch.mp3');

  goog.base(this, containerElem, assetPrefix, 'rocket', true, true, false);

  this.moon_ = this.find('#moon-1')[0];
  var i = this.find('.letter-i');
  var o = this.find('.letter-o');
  this.moonCenter_ = o.attr('cx') + ', ' + o.attr('cy');
  this.rocketCenter_ = i.attr('cx') + ', ' + i.attr('cy');
  this.rocket_ = this.find('.letter-i-wrapper');

  this.moonOver_ = this.find('.letter-o').clone();
  this.moonOver_.attr('class', 'letter-o-over');
  this.moonOver_.css('opacity', 0);

  this.find('.letter-i').after(this.moonOver_);

  this.moonOver_.find('#moon-1').attr('id', 'moon-2');
  this.moonOver_.find('#face-1').attr('id', 'face-2');
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
      rocketBounds = this.$letterI_[0].getBoundingClientRect(),
      distance = ~~(moonBounds['right'] + rocketBounds['width'] +
                    rocketBounds['height']),
      transform = '', prevTransform = '';

  var rotateIn = new TWEEN.Tween({ 'rotate': 0 });
  rotateIn.to({ 'rotate': 90 }, delay);
  rotateIn.onUpdate(function() {
    self.$letterI_.attr('transform',
      'rotate(' + this['rotate'] + ', ' + self.rocketCenter_ + ')');
  });

  var orbitOver = new TWEEN.Tween({ 'translateY': 0, 'scale': 1 });
  orbitOver.to({ 'translateY': distance, 'scale': 0.25 }, duration);
  orbitOver.delay(delay);
  orbitOver.onUpdate(function() {
    transform = 'scale(' + this['scale'] + ') ' +
                'translate(0, -' + this['translateY'] + ')';
    self.rocket_.attr('transform', transform);
  });
  orbitOver.onComplete(function() {
    transform = transform + ' scale(1, -1) ';
    prevTransform = transform;
    self.rocket_.attr('transform', transform);
  });

  delay += duration;

  var orbitBack = new TWEEN.Tween({ 'translateY': 0, 'scale': 1 });
  orbitBack.to({ 'translateY': distance, 'scale': 4 }, duration);
  orbitBack.delay(delay);
  orbitBack.onStart(function() {
    self.moonOver_.style['opacity'] = 1;
  });
  orbitBack.onUpdate(function() {
    transform = prevTransform + ' translate(0, -' + this['translateY'] + ') ' +
                'scale(' + this['scale'] + ')';
    self.rocket_.attr('transform', transform);
  });
  orbitBack.onComplete(function() {
    prevTransform = transform;
    self.moonOver_.style['opacity'] = 0;
  });

  delay += duration;

  var rotateBack = new TWEEN.Tween({ 'rotate': 90 });
  rotateBack.to({ 'rotate': 0 }, 100);
  rotateBack.onStart(function() {
    transform = transform + ' scale(1, -1) ';
    prevTransform = transform;
    self.rocket_.attr('transform', transform);
  });
  rotateBack.delay(delay);
  rotateBack.onUpdate(function() {
    self.$letterI_.attr('transform',
      'rotate(' + this['rotate'] + ', ' + self.rocketCenter_ + ')');
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
    self.moons_.attr('transform', 'rotate(' +
                      this['rotate'] + ', ' + self.moonCenter_ + ')');
  });
  rotateAround.onComplete(function() {
    self.moons_.attr('transform', 'rotate(0, ' + self.moonCenter_ + ')');
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
