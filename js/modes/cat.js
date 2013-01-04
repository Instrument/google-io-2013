goog.require('ww.mode.Core');
goog.provide('ww.mode.CatMode');

/**
 * @constructor
 */
ww.mode.CatMode = function() {
  goog.base(this, 'cat', true);
};
goog.inherits(ww.mode.CatMode, ww.mode.Core);

ww.mode.CatMode.setRotate = function(elm, deg) {
  $(elm).css({
    '-webkit-transform': 'rotate(' + deg + 'deg)',
    '-moz-transform': 'rotate(' + deg + 'deg)',
    '-ms-transform': 'rotate(' + deg + 'deg)',
    'transform': 'rotate(' + deg + 'deg)'
  });
};

ww.mode.CatMode.prototype.activateI = function() {
  var self = this;

  self.playSound('cat-1.mp3');

  self.letterI.animate({ rotate: -20 },
    {
      duration: 100,
      easing: 'easeInOutBounce',
      step: function(now, fx) {
        ww.mode.CatMode.setRotate(this, now);
      }
    }
  ).animate({ rotate: 20 },
    {
      duration: 200,
      easing: 'easeInOutBounce',
      step: function(now, fx) {
        ww.mode.CatMode.setRotate(this, now);
      }
    }
  ).animate({ rotate: 0 },
    {
      duration: 100,
      easing: 'easeInOutBounce',
      step: function(now, fx) {
        ww.mode.CatMode.setRotate(this, now);
      }
    }
  );
};

ww.mode.CatMode.prototype.activateO = function() {
  var self = this;

  self.playSound('cat-2.mp3');

  self.letterO.addClass('selected');
  
  var timer = setTimeout(function() {
    self.letterO.removeClass('selected');
    clearTimeout(timer);
    timer = null;
  }, 190);
};
