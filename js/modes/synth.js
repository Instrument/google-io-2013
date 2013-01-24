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

  this.count = 360 * (this.width_ % 360);
};

ww.mode.SynthMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  if (!this.isPlaying) {
    return;
  }

  this.count = this.count - (delta * 1000);

  var data = new Uint8Array(this.analyser.frequencyBinCount);
  this.analyser.getByteFrequencyData(data);

  var newY;
  for (var i = 0, l = data.length; i < l; i++) {
    newY = (this.height_ / 2) + (256 / 2) - data[i] * 1.5;
    this.path['segments'][i]['point']['y'] = newY;
  }

  this.path['smooth']();

  var detune = Math.max(0.5,
                Math.abs(Math.round(this.source.detune.value / 2400)));
  var freq = this.source.frequency.value * 0.00075;

  this.sctx.strokeStyle = 'rgba(230, 230, 230, 0.5)';
  this.sctx.fillStyle = 'rgba(230, 230, 230, 0.5)';
  this.sctx.lineWidth = 2;

  this.sctx.beginPath();

  var x = 0;
  var y = 0;

  while (x + this.count < this.width_ + this.count) {
    y = Math.sin(freq * (x + this.count) * Math.PI / 180) * detune;

    if (y >= 0) {
      y = 300 - (y - 0) * (300 / 2);
    }

    if (y < 0) {
      y = 300 + (0 - y) * (300 / 2);
    }

    y += (this.height_ / 4);

    this.sctx.fillRect(x, y, 2, 2);
    this.sctx.lineTo(x, y);

    x++;
  }

  this.sctx.closePath();
  this.sctx.stroke();
  this.sctx.fill();

  if (this.count < 0) {
    this.count = 360 * (this.width_ % 360);
  }
};


ww.mode.SynthMode.prototype.onResize = function(redraw) {
  goog.base(this, 'onResize', false);

  if (this.canvas_) {
    this.canvas_.width = this.width_;
    this.canvas_.height = this.height_;
    this.scale = ~~(this.height_ * 0.5);
  }

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

  if (!self.canvas_) {
    self.canvas_ = $('#sine-graph')[0];
    self.canvas_.width = self.width_;
    self.canvas_.height = self.height_;
    self.sctx = self.canvas_.getContext('2d');
    self.scale = ~~(this.height_ * 0.5);
  }

  if (!self.path && !self.points) {
    self.getPaperCanvas_();

    self.sctx = self.paperCanvas_.getContext('2d');

    var size = Math.round(this.width_ / 256);
    var centerY = self.height_ / 2;

    self.path = new paper['Path']();
    self.path['strokeColor'] = '#e9e9e9';
    self.path['strokeWidth'] = 3;

    for (var i = -1; i <= 256; i++) {
      var point = new paper['Point'](size * i, centerY + (256 / 2));
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

