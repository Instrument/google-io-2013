goog.require('ww.mode.Core');
goog.provide('ww.mode.SongMode');


/**
 * @constructor
 */
ww.mode.SongMode = function() {
  goog.base(this, 'song', true, true);

  this.preloadSound('brass-note-1.m4a');
  this.preloadSound('brass-note-2.m4a');
  this.preloadSound('brass-note-3.m4a');
  this.preloadSound('brass-note-4.m4a');

  this.preloadSound('lute-note-1.m4a');
  this.preloadSound('lute-note-2.m4a');
  this.preloadSound('lute-note-3.m4a');
  this.preloadSound('lute-note-4.m4a');

  this.preloadSound('organ-note-1.m4a');
  this.preloadSound('organ-note-2.m4a');
  this.preloadSound('organ-note-3.m4a');
  this.preloadSound('organ-note-4.m4a');
};
goog.inherits(ww.mode.SongMode, ww.mode.Core);


/**
 * Initailize SongMode.
 */
ww.mode.SongMode.prototype.init = function() {
  goog.base(this, 'init');

  if (Modernizr.touch) {
    this.evtStart = 'touchstart.song';
    this.evtEnd = 'touchend.song';
  } else {
    this.evtStart = 'mousedown.song';
    this.evtEnd = 'mouseup.song';
  }
  
  // setup instruments and animation elements
  this.instruments = $('.instrument');
  this.ripples = {};

  this.note1 = $('#note-1');
  this.ripples['note-1'] = [document.getElementById('rectangle1'),
                            document.getElementById('rectangle2'),
                            document.getElementById('rectangle3')];

  this.note2 = $('#note-2');
  this.ripples['note-2'] = [document.getElementById('circle-yellow1'),
                            document.getElementById('circle-yellow2'),
                            document.getElementById('circle-yellow3')];

  this.note3 = $('#note-3');
  this.ripples['note-3'] = [document.getElementById('circle-blue1'),
                            document.getElementById('circle-blue2'),
                            document.getElementById('circle-blue3')];

  this.note4 = $('#note-4');
  this.ripples['note-4'] = [document.getElementById('polygon1'),
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
    self.beginSound(this.id, false);
  });

  self.instruments.bind(self.evtEnd, function() {
    self.endSound(this.id);
  });

  self.songs.bind(self.evtEnd, function() {
    self.swapSongMode(this.id);
  });
};


ww.mode.SongMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  this.instruments.unbind(this.evtStart);
  this.instruments.unbind(this.evtEnd);
  this.songs.unbind(this.evtEnd);
};


ww.mode.SongMode.prototype.swapSongMode = function(id) {
  this.log('swapping instrument to: ' + id);

  this.songs.removeClass('active');
  $('#' + id).addClass('active');
  this.active = id;
};


ww.mode.SongMode.prototype.beginSound = function(id, loop) {
  this.log('now playing sound for instrument id: ' + this.active + '-' + id);

  var self = this;

  self.playSound(self.active + '-' + id + '.m4a', function(source) {
    self.source = source;
  });

  var ripples = this.ripples[id];
  var ripple, delay = 0;
  var duration = ~~self.source['buffer']['duration'];
  
  for (var i = 0, l = ripples.length; i < l; i++) {
    ripple = ripples[i];

    (function(ripple, delay) {
      var startDuration = duration * 0.4 * 1000,
          endDuration = duration * 0.3 * 1000;
      var rippleOut = new TWEEN['Tween']({ 'scale': 1, 'opacity': 1 });
          rippleOut['to']({ 'scale': 1.75, 'opacity': 0.05 }, startDuration);
          rippleOut['delay'](delay);
          rippleOut['onUpdate'](function() {
            self.transformElem_(ripple, 'scale(' + this['scale'] + ')');
            ripple.style.opacity = this['opacity'];
          });

      var rippleIn = new TWEEN['Tween']({ 'scale': 1.75, 'opacity': 0.05 });
          rippleIn['to']({ 'scale': 1, 'opacity': 1 }, endDuration);
          rippleIn['delay'](delay + startDuration);
          rippleIn['onUpdate'](function() {
            self.transformElem_(ripple, 'scale(' + this['scale'] + ')');
            ripple.style.opacity = this['opacity'];
          });

      self.addTween(rippleOut);
      self.addTween(rippleIn);
    })(ripple, delay);

    delay += (duration * 0.2 * 1000);
  }
};


ww.mode.SongMode.prototype.endSound = function(id) {
  this.log('now stopping sound for instrument id: ' + id);

};
