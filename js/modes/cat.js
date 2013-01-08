goog.require('ww.mode.Core');
goog.provide('ww.mode.CatMode');


/**
 * @constructor
 */
ww.mode.CatMode = function() {
  goog.base(this, 'cat', true, true);
};
goog.inherits(ww.mode.CatMode, ww.mode.Core);

/**
 * Initailize CateMode.
 * @private
 */
// ww.mode.CatMode.prototype.init = function() {
//   goog.base(this, 'init');
// };

/**
 * Plays a sound and stretches the letter i when activated.
 * @private
 */
ww.mode.CatMode.prototype.activateI = function() {
  goog.base(this, 'activateI');
  this.playSound('cat-1.mp3');

  var self = this;

  var stretchOut = new TWEEN['Tween']({ 'scaleY': 1 });
  stretchOut['to']({ 'scaleY': 1.4 }, 200);
  stretchOut['onUpdate'](function() {
    self.transformElem_(self.letterI[0], 'scaleY(' + this['scaleY'] + ')');
  });

  var stretchBack = new TWEEN['Tween']({ 'scaleY': 1.4 });
  stretchBack['to']({ 'scaleY': 1 }, 200);
  stretchBack['delay'](200);
  stretchBack['onUpdate'](function() {
    self.transformElem_(self.letterI[0], 'scaleY(' + this['scaleY'] + ')');
  });

  this.addTween(stretchOut);
  this.addTween(stretchBack);
};

/**
 * Plays a sound and stretches the letter o when activated.
 * @private
 */
ww.mode.CatMode.prototype.activateO = function() {
  goog.base(this, 'activateO');
  this.playSound('cat-2.mp3');

  var self = this;

  var position = [Random(-200, 200), Random(-50, 50)];

  var moveOut = new TWEEN['Tween']({ 'x': 0, 'y': 0 });
  moveOut['to']({ 'x': position[0], 'y': position[1] }, 200);
  moveOut['onUpdate'](function() {
    var translate = 'translate(' + this['x'] + 'px, ' + this['y'] + 'px)';
    self.transformElem_(self.letterO[0], translate);
  });

  var moveBack = new TWEEN['Tween']({ 'x': position[0], 'y': position[1] });
  moveBack['to']({ 'x': 0, 'y': 0 }, 200);
  moveBack['delay'](200);
  moveBack['onUpdate'](function() {
    var translate = 'translate(' + this['x'] + 'px, ' + this['y'] + 'px)';
    self.transformElem_(self.letterO[0], translate);
  });

  this.addTween(moveOut);
  this.addTween(moveBack);
};
