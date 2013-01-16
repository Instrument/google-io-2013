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
  this.ix = this.screenCenterX_ - this.iWidth_ * 1.5;
  this.iy = this.screenCenterY_ - this.iHeight_ / 2;

  if (!this.paperI_) {

    // Initial variables for calculating path coordinates.
    var pathX;
    var pathY;

    var pathStart;
    var pathMidOne;
    var pathMidTwo;
    var pathEnd;
    var pathLength;

    var i;
    var ii;

    // Create an array to store I's paths.
    this.iPaths_ = [];

    // Create a new paper.js path based on the previous variables.
    var iTopLeft = new paper['Point'](this.ix, this.iy);
    var iSize = new paper['Size'](this.iWidth_, this.iHeight_);
    this.letterI_ = new paper['Rectangle'](iTopLeft, iSize);
    this.paperI_ = new paper['Path']['Rectangle'](this.letterI_);
    this.paperI_['fillColor'] = '#transparent';

    this.iGroup_ = new paper['Group'];

    for (i = 0; i < this.iWidth_ / 6; i++) {
      this.iPaths_.push(new paper['Path']);

      pathX = iTopLeft['x'] + i * 6;
      pathY = iTopLeft['y'];

      pathStart = new paper['Point'](pathX, pathY);

      pathY = iTopLeft['y'] + this.iHeight_;

      pathEnd = new paper['Point'](pathX, pathY);

      pathMidOne = new paper['Point'](pathX, this.screenCenterY_ -
        (this.iHeight_ / 4));

      pathMidTwo = new paper['Point'](pathX, this.screenCenterY_ +
        (this.iHeight_ / 4));

      this.iPaths_[i]['add'](pathStart, pathMidOne, pathMidTwo, pathEnd);

      this.iGroup_['addChild'](this.iPaths_[i]);
    }

    this.iGroup_['strokeColor'] = '#11a860';
    this.iGroup_['strokeWidth'] = 1;

    // Create arrays to store the coordinates for I's path points.
    this.iPathsX_ = [];
    this.iPathsY_ = [];

    // Store the coordinates for I's path points.
    this.copyXY_(this.iPaths_, this.iPathsX_, this.iPathsY_, true);

  // Run if drawI_() is called and drawI_(true) has also already been called.
  } else if (this.paperI_) {
    // Restore the coordinates for I's path points before resizing.
    this.copyXY_(this.iPaths_, this.iPathsX_, this.iPathsY_, false);

    // Change the position based on new screen size values.
    this.iGroup_['position'] = {x: this.ix + this.iWidth_ / 2,
      y: this.iy + this.iHeight_ / 2};
    this.paperI_['position'] = {x: this.ix + this.iWidth_ / 2,
      y: this.iy + this.iHeight_ / 2};

    // Change the scale based on new screen size values.
    this.iGroup_['scale'](this.iWidth_ / this.paperI_['bounds']['width']);
    this.paperI_['scale'](this.iWidth_ / this.paperI_['bounds']['width']);

    // Store the coordinates for I's path points based on the new window size.
    this.copyXY_(this.iPaths_, this.iPathsX_, this.iPathsY_, true);
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

    var i;
    var ii;

    // Create an array to store O's paths.
    this.oPaths_ = [];

    // Create a new paper.js path for O based off the previous variables.
    var oCenter = new paper['Point'](this.oX_, this.oY_);
    this.paperO_ = new paper['Path']['Circle'](oCenter, this.oRad_);
    this.paperO_['fillColor'] = 'transparent';

    this.oGroup_ = new paper['Group']();

    for (i = 0; i < 90; i++) {
      this.oPaths_.push(new paper['Path']());

      pathX = oCenter['x'] + this.oRad_ * Math.cos((i * 2) *
        (Math.PI / 180));

      pathY = oCenter['y'] + this.oRad_ * Math.sin((i * 2) *
        (Math.PI / 180));

      pathStart = new paper['Point'](pathX, pathY);

      pathX = oCenter['x'] + this.oRad_ * Math.cos(((-i * 2)) *
        (Math.PI / 180));

      pathY = oCenter['y'] + this.oRad_ * Math.sin(((-i * 2)) *
        (Math.PI / 180));

      pathEnd = new paper['Point'](pathX, pathY);

      pathLength = pathEnd['getDistance'](pathStart);

      pathMidOne = new paper['Point'](pathX, this.screenCenterY_ +
        (pathLength / 4));

      pathMidTwo = new paper['Point'](pathX, this.screenCenterY_ -
        (pathLength / 4));

      this.oPaths_[i]['add'](pathStart, pathMidOne, pathMidTwo, pathEnd);

      this.oGroup_['addChild'](this.oPaths_[i]);
    }

    this.oGroup_['strokeColor'] = '#3777e2';
    this.oGroup_['strokeWidth'] = 1;
    this.oGroup_['rotate'](-45);

    // Create arrays to store the coordinates for O's path points.
    this.oPathsX_ = [];
    this.oPathsY_ = [];

    // Store the coordinates for O's path points.
    this.copyXY_(this.oPaths_, this.oPathsX_, this.oPathsY_, true);

  // Run if drawO_() is called and drawO_(true) has also already been called.
  } else if (this.paperO_) {
    // Restore the original coordinates for O's path points before resizing.
    this.copyXY_(this.oPaths_, this.oPathsX_, this.oPathsY_, false);

    // Change the position based on new screen size values.
    this.oGroup_['position'] = {x: this.oX_, y: this.oY_};
    this.paperO_['position'] = {x: this.oX_, y: this.oY_};

    // Change the scale based on new screen size values.
    this.oGroup_['scale'](this.oRad_ * 2 / this.paperO_['bounds']['height']);
    this.paperO_['scale'](this.oRad_ * 2 / this.paperO_['bounds']['height']);

    // Store the coordinates for O's path points based on the new window size.
    this.copyXY_(this.oPaths_, this.oPathsX_, this.oPathsY_, true);
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

    this.slashEnd_ = new paper['Point'](this.ix + this.iWidth_,
      this.screenCenterY_ + (this.iHeight_ / 2) +
      ((this.iHeight_ * 1.5) * 0.17475728));

    // Create a new paper.js path for the slash based on screen dimensions.
    this.paperSlash_ = new paper['Path']();
    this.paperSlash_['strokeWidth'] = 1;
    this.paperSlash_['strokeColor'] = '#ebebeb';

    this.paperSlash_['add'](this.slashStart_, this.slashEnd_);

  // Run if drawSlash_() is called and drawSlash(true) has already been called.
  } else {
    this.slashStart_['x'] = this.screenCenterX_ + this.oRad_ / 8;
    this.slashStart_['y'] = this.screenCenterY_ - (this.iHeight_ / 2) -
      ((this.iHeight_ * 1.5) * 0.17475728);

    this.slashEnd_['x'] = this.ix + this.iWidth_;
    this.slashEnd_['y'] = this.screenCenterY_ + (this.iHeight_ / 2) +
      ((this.iHeight_ * 1.5) * 0.17475728);

    this.paperSlash_['segments'][0]['point'] = this.slashStart_;
    this.paperSlash_['segments'][1]['point'] = this.slashEnd_;
  }
};

/**
 * Function to initialize the current mode.
 * Requests a paper canvas and creates paths.
 * Sets initial variables.
 */
ww.mode.SpaceMode.prototype.init = function() {
  goog.base(this, 'init');

  var i;

  /**
   * Create a star field.
   */
  this.world_ = this.getPhysicsWorld_();
  this.world_['viscosity'] = 0;

  for (i = 0; i < 500; i++) {
    this.tempFloat_ = ww.util.floatComplexGaussianRandom();

    this.world_['particles'].push(new Particle());

    this.world_['particles'][i]['setRadius'](
      Math.random() * (2 - 0.1) + 0.1);

    this.world_['particles'][i]['pos']['x'] = this.tempFloat_[0] *
      this.width_;

    this.world_['particles'][i]['pos']['y'] = this.tempFloat_[1] *
      this.height_;

    this.world_['particles'][i]['vel']['x'] = 0;
    this.world_['particles'][i]['vel']['y'] = 0;
  }

  // Prep paperjs
  this.getPaperCanvas_();

  // Variable to modify delta's returned value.
  this.deltaModifier_ = 0;

  // Temporarily float variable to use for randomizing animation effects.
  this.tempFloat_ = [];

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

  if (this.paperO_) {
    this.drawO_();
  }
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

  var evt = Modernizr['touch'] ? 'touchmove' : 'mousemove';
  $(document).bind(evt + '.space', function(e) {
    self.mouseX_ = e.pageX;
    self.mouseY_ = e.pageY;
  });
};

/**
 * Event is called after a mode unfocused.
 */
ww.mode.SpaceMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  var evt = Modernizr['touch'] ? 'touchmove' : 'mousemove';
  $(document).unbind(evt + '.space');
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

  var i;

  if (this.world_) {
    for (i = 0; i < this.world_['particles'].length; i++) {
      this.tempFloat_ = ww.util.floatComplexGaussianRandom();

      this.world_['particles'][i]['pos']['x'] = this.tempFloat_[0] *
        this.width_;

      this.world_['particles'][i]['pos']['y'] = this.tempFloat_[1] *
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
 * Assign a paper object's coordinates to a static array, or vice versa.
 * @param {Array} paperArray The paper.js array to reference.
 * @param {Array} xArray The array of static X coordinates to reference.
 * @param {Array} yArray The array of static Y coordinates to reference.
 * @param {Boolean} copy Determines if paperArray is copied from or written to.
 */
ww.mode.SpaceMode.prototype.copyXY_ = function(paper, xArray, yArray, copy) {
  var i;
  var ii;

  for (i = 0; i < paper.length; i++) {
    // If the x and y arrays don't have sub arrays already, create them.
    if (!xArray[i] && !yArray[i]) {
      xArray[i] = [];
      yArray[i] = [];
    }

    for (ii = 0; ii < paper[i]['segments'].length; ii++) {
      if (copy) {
        xArray[i][ii] = paper[i]['segments'][ii]['point']['x'];

        yArray[i][ii] = paper[i]['segments'][ii]['point']['y'];
      } else {
        paper[i]['segments'][ii]['point']['x'] = xArray[i][ii];

        paper[i]['segments'][ii]['point']['y'] = yArray[i][ii];
      }
    }
  }
}

/**
 * On each physics tick, adjust star positions.
 * @param {Float} delta Time since last tick.
 */
ww.mode.SpaceMode.prototype.stepPhysics = function(delta) {
  goog.base(this, 'stepPhysics', delta);

  var i;

  // Move star positions right and also adjust them based on mouse position.
  for (i = 0; i < this.world_['particles'].length; i++) {
    this.world_['particles'][i]['pos']['x'] +=
      (this.screenCenterX_ - this.mouseX_) /
      (5000 / this.world_['particles'][i]['radius']) + .1;

    if (this.world_['particles'][i]['pos']['x'] > this.width_ * 2) {
      this.world_['particles'][i]['pos']['x'] =
        -this.world_['particles'][i]['radius'] * 10;
    } else if (this.world_['particles'][i]['pos']['x'] <
      -this.width_ * 2) {
        this.world_['particles'][i]['pos']['x'] =
          this.width_ + this.world_['particles'][i]['radius'] * 10;
    }

    this.world_['particles'][i]['pos']['y'] +=
      (this.screenCenterY_ - this.mouseY_) /
      (5000 / this.world_['particles'][i]['radius']);

    if (this.world_['particles'][i]['pos']['y'] > this.height_ * 2) {
      this.world_['particles'][i]['pos']['y'] =
        -this.world_['particles'][i]['radius'] * 10;
    } else if (this.world_['particles'][i]['pos']['y'] <
      -this.height_ * 2) {
        this.world_['particles'][i]['pos']['y'] =
          this.width_ + this.world_['particles'][i]['radius'] * 10;
    }
  }

};

/**
 * Runs code on each requested frame.
 * @param {Integer} delta The timestep variable for animation accuracy.
 */
ww.mode.SpaceMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  var i;
  var ii;

  if (!this.canvas_) { return; }

  this.ctx_.clearRect(0, 0, this.canvas_.width + 1, this.canvas_.height + 1);

  this.ctx_.beginPath();

  for (i = 0; i < this.world_['particles'].length; i++) {
    this.ctx_.arc(this.world_['particles'][i]['pos']['x'],
      this.world_['particles'][i]['pos']['y'],
      this.world_['particles'][i]['radius'], 0, Math.PI * 2);
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

    for (i = 0; i < this.iPaths_.length; i++) {
      this.tempFloat_ = ww.util.floatComplexGaussianRandom();

      this.iPaths_[i]['segments'][0]['point']['x'] =
        this.iPathsX_[i][0] +
        Math.cos(this.framesRendered_ / 10 +
        (this.iGroup_['position']['x'] - this.iPathsX_[i][0])) *
        this.iModifier_ * this.iMultiplier_;

      this.iPaths_[i]['segments'][0]['point']['y'] =
        this.iPathsY_[i][0] +
        Math.sin(this.framesRendered_ / 10 +
        (this.iGroup_['position']['y'] - this.iPathsY_[i][0])) *
        this.iModifier_ * this.iMultiplier_ * this.tempFloat_[0];

      this.iPaths_[i]['segments'][1]['point']['x'] =
        this.iPathsX_[i][1] +
        Math.sin(this.framesRendered_ / 10 +
        (this.iGroup_['position']['x'] - this.iPathsX_[i][1])) *
        this.iModifier_ * this.iMultiplier_;

      this.iPaths_[i]['segments'][1]['point']['y'] =
        this.iPathsY_[i][1] +
        Math.cos(this.framesRendered_ / 10 +
        (this.iGroup_['position']['y'] - this.iPathsY_[i][1])) *
        this.iModifier_ * this.iMultiplier_;

      this.iPaths_[i]['segments'][2]['point']['x'] =
        this.iPathsX_[i][2] +
        Math.cos(this.framesRendered_ / 10 +
        (this.iGroup_['position']['x'] - this.iPathsX_[i][2])) *
        this.iModifier_ * this.iMultiplier_;

      this.iPaths_[i]['segments'][2]['point']['y'] =
        this.iPathsY_[i][2] +
        Math.sin(this.framesRendered_ / 10 +
        (this.iGroup_['position']['y'] - this.iPathsY_[i][2])) *
        this.iModifier_ * this.iMultiplier_;

      this.iPaths_[i]['segments'][3]['point']['x'] =
        this.iPathsX_[i][3] +
        Math.sin(this.framesRendered_ / 10 +
        (this.iGroup_['position']['x'] - this.iPathsX_[i][3])) *
        this.iModifier_ * this.iMultiplier_;

      this.iPaths_[i]['segments'][3]['point']['y'] =
        this.iPathsY_[i][3] +
        Math.cos(this.framesRendered_ / 10 +
        (this.iGroup_['position']['y'] - this.iPathsY_[i][3])) *
        this.iModifier_ * this.iMultiplier_ * this.tempFloat_[1];

      this.iPaths_[i]['smooth']();
    }
  } else {
    /*
     * If I hasn't been activated recently enough, restore the original point
     * coordinates.
     */
    for (i = 0; i < this.iPaths_.length; i++) {
      for (ii = 0; ii < this.iPaths_[i]['segments'].length; ii++) {
        this.iPaths_[i]['segments'][ii]['x'] =
          this.iPathsX_[i][ii];

        this.iPaths_[i]['segments'][ii]['y'] =
          this.iPathsY_[i][ii];
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

    for (i = 0; i < this.oPaths_.length; i++) {
      this.tempFloat_ = ww.util.floatComplexGaussianRandom();

      this.oPaths_[i]['segments'][0]['point']['x'] =
        this.oPathsX_[i][0] +
        Math.cos(this.framesRendered_ / 10 +
        (this.oGroup_['position']['x'] - this.oPathsX_[i][0])) *
        this.oModifier_ * this.oMultiplier_;

      this.oPaths_[i]['segments'][0]['point']['y'] =
        this.oPathsY_[i][0] +
        Math.sin(this.framesRendered_ / 10 +
        (this.oGroup_['position']['y'] - this.oPathsY_[i][0])) *
        this.oModifier_ * this.oMultiplier_ * this.tempFloat_[0];

      this.oPaths_[i]['segments'][1]['point']['x'] =
        this.oPathsX_[i][1] +
        Math.sin(this.framesRendered_ / 10 +
        (this.oGroup_['position']['x'] - this.oPathsX_[i][1])) *
        this.oModifier_ * this.oMultiplier_;

      this.oPaths_[i]['segments'][1]['point']['y'] =
        this.oPathsY_[i][1] +
        Math.cos(this.framesRendered_ / 10 +
        (this.oGroup_['position']['y'] - this.oPathsY_[i][1])) *
        this.oModifier_ * this.oMultiplier_;

      this.oPaths_[i]['segments'][2]['point']['x'] =
        this.oPathsX_[i][2] +
        Math.cos(this.framesRendered_ / 10 +
        (this.oGroup_['position']['x'] - this.oPathsX_[i][2])) *
        this.oModifier_ * this.oMultiplier_;

      this.oPaths_[i]['segments'][2]['point']['y'] =
        this.oPathsY_[i][2] +
        Math.sin(this.framesRendered_ / 10 +
        (this.oGroup_['position']['y'] - this.oPathsY_[i][2])) *
        this.oModifier_ * this.oMultiplier_;

      this.oPaths_[i]['segments'][3]['point']['x'] =
        this.oPathsX_[i][3] +
        Math.sin(this.framesRendered_ / 10 +
        (this.oGroup_['position']['x'] - this.oPathsX_[i][3])) *
        this.oModifier_ * this.oMultiplier_;

      this.oPaths_[i]['segments'][3]['point']['y'] =
        this.oPathsY_[i][3] +
        Math.cos(this.framesRendered_ / 10 +
        (this.oGroup_['position']['y'] - this.oPathsY_[i][3])) *
        this.oModifier_ * this.oMultiplier_ * this.tempFloat_[1];

      this.oPaths_[i]['smooth']();
    }
  } else {
    /*
     * If O hasn't been activated recently enough, restore the original point
     * coordinates.
     */
    for (i = 0; i < this.oPaths_.length; i++) {
      for (ii = 0; ii < this.oPaths_[i]['segments'].length; ii++) {
        this.oPaths_[i]['segments'][ii]['x'] =
          this.oPathsX_[i][ii];

        this.oPaths_[i]['segments'][ii]['y'] =
          this.oPathsY_[i][ii];
      }
    }
  }
};
