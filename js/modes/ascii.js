goog.require('ww.mode.Core');
goog.require('ww.util');
goog.provide('ww.mode.AsciiMode');

/**
 * @constructor
 */
ww.mode.AsciiMode = function() {
  goog.base(this, 'ascii', true, true);

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
goog.inherits(ww.mode.AsciiMode, ww.mode.Core);

/**
 * Play a sound by url after being processed by Tuna.
 * @private.
 * @param {String} filename Audio file name.
 * @param {Object} filter Audio filter name.
 */
ww.mode.AsciiMode.prototype.playProcessedAudio_ = function(filename, filter) {
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
 * Method called when activating the I.
 */
ww.mode.AsciiMode.prototype.activateI = function() {
  goog.base(this, 'activateI');

  this.iClicked_ = true;
  if (this.iMultiplier_ < 10) {
    this.iMultiplier_ += 2;
  }

  this.playProcessedAudio_('boing.wav', this.chorus_);
};

/**
 * Method called when activating the O.
 */
ww.mode.AsciiMode.prototype.activateO = function() {
  goog.base(this, 'activateO');

  this.oClicked_ = true;
  if (this.oMultiplier_ < 10) {
    this.oMultiplier_ += 2;
  }

  /*for (var i = 0; i < this.paperO_['segments'].length; i++) {
    var vector = this.oStatic_[i]['point'] + this.oCenter_ -
      this.lastClick_;

    var distance = Math.max(0, this.paperO_['radius'] - vector.length);
    this.oStatic_[i]['point'].length += distance;
    this.oStatic_[i]['vector'] += 10;
  }*/

  this.playProcessedAudio_('boing.wav', this.delay_);
};

/**
 * Function to create and draw I.
 * @private
 */
ww.mode.AsciiMode.prototype.drawI_ = function() {
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

// The stops array: yellow mixes with red between 0 and 15%,
// 15% to 30% is pure red, red mixes with black between 30% to 100%:
var stops = [['white', 0], ['black', 0.5], ['white', 1]];

// Create a radial gradient using the color stops array:
var gradient = new paper['Gradient'](stops);

// We will use the center point of the circle shaped path as
// the origin point for our gradient color
var from = this.paperI_['position']['clone']();
from['x'] -= this.iX_ * 1.3;

// The destination point of the gradient color will be the
// center point of the path + 80pt in horizontal direction:
var to = this.paperI_['position']['clone']();
to['x'] += this.iX_ * 1.3;

// Create the gradient color:
var gradientColor = new paper['GradientColor'](gradient, from, to);


    // this.paperI_['fillColor'] = '#11a860';
    this.paperI_['fillColor'] = gradientColor;

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
ww.mode.AsciiMode.prototype.drawO_ = function() {
  var i;

  // Set O's radius.
  this.oRad_ = this.width_ * 0.1944444444;

  // Set O's coordinates.
  this.oX_ = this.screenCenterX_ + this.oRad_;
  this.oY_ = this.screenCenterY_;

  if (!this.paperO_) {
    // Create a new paper.js path for O based off the previous variables.
    this.oCenter_ = new paper['Point'](this.oX_, this.oY_);
    // this.paperO_ = new paper['Path']['Circle'](this.oCenter_, this.oRad_);
    this.paperO_ = new paper['Path']['RegularPolygon'](this.oCenter_, 100, this.oRad_);

// The stops array: yellow mixes with red between 0 and 15%,
// 15% to 30% is pure red, red mixes with black between 30% to 100%:
var stops = [['black', 0], ['white', 1]];

// Create a radial gradient using the color stops array:
var gradient = new paper['Gradient'](stops, 'radial');

// We will use the center point of the circle shaped path as
// the origin point for our gradient color
var from = this.paperO_['position'];

// The destination point of the gradient color will be the
// center point of the path + 80pt in horizontal direction:
var to = this.paperO_['position']['clone']();
to['x'] += this.oRad_ * 1.3;

// Create the gradient color:
var gradientColor = new paper['GradientColor'](gradient, from, to);


    // this.paperO_['fillColor'] = '#3777e2';
    this.paperO_['fillColor'] = gradientColor;

    // Create arrays to store the coordinates for O's path points.
    this.oPointX_ = [];
    this.oPointY_ = [];

    // Store the coordinates for O's path points.
    this.copyXY_(this.paperO_, this.oPointX_, this.oPointY_, true);

    this.oStatic_ = [];

    for (i = 0; i < this.paperO_['segments'].length; i++) {
      this.oStatic_[i] = {
        'vector': 0,
        'randOne': Math.random() * 5 + 10,
        'randTwo': Math.random() * .1 + 1.05,
        'point': this.paperO_['segments'][i]['point']
      }
    }
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
ww.mode.AsciiMode.prototype.drawSlash_ = function() {
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
ww.mode.AsciiMode.prototype.init = function() {
  goog.base(this, 'init');

  // Prep paperjs
  this.getPaperCanvas_(true);

  // Variable to modify delta's returned value.
  this.deltaModifier_ = 0;

  // Temporarily float variable to use for randomizing animation effects.
  this.tempFloat = [];

  // Gets the centerpoint of the viewport.
  this.screenCenterX_ = this.width_ / 2;
  this.screenCenterY_ = this.height_ / 2;

  // Variable to store the screen coordinates of the last click/tap/touch.
  this.lastClick_ =
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
ww.mode.AsciiMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  var self = this;
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

// ww.mode.AsciiMode.prototype.didUnfocus = function() {
//   goog.base(this, 'didUnfocus');
// };

/**
 * Handles a browser window resize.
 * @param {Boolean} redraw Whether resize redraws.
 */
ww.mode.AsciiMode.prototype.onResize = function(redraw) {
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
ww.mode.AsciiMode.prototype.copyXY_ = function(paper, xArray, yArray, copy) {
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
ww.mode.AsciiMode.prototype.adjustModifiers_ = function(modifier,
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
};

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
ww.mode.AsciiMode.prototype.modCoords_ = function(source,
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
};

/**
 * Runs code on each requested frame.
 * @param {Integer} delta The timestep variable for animation accuracy.
 */
ww.mode.AsciiMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  var i;

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

    var tempDist;

    /*for (var i = 0; i < this.paperO_['segments'].length; i++) {
      this.oStatic_[i]['vector'] = ((this.paperO_['radius'] -
        this.paperO_['segments'].length) / this.oStatic_[i]['modOne'] +
        this.oStatic_[i]['vector']) / this.oStatic_[i]['modTwo'];
    }*/

    var distanceModifier;
    var origin;
    var vector;
    var vectorX;
    var vectorY;
    var tempPoint;

    for (i = 0; i < this.paperO_['segments'].length; i++) {
      vectorX = this.oPointX_[i] - this.oCenter_['x'];
      vectorY = this.oPointY_[i] - this.oCenter_['y'];
      tempPoint = new paper['Point'](vectorX, vectorY);

      vector = tempPoint['normalize']();

      origin = new paper['Point'](this.oPointX_[i], this.oPointY_[i]);
      tempDist = origin['getDistance'](this.lastClick_);
      distanceModifier = Math.max(tempDist, 50);

      this.paperO_['segments'][i]['point']['x'] = this.oPointX_[i] +
        Math.cos(this.framesRendered_ / 10) * vector['x'] * this.oModifier_ * this.oMultiplier_ / (distanceModifier / this.oRad_);

      this.paperO_['segments'][i]['point']['y'] = this.oPointY_[i] +
        Math.sin(this.framesRendered_ / 10) * vector['y'] * this.oModifier_ * this.oMultiplier_ / (distanceModifier / this.oRad_);
    }


     this.paperO_['smooth']();
    /*this.paperO_['segments'][0]['point']['x'] =
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
      this.oMultiplier_);*/
  } else {
    /*
     * If O hasn't been activated recently enough, restore the original handle
     * coordinates.
     */
    this.copyXY_(this.paperO_, this.oPointX_, this.oPointY_, false);
  }

  asciifyImage(this.paperCanvas_);
};
