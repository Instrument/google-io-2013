goog.require('ww.mode.Core');
goog.provide('ww.mode.BaconMode');

/**
 * @constructor
 */
ww.mode.BaconMode = function() {
  goog.base(this, 'bacon', true, true);
};
goog.inherits(ww.mode.BaconMode, ww.mode.Core);

/**
 * Initailize BaconMode.
 */
ww.mode.BaconMode.prototype.init = function() {
  goog.base(this, 'init');

  var self = this;

  this.container = $('#bacon-container').css('opacity', 1);
  this.bacon = $('#bacon');
  this.eggs = $('eggs');
};
