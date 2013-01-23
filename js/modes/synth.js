goog.require('ww.mode.Core');
goog.provide('ww.mode.SynthMode');


/**
 * @constructor
 */
ww.mode.SynthMode = function() {
  goog.base(this, 'synth', true, true, false);
};
goog.inherits(ww.mode.SynthMode, ww.mode.Core);


ww.mode.SynthMode.prototype.init = function() {
  goog.base(this, 'init');

  if (Modernizr.touch) {
    this.evtStart = 'touchstart.synth';
    this.evtEnd = 'touchend.synth';
  } else {
    this.evtStart = 'mousedown.synth';
    this.evtEnd = 'mouseup.synth';
  }

  this.getAudioContext_();
  this.source = this.audioContext_.createOscillator();
  this.tuna_ = new Tuna(this.audioContext_);
  this.analyser = this.audioContext_.createAnalyser();
  this.analyser.fftSize = 512;
  this.analyser.smoothingTimeConstant = 0.85;

  this.synth = $('#controls');
  this.effect = $('#effect');
  this.power = $('#power');
  this.params = $('.param');

  this.type = document.getElementById('oscillator-type');
  this.freq = document.getElementById('oscillator-frequency');
  this.detune = document.getElementById('oscillator-detune');

  this.isPlaying = false;
  this.previousEffect = 'dry';

  this.buildEffects_();
  this.createSound_();
};

ww.mode.SynthMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  if (!this.isPlaying) {
    return;
  }

  var data = new Uint8Array(this.analyser.frequencyBinCount);
  this.analyser.getByteFrequencyData(data);
  
  var size = ~~(this.width_ / data.length) + 1,
      x = 0, y = 0;
  for (var i = 0, l = data.length; i < l; i++) {
    y = (this.height_ / 2 + 256) - 256 - data[i];
    this.path['segments'][i]['point']['y'] = y;
  }

  this.path['smooth']();
};


ww.mode.SynthMode.prototype.onResize = function(redraw) {
  goog.base(this, 'onResize', false);

  if (this.path) {
    var x = ~~(this.width_ / 256) + 1;
    for (var i = 0, l = this.path['segments'].length; i < l; i++) {
      this.path['segments'][i]['point']['x'] = x * i;
    }
  }

  if (redraw) {
    this.redraw();
  }
};


/**
 * On focus, make the Synth interactive.
 */
ww.mode.SynthMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  var self = this;

  if (!self.path && !self.points) {
    self.getPaperCanvas_();

    var size = ~~(this.width_ / 256) + 1;

    self.path = new paper['Path']();
    self.path['strokeColor'] = '#ebebeb';
    self.path['strokeWidth'] = size;

    for (var i = 0; i < 256; i++) {
      var point = new paper['Point'](size * i, self.height_ / 2);
      self.path.add(point);
    }
  }

  self.isPlaying = false;
  self.connectPower_(); // connect

  self.power.bind(self.evtEnd, function() {
    self.connectPower_();
  });

  self.params.bind('change.synth', function() {
    self.createSound_();
  });

  self.effect.bind('change.synth', function() {
    self.changeEffect_(this);
  });
};


/**
 * On unfocus, deactivate the Synth.
 */
ww.mode.SynthMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  this.power.unbind(this.evtEnd);
  this.params.unbind('change.synth');
  this.effect.unbind('change.synth');

  this.isPlaying = true;
  this.connectPower_(); // disconnect
};


/**
 * @param {Object} elm Input element with desired effect.
 * @private
 */
ww.mode.SynthMode.prototype.changeEffect_ = function(elm) {
  if (!this.isPlaying) {
    this.connectPower_();
  }

  if (this.previousEffect === 'dry') {
    this.source.disconnect(this.audioContext_.destination);
  } else {
    this.effects[this.previousEffect].disconnect(
      this.audioContext_.destination);
  }

  this.analyser.disconnect(this.audioContext_.destination);

  if (elm.value === 'dry') {
    this.source.connect(this.analyser);
  } else {
    this.source.connect(this.effects[elm.value]['input']);
    this.effects[elm.value].connect(this.analyser);
  }

  this.analyser.connect(this.audioContext_.destination);

  this.previousEffect = elm.value;
};


/**
 * @private
 */
ww.mode.SynthMode.prototype.buildEffects_ = function() {
  this.effects = {};

  this.effects['chorus'] = new this.tuna_.Chorus();
  this.effects['tremolo'] = new this.tuna_.Tremolo();
  this.effects['delay'] = new this.tuna_.Delay();
  this.effects['phaser'] = new this.tuna_.Phaser();
  this.effects['wahwah'] = new this.tuna_.WahWah();
  this.effects['filter'] = new this.tuna_.Filter();
  this.effects['overdrive'] = new this.tuna_.Overdrive();
};


/**
 * @private
 */
ww.mode.SynthMode.prototype.createSound_ = function() {
  this.source.type = this.type.value;
  this.source.frequency.value = this.freq.value;
  this.source.detune.value = this.detune.value;
};


/**
 * @private
 */
ww.mode.SynthMode.prototype.connectPower_ = function() {
  if (!this.isPlaying) {
    this.playSound_();
    this.power[0].value = 'Pause';
    this.isPlaying = true;
  } else {
    this.pauseSound_();
    this.power[0].value = 'Play';
    this.isPlaying = false;
  }
};


/**
 * @private
 */
ww.mode.SynthMode.prototype.playSound_ = function() {
  var effect = this.effect[0].value;

  if (effect === 'dry') {
    this.source.connect(this.analyser);
  } else {
    this.source.connect(this.effects[effect]['input']);
    this.effects[effect].connect(this.analyser);
  }

  this.analyser.connect(this.audioContext_.destination);
  this.source.noteOn(0);
};


/**
 * @private
 */
ww.mode.SynthMode.prototype.pauseSound_ = function() {
  this.source.disconnect();
};


