goog.require('ww.mode.Core');
goog.provide('ww.mode.SongMode');


/**
 * @constructor
 */
ww.mode.SongMode = function() {
  goog.base(this, 'song', true, true);
};
goog.inherits(ww.mode.SongMode, ww.mode.Core);


/**
 * Initailize SongMode.
 */
ww.mode.SongMode.prototype.init = function() {
  goog.base(this, 'init');


  if (Modernizr['touch']) {
    this.evtStart = 'touchstart.song';
    this.evtEnd = 'touchend.song';
  } else {
    this.evtStart = 'mousedown.song';
    this.evtEnd = 'mouseup.song';
  }
  
  // setup instruments and animation elements
  this.instruments = $('.instrument');
  this.ripples = {};

  this.rectangle = $('#rectangle');
  this.ripples['rectangle'] = [document.getElementById('rectangle0'),
                               document.getElementById('rectangle1'),
                               document.getElementById('rectangle2')];

  this.bigCircle = $('#big-circle');
  this.ripples['big-circle'] = [document.getElementById('big-circle0'),
                                document.getElementById('big-circle1'),
                                document.getElementById('big-circle2')];

  this.smallCircle = $('#small-circle');
  this.ripples['small-circle'] = [document.getElementById('small-circle0'),
                                  document.getElementById('small-circle1'),
                                  document.getElementById('small-circle2')];

  this.polygon = $('#polygon');
  this.ripples['polygon'] = [document.getElementById('polygon0'),
                             document.getElementById('polygon1'),
                             document.getElementById('polygon2')];
};


ww.mode.SongMode.prototype.didFocus =  function() {
  goog.base(this, 'didFocus');

  var self = this;

  self.instruments.bind(self.evtStart, function() {
    self.beginSound(this.id);
  });

  self.instruments.bind(self.evtEnd, function() {
    self.endSound(this.id);
  });
};


ww.mode.SongMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  this.instruments.unbind(this.evtStart);
  this.instruments.unbind(this.evtEnd);
};


ww.mode.SongMode.prototype.beginSound = function(id) {
  this.log('now playing sound for instrument id: ' + id);

  var self = this;
  var ripples = this.ripples[id];
  var ripple, delay = 0;
  for (var i = 0, l = ripples.length; i < l; i++) {
    ripple = ripples[i];

    (function(ripple, delay) {
      var fadeOut = new TWEEN['Tween']({ 'opacity': 1, 'scale': 1 });
          fadeOut['to']({ 'opacity': 0, 'scale': 5 }, 500);
          fadeOut['delay'](delay);
          fadeOut['easing'](TWEEN['Easing']['Elastic']['Out']);
          fadeOut['onUpdate'](function() {
            self.transformElem_(ripple, 'scale(' + this['scale'] + ')');
            ripple.style.opacity = this['opacity'];
          });
          fadeOut['onComplete'](function() {
            self.transformElem_(ripple, 'scale(1)');
            ripple.style.opacity = 1;
          });

      self.addTween(fadeOut);
    })(ripple, delay);

    delay += 300;
  }
};


ww.mode.SongMode.prototype.endSound = function(id) {
  this.log('now stopping sound for instrument id: ' + id);

};
