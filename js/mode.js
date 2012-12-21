goog.provide('ww.mode');

/**
 * @constructor
 */
ww.mode.Core = function(name) {
  this.name_ = name;
};

ww.mode.Core.prototype['start'] = function() {
  window.parent.postMessage(this.name_ + '.ready', '*');
};

goog.exportSymbol('ww.mode.Core', ww.mode.Core);