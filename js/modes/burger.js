goog.require('ww.mode.Core');
goog.provide('ww.mode.BurgerMode');


/**
 * @constructor
 */
ww.mode.BurgerMode = function() {
  goog.base(this, 'burger', true, true, false);
};
goog.inherits(ww.mode.BurgerMode, ww.mode.Core);


/**
 * Initailize BurgerMode.
 */
ww.mode.BurgerMode.prototype.init = function() {
  goog.base(this, 'init');
};
