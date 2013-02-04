goog.require('ww.mode.Core');
goog.provide('ww.mode.DonutMode');


/**
 * @constructor
 */
ww.mode.DonutMode = function() {
  goog.base(this, 'donut', true, true, false);
};
goog.inherits(ww.mode.DonutMode, ww.mode.Core);


/**
 * Initailize DonutMode.
 */
ww.mode.DonutMode.prototype.init = function() {
  goog.base(this, 'init');
};
