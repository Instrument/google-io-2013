goog.require('ww.mode.Core');
goog.provide('ww.mode.SynthMode');


/**
 * @constructor
 */
ww.mode.SynthMode = function() {
  goog.base(this, 'synth', true, true);
};
goog.inherits(ww.mode.SynthMode, ww.mode.Core);


ww.mode.SynthMode.prototype.init = function() {
  goog.base(this, 'init');

  if (Modernizr.touch) {
    this.evtStart = 'touchstart.synth';
    this.evtMove = 'touchmove.synth';
    this.evtEnd = 'touchend.synth';
  } else {
    this.evtStart = 'mousedown.synth';
    this.evtMove = 'mousemove.synth';
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


/**
 * On focus, make the Synth interactive.
 */
ww.mode.SynthMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  var self = this;

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


// var ctx = graph.getContext('2d');
// ctx.translate(0, 100);

// function setupCanvas() {
//     var canvas = document.getElementById('canvas');
//     gfx = canvas.getContext('2d');
//     webkitRequestAnimationFrame(logSpectrum);
// }

// var shift = 360;
// var scale = ~~(window.innerHeight * 0.5);

// function logSpectrum() {
//   // var freqByteData = new Uint8Array(analyser.frequencyBinCount);
//   // analyser.getByteFrequencyData(freqByteData);
//   // console.log(freqByteData);


//   // Viz code pulled from
//   // http://joshondesign.com/p/books/canvasdeepdive/chapter12.html#drawing
//   webkitRequestAnimationFrame(logSpectrum);
//   if (!isPlaying) {
//     return;
//   }
//   gfx.clearRect(0, 0, 800, 600);
//   gfx.fillStyle = 'white';
//   gfx.fillRect(0, 0, 800, 600);

//   var data = new Uint8Array(analyser.frequencyBinCount);
//   analyser.getByteFrequencyData(data);
//   gfx.fillStyle = 'red';
//   for (var i = 0; i < data.length; i++) {
//       gfx.fillRect(i * 4, 256 - data[i] * 2, 3, 100);
//   }

//   var detune = Math.abs(source.detune.value / 4800);
//   var freq = source.frequency.value * 0.001;

//   ctx.clearRect(0, -100, graph.width, graph.height);

//   var gainNode = audioContext.createGainNode();
//   source.connect(gainNode);
//   gainNode.connect(audioContext.destination);
//   gainNode.gain.value = 0.0001;

//   var colors = ['red', 'blue', 'green'];
//   var x = 0, y = 0, size;
//   shift--;

//   while (x + shift < graph.width + shift) {
//     size = Math.sin(freq * (x + shift) * Math.PI / 180);

//     for (var i = -1; i < colors.length - 1; i++) {
//       y = Math.sin(freq * (x + shift + (i * 120)) * Math.PI / 180) * detune;
      
//       if (y >= 0) {
//         y = scale * detune - (y - 0) * (scale * detune / 2);
//       }

//       if (y < 0) {
//         y = scale * detune + (0 - y) * (scale * detune / 2);
//       }

//       ctx.fillStyle = colors[i + 1];
//       ctx.fillRect(x, y, size, size);
//     }

//     x++;
//   }

//   if (shift < 0) {
//     shift = 360;
//   }
// }
