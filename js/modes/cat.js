goog.require('ww.mode.Core');
goog.provide('ww.mode.CatMode');

/**
 * @constructor
 */
ww.mode.CatMode = function() {
  goog.base(this, 'cat', true);
};
goog.inherits(ww.mode.CatMode, ww.mode.Core);

ww.mode.CatMode.prototype.activateI = function() {
  this.playSound('cat-1.mp3');
};

ww.mode.CatMode.prototype.activateO = function() {
  this.playSound('cat-2.mp3');
};
