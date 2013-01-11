goog.require('ww.mode.Core');
goog.require('ww.util');
goog.provide('ww.mode.SpaceMode');

/**
 * @constructor
 */
ww.mode.SpaceMode = function() {
  goog.base(this, 'space', true, false, true);

  this.getAudioContext_();

  var tuna = new Tuna(this.audioContext_);

  /**
   * Create a delay audio filter. Value ranges are as follows.
   * feedback: 0 to 1+
   * delayTime: how many milliseconds should the wet signal be delayed?
   * wetLevel: 0 to 1+
   * dryLevel: 0 to 1+
   * cutoff: cutoff frequency of the built in highpass-filter. 20 to 22050
   * bypass: the value 1 starts the effect as bypassed, 0 or 1
   */
  this.delay = new tuna['Delay']({
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
  this.chorus = new tuna['Chorus']({
    rate: 0.01,
    feedback: 0.2,
    delay: 0,
    bypass: 0
  });

  this.currentPattern_ = '';
  this.maxPatternLength_ = 15;
};
goog.inherits(ww.mode.SpaceMode, ww.mode.Core);

function pad(number, length) {
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}

/**
 * Play a sound by url after being processed by Tuna.
 * @param {String} filename Audio file name.
 * @param {Object} filter Audio filter name.
 */
ww.mode.SpaceMode.prototype.playProcessedAudio = function(filename, filter) {
  if (!this.wantsAudio_) { return; }

  var url = '../sounds/' + this.name_ + '/' + filename;

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

ww.mode.SpaceMode.prototype.activateI = function() {
  this.iClicked = true;
  if (this.iMultiplier < 10) {
    this.iMultiplier += 2;
  }

  // this.playProcessedAudio('boing.wav', this.chorus);
};

ww.mode.SpaceMode.prototype.activateO = function() {
  this.oClicked = true;
  if (this.oMultiplier < 10) {
    this.oMultiplier += 2;
  }

  // this.playProcessedAudio('boing.wav', this.delay);
};

/**
 * Function to initialize the current mode.
 * Requests a paper canvas and creates paths.
 * Sets initial variables.
 */
ww.mode.SpaceMode.prototype.init = function() {
  goog.base(this, 'init');

  // Prep paperjs
  this.getPaperCanvas_();

  // Variable to modify delta's returned value.
  this.deltaModifier = 0;

  // Temporarily float variable to use for randomizing animation effects.
  this.tempFloat = [];

  // Generic iterator.
  this.i = 0;

  /**
   * Gets the width of the viewport and its center point.
   */
  this.screenCenterX = this.width_ / 2;
  this.screenCenterY = this.height_ / 2;

  this.mouseX = this.screenCenterX;
  this.mouseY = this.screenCenterY;

  // Variable to store the screen coordinates of the last click/tap/touch.
  this.lastClick =
    new paper['Point'](this.screenCenterX, this.screenCenterY);

  /**
   * Create a star field.
   */
  this.world = this.getPhysicsWorld_();
  this.world['viscosity'] = 0;

  for (this.i = 0; this.i < 200; this.i++) {
    this.tempFloat = ww.util.floatComplexGaussianRandom();
    this.world['particles'].push(new Particle(this.tempFloat[0] * this.width_,
      this.tempFloat[1] * this.height_));
    this.world['particles'][this.i]['setRadius'](Math.random(this.width_ * 0.0277778));
    this.world['particles'][this.i]['vel']['x'] = 10;
    this.world['particles'][this.i]['vel']['y'] = 0;
  }

  /**
   * Create the letter I.
   */
  // Boolean that sets to true if I is being activated.
  this.iClicked = false;

  // Boolean that sets to false if I has been activated but delta is too high.
  this.iIncrement = true;

  // Float that increments by delta when I is activated to affect animation.
  this.iModifier = 0;

  // Float that increments on each activation of I to affect animation further.
  this.iMultiplier = 1;

  // Set I's initial dimensions.
  var iWidth = this.width_ * .175;
  var iHeight = iWidth * 2.12698413;

  // Set coordinates for I's upper left corner.
  var iX = this.screenCenterX - iWidth * 1.5;
  var iY = this.screenCenterY - iHeight / 2;

  // Create a new paper.js path based on the previous variables.
  var iTopLeft = new paper['Point'](iX, iY);
  var iSize = new paper['Size'](iWidth, iHeight);
  this.letterI = new paper['Rectangle'](iTopLeft, iSize);
  this.paperI = new paper['Path']['Rectangle'](this.letterI);
  this.paperI['fillColor'] = '#11a860';
  // this.paperI['fullySelected'] = true;

  /*// Create a series of additional points within I's path segments.
  for (this.i = 0; this.i < iLength; this.i += 2) {
    var tempX = (this.paperI['segments'][this.i]['next']['point']['_x']
      - this.paperI['segments'][this.i]['point']['_x']) + iX;

    var tempY = (this.paperI['segments'][this.i]['next']['point']['_y']
      - this.paperI['segments'][this.i]['point']['_y']) + iY;

    this.paperI['insert'](this.i, new paper['Point'](tempX, tempY));
  }
*/
  // Create arrays to store the original coordinates for I's path points.
  this.iPointX = [];
  this.iPointY = [];

  for (this.i = 0; this.i < this.paperI['segments'].length; this.i++) {
    this.iPointX.push(this.paperI['segments'][this.i]['point']['_x']);
    this.iPointY.push(this.paperI['segments'][this.i]['point']['_y']);
  }

  /**
   * Create the letter O.
   */
  // Boolean that sets to true if O is being activated.
  this.oClicked = false;

  // Boolean that sets to false if O has been activated but delta is too high.
  this.oIncrement = true;

  // Float that increments by delta when O is activated to affect animation.
  this.oModifier = 0;

  // Float that increments on each activation of O to affect animation further.
  this.oMultiplier = 1;

  // Set O's radius.
  this.oRad = this.width_ * 0.1944444444;

  // Set O's initial scale.
  this.oScale = 1;

  // Set O's coordinates.
  var oX = this.screenCenterX + this.oRad;
  var oY = this.screenCenterY;

  // Create a new paper.js path for O based off the previous variables.
  var oCenter = new paper['Point'](oX, oY);
  this.paperO = new paper['Path']['Circle'](oCenter, this.oRad);
  this.paperO['fillColor'] = '#3777e2';

  // Create arrays to store the original coordinates for O's path point handles.
  this.oHandleInX = [];
  this.oHandleInY = [];
  this.oHandleOutX = [];
  this.oHandleOutY = [];

  this.oPointX = [];
  this.oPointY = [];

  for (this.i = 0; this.i < this.paperO['segments'].length; this.i++) {
    this.oHandleInX.push(this.paperO['segments'][this.i]['handleIn']['_x']);
    this.oHandleInY.push(this.paperO['segments'][this.i]['handleIn']['_y']);
    this.oHandleOutX.push(this.paperO['segments'][this.i]['handleOut']['_x']);
    this.oHandleOutY.push(this.paperO['segments'][this.i]['handleOut']['_y']);
  }

  for (this.i = 0; this.i < this.paperO['segments'].length; this.i++) {
    this.oPointX.push(this.paperO['segments'][this.i]['point']['_x']);
    this.oPointY.push(this.paperO['segments'][this.i]['point']['_y']);
  }

  /**
   * Create the slash.
   */
  var slashStart = new paper['Point'](this.screenCenterX + this.oRad / 8,
    this.screenCenterY - (iHeight / 2) - ((iHeight * 1.5) * 0.17475728));
  var slashEnd = new paper['Point'](iX + iWidth,
    this.screenCenterY + (iHeight / 2) + ((iHeight * 1.5) * 0.17475728));

  this.paperSlash = new paper['Path'];
  this.paperSlash['strokeWidth'] = this.width_ * 0.01388889;
  this.paperSlash['strokeColor'] = '#ebebeb';

  this.paperSlash['add'](slashStart, slashEnd);
};

ww.mode.SpaceMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  this.$canvas_ = $('#space-canvas');
  this.canvas_ = this.$canvas_[0];
  this.canvas_.width = this.width_;
  this.canvas_.height = this.height_;
  this.ctx_ = this.canvas_.getContext('2d');

  var self = this;

  var evt = Modernizr['touch'] ? 'touchmove' : 'mousemove';
  var tempPoint;

  var tool = new paper['Tool']();

  tool['onMouseDown'] = function(event) {
    self.lastClick = event['point'];
    if (self.paperO['hitTest'](event['point'])) {
      self.activateO();
    }

    if (self.paperI['hitTest'](event['point'])) {
      self.activateI();
    }
  };

  $(canvas).bind(evt, function(e) {
    e.preventDefault();
    e.stopPropagation();

    self.mouseX = e.pageX;
    self.mouseY = e.pageY;
  });
};

ww.mode.SpaceMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  var canvas = this.getPaperCanvas_();
  var evt = Modernizr['touch'] ? 'touchmove' : 'mousemove';

  $(canvas).unbind(evt);
};

/**
 * On each physics tick, adjust star positions.
 * @param {Float} delta Time since last tick.
 */
ww.mode.SpaceMode.prototype.stepPhysics = function(delta) {
  goog.base(this, 'stepPhysics', delta);
  
  // Move star positions right and also adjust them based on mouse position.
  for (this.i = 0; this.i < this.world['particles'].length; this.i++) {
    this.world['particles'][this.i]['pos']['x'] +=
      (1 + this.screenCenterX - this.mouseX);

    this.world['particles'][this.i]['pos']['y'] +=
      (this.screenCenterY - this.mouseY);
  }
};

/**
 * Runs code on each requested frame.
 * @param {Integer} delta The timestep variable for animation accuracy.
 */
ww.mode.SpaceMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);
  console.log('frame');

  if (!this.canvas_) { return; }

  this.ctx_.clearRect(0, 0, this.canvas_.width + 1, this.canvas_.height + 1);

  this.ctx_.fillStyle = '#fff';

  this.ctx_.beginPath();

  for (this.i = 0; this.i < this.world['particles'].length; this.i++) {
    this.ctx_.arc(this.world['particles'][this.i]['pos']['x'],
      this.world['particles'][this.i]['pos']['y'],
      this.world['particles'][this.i]['radius'], 0, Math.PI * 2);
    console.log(this.world['particles'][this.i]);
  }

  this.ctx_.fill();
};
