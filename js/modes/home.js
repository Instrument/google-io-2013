goog.require('ww.mode.Core');
goog.require('ww.util');
goog.provide('ww.mode.HomeMode');

/**
 * @constructor
 */
ww.mode.HomeMode = function() {
  goog.base(this, 'home', true, true);

  this.setupPatternMatchers_();

  this.currentPattern_ = '';
  this.maxPatternLength_ = 15;

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

  var self = this;

  this.getSoundBufferFromURL_(url, function(buffer) {
    var source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(filter.input);
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
  this.$date.fadeIn(300);
  this.$pattern.fadeOut(300);
};

/**
 * Leave idle mode.
 * @private
 */
ww.mode.HomeMode.prototype.leaveIdle_ = function() {
  this.isIdle_ = false;
  this.$date.fadeOut(300);
  this.$pattern.fadeIn(300);
};

/**
 * Method called when activating the I.
 */
ww.mode.HomeMode.prototype.activateI = function() {
  goog.base(this, 'activateI');

  this.iClicked_ = true;
  if (this.iMultiplier_ < 10) {
    this.iMultiplier_ += 2;
  }

  this.playProcessedAudio_('boing.wav', this.chorus_);

  this.addCharacter_('1');
  this.resetIdle_();
};

/**
 * Method called when activating the O.
 */
ww.mode.HomeMode.prototype.activateO = function() {
  goog.base(this, 'activateO');

  this.oClicked_ = true;
  if (this.oMultiplier_ < 10) {
    this.oMultiplier_ += 2;
  }

  this.playProcessedAudio_('boing.wav', this.delay_);

  this.addCharacter_('0');
  this.resetIdle_();
};

/**
 * Build matchers from patterns.
 * @private
 */
ww.mode.HomeMode.prototype.setupPatternMatchers_ = function() {
  var patterns = {}, key, mode;

  // Privately decode patterns into binary.
  for (key in ww.mode.modes) {
    if (ww.mode.modes.hasOwnProperty(key) && ww.mode.modes[key].pattern) {
      mode = ww.mode.modes[key];
      patterns[key] = {
        klass: mode.klass,
        binaryPattern: ww.util.pad(mode.pattern.toString(2), mode.len)
      };
    }
  }

  // Build per-character matchers
  this.matchers_ = [];

  for (key in patterns) {
    if (patterns.hasOwnProperty(key)) {
      mode = patterns[key];
      this.log('Building matchers for: ' + mode.binaryPattern);
      for (var i = 0; i < mode.binaryPattern.length; i++) {
        this.matchers_.push({
          key: key,
          matcher: new RegExp("^" + mode.binaryPattern.slice(0, i + 1)),
          isPartial: ((i + 1) != mode.binaryPattern.length)
        });
      }
    }
  }
};

/**
 * Add a character to the pattern we're tracking.
 * @private
 * @param {String} str The new character.
 */
ww.mode.HomeMode.prototype.addCharacter_ = function(str) {
  if (this.$pattern.hasClass('success')) {
    this.$pattern.removeClass('success');
    this.resetMatcher_();
  }

  if (this.$pattern.hasClass('failure')) {
    this.$pattern.removeClass('failure');
    this.resetMatcher_();
  }

  this.currentPattern_ += str;

  if (this.currentPattern_.length > this.maxPatternLength_) {
    this.currentPattern_ = this.currentPattern_.slice(-this.maxPatternLength_,
      this.currentPattern_.length);
  }

  this.log('current pattern: ' + this.currentPattern_);

  var patternHTML = this.currentPattern_.replace(/1/g, '<span class="i"></span>').replace(/0/g, '<span class="o"></span>');
  this.$pattern.html(patternHTML);
  this.$pattern.css('marginLeft', -(this.$pattern.width() / 2));

  var matched = this.runMatchers_();
  if (matched) {
    this.log('matched', matched);

    if (matched.isPartial) {
      // Highlight partial match in UI?
    } else {
      this.$pattern.addClass('success');
      this.goToMode_(matched.key);
    }
  } else {
    this.$pattern.removeClass('success');
    this.$pattern.addClass('failure');
  }
};

/**
 * Reset the pattern matcher.
 * @private
 */
ww.mode.HomeMode.prototype.resetMatcher_ = function() {
  this.currentPattern_ = '';
};

/**
 * Run the matchers and return the best match.
 * @private
 * @return {Object} The best match.
 */
ww.mode.HomeMode.prototype.runMatchers_ = function() {
  var matches = [];

  for (var i = 0; i < this.matchers_.length; i++) {
    var matcher = this.matchers_[i];
    var len = matcher.matcher.toString().length - 3;
    if ((len === this.currentPattern_.length) && matcher.matcher.test(this.currentPattern_)) {
      matches.push({
        matcher: matcher,
        len: len,
        isPartial: matcher.isPartial
      });

      if (!matcher.isPartial) {
        return matcher;
      }
    }
  }

  var found;
  // Find longest
  var longestLen = 0;
  for (var j = 0; j < matches.length; j++) {
    if (matches[j].len > longestLen) {
      found = matches[j].matcher;
      longestLen = matches[j].len;
    }
  }

  return found;
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
  // Set I's initial dimensions.
  this.iWidth_ = this.width_ * 0.175;
  this.iHeight_ = this.iWidth_ * 2.12698413;

  // Set coordinates for I's upper left corner.
  this.iX_ = this.screenCenterX_ - this.iWidth_ * 1.5;
  this.iY_ = this.screenCenterY_ - this.iHeight_ / 2;

  if (!this.paperI_) {
    // Create a new paper.js path based on the previous variables.
    var iTopLeft = new paper['Point'](this.iX_, this.iY_);
    var iSize = new paper['Size'](this.iWidth_, this.iHeight_);
    this.letterI = new paper['Rectangle'](iTopLeft, iSize);
    this.paperI_ = new paper['Path']['Rectangle'](this.letterI);
    this.paperI_['fillColor'] = '#11a860';

    // Create arrays to store the original coordinates for I's path points.
    this.iPointX_ = [];
    this.iPointY_ = [];

    // Store the coordinates for I's path points.
    this.copyXY_(this.paperI_, this.iPointX_, this.iPointY_, true);
  } else {
    // Change the position based on new screen size values.
    this.paperI_['position'] = {x: this.iX_ + this.iWidth_ / 2,
      y: this.iY_ + this.iHeight_ / 2};

    // Change the scale based on new screen size values.
    this.paperI_['scale'](this.iWidth_ / this.paperI_['bounds']['width']);

    // Store the coordinates for the newly moved and scaled control points.
    this.copyXY_(this.paperI_, this.iPointX_, this.iPointY_, true);
  }
};

/**
 * Function to create and draw O.
 * @private
 */
ww.mode.HomeMode.prototype.drawO_ = function() {
  var i;

  // Set O's radius.
  this.oRad_ = this.width_ * 0.1944444444;

  // Set O's coordinates.
  this.oX_ = this.screenCenterX_ + this.oRad_;
  this.oY_ = this.screenCenterY_;

  if (!this.paperO_) {
    // Create a new paper.js path for O based off the previous variables.
    var oCenter = new paper['Point'](this.oX_, this.oY_);
    this.paperO_ = new paper['Path']['Circle'](oCenter, this.oRad_);
    this.paperO_['fillColor'] = '#3777e2';

    // Create arrays to store the coordinates for O's path points.
    this.oPointX_ = [];
    this.oPointY_ = [];

    // Store the coordinates for O's path points.
    this.copyXY_(this.paperO_, this.oPointX_, this.oPointY_, true);
  } else {
    this.paperO_['position'] = {x: this.oX_, y: this.oY_};
    this.paperO_['scale'](this.oRad_ * 2 / this.paperO_['bounds']['height']);

    // Store the coordinates for the newly moved and scaled control points.
    this.copyXY_(this.paperO_, this.oPointX_, this.oPointY_, true);
  }
};

/**
 * Function to create and draw Slash.
 * @private
 */
ww.mode.HomeMode.prototype.drawSlash_ = function() {
  // If no slash exists and the I and the O have been created.
  if (!this.paperSlash_ && this.paperI_ && this.paperO_) {
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

  this.resetMatcher_();

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
  this.lastClick =
    new paper['Point'](this.screenCenterX_, this.screenCenterY_);

  /**
   * Set the letter I's modify variables.
   */
  // Boolean that sets to true if I is being activated.
  this.iClicked_ = false;

  // Boolean that sets to false if I has been activated but delta is too high.
  this.iIncrement_ = true;

  // Float that increments by delta when I is activated to affect animation.
  this.iModifier_ = 0;

  // Float that increments on each activation of I to affect animation further.
  this.iMultiplier_ = 1;

  /**
   * Set the letter O's modify variables.
   */
  // Boolean that sets to true if O is being activated.
  this.oClicked_ = false;

  // Boolean that sets to false if O has been activated but delta is too high.
  this.oIncrement_ = true;

  // Float that increments by delta when O is activated to affect animation.
  this.oModifier_ = 0;

  // Float that increments on each activation of O to affect animation further.
  this.oMultiplier_ = 1;
};

/**
 * Event is called after a mode focused.
 */
ww.mode.HomeMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  this.$date = $("#date");
  this.$pattern = $("#pattern");

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
    self.lastClick = event['point'];
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

  /**
   * Create the letter I.
   */
  this.drawI_();

  /**
   * Create the letter O.
   */
  this.drawO_();

  /**
   * Create the slash. drawI() and drawO() must be called before drawSlash() to
   * successfully create the slash.
   */
  this.drawSlash_();

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

/**
 * Assign a paper object's coordinates to a static array, or vice versa.
 * @param {Number} modifier The modifier variable to adjust.
 * @param {Boolean} incrementer The incrementer variable to switch on and off.
 * @param {Number} multiplier The multiplier variable to adjust.
 * @param {Boolean} clicker The clicker variable to switch on and off.
 * @param {Boolean} isI The boolean to determine if I or O should be modified.
 */
ww.mode.HomeMode.prototype.adjustModifiers_ = function(modifier,
  incrementer, multiplier, clicker, isI) {

  var delta1 = this.deltaModifier_ * 100;
  var delta2 = this.deltaModifier_ * 1000;
  var delta3 = this.deltaModifier_ * 10000;
    
    if (modifier < delta3 &&
      incrementer === true) {
        modifier += delta2;
    } else if (multiplier > 1) {
      if (modifier < delta3) {
        modifier += delta1;
      }
      if (multiplier > 1) {
        multiplier -= 0.1;
      } else {
        multiplier = 1;
      }
    } else {
      incrementer = false;
      modifier -= delta2;
      if (multiplier > 1) {
        multiplier -= 0.1;
      } else {
        multiplier = 1;
      }
    }

    if (modifier < delta1) {
      clicker = false;
      incrementer = true;
      multiplier = 1;
    }

  if (isI === true) {
    this.iModifier_ = modifier;
    this.iIncrement_ = incrementer;
    this.iMultiplier_ = multiplier;
    this.iClicked_ = clicker;
  } else {
    this.oModifier_ = modifier;
    this.oIncrement_ = incrementer;
    this.oMultiplier_ = multiplier;
    this.oClicked_ = clicker;
  }
}

/**
 * Assign a paper object's coordinates to a static array, or vice versa.
 * @param {Number} source The base coordinate to reference.
 * @param {Boolean} cos Equation uses cosine if true, sine if false.
 * @param {Number} mod1 The first modifier used in the equation.
 * @param {Number} mod2 The second modifier used in the equation.
 * @param {Number} mod3 The third modifier used in the equation.
 * @param {Number} mod4 The fourth modifier used in the equation.
 * @param {Float} random Optional float to modify the equation.
 */
ww.mode.HomeMode.prototype.modCoords_ = function(source,
  cos, mod1, mod2, mod3, mod4, random) {

    var result;

    if (!random) {
      random = 1;
    }
    
    if (cos) {
      result = source + Math.cos(this.framesRendered_ / 10 + (mod1 - mod2)) *
        mod3 * mod4 * random;
    } else {
      result = source + Math.sin(this.framesRendered_ / 10 + (mod1 - mod2)) *
        mod3 * mod4 * random;
    }

    return result;
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

  /*
   * Delta is initially a very small float. Need to modify it for it to have a
   * stronger effect.
   */
  this.deltaModifier_ = (delta / 100);

  /*
   * Run the following code if the letter I is activated.
   * It uses delta along with other variables to modify the intensity of the
   * animation.
   */
  if (this.iClicked_ === true) {

    this.adjustModifiers_(this.iModifier_, this.iIncrement_, this.iMultiplier_,
      this.iClicked_, true);

    /*
     * Loop through each path segment on the letter I and move each point's
     * handles based on time as being evaluated by Sine and Cosine.
     */
    this.paperI_['segments'][0]['point']['x'] =
      this.modCoords_(this.iPointX_[0], true,
      0, 0, this.iModifier_,
      this.iMultiplier_);

    this.paperI_['segments'][0]['point']['y'] =
      this.modCoords_(this.iPointY_[0], false,
      0, 0, this.iModifier_,
      this.iMultiplier_);

    this.paperI_['segments'][1]['point']['x'] =
      this.modCoords_(this.iPointX_[1], false,
      0, 0, this.iModifier_,
      this.iMultiplier_);

    this.paperI_['segments'][1]['point']['y'] =
      this.modCoords_(this.iPointY_[1], true,
      0, 0, this.iModifier_,
      this.iMultiplier_);

    this.paperI_['segments'][2]['point']['x'] =
      this.modCoords_(this.iPointX_[2], true,
      0, 0, this.iModifier_,
      this.iMultiplier_);

    this.paperI_['segments'][2]['point']['y'] =
      this.modCoords_(this.iPointY_[2], false,
      0, 0, this.iModifier_,
      this.iMultiplier_);

    this.paperI_['segments'][3]['point']['x'] =
      this.modCoords_(this.iPointX_[3], false,
      0, 0, this.iModifier_,
      this.iMultiplier_);

    this.paperI_['segments'][3]['point']['y'] =
      this.modCoords_(this.iPointY_[3], true,
      0, 0, this.iModifier_,
      this.iMultiplier_);
  } else {
    /*
     * If I hasn't been activated recently enough, restore the original handle
     * coordinates.
     */
    this.copyXY_(this.paperI_, this.iPointX_, this.iPointY_, false);
  }

  /*
   * Run the following code if the letter O is activated.
   * It uses delta along with other variables to modify the intensity of the
   * animation.
   */
  if (this.oClicked_ === true) {

    this.adjustModifiers_(this.oModifier_, this.oIncrement_, this.oMultiplier_,
      this.oClicked_, false);

    // TODO: externs Tuna.Delay.prototype.feedback
    this.delay_['feedback'] = this.oMultiplier_ / 10;

    /*
     * Loop through each path segment on the letter O and move each point's
     * handles based on time as being evaluated by Sine and Cosine.
     */
    this.paperO_['segments'][0]['point']['x'] =
      this.modCoords_(this.oPointX_[0], true,
      0, 0, this.oModifier_,
      this.oMultiplier_);

    this.paperO_['segments'][0]['point']['y'] =
      this.modCoords_(this.oPointY_[0], false,
      0, 0, this.oModifier_,
      this.oMultiplier_);

    this.paperO_['segments'][1]['point']['x'] =
      this.modCoords_(this.oPointX_[1], false,
      0, 0, this.oModifier_,
      this.oMultiplier_);

    this.paperO_['segments'][1]['point']['y'] =
      this.modCoords_(this.oPointY_[1], true,
      0, 0, this.oModifier_,
      this.oMultiplier_);

    this.paperO_['segments'][2]['point']['x'] =
      this.modCoords_(this.oPointX_[2], true,
      0, 0, this.oModifier_,
      this.oMultiplier_);

    this.paperO_['segments'][2]['point']['y'] =
      this.modCoords_(this.oPointY_[2], false,
      0, 0, this.oModifier_,
      this.oMultiplier_);

    this.paperO_['segments'][3]['point']['x'] =
      this.modCoords_(this.oPointX_[3], false,
      0, 0, this.oModifier_,
      this.oMultiplier_);

    this.paperO_['segments'][3]['point']['y'] =
      this.modCoords_(this.oPointY_[3], true,
      0, 0, this.oModifier_,
      this.oMultiplier_);
  } else {
    /*
     * If O hasn't been activated recently enough, restore the original handle
     * coordinates.
     */
    this.copyXY_(this.paperO_, this.oPointX_, this.oPointY_, false);
  }
};
