goog.provide('ww.mode');
goog.require('ww.mode.CatMode');
goog.require('ww.mode.DogMode');

/** @define {boolean} */
var DEBUG_MODE = false;

ww.mode.modes_ = {};

ww.mode.register = function(name, klass) {
  ww.mode.modes_[name] = klass;
};

ww.mode.findModeByName = function(name) {
  return ww.mode.modes_[name];
};

ww.mode.register('cat', ww.mode.CatMode);
ww.mode.register('dog', ww.mode.DogMode);

jQuery(function() {
  var parts = window.location.href.split('/');
  var page = parts[parts.length-1];
  var scriptName = page.replace('.html', '');

  var klass = ww.mode.findModeByName(scriptName);
  
  // Initialize
  var controller = new klass();

  if (DEBUG_MODE) {
    var focusCheckbox = $('<input type="checkbox">').appendTo(document.body);
    focusCheckbox.css({ 'position': 'absolute', 'top': 0, 'right': 0 });
    focusCheckbox.change(function () {
      if (focusCheckbox.prop('checked')) {
        controller['focus']();
      } else {
        controller['unfocus']();
      }
    });
  }
});