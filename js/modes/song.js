goog.require('ww.mode.Core');
goog.provide('ww.mode.SongMode');


/**
 * @constructor
 * @param {Element} containerElem The containing element.
 * @param {String} assetPrefix The containing element.
 */
ww.mode.SongMode = function(containerElem, assetPrefix) {
  goog.base(this, containerElem, assetPrefix, 'song', true, true);

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

  this.evtStart = this.getPointerEventNames_('down', 'song');
  this.evtEnd = this.getPointerEventNames_('up', 'song');

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
  this.drumBadge = $('#drum-number');
  this.drumIndex = -1;
  this.drumEl = $('#drumkit');
  this.activeDrum = null;
};


/**
 * On focus, make the Song mode interactive.
 */
ww.mode.SongMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  var self = this;

  self.instruments.bind(self.evtStart, function() {
    self.beginSound_(this.id, false);
  });

  self.songs.bind(self.evtEnd, function() {
    self.swapSongMode_(this.id);
  });

  self.drumEl.bind(self.evtStart, function() {
    self.startDrumChange_();
  });

  self.drumEl.bind(self.evtEnd, function() {
    self.changeDrums_();
  });
};


/**
 * On unfocus, deactivate Song mode. Reset drums and animations.
 */
ww.mode.SongMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  this.instruments.unbind(this.evtStart);
  this.songs.unbind(this.evtEnd);
  this.drumEl.unbind(this.evtStart);
  this.drumEl.unbind(this.evtEnd);

  this.songs.removeClass('active');

  this.activeDrum && this.activeDrum['disconnect'](0);
  this.source && this.source['disconnect'](0);

  this.activeDrum = null;
  this.drumIndex = -1;
  this.drumEl.removeClass('active');

  TWEEN.removeAll();

  var shapes = $('.shape');
  for (var i = 0, l = shapes.length; i < l; i++) {
    var shape = shapes[i];
    this.transformElem_(shape, 'scale(1)');
    shape.style.opacity = 1;
  }
};


/**
 * Prepare to use the next drum. Reset drums if going past the last.
 * Cycle through the drums, deactivating once trying to go past the last.
 * @private
 */
ww.mode.SongMode.prototype.startDrumChange_ = function() {
  this.drumIndex++;

  if (this.drumIndex === 0) {
    this.drumEl.addClass('active');
  }

  if (this.drumIndex < this.numDrums) {
    this.drumEl.addClass('tabbing');
    this.drumBadge.text(this.drumIndex + 1);
  } else {
    this.drumEl.removeClass('active');
    this.drumBadge.text('');
    this.drumIndex = -1;
    this.activeDrum['disconnect'](0);
    this.activeDrum = null;
  }
};


/**
 * Change to the next drums if drums are still active.
 * Drums are not active once the next drum is beyond the last.
 * @private
 */
ww.mode.SongMode.prototype.changeDrums_ = function() {
  if (this.drumIndex >= 0) {
    var self = this;

    self.activeDrum && self.activeDrum['disconnect'](0);

    self.playSound(self.drums[self.drumIndex], function(source) {
      self.activeDrum = source;
    }, true);

    self.drumEl.removeClass('tabbing');
  }
};


/**
 * Prepare to use the next set of notes of the selected instrument.
 * @param {String} id Id of the next group of notes to use.
 * @private
 */
ww.mode.SongMode.prototype.swapSongMode_ = function(id) {
  this.log('swapping instrument to: ' + id);
  this.trackEvent_('changed-instrument', id);

  this.songs.removeClass('active');
  $('#' + id).addClass('active');

  this.active = id;
};

/**
 * Begin playing the selected note out of the active instrument group.
 * @param {String} id Id of the note to use.
 * @private
 */
ww.mode.SongMode.prototype.beginSound_ = function(id) {
  this.log('now playing sound for note id: ' + this.active + '-' + id);
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
      // animation durations dependent on length of sound clip
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

