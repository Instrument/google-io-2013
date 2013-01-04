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

ww.mode.CatMode.setScale = function(elm, scale) {
  $(elm).css({
    '-webkit-transform': 'scale(' + scale + ')',
    '-moz-transform': 'scale(' + scale + ')',
    '-ms-transform': 'scale(' + scale + ')',
    'transform': 'scale(' + scale + ')'
  });
};

ww.mode.CatMode.prototype.activateI = function() {
  this.playSound('cat-1.mp3');

  $('#letter-i').animate({ rotate: -20 },
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
  this.playSound('cat-2.mp3');

  $('#letter-o').animate({ scale: 1.25 },
    {
      duration: 200,
      easing: 'easeInOutBounce',
      step: function(now, fx) {
        ww.mode.CatMode.setScale(this, now);
      }
    }
  ).animate({ scale: 1 },
    {
      duration: 100,
      easing: 'easeInOutBounce',
      step: function(now, fx) {
        ww.mode.CatMode.setScale(this, now);
      }
    }
  );
};
