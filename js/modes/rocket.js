goog.require('ww.mode.Core');
goog.provide('ww.mode.RocketMode');


/**
 * @constructor
 */
ww.mode.RocketMode = function() {
  goog.base(this, 'rocket', true, true, false);
};
goog.inherits(ww.mode.RocketMode, ww.mode.Core);


/**
 * Method called when activating the I.
 * Launch the rocket and land.
 */
ww.mode.RocketMode.prototype.activateI = function() {
  goog.base(this, 'activateI');

  var self = this;
  var delay = 200,
      moonBounds = this.$letterO_[0].getBoundingClientRect(),
      transform, prevTransform;

  var rocketLaunch = new TWEEN.Tween({
    'translateY': 0,
    'rotate': 0,
    'scale': 1
  });

  rocketLaunch.to({
    'translateY': 20,
    'rotate': 145,
    'scale': 0.25
  }, delay);

  rocketLaunch.onUpdate(function() {
    transform = 'scale(' + this['scale'] + ') ' +
                'translateY(' + this['translateY'] + '%) ' +
                'rotate(' + this['rotate'] + 'deg)';
    self.transformElem_(self.$letterI_[0], transform);
  });

  rocketLaunch.onComplete(function(){
    prevTransform = transform;

    var rocketBounds = self.$letterI_[0].getBoundingClientRect(),

        newY = ~~(rocketBounds['top'] + rocketBounds['height'] / 2 -
                  moonBounds['top'] - moonBounds['height'] / 2),

        newX = ~~(moonBounds['width'] / 2 - rocketBounds['width'] / 2);

    var toCenter = new TWEEN.Tween({
      'newY': 0,
      'newX': 0,
      'rotate': 0
    });

    toCenter.to({
      'newY': newY,
      'newX': -newX,
      'rotate': 575
    }, 200);

    toCenter.delay(delay);

    toCenter.onUpdate(function() {
      transform = prevTransform + ' translate(' + this['newX'] + 'px, ' +
                  this['newY'] + 'px) ' + 'rotate(' + this['rotate'] + 'deg)';
      self.transformElem_(self.$letterI_[0], transform);
    });

    self.addTween(toCenter);
  });

  this.addTween(rocketLaunch);
};


/**
 * Method called when activating the O.
 * Rotate the moon.
 */
ww.mode.RocketMode.prototype.activateO = function() {
  goog.base(this, 'activateO');

  var self = this;
  var deg = this.$letterO_[0].style[self.prefix_].split('rotate(')[1];
      deg = parseInt(deg) || 0;

  var rotateAround = new TWEEN.Tween({ 'rotate': deg });
  rotateAround.to({ 'rotate': deg + 360 }, 1000);
  rotateAround.onUpdate(function() {
    self.transformElem_(self.$letterO_[0], 'rotate(' + this['rotate'] + 'deg)');
  });
  rotateAround.onComplete(function() {
    self.transformElem_(self.$letterO_[0], 'rotate(0deg)');
  });

  self.addTween(rotateAround);
};
