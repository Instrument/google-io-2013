goog.require('ww.mode.Core');
goog.provide('ww.mode.SongMode');


/**
 * @constructor
 */
ww.mode.SongMode = function() {
  goog.base(this, 'song', true, true);

  // TODO: Maybe we need to do this on category change to save bandwidth

  this.preloadSound('brass-note-1.m4a');
  this.preloadSound('brass-note-2.m4a');
  this.preloadSound('brass-note-3.m4a');
  this.preloadSound('brass-note-4.m4a');

  this.preloadSound('lute-note-1.m4a');
  this.preloadSound('lute-note-2.m4a');
  this.preloadSound('lute-note-3.m4a');
  this.preloadSound('lute-note-4.m4a');

  this.preloadSound('funky-note-1.m4a');
  this.preloadSound('funky-note-2.m4a');
  this.preloadSound('funky-note-3.m4a');
  this.preloadSound('funky-note-4.m4a');

  // this.preloadSound('organ-note-1.m4a');
  // this.preloadSound('organ-note-2.m4a');
  // this.preloadSound('organ-note-3.m4a');
  // this.preloadSound('organ-note-4.m4a');

  this.preloadSound('beats-piano.m4a');
  this.preloadSound('beats-club.m4a');
  this.preloadSound('beats-effected-kit.m4a');
  this.preloadSound('beats-electric-1.m4a');
  this.preloadSound('beats-electric-2.m4a');
  this.preloadSound('beats-hip-hop.m4a');
  this.preloadSound('beats-jazzy-rock.m4a');
  this.preloadSound('beats-jazzy.m4a');
  this.preloadSound('beats-lounge.m4a');
  this.preloadSound('beats-motown.m4a');
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

  this.ripples['note-1'] = [document.getElementById('rectangle1'),
                            document.getElementById('rectangle2'),
                            document.getElementById('rectangle3')];

  this.ripples['note-2'] = [document.getElementById('circle-yellow1'),
                            document.getElementById('circle-yellow2'),
                            document.getElementById('circle-yellow3')];

  this.ripples['note-3'] = [document.getElementById('circle-blue1'),
                            document.getElementById('circle-blue2'),
                            document.getElementById('circle-blue3')];

  this.ripples['note-4'] = [document.getElementById('polygon1'),
                            document.getElementById('polygon2'),
                            document.getElementById('polygon3')];

  // setup song styles, making first auto-active
  this.songs = $('.song-style');
  $(this.songs.get(0)).addClass('active');
  this.active = this.songs.get(0).id;

  // setup drums
  this.drums = [
    'beats-piano.m4a',
    'beats-club.m4a',
    'beats-effected-kit.m4a',
    'beats-electric-1.m4a',
    'beats-electric-2.m4a',
    'beats-hip-hop.m4a',
    'beats-jazzy-rock.m4a',
    'beats-jazzy.m4a',
    'beats-lounge.m4a',
    'beats-motown.m4a'
  ];

  this.numDrums = this.drums.length;
  this.drumIndex = -1;
  this.drumEl = $('#drumkit');
  this.activeDrum = null;
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

  self.drumEl.bind(self.evtStart, function() {
    self.startDrumChange();
  });

  self.drumEl.bind(self.evtEnd, function() {
    self.changeDrums();
  });
};

ww.mode.SongMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  this.instruments.unbind(this.evtStart);
  this.instruments.unbind(this.evtEnd);
  this.songs.unbind(this.evtEnd);
  this.drumEl.unbind(this.evtStart);
  this.drumEl.unbind(this.evtEnd);
};


ww.mode.SongMode.prototype.startDrumChange = function() {
  this.drumIndex++;

  if (this.drumIndex === 0) {
    this.drumEl.addClass('active');
  }

  if (this.drumIndex < this.numDrums) {
    this.drumEl.addClass('tabbing');
  } else {
    this.drumEl.removeClass('active');
    this.drumIndex = -1;
    this.activeDrum['disconnect'](0);
    this.activeDrum = null;
  }
};


ww.mode.SongMode.prototype.changeDrums = function() {
  if (this.drumIndex >= 0) {
    var self = this;

    self.activeDrum && self.activeDrum['disconnect'](0);

    self.playSound(self.drums[self.drumIndex], function(source) {
      self.activeDrum = source;
    }, true);

    self.drumEl.removeClass('tabbing');
  }
};


ww.mode.SongMode.prototype.swapSongMode = function(id) {
  this.log('swapping instrument to: ' + id);
  this.trackEvent_('changed-instrument', id);

  this.songs.removeClass('active');
  $('#' + id).addClass('active');
  this.active = id;
};


ww.mode.SongMode.prototype.beginSound = function(id, loop) {
  this.log('now playing sound for instrument id: ' + this.active + '-' + id);
  this.trackEvent_('play-sound', this.active + '-' + id);

  var self = this;

  self.playSound(self.active + '-' + id + '.m4a', function(source) {
    self.source = source;
  });

  var ripples = this.ripples[id];
  var ripple, delay = 0;
  var duration = ~~self.source.buffer.duration;
  
  for (var i = 0, l = ripples.length; i < l; i++) {
    ripple = ripples[i];

    (function(ripple, delay) {
      var startDuration = duration * 0.4 * 1000,
          endDuration = duration * 0.3 * 1000;
      var rippleOut = new TWEEN.Tween({ 'scale': 1, 'opacity': 1 });
          rippleOut.to({ 'scale': 1.75, 'opacity': 0.05 }, startDuration);
          rippleOut.delay(delay);
          rippleOut.onUpdate(function() {
            self.transformElem_(ripple, 'scale(' + this['scale'] + ')');
            ripple.style.opacity = this['opacity'];
          });

      var rippleIn = new TWEEN.Tween({ 'scale': 1.75, 'opacity': 0.05 });
          rippleIn.to({ 'scale': 1, 'opacity': 1 }, endDuration);
          rippleIn.delay(delay + startDuration);
          rippleIn.onUpdate(function() {
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
