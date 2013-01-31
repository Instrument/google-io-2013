goog.require('ww.mode.Core');
goog.provide('ww.mode.BowlingMode');


/**
 * @constructor
 */
ww.mode.BowlingMode = function() {
  goog.base(this, 'bowling', true, true, false);
};
goog.inherits(ww.mode.BowlingMode, ww.mode.Core);


/**
 * Initailize BowlingMode.
 */
ww.mode.BowlingMode.prototype.init = function() {
  goog.base(this, 'init');
};
