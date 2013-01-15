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
  this.ripples['rectangle'] = [document.getElementById('rectangle1'),
                               document.getElementById('rectangle2'),
                               document.getElementById('rectangle3')];

  this.bigCircle = $('#circle-blue');
  this.ripples['circle-blue'] = [document.getElementById('circle-blue1'),
                                document.getElementById('circle-blue2'),
                                document.getElementById('circle-blue3')];

  this.smallCircle = $('#circle-yellow');
  this.ripples['circle-yellow'] = [document.getElementById('circle-yellow1'),
                                  document.getElementById('circle-yellow2'),
                                  document.getElementById('circle-yellow3')];

  this.polygon = $('#polygon');
  this.ripples['polygon'] = [document.getElementById('polygon1'),
                             document.getElementById('polygon2'),
                             document.getElementById('polygon3')];

  // setup song styles, making first auto-active
  this.songs = $('.song-style');
  $(this.songs.get(0)).addClass('active');
  this.active = this.songs.get(0).id;
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
      var rippleOut = new TWEEN['Tween']({ 'scale': 1, 'opacity': 1 });
          rippleOut['to']({ 'scale': 1.75, 'opacity': 0.05 }, 400);
          rippleOut['delay'](delay);
          rippleOut['onUpdate'](function() {
            self.transformElem_(ripple, 'scale(' + this['scale'] + ')');
            ripple.style.opacity = this['opacity'];
          });

      var rippleIn = new TWEEN['Tween']({ 'scale': 1.75, 'opacity': 0.05 });
          rippleIn['to']({ 'scale': 1, 'opacity': 1 }, 200);
          rippleIn['delay'](delay + 400);
          rippleIn['onUpdate'](function() {
            self.transformElem_(ripple, 'scale(' + this['scale'] + ')');
            ripple.style.opacity = this['opacity'];
          });

      self.addTween(rippleOut);
      self.addTween(rippleIn);
    })(ripple, delay);

    delay += 300;
  }
};


ww.mode.SongMode.prototype.endSound = function(id) {
  this.log('now stopping sound for instrument id: ' + id);

};
