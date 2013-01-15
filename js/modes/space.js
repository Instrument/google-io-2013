goog.require('ww.mode.Core');
goog.require('ww.util');
goog.provide('ww.mode.SpaceMode');

/**
 * @constructor
 */
ww.mode.SpaceMode = function() {
  goog.base(this, 'space', true, true, true);

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
  this.delay_ = new this.tuna_['Delay']({
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
  this.chorus_ = new this.tuna_['Chorus']({
    rate: 0.01,
    feedback: 0.2,
    delay: 0,
    bypass: 0
  });
};
goog.inherits(ww.mode.SpaceMode, ww.mode.Core);

/**
 * Play a sound by url after being processed by Tuna.
 * @private.
 * @param {String} filename Audio file name.
 * @param {Object} filter Audio filter name.
 */
ww.mode.SpaceMode.prototype.playProcessedAudio_ = function(filename, filter) {
  if (!this.wantsAudio_) { return; }

  var url = '../sounds/' + this.name_ + '/' + filename;

  if (ww.testMode) {
    url = '../' + url;
  }

  this.log('Requested sound "' + filename + '" from "' + url + '"');

  var audioContext = this.audioContext_;

  var self = this;

  this.getSoundBufferFromURL_(url, function(buffer) {
    var source = audioContext['createBufferSource']();
    source['buffer'] = buffer;
    source['connect'](filter['input']);
    filter['connect'](audioContext['destination']);
    source['noteOn'](0);
  });
};

/**
 * Method called when activating the I.
 */
ww.mode.SpaceMode.prototype.activateI = function() {
  this.iClicked_ = true;
  if (this.iMultiplier_ < 10) {
    this.iMultiplier_ += 2;
  }

  // this.playProcessedAudio_('boing.wav', this.chorus_);
};

/**
 * Method called when activating the O.
 */
ww.mode.SpaceMode.prototype.activateO = function() {
  this.oClicked_ = true;
  if (this.oMultiplier_ < 10) {
    this.oMultiplier_ += 2;
  }

  // this.playProcessedAudio_('boing.wav', this.delay_);
};

/**
 * Function to create and draw I.
 * @private
 */
ww.mode.SpaceMode.prototype.drawI_ = function() {
  // Set I's initial dimensions.
  this.iWidth_ = this.width_ * .175;
  this.iHeight_ = this.iWidth_ * 2.12698413;

  // Set coordinates for I's upper left corner.
  this.i_X = this.screenCenterX_ - this.iWidth_ * 1.5;
  this.i_Y = this.screenCenterY_ - this.iHeight_ / 2;

  if (!this.paperI_) {

    // Initial variables for calculating path coordinates.
    var pathX;
    var pathY;

    var pathStart;
    var pathMidOne;
    var pathMidTwo;
    var pathEnd;
    var pathLength;

    var altI;

    // Create an array to store I's paths.
    this.iPaths_ = [];

    // Create a new paper.js path based on the previous variables.
    var iTopLeft = new paper['Point'](this.i_X, this.i_Y);
    var iSize = new paper['Size'](this.iWidth_, this.iHeight_);
    this.letterI_ = new paper['Rectangle'](iTopLeft, iSize);
    this.paperI_ = new paper['Path']['Rectangle'](this.letterI_);
    this.paperI_['fillColor'] = '#transparent';

    this.iGroup_ = new paper['Group'];

    for (this.i_ = 0; this.i_ < this.iWidth_ / 6; this.i_++) {
      this.iPaths_.push(new paper['Path']);

      pathX = iTopLeft['x'] + this.i_ * 6;
      pathY = iTopLeft['y'];

      pathStart = new paper['Point'](pathX, pathY);

      pathY = iTopLeft['y'] + this.iHeight_;

      pathEnd = new paper['Point'](pathX, pathY);

      pathMidOne = new paper['Point'](pathX, this.screenCenterY_ -
        (this.iHeight_ / 4));

      pathMidTwo = new paper['Point'](pathX, this.screenCenterY_ +
        (this.iHeight_ / 4));

      this.iPaths_[this.i_]['add'](pathStart, pathMidOne, pathMidTwo, pathEnd);

      this.iGroup_['addChild'](this.iPaths_[this.i_]);
    }

    this.iGroup_['strokeColor'] = '#11a860';
    this.iGroup_['strokeWidth'] = 1;

    // Create arrays to store the coordinates for I's path points.
    this.iPathsX_ = [];
    this.iPathsY_ = [];

    // Store the coordinates for I's path points.
    for (this.i_ = 0; this.i_ < this.iPaths_.length; this.i_++) {
      this.iPathsX_[this.i_] = [];
      this.iPathsY_[this.i_] = [];

      for (altI = 0; altI < this.iPaths_[this.i_]['segments'].length; altI++) {
        this.iPathsX_[this.i_].push(
          this.iPaths_[this.i_]['segments'][altI]['point']['_x']);

        this.iPathsY_[this.i_].push(
          this.iPaths_[this.i_]['segments'][altI]['point']['_y']);
      }
    }

  // Run if drawI_() is called and drawI_(true) has also already been called.
  } else if (this.paperI_) {
    // Restore the coordinates for I's path points before resizing
    for (this.i_ = 0; this.i_ < this.iPaths_.length; this.i_++) {
      for (altI = 0; altI < this.iPaths_[this.i_]['segments'].length; altI++) {
        this.iPaths_[this.i_]['segments'][altI]['point']['_x'] =
          this.iPathsX_[this.i_][altI];

        this.iPaths_[this.i_]['segments'][altI]['point']['_y'] =
          this.iPathsY_[this.i_][altI];
      }
    }

    // Change the position based on new screen size values.
    this.iGroup_['position'] = {x: this.i_X + this.iWidth_ / 2,
      y: this.i_Y + this.iHeight_ / 2};
    this.paperI_['position'] = {x: this.i_X + this.iWidth_ / 2,
      y: this.i_Y + this.iHeight_ / 2};

    // Change the scale based on new screen size values.
    this.iGroup_['scale'](this.iWidth_ / this.paperI_['bounds']['width']);
    this.paperI_['scale'](this.iWidth_ / this.paperI_['bounds']['width']);

    // Store the coordinates for I's path points based on the new window size.
    for (this.i_ = 0; this.i_ < this.iPaths_.length; this.i_++) {
      for (altI = 0; altI < this.iPaths_[this.i_]['segments'].length; altI++) {
        this.iPathsX_[this.i_][altI] =
          this.iPaths_[this.i_]['segments'][altI]['point']['_x'];

        this.iPathsY_[this.i_][altI] =
          this.iPaths_[this.i_]['segments'][altI]['point']['_y'];
      }
    }
  } else {
    return;
  }
};

/**
 * Function to create and draw O.
 * @private
 */
ww.mode.SpaceMode.prototype.drawO_ = function() {
  // Set O's radius.
  this.oRad_ = this.width_ * 0.1944444444;

  // Set O's coordinates.
  this.oX_ = this.screenCenterX_ + this.oRad_;
  this.oY_ = this.screenCenterY_;

  if (!this.paperO_) {

    // Initial variables for calculating circle angles.
    var pathX;
    var pathY;

    var pathStart;
    var pathMidOne;
    var pathMidTwo;
    var pathEnd;
    var pathLength;

    var altI;

    // Create an array to store O's paths.
    this.oPaths_ = [];

    // Create a new paper.js path for O based off the previous variables.
    var oCenter = new paper['Point'](this.oX_, this.oY_);
    this.paperO_ = new paper['Path']['Circle'](oCenter, this.oRad_);
    this.paperO_['fillColor'] = 'transparent';

    this.oGroup_ = new paper['Group'];

    for (this.i_ = 0; this.i_ < 90; this.i_++) {
      this.oPaths_.push(new paper['Path']);

      pathX = oCenter['x'] + this.oRad_ * Math.cos((this.i_ * 2) *
        (Math.PI / 180));

      pathY = oCenter['y'] + this.oRad_ * Math.sin((this.i_ * 2) *
        (Math.PI / 180));

      pathStart = new paper['Point'](pathX, pathY);

      pathX = oCenter['x'] + this.oRad_ * Math.cos(((-this.i_ * 2)) *
        (Math.PI / 180));

      pathY = oCenter['y'] + this.oRad_ * Math.sin(((-this.i_ * 2)) *
        (Math.PI / 180));

      pathEnd = new paper['Point'](pathX, pathY);

      pathLength = pathEnd['getDistance'](pathStart);

      pathMidOne = new paper['Point'](pathX, this.screenCenterY_ +
        (pathLength / 4));

      pathMidTwo = new paper['Point'](pathX, this.screenCenterY_ -
        (pathLength / 4));

      this.oPaths_[this.i_]['add'](pathStart, pathMidOne, pathMidTwo, pathEnd);

      this.oGroup_['addChild'](this.oPaths_[this.i_]);
    }

    this.oGroup_['strokeColor'] = '#3777e2';
    this.oGroup_['strokeWidth'] = 1;
    this.oGroup_['rotate'](-45);

    // Create arrays to store the coordinates for O's path points.
    this.oPathsX_ = [];
    this.oPathsY_ = [];

    // Store the coordinates for O's path points.
    for (this.i_ = 0; this.i_ < this.oPaths_.length; this.i_++) {
      this.oPathsX_[this.i_] = [];
      this.oPathsY_[this.i_] = [];
      for (altI = 0; altI < this.oPaths_[this.i_]['segments'].length; altI++) {
        this.oPathsX_[this.i_].push(
          this.oPaths_[this.i_]['segments'][altI]['point']['_x']);

        this.oPathsY_[this.i_].push(
          this.oPaths_[this.i_]['segments'][altI]['point']['_y']);
      }
    }

  // Run if drawO_() is called and drawO_(true) has also already been called.
  } else if (this.paperO_) {
    // Restore the original coordinates for O's path points before resizing.
    for (this.i_ = 0; this.i_ < this.oPaths_.length; this.i_++) {
      for (altI = 0; altI < this.oPaths_[this.i_]['segments'].length; altI++) {
        this.oPaths_[this.i_]['segments'][altI]['point']['_x'] =
          this.oPathsX_[this.i_][altI];

        this.oPaths_[this.i_]['segments'][altI]['point']['_y'] =
          this.oPathsY_[this.i_][altI];
      }
    }

    // Change the position based on new screen size values.
    this.oGroup_['position'] = {x: this.oX_, y: this.oY_};
    this.paperO_['position'] = {x: this.oX_, y: this.oY_};

    // Change the scale based on new screen size values.
    this.oGroup_['scale'](this.oRad_ * 2 / this.paperO_['bounds']['height']);
    this.paperO_['scale'](this.oRad_ * 2 / this.paperO_['bounds']['height']);

    // Store the coordinates for O's path points based on the new window size.
    for (this.i_ = 0; this.i_ < this.oPaths_.length; this.i_++) {
      for (altI = 0; altI < this.oPaths_[this.i_]['segments'].length; altI++) {
        this.oPathsX_[this.i_][altI] =
          this.oPaths_[this.i_]['segments'][altI]['point']['_x'];

        this.oPathsY_[this.i_][altI] =
          this.oPaths_[this.i_]['segments'][altI]['point']['_y'];
      }
    }
  } else {
    return;
  }
};

/**
 * Function to create and draw Slash.
 * @private
 */
ww.mode.SpaceMode.prototype.drawSlash_ = function() {
  // Run only if drawI_(true) and drawO_(true) have been called
  if (!this.paperSlash_ && this.paperI_ && this.paperO_) {
    // Determine the slash's start and end coordinates based on I and O sizes.
    this.slashStart_ = new paper['Point'](this.screenCenterX_ + this.oRad_ / 8,
      this.screenCenterY_ - (this.iHeight_ / 2) -
      ((this.iHeight_ * 1.5) * 0.17475728));

    this.slashEnd_ = new paper['Point'](this.i_X + this.iWidth_,
      this.screenCenterY_ + (this.iHeight_ / 2) +
      ((this.iHeight_ * 1.5) * 0.17475728));

    // Create a new paper.js path for the slash based on screen dimensions.
    this.paperSlash_ = new paper['Path'];
    this.paperSlash_['strokeWidth'] = 1;
    this.paperSlash_['strokeColor'] = '#ebebeb';

    this.paperSlash_['add'](this.slashStart_, this.slashEnd_);

  // Run if drawSlash_() is called and drawSlash(true) has already been called.
  } else if (this.paperSlash_) {
    this.slashStart_['x'] = this.screenCenterX_ + this.oRad_ / 8;
    this.slashStart_['y'] = this.screenCenterY_ - (this.iHeight_ / 2) -
      ((this.iHeight_ * 1.5) * 0.17475728);

    this.slashEnd_['x'] = this.i_X + this.iWidth_;
    this.slashEnd_['y'] = this.screenCenterY_ + (this.iHeight_ / 2) +
      ((this.iHeight_ * 1.5) * 0.17475728);

    this.paperSlash_['segments'][0]['point'] = this.slashStart_;
    this.paperSlash_['segments'][1]['point'] = this.slashEnd_;

  } else {
    return;
  }
};

/**
 * Function to initialize the current mode.
 * Requests a paper canvas and creates paths.
 * Sets initial variables.
 */
ww.mode.SpaceMode.prototype.init = function() {
  goog.base(this, 'init');

  /**
   * Create a star field.
   */
  this.world_ = this.getPhysicsWorld_();
  this.world_['viscosity'] = 0;

  for (this.i_ = 0; this.i_ < 500; this.i_++) {
    this.tempFloat_ = ww.util.floatComplexGaussianRandom();

    this.world_['particles'].push(new Particle());

    this.world_['particles'][this.i_]['setRadius'](
      Math.random() * (2 - 0.1) + 0.1);

    this.world_['particles'][this.i_]['pos']['x'] = this.tempFloat_[0] *
      this.width_;

    this.world_['particles'][this.i_]['pos']['y'] = this.tempFloat_[1] *
      this.height_;

    this.world_['particles'][this.i_]['vel']['x'] = 0;
    this.world_['particles'][this.i_]['vel']['y'] = 0;
  }

  // Prep paperjs
  this.getPaperCanvas_();

  // Variable to modify delta's returned value.
  this.deltaModifier_ = 0;

  // Temporarily float variable to use for randomizing animation effects.
  this.tempFloat_ = [];

  // Generic iterator.
  this.i_ = 0;

  // Gets the centerpoint of the viewport.
  this.screenCenterX_ = this.width_ / 2;
  this.screenCenterY_ = this.height_ / 2;

  /**
   * Sets the mouse position to start at the screen center.
   */
  this.mouseX_ = this.screenCenterX_;
  this.mouseY_ = this.screenCenterY_;

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

  // If I and O already exist, draw them again to reset their path points.
  if (this.paperI_) {
    this.drawI_();
  }

  if (this.paperO_) {
    this.drawO_();
  }


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
ww.mode.SpaceMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  this.$canvas_ = $('#space-canvas');
  this.canvas_ = this.$canvas_[0];
  this.canvas_.width = this.width_;
  this.canvas_.height = this.height_;
  this.ctx_ = this.canvas_.getContext('2d');
  this.ctx_.fillStyle = '#424242';
  this.ctx_.shadowColor = '#fff';
  this.ctx_.shadowBlur = 10;

  var canvas = this.getPaperCanvas_();

  var self = this;

  var evt = Modernizr['touch'] ? 'touchmove' : 'mousemove';

  var tool = new paper['Tool']();

  tool['onMouseDown'] = function(event) {
    self.lastClick = event['point'];
    if (self.paperO_['hitTest'](event['point'])) {
      self.activateO();
    }

    if (self.paperI_['hitTest'](event['point'])) {
      self.activateI();
    }
  };

  this.$canvas_.bind(evt, function(e) {
    e.preventDefault();
    e.stopPropagation();

    self.mouseX_ = e.pageX;
    self.mouseY_ = e.pageY;
  });

  $(canvas).bind(evt, function(e) {
    e.preventDefault();
    e.stopPropagation();

    self.mouseX_ = e.pageX;
    self.mouseY_ = e.pageY;
  });
};

/**
 * Handles a browser window resize.
 * @param {Boolean} redraw Whether resize redraws.
 */
ww.mode.SpaceMode.prototype.onResize = function(redraw) {
  goog.base(this, 'onResize', false);

  if (this.canvas_) {
    this.canvas_.width = this.width_;
    this.canvas_.height = this.height_;
  }

  // Recalculate the center of the screen based on the new window size.
  this.screenCenterX_ = this.width_ / 2;
  this.screenCenterY_ = this.height_ / 2;

  if (this.world_) {
    for (this.i_ = 0; this.i_ < this.world_['particles'].length; this.i_++) {
      this.tempFloat_ = ww.util.floatComplexGaussianRandom();

      this.world_['particles'][this.i_]['pos']['x'] = this.tempFloat_[0] *
        this.width_;

      this.world_['particles'][this.i_]['pos']['y'] = this.tempFloat_[1] *
        this.height_;
    }
  }

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

  this.redraw();
};

/**
 * On each physics tick, adjust star positions.
 * @param {Float} delta Time since last tick.
 */
ww.mode.SpaceMode.prototype.stepPhysics = function(delta) {
  goog.base(this, 'stepPhysics', delta);

  // Move star positions right and also adjust them based on mouse position.
  for (this.i_ = 0; this.i_ < this.world_['particles'].length; this.i_++) {
    this.world_['particles'][this.i_]['pos']['x'] +=
      (this.screenCenterX_ - this.mouseX_) /
      (5000 / this.world_['particles'][this.i_]['radius']) + .1;

    if (this.world_['particles'][this.i_]['pos']['x'] > this.width_ * 2) {
      this.world_['particles'][this.i_]['pos']['x'] =
        -this.world_['particles'][this.i_]['radius'] * 10;
    } else if (this.world_['particles'][this.i_]['pos']['x'] <
      -this.width_ * 2) {
        this.world_['particles'][this.i_]['pos']['x'] =
          this.width_ + this.world_['particles'][this.i_]['radius'] * 10;
    }

    this.world_['particles'][this.i_]['pos']['y'] +=
      (this.screenCenterY_ - this.mouseY_) /
      (5000 / this.world_['particles'][this.i_]['radius']);

    if (this.world_['particles'][this.i_]['pos']['y'] > this.height_ * 2) {
      this.world_['particles'][this.i_]['pos']['y'] =
        -this.world_['particles'][this.i_]['radius'] * 10;
    } else if (this.world_['particles'][this.i_]['pos']['y'] <
      -this.height_ * 2) {
        this.world_['particles'][this.i_]['pos']['y'] =
          this.width_ + this.world_['particles'][this.i_]['radius'] * 10;
    }
  }

};

/**
 * Runs code on each requested frame.
 * @param {Integer} delta The timestep variable for animation accuracy.
 */
ww.mode.SpaceMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  if (!this.canvas_) { return; }

  this.ctx_.clearRect(0, 0, this.canvas_.width + 1, this.canvas_.height + 1);

  this.ctx_.beginPath();

  for (this.i_ = 0; this.i_ < this.world_['particles'].length; this.i_++) {
    this.ctx_.arc(this.world_['particles'][this.i_]['pos']['x'],
      this.world_['particles'][this.i_]['pos']['y'],
      this.world_['particles'][this.i_]['radius'], 0, Math.PI * 2);
  }

  this.ctx_.fill();

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
  if (this.iClicked_ == true) {

    if (this.iModifier_ < this.deltaModifier_ * 10000 &&
      this.iIncrement_ == true) {
        this.iModifier_ += this.deltaModifier_ * 1000;
    } else if (this.iMultiplier_ > 1) {
      if (this.iModifier_ < this.deltaModifier_ * 10000) {
        this.iModifier_ += this.deltaModifier_ * 100;
      }
      if (this.iMultiplier_ > 1) {
        this.iMultiplier_ -= 0.1;
      } else {
        this.iMultiplier_ = 1;
      }
    } else {
      this.iIncrement_ = false;
      this.iModifier_ -= this.deltaModifier_ * 1000;
      if (this.iMultiplier_ > 1) {
        this.iMultiplier_ -= 0.1;
      } else {
        this.iMultiplier_ = 1;
      }
    }

    if (this.iModifier_ < this.deltaModifier_ * 1000) {
      this.iClicked_ = false;
      this.iIncrement_ = true;
      this.iMultiplier_ = 1;
    }

    /*
     * Loop through each path segment on the letter I and move each point's
     * handles based on time as being evaluated by Sine and Cosine.
     */
    var altI;

    for (this.i_ = 0; this.i_ < this.iPaths_.length; this.i_++) {
      this.tempFloat_ = ww.util.floatComplexGaussianRandom();

      this.iPaths_[this.i_]['segments'][0]['point']['_x'] =
        this.iPathsX_[this.i_][0] +
        Math.cos(this.framesRendered_ / 10 +
        (this.iGroup_['position']['_x'] - this.iPathsX_[this.i_][0])) *
        this.iModifier_ * this.iMultiplier_;

      this.iPaths_[this.i_]['segments'][0]['point']['_y'] =
        this.iPathsY_[this.i_][0] +
        Math.sin(this.framesRendered_ / 10 +
        (this.iGroup_['position']['_y'] - this.iPathsY_[this.i_][0])) *
        this.iModifier_ * this.iMultiplier_ * this.tempFloat_[0];

      this.iPaths_[this.i_]['segments'][1]['point']['_x'] =
        this.iPathsX_[this.i_][1] +
        Math.sin(this.framesRendered_ / 10 +
        (this.iGroup_['position']['_x'] - this.iPathsX_[this.i_][1])) *
        this.iModifier_ * this.iMultiplier_;

      this.iPaths_[this.i_]['segments'][1]['point']['_y'] =
        this.iPathsY_[this.i_][1] +
        Math.cos(this.framesRendered_ / 10 +
        (this.iGroup_['position']['_y'] - this.iPathsY_[this.i_][1])) *
        this.iModifier_ * this.iMultiplier_;

      this.iPaths_[this.i_]['segments'][2]['point']['_x'] =
        this.iPathsX_[this.i_][2] +
        Math.cos(this.framesRendered_ / 10 +
        (this.iGroup_['position']['_x'] - this.iPathsX_[this.i_][2])) *
        this.iModifier_ * this.iMultiplier_;

      this.iPaths_[this.i_]['segments'][2]['point']['_y'] =
        this.iPathsY_[this.i_][2] +
        Math.sin(this.framesRendered_ / 10 +
        (this.iGroup_['position']['_y'] - this.iPathsY_[this.i_][2])) *
        this.iModifier_ * this.iMultiplier_;

      this.iPaths_[this.i_]['segments'][3]['point']['_x'] =
        this.iPathsX_[this.i_][3] +
        Math.sin(this.framesRendered_ / 10 +
        (this.iGroup_['position']['_x'] - this.iPathsX_[this.i_][3])) *
        this.iModifier_ * this.iMultiplier_;

      this.iPaths_[this.i_]['segments'][3]['point']['_y'] =
        this.iPathsY_[this.i_][3] +
        Math.cos(this.framesRendered_ / 10 +
        (this.iGroup_['position']['_y'] - this.iPathsY_[this.i_][3])) *
        this.iModifier_ * this.iMultiplier_ * this.tempFloat_[1];

      this.iPaths_[this.i_]['smooth']();
    }
  } else {
    /*
     * If I hasn't been activated recently enough, restore the original point
     * coordinates.
     */
    for (this.i_ = 0; this.i_ < this.iPaths_.length; this.i_++) {
      for (altI = 0; altI < this.iPaths_[this.i_]['segments'].length; altI++) {
        this.iPaths_[this.i_]['segments'][altI]['_x'] =
          this.iPathsX_[this.i_][altI];

        this.iPaths_[this.i_]['segments'][altI]['_y'] =
          this.iPathsY_[this.i_][altI];
      }
    }
  }

  /*
   * Run the following code if the letter O is activated.
   * It uses delta along with other variables to modify the intensity of the
   * animation.
   */
  if (this.oClicked_ === true) {

    if (this.oModifier_ < this.deltaModifier_ * 10000 &&
      this.oIncrement_ === true) {
        this.oModifier_ += this.deltaModifier_ * 1000;
    } else if (this.oMultiplier_ > 1) {
      if (this.oModifier_ < this.deltaModifier_ * 10000) {
        this.oModifier_ += this.deltaModifier_ * 10;
      }
      if (this.oMultiplier_ > 1) {
        this.oMultiplier_ -= 0.1;
      } else {
        this.oMultiplier_ = 1;
      }
    } else {
      this.oIncrement_ = false;
      this.oModifier_ -= this.deltaModifier_ * 1000;
      if (this.oMultiplier_ > 1) {
        this.oMultiplier_ -= 0.1;
      } else {
        this.oMultiplier_ = 1;
      }
    }

    // If oModifier drops too low, reset variables to their default state.
    if (this.oModifier_ < this.deltaModifier_ * 1000) {
      this.oClicked_ = false;
      this.oIncrement_ = true;
      this.oMultiplier_ = 1;
    }

    this.delay_['feedback'] = this.oMultiplier_ / 10;

    /*
     * Loop through each path segment on the letter O and move each point's
     * coordinates based on time as being evaluated by Sine and Cosine.
     */
    var altI;

    for (this.i_ = 0; this.i_ < this.oPaths_.length; this.i_++) {
      this.tempFloat_ = ww.util.floatComplexGaussianRandom();

      this.oPaths_[this.i_]['segments'][0]['point']['_x'] =
        this.oPathsX_[this.i_][0] +
        Math.cos(this.framesRendered_ / 10 +
        (this.oGroup_['position']['_x'] - this.oPathsX_[this.i_][0])) *
        this.oModifier_ * this.oMultiplier_;

      this.oPaths_[this.i_]['segments'][0]['point']['_y'] =
        this.oPathsY_[this.i_][0] +
        Math.sin(this.framesRendered_ / 10 +
        (this.oGroup_['position']['_y'] - this.oPathsY_[this.i_][0])) *
        this.oModifier_ * this.oMultiplier_ * this.tempFloat_[0];

      this.oPaths_[this.i_]['segments'][1]['point']['_x'] =
        this.oPathsX_[this.i_][1] +
        Math.sin(this.framesRendered_ / 10 +
        (this.oGroup_['position']['_x'] - this.oPathsX_[this.i_][1])) *
        this.oModifier_ * this.oMultiplier_;

      this.oPaths_[this.i_]['segments'][1]['point']['_y'] =
        this.oPathsY_[this.i_][1] +
        Math.cos(this.framesRendered_ / 10 +
        (this.oGroup_['position']['_y'] - this.oPathsY_[this.i_][1])) *
        this.oModifier_ * this.oMultiplier_;

      this.oPaths_[this.i_]['segments'][2]['point']['_x'] =
        this.oPathsX_[this.i_][2] +
        Math.cos(this.framesRendered_ / 10 +
        (this.oGroup_['position']['_x'] - this.oPathsX_[this.i_][2])) *
        this.oModifier_ * this.oMultiplier_;

      this.oPaths_[this.i_]['segments'][2]['point']['_y'] =
        this.oPathsY_[this.i_][2] +
        Math.sin(this.framesRendered_ / 10 +
        (this.oGroup_['position']['_y'] - this.oPathsY_[this.i_][2])) *
        this.oModifier_ * this.oMultiplier_;

      this.oPaths_[this.i_]['segments'][3]['point']['_x'] =
        this.oPathsX_[this.i_][3] +
        Math.sin(this.framesRendered_ / 10 +
        (this.oGroup_['position']['_x'] - this.oPathsX_[this.i_][3])) *
        this.oModifier_ * this.oMultiplier_ ;

      this.oPaths_[this.i_]['segments'][3]['point']['_y'] =
        this.oPathsY_[this.i_][3] +
        Math.cos(this.framesRendered_ / 10 +
        (this.oGroup_['position']['_y'] - this.oPathsY_[this.i_][3])) *
        this.oModifier_ * this.oMultiplier_ * this.tempFloat_[1];

      this.oPaths_[this.i_]['smooth']();
    }
  } else {
    /*
     * If O hasn't been activated recently enough, restore the original point
     * coordinates.
     */
    for (this.i_ = 0; this.i_ < this.oPaths_.length; this.i_++) {
      for (altI = 0; altI < this.oPaths_[this.i_]['segments'].length; altI++) {
        this.oPaths_[this.i_]['segments'][altI]['_x'] =
          this.oPathsX_[this.i_][altI];

        this.oPaths_[this.i_]['segments'][altI]['_y'] =
          this.oPathsY_[this.i_][altI];
      }
    }
  }
};
