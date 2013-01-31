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
 * Initailize RocketMode.
 */
ww.mode.RocketMode.prototype.init = function() {
  goog.base(this, 'init');
};
