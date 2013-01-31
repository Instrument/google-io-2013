goog.require('ww.mode.Core');
goog.provide('ww.mode.SynthMode');


/**
 * @constructor
 */
ww.mode.SynthMode = function() {
  goog.base(this, 'synth', true, true, false);
};
goog.inherits(ww.mode.SynthMode, ww.mode.Core);

/**
 * Set up synth events, sounds, effects and viz.
 */
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

  this.filter = this.audioContext_.createBiquadFilter();
  this.filter.type = 0;  // lowpass
  this.filter.frequency.value = 440;

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

  this.count = 360 * (this.width_ % 360);
};


/**
 * Runs code on each requested frame.
 * @param {Integer} delta The timestep variable for animation accuracy.
 */
ww.mode.SynthMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);
  
  if (!this.isPlaying) {
    return;
  }

  this.count = this.count - (delta * 300);
  this.duration = this.duration + delta;

  // Draw frequency path.
  var data = new Uint8Array(this.analyser.frequencyBinCount);
  this.analyser.getByteFrequencyData(data);

  var newY;
  for (var i = 0, l = data.length; i < l; i++) {
    newY = this.centerY - (data[i] * 1.25);
    this.path['segments'][i]['point']['y'] = newY;
  }
  this.path['smooth']();


  // Draw sine wave.
  var detune = Math.abs(Math.abs(this.source.detune.value / 2400) - 2) + .5;
  var freq = this.source.frequency.value * .05; // * 0.00075;

  console.log(freq,detune,this.source.frequency.value);

  var min = 6
  var amount = freq > min ? freq : min;
  var height = 100 * detune;
  var distance = this.width_ / amount;
  
  if (this.sinePath['segments'].length - 1 !== amount) {
    this.sinePath['removeSegments']();
    for (var i = 0; i <= amount; i++) {
      var point = new paper['Point'](distance * i, this.centerY);
      this.sinePath.add(point);
    }
  }
  
  for (var i = 0; i <= amount; i++) {
    var segment = this.sinePath['segments'][i];
    var sin = Math.sin(this.duration * 3 + i);
    segment['point']['y'] = sin * height + this.centerY;
  }

  this.sinePath['smooth']();
    
};


/**
 * Handles a browser window resize.
 * @param {Boolean} redraw Whether resize redraws.
 */
ww.mode.SynthMode.prototype.onResize = function(redraw) {
  goog.base(this, 'onResize', false);

  if (this.height_ < 500) {
    this.centerY = (this.height_ / 2) + (this.height_ - 256) / 2;
  } else {
    this.centerY = (this.height_ / 2) + (256 / 2);
  }

  this.scale = ~~(this.height_ * 0.5);
  this.waveHeight = ~~(this.height_ / 2);

  if (this.canvas_) {
    this.canvas_.width = this.width_;
    this.canvas_.height = this.height_;
  }

  if (this.path) {
    var max = Math.max(this.width_, 256);
    var x = Math.ceil(this.paperCanvas_.width / 256);

    for (var i = 0, l = this.path['segments'].length; i < l; i++) {
      this.path['segments'][i]['point']['x'] = x * i;
      this.path['segments'][i]['point']['y'] = this.centerY;
    }
  }

  if (redraw) {
    this.redraw();
  }

  var boundingO = $('#letter-o')[0]['getBoundingClientRect']();
  this.synth.css({
    'top': ~~boundingO['top'] + 'px',
    'left': ~~boundingO['left'] + 'px',
    'height': ~~boundingO['height'] + 'px',
    'width': ~~boundingO['width'] + 'px'
  });
};


/**
 * On focus, make the Synth interactive.
 */
ww.mode.SynthMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  var self = this;

  if (self.height_ < 500) {
    self.centerY = (self.height_ / 2) + (self.height_ - 256) / 2;
  } else {
    self.centerY = (self.height_ / 2) + (256 / 2);
  }

  self.scale = ~~(self.height_ * 0.5);
  self.waveHeight = ~~(self.height_ / 2);

  // if (!self.canvas_) {
  //   self.canvas_ = $('#sine-graph')[0];
  //   self.canvas_.width = self.width_;
  //   self.canvas_.height = self.height_;
  //   self.sctx = self.canvas_.getContext('2d');
  // }

  if (!self.path && !self.points) {
    self.getPaperCanvas_();
    self.ctx = self.paperCanvas_.getContext('2d');

    var max = Math.max(this.width_, 256);
    var size = Math.ceil(self.paperCanvas_.width / 256);

    self.path = new paper['Path']();
    self.path['strokeColor'] = '#e9e9e9';
    self.path['strokeWidth'] = 5;
    
    self.sinePath = new paper['Path']();
    self.sinePath['strokeColor'] = 'red';
    self.sinePath['strokeWidth'] = 2;

    for (var i = 0; i <= max; i++) {
      var point = new paper['Point'](size * i, self.centerY);
      self.path.add(point);
    }
    self.duration = 0;
  }

  var boundingO = $('#letter-o')[0]['getBoundingClientRect']();
  self.synth.css({
    'top': ~~boundingO['top'] + 'px',
    'left': ~~boundingO['left'] + 'px',
    'height': ~~boundingO['height'] + 'px',
    'width': ~~boundingO['width'] + 'px'
  });

  self.isPlaying = false;
  self.connectPower_(); // connect

  self.power.bind(self.evtEnd, function() {
    self.connectPower_();
  });

  self.params.bind('change.synth', function(e) {
    e.preventDefault();
    self.createSound_();
  });

  self.effect.bind('change.synth', function(e) {
    e.preventDefault();
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

  // this.analyser.connect(this.audioContext_.destination);
  this.source.noteOn(0);
};


/**
 * @private
 */
ww.mode.SynthMode.prototype.pauseSound_ = function() {
  this.source.disconnect();
};
