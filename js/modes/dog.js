goog.require('ww.mode.Core');
goog.provide('ww.mode.DogMode');

/**
 * @constructor
 */
ww.mode.DogMode = function() {
  goog.base(this, 'dog', true);
};
goog.inherits(ww.mode.DogMode, ww.mode.Core);