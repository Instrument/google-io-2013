goog.require('ww.mode.Core');
goog.provide('ww.mode.SynthMode');
/**
 * @constructor
 * @param {Element} containerElem The containing element.
 * @param {String} assetPrefix The containing element.
 */
ww.mode.SynthMode = function(containerElem, assetPrefix) {
  goog.base(this, containerElem, assetPrefix, 'synth', true, true, false);
};
goog.inherits(ww.mode.SynthMode, ww.mode.Core);

/**
 * Initialize SynthMode.
 */
ww.mode.SynthMode.prototype.init = function() {
  goog.base(this, 'init');

  this.evtStart = ww.util.getPointerEventNames('down', 'synth');
  this.evtEnd = ww.util.getPointerEventNames('up', 'synth');

  var aCtx = this.getAudioContext_();
  this.source = aCtx.createOscillator();
  this.gain = aCtx.createGainNode();
  this.gain.gain.value = 0.01;
  this.tuna_ = new Tuna(aCtx);
  this.analyser = aCtx.createAnalyser();
  this.analyser.fftSize = 512;
  this.analyser.smoothingTimeConstant = 0.85;

  this.waveforms = $('#waveforms');

  this.freq = document.getElementById('oscillator-frequency');
  this.detune = document.getElementById('oscillator-detune');

  this.isPlaying = false;

  this.buildEffects_();
  this.createSound_();

  this.count = 360 * (this.width_ % 360);

  this.letterI = $('#synth-letter-i');
  this.letterO = $('#synth-letter-o');

  this.waveType = 1;
  this.lastFreq = 80;
  this.lastDetune = 650;
  this.lastHue = 0;
  this.lastXPercent = 0.5;
  this.lastYPercent = 0.5;

  this.waveMap = ['sine', 'square', 'saw', 'triangle'];
  var self = this;
  setTimeout(function() {
    self.onResize(true);
  }, 800);
};

/**
 * Draw a single frame.
 * @param {Number} delta Ms since last draw.
 */
ww.mode.SynthMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  if (!this.isPlaying) {
    return;
  }

  this.count = this.count - (delta * 300);
  this.duration = this.duration + delta;

  // Draw frequency paths.
  var data = new Uint8Array(this.analyser.frequencyBinCount);
  this.analyser.getByteFrequencyData(data);

  var newY;
  var adjustY;
  for (var i = 0, p = this.paths.length; i < p; i++) {
    for (var j = 0, l = data.length / 2; j < l; j++) {
      newY = this.centerY - (data[j] * 0.75);
      adjustY = newY === this.centerY ? 0 : i * 5;
      this.paths[i]['segments'][j]['point']['y'] = newY + adjustY;
    }
    this.paths[i]['smooth']();
  }

  // Draw waves.
  // var detune = Math.abs(Math.abs(this.lastDetune / 2400) - 2) + 0.5;
  // var freq = this.lastFreq * 0.05; // * 0.00075;

  // var min = 6;
  // var amount = Math.floor(freq > min ? freq : min);
  // var height = 100 * detune;
  // var distance = this.width_ / amount;
  // var xAdjust = 100 * this.lastXPercent;
  // var yAdjust = 100 * this.lastYPercent;

  // for (var j2 = 0, p2 = this.wavePaths.length; j2 < p2; j2++) {
  //   if (this.wavePaths[j2]['segments'].length - 1 !== amount) {
  //     this.wavePaths[j2]['removeSegments']();
  //     for (var k = 0; k <= amount; k++) {
  //       var point = new paper['Point'](
  //                     distance * k + j2 * xAdjust, this.centerY
  //                   );
  //       this.wavePaths[j2].add(point);
  //     }
  //   }

  //   for (var i2 = 0; i2 <= amount; i2++) {
  //     var segment = this.wavePaths[j2]['segments'][i2];
  //     var sin = Math.sin(this.duration * (amount * Math.PI / 8) + i2);
  //     segment['point']['y'] = (sin * height + this.height_ / 2) +
  //                             ((j2 - 1.5) * yAdjust);
  //   }
  //   this.wavePaths[j2]['strokeColor']['hue'] = this.lastHue;
  //   this.wavePaths[j2]['smooth']();
  // }

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

  this.oOffset = this.letterO.offset();
  this.oSize = this.letterO[0]['getBoundingClientRect']()['width'];

  this.oRad = this.oSize / 2;
  this.oLeft = this.oOffset.left + this.oRad;
  this.oTop = this.oOffset.top + this.oRad;

  if (this.circle && this.tracker) {
    this.circleX = this.circle['position']['x'];
    this.circleY = this.circle['position']['y'];

    this.currentRad = this.circle['bounds']['width'] / 2;
    this.circle['position']['x'] = this.oLeft;
    this.circle['position']['y'] = this.oTop;
    this.circle['scale'](this.oRad / this.currentRad);
    this.circleClone['position']['x'] = this.oLeft;
    this.circleClone['position']['y'] = this.oTop;
    this.circleClone['scale'](this.oRad / this.currentRad);

    this.currentRad = this.tracker['bounds']['width'] / 2;
    this.tracker['position']['x'] = this.oLeft;
    this.tracker['position']['y'] = this.oTop;
    this.tracker['scale']((this.oRad * 0.08) / this.currentRad);
  }

  if (this.paths) {
    var max = Math.max(this.oRad * 2, 128);
    var x = (this.oRad * 2) / 128;
    for (var j = 0, p = this.paths.length; j < p; j++) {
      for (var i = 0, l = this.paths[j]['segments'].length; i < l; i++) {
        this.paths[j]['segments'][i]['point']['x'] =
          x * i + this.oLeft - this.oRad;
        this.paths[j]['segments'][i]['point']['y'] = this.centerY;
      }
    }
  }

  if (redraw) {
    this.redraw();
  }

  var boundingI = this.letterI[0]['getBoundingClientRect']();
  var iPos = this.letterI.position();

  var containerHeight = ~~boundingI['height'];

  this.waveforms.css({
    'top': ~~iPos['top'] + 'px',
    'left': ~~iPos['left'] + 'px',
    'height': containerHeight + 'px',
    'width': ~~boundingI['width'] + 'px'
  });

  var self = this;
  setTimeout(function() {
    var boxes = self.waveforms.find('li');
    var eachHeight = boxes.height();

    var remainingSpace = containerHeight - (eachHeight * 4);
    var margins = remainingSpace / 4.5;
    boxes.css('margin-top', ~~margins);
  }, 100);
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

  if (!self.path && !self.points) {
    self.getPaperCanvas_();
    // self.ctx = self.paperCanvas_.getContext('2d');

    // self.wavePath = new paper['Path']();
    // self.wavePath['strokeColor'] = 'red';
    // self.wavePath['strokeWidth'] = 2;

    // self.wavePaths = [];
    // self.wavePaths.push(self.wavePath);

    // for (var i = 0; i < 3; i++) {
    //   var path = self.wavePath['clone']();
    //   path['strokeColor']['alpha'] = 0.3;
    //   self.wavePaths.push(path);
    // }

    var max = Math.max(self.oRad * 2, 128);
    var size = (self.oRad * 2) / 128;

    self.circle = new paper['Path']['Circle'](
                    new paper['Point'](self.oLeft, self.oTop), self.oRad
                  );
    self.circleClone = self.circle['clone']();
    self.circleClone['fillColor'] = '#3777e3';
    self.circleClone['opacity'] = 0.9;

    self.tracker = new paper['Path']['Circle'](
                    new paper['Point'](self.oLeft, self.oTop), self.oRad * 0.08
                    );
    self.tracker['fillColor'] = '#ffffff';
    self.tracker['strokeColor'] = '#ffffff';
    self.tracker['strokeColor']['alpha'] = 0.3;
    self.tracker['strokeWidth'] = self.oRad * 0.05;
    self.tracker['opacity'] = 0.7;

    self.path = new paper['Path']();
    self.path['strokeColor'] = new paper['RgbColor'](255, 255, 255, 0.2);
    self.path['strokeWidth'] = 5;

    for (var i3 = 0; i3 <= 128; i3++) {
      var point = new paper['Point'](
                    size * i3 + self.oLeft - self.oRad, self.centerY
                  );
      self.path.add(point);
    }

    self.paths = [];
    self.paths.push(self.path);

    for (var i2 = 0; i2 < 3; i2++) {
      var path2 = self.path['clone']();
      self.paths.push(path2);
    }

    self.oscilloGroup = new paper['Group'](
                          self.circle,
                          self.paths[0],
                          self.paths[1],
                          self.paths[2],
                          self.paths[3],
                          self.tracker
                        );
    self.oscilloGroup['clipped'] = true;
    self.duration = 0;
  }

  self.isPlaying = false;
  self.connectPower_(); // connect

  self.letterI.bind(this.evtEnd, function() {
    self.changeWaveType();
  });
  self.letterO.bind(this.evtStart, function() {
    self.padTouchOn = true;
    self.lastFreq = self.calculateFrequency(event.pageX, event.pageY);
  });
  self.letterO.bind(this.evtEnd, function() {
    self.changeFrequency(event);
    self.moveTracker(event);
    self.padTouchOn = false;
  });

  var evt = ww.util.getPointerEventNames('move', this.name_);
  self.letterO.bind(evt, function() {
    if (self.padTouchOn) {
      self.changeFrequency(event);
      self.moveTracker(event);
    }
  });

  self.oOffset = self.letterO.offset();

  self.oSize = self.letterO[0]['getBoundingClientRect']()['width'];
};

/**
 * On unfocus, deactivate the Synth.
 */
ww.mode.SynthMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  this.letterI.unbind(this.evtEnd);
  this.letterO.unbind(this.evtStart);
  this.letterO.unbind(this.evtEnd);

  var evt = ww.util.getPointerEventNames('move', this.name_);
  this.letterO.unbind(evt);

  this.isPlaying = true;
  this.connectPower_(); // disconnect
};

/**
 * @private
 */
ww.mode.SynthMode.prototype.buildEffects_ = function() {
  this.effects = {};
  this.effects['delay'] = new this.tuna_.Delay();
};

/**
 * @private
 */
ww.mode.SynthMode.prototype.createSound_ = function() {
  this.source.type = this.waveType;
  this.source.frequency.value = this.lastFreq;
  this.source.detune.value = this.lastDetune;
};

/**
 * @private
 */
ww.mode.SynthMode.prototype.connectPower_ = function() {
  if (!this.isPlaying) {
    this.playSound_();
    this.isPlaying = true;
  } else {
    this.pauseSound_();
    this.isPlaying = false;
  }
};

/**
 * @private
 */
ww.mode.SynthMode.prototype.playSound_ = function() {
  var aCtx = this.getAudioContext_();
  this.source.connect(this.effects['delay']['input']);
  this.effects['delay'].connect(this.analyser);
  this.analyser.connect(this.gain);
  this.gain.connect(aCtx.destination);
  this.source.noteOn(0);
};

/**
 * @private
 */
ww.mode.SynthMode.prototype.pauseSound_ = function() {
  this.source.disconnect();
};

/**
 * Toggle wave type between square, saw, triangle and sine
 * and set on class for icon.
 */
ww.mode.SynthMode.prototype.changeWaveType = function() {
  this.waveType++;
  this.waveType = this.waveType > 3 ? 0 : this.waveType;
  this.createSound_();

  $('.on', this.waveforms).removeClass('on');
  $('.' + this.waveMap[this.waveType], this.waveforms).addClass('on');
};

/**
 * Get new frequency and recreate sound.
 * @param {Object} event Page mouse event.
 */
ww.mode.SynthMode.prototype.changeFrequency = function(event) {
  this.calculateFrequency(event.pageX, event.pageY);
  this.createSound_();
};

/**
 * Position tracker based on pointer event.
 * @param {Object} event Page mouse event.
 */
ww.mode.SynthMode.prototype.moveTracker = function(event) {
  this.tracker['position']['x'] = event.pageX;
  this.tracker['position']['y'] = event.pageY;
};

/**
 * Parse mouse position to calculate new frequency.
 * @param {Integer} x page x position.
 * @param {Integer} y page y position.
 */
ww.mode.SynthMode.prototype.calculateFrequency = function(x, y) {

  var xDiff = x - this.oOffset.left;
  var yDiff = y - this.oOffset.top;
  var xPercent = xDiff / this.oSize;
  var yPercent = yDiff / this.oSize;

  this.lastFreq = 1000 - (1000 * yPercent);
  this.lastDetune = -4800 + (9600 * xPercent);
  this.lastHue = 60 - (60 * yPercent);
  this.lastYPercent = yPercent;
  this.lastXPercent = xPercent;
};
