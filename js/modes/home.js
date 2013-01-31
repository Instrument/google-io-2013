goog.require('ww.mode.Core');
goog.require('ww.util');
goog.require('ww.PatternMatcher');
goog.provide('ww.mode.HomeMode');

/**
 * @constructor
 */
ww.mode.HomeMode = function() {
  goog.base(this, 'home', true, true);

  this.patternMatcher_ = new ww.PatternMatcher(ww.mode.modes);

  this.wentIdleTime_ = 0;
  this.isIdle_ = true;
  this.maxIdleTime_ = 15000; // 15 seconds

  var context = this.getAudioContext_();
  this.tuna_ = new Tuna(context);
  
  /**
   * Create a delay audio filter. Value ranges are as follows.
   * feedback: 0 to 1+
   * delayTime: how many milliseconds should the wet signal be delayed?
   * wetLevel: 0 to 1+
   * dryLevel: 0 to 1+
   * cutoff: cutoff frequency of the built in highpass-filter. 20 to 22050
   * bypass: the value 1 starts the effect as bypassed, 0 or 1
   */
  this.delay_ = new this.tuna_.Delay({
    feedback: 0,
    delayTime: 0,
    wetLevel: 0,
    dryLevel: 0,
    cutoff: 20,
    bypass: 0
  });

  /**
   * Create a chorus audio filter. Value ranges are as follows.
   * rate: 0.01 to 8+
   * feedback: 0 to 1+
   * delay: 0 to 1
   * dryLevel: 0 to 1+
   * bypass: the value 1 starts the effect as bypassed, 0 or 1
   */
  this.chorus_ = new this.tuna_.Chorus({
    rate: 0.01,
    feedback: 0.2,
    delay: 0,
    bypass: 0
  });
};
goog.inherits(ww.mode.HomeMode, ww.mode.Core);

/**
 * Play a sound by url after being processed by Tuna.
 * @private.
 * @param {String} filename Audio file name.
 * @param {Object} filter Audio filter name.
 */
ww.mode.HomeMode.prototype.playProcessedAudio_ = function(filename, filter) {
  if (!this.wantsAudio_) { return; }

  var url = '../sounds/' + this.name_ + '/' + filename;

  if (ww.testMode) {
    url = '../' + url;
  }

  this.log('Requested sound "' + filename + '" from "' + url + '"');

  var audioContext = this.audioContext_;
  var source;
  var gain;

  var self = this;

  this.getSoundBufferFromURL_(url, function(buffer) {
    source = audioContext.createBufferSource();
    gain = audioContext.createGainNode();
    gain.gain.value = 0.1;
    source.buffer = buffer;
    source.connect(gain);
    gain.connect(filter.input);
    filter.connect(audioContext.destination);
    source.noteOn(0);
  });
};

/**
 * Reset the last time the user was idle.
 * @private
 */
ww.mode.HomeMode.prototype.resetIdle_ = function() {
  if (this.isIdle_) {
    this.leaveIdle_();
  }
  this.wentIdleTime_ = this.timeElapsed_;
};

/**
 * Enter idle mode.
 * @private
 */
ww.mode.HomeMode.prototype.enterIdle_ = function() {
  this.isIdle_ = true;
  this.$date_.fadeIn(300);
  this.$pattern_.fadeOut(300);
};

/**
 * Leave idle mode.
 * @private
 */
ww.mode.HomeMode.prototype.leaveIdle_ = function() {
  this.isIdle_ = false;
  this.$date_.fadeOut(300);
  this.$pattern_.fadeIn(300);
};

ww.mode.HomeMode.prototype.addPatternCharacter = function(character) {
  if (this.$pattern_.hasClass('success')) {
    this.$pattern_.removeClass('success');
    this.patternMatcher_.reset();
  }

  if (this.$pattern_.hasClass('failure')) {
    this.$pattern_.removeClass('failure');
    this.patternMatcher_.reset();
  }

  var self = this;
  this.patternMatcher_.addCharacter(character, function(currentPattern, matched) {
    self.log('current pattern: ' + currentPattern);

    var patternHTML = currentPattern.replace(/1/g, '<span class="i"></span>').replace(/0/g, '<span class="o"></span>');
    self.$pattern_.html(patternHTML);
    self.$pattern_.css('marginLeft', -(self.$pattern_.width() / 2));

    if (matched) {
      self.log('matched', matched);

      if (matched.isPartial) {
        // Highlight partial match in UI?
      } else {
        self.$pattern_.addClass('success');
        self.goToMode_(matched.key);
      }
    } else {
      self.$pattern_.removeClass('success');
      self.$pattern_.addClass('failure');
    }
  });

  this.resetIdle_();
};

/**
 * Method called when activating the I.
 */
ww.mode.HomeMode.prototype.activateI = function() {
  goog.base(this, 'activateI');

  this.pushPoints_(this.paperI_, this.lastClick_, 10);

  this.playProcessedAudio_('i.mp3', this.chorus_);

  this.addPatternCharacter('1');
};

/**
 * Method called when activating the O.
 */
ww.mode.HomeMode.prototype.activateO = function() {
  goog.base(this, 'activateO');

  this.pushPoints_(this.paperO_, this.lastClick_, 10);

  this.playProcessedAudio_('o.mp3', this.delay_);

  this.addPatternCharacter('0');
};


/**
 * Tell the app to transition to the specified mode.
 * @private
 * @param {String} key The mode name.
 */
ww.mode.HomeMode.prototype.goToMode_ = function(key) {
  this.trackEvent_('matched-pattern', key);
  this.sendMessage_('goToMode', key);
};

/**
 * Function to create and draw I.
 * @private
 */
ww.mode.HomeMode.prototype.drawI_ = function() {
  if (!this.paperI_) {
    // Create a new paper.js path based on the previous variables.
    var iTopLeft = new paper['Point'](this.iX_, this.iY_);
    var iSize = new paper['Size'](this.iWidth_, this.iHeight_);
    var letterI = new paper['Rectangle'](iTopLeft, iSize);
    this.paperI_ = new paper['Path']['Rectangle'](letterI);
    this.paperI_['fillColor'] = '#11a860';

    this.paperI_['closed'] = true;

    this.paperI_['vectors'] = [];

    for (var i = 0; i < this.paperI_['segments'].length; i++) {
      var point = this.paperI_['segments'][i]['point']['clone']();
      point = point['subtract'](this.iCenter_);

      point['velocity'] = 0;
      point['acceleration'] = Math.random() * 5 + 10;
      point['bounce'] = Math.random() * .1 + 1.05;

      this.paperI_['vectors'].push(point);
    }
  } else {
    // Change the position based on new screen size values.
    this.paperI_['position'] = {x: this.iX_ + this.iWidth_ / 2,
      y: this.iY_ + this.iHeight_ / 2};

    // Change the scale based on new screen size values.
    this.paperI_['scale'](this.iWidth_ / this.paperI_['bounds']['width']);
  }
};

/**
 * Function to create and draw O.
 * @private
 */
ww.mode.HomeMode.prototype.drawO_ = function() {
  if (!this.paperO_) {
    // Create a new paper.js path for O based off the previous variables.
    this.oCenter_ = new paper['Point'](this.oX_, this.oY_);

    this.paperO_ = new paper['Path']['RegularPolygon'](this.oCenter_, 12,
      this.oRad_);

    this.paperO_['fillColor'] = '#3777e2';

    this.paperO_['vectors'] = [];

    this.oStatic_ = [];

    for (var i = 0; i < this.paperO_['segments'].length; i++) {
      var point = this.paperO_['segments'][i]['point']['clone']();
      point = point['subtract'](this.oCenter_);

      point['velocity'] = 0;
      point['acceleration'] = Math.random() * 5 + 10;
      point['bounce'] = Math.random() * .1 + 1.05;

      this.paperO_['vectors'].push(point);
    }
  } else {
    // Change the position based on new screen size values.
    this.paperO_['position'] = {x: this.oX_, y: this.oY_};

    // Change the scale based on new screen size values.
    this.paperO_['scale'](this.oRad_ * 2 / this.paperO_['bounds']['height']);
  }
};

/**
 * Function to create and draw Slash.
 * @private
 */
ww.mode.HomeMode.prototype.drawSlash_ = function() {
  // If no slash exists and the I and the O have been created.
  if (!this.paperSlash_) {
    // Determine the slash's start and end coordinates based on I and O sizes.
    this.slashStart_ = new paper['Point'](this.screenCenterX_ + this.oRad_ / 8,
      this.screenCenterY_ - (this.iHeight_ / 2) -
      ((this.iHeight_ * 1.5) * 0.17475728));

    this.slashEnd_ = new paper['Point'](this.iX_ + this.iWidth_,
      this.screenCenterY_ + (this.iHeight_ / 2) +
      ((this.iHeight_ * 1.5) * 0.17475728));

    // Create a new paper.js path for the slash based on screen dimensions.
    this.paperSlash_ = new paper['Path']();
    this.paperSlash_['strokeWidth'] = this.width_ * 0.01388889;
    this.paperSlash_['strokeColor'] = '#ebebeb';

    this.paperSlash_['add'](this.slashStart_, this.slashEnd_);
  } else {
    this.slashStart_['x'] = this.screenCenterX_ + this.oRad_ / 8;
    this.slashStart_['y'] = this.screenCenterY_ - (this.iHeight_ / 2) -
      ((this.iHeight_ * 1.5) * 0.17475728);

    this.slashEnd_['x'] = this.iX_ + this.iWidth_;
    this.slashEnd_['y'] = this.screenCenterY_ + (this.iHeight_ / 2) +
      ((this.iHeight_ * 1.5) * 0.17475728);

    this.paperSlash_['segments'][0]['point'] = this.slashStart_;
    this.paperSlash_['segments'][1]['point'] = this.slashEnd_;

    this.paperSlash_['strokeWidth'] = this.width_ * 0.01388889;
  }
};

/**
 * Function to initialize the current mode.
 * Requests a paper canvas and creates paths.
 * Sets initial variables.
 */
ww.mode.HomeMode.prototype.init = function() {
  goog.base(this, 'init');

  this.$date_ = $("#date");
  this.$pattern_ = $("#pattern");

  this.patternMatcher_.reset();

  // Prep paperjs
  this.getPaperCanvas_();

  // Variable to modify delta's returned value.
  this.deltaModifier_ = 0;

  // Temporarily float variable to use for randomizing animation effects.
  this.tempFloat = [];

  // Gets the centerpoint of the viewport.
  this.screenCenterX_ = this.width_ / 2;
  this.screenCenterY_ = this.height_ / 2;

  // Variable to store the screen coordinates of the last click/tap/touch.
  this.lastClick_ =
    new paper['Point'](this.oX_, this.oY_);
};

/**
 * Event is called after a mode focused.
 */
ww.mode.HomeMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  var self = this;

  var evt2 = Modernizr.touch ? 'touchend' : 'mouseup';
  $("#menu").bind(evt2 + '.core', function() {
    $(document.body).addClass('nav-visible');
  });

  $("#modal").bind(evt2 + '.core', function() {
    $(document.body).removeClass('nav-visible');
  });

  $("#dropdown").bind(evt2 + '.core', function(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  });

  var tool = new paper['Tool']();

  var evt = Modernizr.touch ? 'touchmove' : 'mousemove';
  tool['onMouseDown'] = function(event) {
    self.lastClick_ = event['point'];
    if (self.paperO_['hitTest'](event['point'])) {
      if (self.hasFocus) {
        self.activateO();
      }
    }

    if (self.paperI_['hitTest'](event['point'])) {
      if (self.hasFocus) {
        self.activateI();
      }
    }
  };
};

ww.mode.HomeMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  var evt2 = Modernizr.touch ? 'touchend' : 'mouseup';
  $("#menu").unbind(evt2 + '.core');
  $("#modal").unbind(evt2 + '.core');
  $("#dropdown").unbind(evt2 + '.core');
};

/**
 * Handles a browser window resize.
 * @param {Boolean} redraw Whether resize redraws.
 */
ww.mode.HomeMode.prototype.onResize = function(redraw) {
  goog.base(this, 'onResize', false);

  // Recalculate the center of the screen based on the new window size.
  this.screenCenterX_ = this.width_ / 2;
  this.screenCenterY_ = this.height_ / 2;

  // Set I's initial dimensions.
  this.iWidth_ = this.width_ * 0.175;
  this.iHeight_ = this.iWidth_ * 2.12698413;

  // Set coordinates for I's upper left corner.
  this.iX_ = this.screenCenterX_ - this.iWidth_ * 1.5;
  this.iY_ = this.screenCenterY_ - this.iHeight_ / 2;

  this.iCenter_ = new paper['Point'](this.iX_ + this.iWidth_ / 2,
    this.iY_ + this.iHeight_ / 2);

  // Set O's radius.
  this.oRad_ = this.width_ * 0.1944444444;

  // Set O's coordinates.
  this.oX_ = this.screenCenterX_ + this.oRad_;
  this.oY_ = this.screenCenterY_;

  /**
   * Create the slash.
   */
  this.drawSlash_();

  /**
   * Create the letter I.
   */
  this.drawI_();

  /**
   * Create the letter O.
   */
  this.drawO_();

  if (redraw) {
    this.redraw();
  }
};

/**
 * Assign a paper object's coordinates to a static array, or vice versa.
 * @param {Array} paperArray The paper.js array to reference.
 * @param {Array} xArray The array of static X coordinates to reference.
 * @param {Array} yArray The array of static Y coordinates to reference.
 * @param {Boolean} copy Determines if paperArray is copied from or written to.
 */
ww.mode.HomeMode.prototype.copyXY_ = function(paper, xArray, yArray, copy) {
  for (var i = 0; i < paper['segments'].length; i++) {
    if (copy) {
      xArray[i] = paper['segments'][i]['point']['x'];

      yArray[i] = paper['segments'][i]['point']['y'];
    } else {
      paper['segments'][i]['point']['x'] = xArray[i];

      paper['segments'][i]['point']['y'] = yArray[i];
    }
  }
};

ww.mode.HomeMode.prototype.pushPoints_ = function(path, clickPoint, speed) {
  for (var i = 0; i < path['vectors'].length; i++) {
    var point = path['vectors'][i];
    var vector;
    var distance;

    if (path === this.paperO_) {
      vector = point['add'](this.oCenter_);
      vector = vector['subtract'](clickPoint);
      distance = Math.max(0, this.oRad_ - vector['length']);
    } else {
      vector = point['add'](this.iCenter_);
      vector = vector['subtract'](clickPoint);
      distance = Math.max(0, this.iWidth_ - vector['length']);
    }

    point['length'] += distance;
    point['velocity'] += speed;
  }
}

ww.mode.HomeMode.prototype.updateVectors_ = function(path) {
  for (var i = 0; i < path['segments'].length; i++) {
    var point = path['vectors'][i];

    if (path === this.paperO_) {
      point['velocity'] = ((this.oRad_ - point['length']) /
        point['acceleration'] + point['velocity']) / point['bounce'];
    } else {
      point['velocity'] = ((this.iWidth_ - point['length']) /
        point['acceleration'] + point['velocity']) / point['bounce'];
    }

    point['length'] = Math.max(0, point['length'] + point['velocity']);
  }
}

ww.mode.HomeMode.prototype.updatePoints_ = function(path) {
  for (var i = 0; i < path['segments'].length; i++) {
    var point = path['vectors'][i];

    var newPoint = point['clone']();

    if (path === this.paperO_) {
      this.paperO_['segments'][i]['point'] = newPoint['add'](this.oCenter_);
      this.paperO_['smooth']();
    } else {
      this.paperI_['segments'][i]['point'] = newPoint['add'](this.iCenter_);
    }
  }
}

/**
 * Runs code on each requested frame.
 * @param {Integer} delta The timestep variable for animation accuracy.
 */
ww.mode.HomeMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  var i;

  if (!this.isIdle_) {
    var hasBeenIdle = this.timeElapsed_ - this.wentIdleTime_;

    if (hasBeenIdle > this.maxIdleTime_) {
      this.enterIdle_();
    }
  }

  this.updateVectors_(this.paperI_);
  this.updatePoints_(this.paperI_);

  this.updateVectors_(this.paperO_);
  this.updatePoints_(this.paperO_);
};
