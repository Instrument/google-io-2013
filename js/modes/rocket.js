goog.require('ww.mode.Core');
goog.provide('ww.mode.RocketMode');


/**
 * @constructor
 */
ww.mode.RocketMode = function() {
  goog.base(this, 'rocket', true, true, false);
};
goog.inherits(ww.mode.RocketMode, ww.mode.Core);


// /**
//  * Initailize RocketMode.
//  */
// ww.mode.RocketMode.prototype.init = function() {
//   goog.base(this, 'init');
// };


/**
 * Method called when activating the I.
 * Rotate the moon.
 */
ww.mode.RocketMode.prototype.activateI = function() {
  goog.base(this, 'activateI');

  var self = this;
  var boundsMoon = this.$letterO_[0].getBoundingClientRect();
  var transform = 'scale(0.25) ';
  var transform2 = '';

  self.transformElem_(self.$letterI_[0], transform);

  var boundsRocket = self.$letterI_[0].getBoundingClientRect();

  var startX = ~~boundsMoon['left'] - (~~boundsRocket['width'] * 2);
  var startY = ~~boundsMoon['top'];

  self.transformElem_(self.$letterI_[0], 'scale(1)');

  var animateToOrbit = new TWEEN.Tween({
    'scale': 1,
    'translateX': 0,
    'translateY': 0,
    'rotate': 0
  });

  animateToOrbit.to({
    'scale': 0.25,
    'translateX': startX,
    'translateY': startY,
    'rotate': 45
  }, 200);

  animateToOrbit.onUpdate(function() {
    transform = 'scale(' + this['scale'] + ') ' +
                'translateX(' + this['translateX'] + 'px) ' +
                'translateY(' + this['translateY'] + 'px) ' +
                'rotate(' + this['rotate'] + 'deg)';
    self.transformElem_(self.$letterI_[0], transform);
  });

  animateToOrbit.onComplete(function() {
    boundsRocket = self.$letterI_[0].getBoundingClientRect();
    var nextX = ~~boundsMoon['left'] + ~~boundsMoon['width'] / 2;
    var nextY = ~~boundsMoon['top'] + ~~boundsMoon['height'] / 2;

    var animateToCenter = new TWEEN.Tween({
      'scale': 0.25,
      'translateX': startX,
      'translateY': startY,
      'rotate': 45
    });

  });

  self.addTween(animateToOrbit);
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
