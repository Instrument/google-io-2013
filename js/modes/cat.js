goog.require('ww.mode.Core');
goog.provide('ww.mode.CatMode');

/**
 * @constructor
 * @param {Element} containerElem The containing element.
 * @param {String} assetPrefix The containing element.
 */
ww.mode.CatMode = function(containerElem, assetPrefix) {
  this.preloadSound('cat-1.mp3');
  this.preloadSound('cat-2.mp3');

  goog.base(this, containerElem, assetPrefix, 'cat', true, true);
};
goog.inherits(ww.mode.CatMode, ww.mode.Core);

/**
 * Plays a sound and stretches the letter i when activated.
 */
ww.mode.CatMode.prototype.activateI = function() {
  goog.base(this, 'activateI');
  this.playSound('cat-1.mp3');

  var self = this;

  var stretchOut = new TWEEN.Tween({ 'scaleY': 1 });
  stretchOut.to({ 'scaleY': 1.55 }, 200);
  stretchOut.easing(TWEEN.Easing.Bounce.InOut);
  stretchOut.onUpdate(function() {
    self.transformElem_(self.$letterI_[0], 'scaleY(' + this['scaleY'] + ')');
  });

  var stretchBack = new TWEEN.Tween({ 'scaleY': 1.55 });
  stretchBack.to({ 'scaleY': 1 }, 200);
  stretchBack.easing(TWEEN.Easing.Bounce.InOut);
  stretchBack.delay(200);
  stretchBack.onUpdate(function() {
    self.transformElem_(self.$letterI_[0], 'scaleY(' + this['scaleY'] + ')');
  });

  this.addTween(stretchOut);
  this.addTween(stretchBack);
};

/**
 * Plays a sound and stretches the letter o when activated.
 */
ww.mode.CatMode.prototype.activateO = function() {
  goog.base(this, 'activateO');
  this.playSound('cat-2.mp3');

  var self = this;

  var position = [~~Random(-50, 50), ~~Random(-50, 50)];

  var moveOut = new TWEEN.Tween({
    'scale': 1,
    'x': 0,
    'y': 0
  });

  moveOut.to({ 'scale': 1.5, 'x': position[0], 'y': position[1] }, 200);
  moveOut.easing(TWEEN.Easing.Bounce.InOut);
  moveOut.onUpdate(function() {
    var translate = 'translate(' + this['x'] + 'px, ' + this['y'] + 'px) ';
        translate += 'scale(' + this['scale'] + ')';
    self.transformElem_(self.$letterO_[0], translate);
  });

  var moveBack = new TWEEN.Tween({
    'scale': 1.5,
    'x': position[0],
    'y': position[1]
  });

  moveBack.to({ 'scale': 1, 'x': 0, 'y': 0 }, 200);
  moveBack.delay(200);
  moveBack.easing(TWEEN.Easing.Bounce.InOut);
  moveBack.onUpdate(function() {
    var translate = 'translate(' + this['x'] + 'px, ' + this['y'] + 'px) ';
        translate += 'scale(' + this['scale'] + ')';
    self.transformElem_(self.$letterO_[0], translate);
  });

  this.addTween(moveOut);
  this.addTween(moveBack);
};
