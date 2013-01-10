goog.require('ww.mode.Core');
goog.require('ww.util');
goog.provide('ww.mode.HomeMode');

/**
 * @constructor
 */
ww.mode.HomeMode = function() {
  goog.base(this, 'home', true, true);

  this.setupPatternMatchers_();
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

  this.currentPattern_ = "";
  this.maxPatternLength_ = 15;
};
goog.inherits(ww.mode.HomeMode, ww.mode.Core);

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
ww.mode.Core.prototype.playProcessedAudio = function(filename, filter) {
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

ww.mode.HomeMode.prototype.activateI = function() {
  this.iClicked = true;
  if (this.iMultiplier < 10) {
    this.iMultiplier += 2;
  }

  this.playProcessedAudio('boing.wav', this.chorus);

  this.addCharacter_('1');
};

ww.mode.HomeMode.prototype.activateO = function() {
  this.oClicked = true;
  if (this.oMultiplier < 10) {
    this.oMultiplier += 2;
  }

  this.playProcessedAudio('boing.wav', this.delay);

  this.addCharacter_('0');
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
        binaryPattern: pad(mode.pattern.toString(2), mode.len)
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
          matcher: mode.binaryPattern.slice(0, i + 1),
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
  this.currentPattern_ += str;

  if (this.currentPattern_.length > this.maxPatternLength_) {
    this.currentPattern_ = this.currentPattern_.slice(-this.maxPatternLength_, this.currentPattern_.length);
  }

  this.log('current pattern: ' + this.currentPattern_);
  $('#pattern').text(this.currentPattern_);

  var matched = this.runMatchers_();
  if (matched) {
    this.log('matched', matched);

    if (true || matched.isPartial) {
      // Highlight partial match in UI?
    } else {
      this.goToMode_(matched.key);
    }
  }
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
    var lastXChars = this.currentPattern_.slice(-matcher.matcher.length, this.currentPattern_.length);

    if (lastXChars.indexOf(matcher.matcher) > -1) {
      matches.push({
        matcher: matcher,
        len: matcher.matcher.length,
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
  this.sendMessage_('goToMode', key);
};

/**
 * Function to initialize the current mode.
 * Requests a paper canvas and creates paths.
 * Sets initial variables.
 */
ww.mode.HomeMode.prototype.init = function() {
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

ww.mode.HomeMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  var self = this;
  var canvas = this.getPaperCanvas_();
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

  $(canvas).bind(evt, function(e){
    e.preventDefault();
    e.stopPropagation();

    self.mouseX = e.pageX;
    self.mouseY = e.pageY;
  });
};

ww.mode.HomeMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  var canvas = this.getPaperCanvas_();
  var evt = Modernizr['touch'] ? 'touchmove' : 'mousemove';

  $(canvas).unbind(evt);
};

/**
 * Runs code on each requested frame.
 * @param {Integer} delta The timestep variable for animation accuracy.
 */
ww.mode.HomeMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  // Generic iterator.
  var i;

  /*
   * Delta is initially a very small float. Need to modify it for it to have a
   * stronger effect.
   */
  this.deltaModifier = (delta / 100);

  /*
   * Run the following code if the letter I is activated.
   */
  if (this.iClicked == true) {

    if (this.iModifier < this.deltaModifier * 10000 &&
      this.iIncrement == true) {      
        this.iModifier += this.deltaModifier * 1000;
    } else if (this.iMultiplier > 1) {
      if (this.iModifier < this.deltaModifier * 10000) {
        this.iModifier += this.deltaModifier * 100;
      }
      if (this.iMultiplier > 1) {
        this.iMultiplier -= .1;
      } else {
        this.iMultiplier = 1;
      }
    } else {
      this.iIncrement = false;
      this.iModifier -= this.deltaModifier * 1000;
      if (this.iMultiplier > 1) {
        this.iMultiplier -= .1;
      } else {
        this.iMultiplier = 1;
      }
    }

    if (this.iModifier < this.deltaModifier * 1000) {
      this.iClicked = false;
      this.iIncrement = true;
      this.iMultiplier = 1;
    }

    /*
     * Loop through each path segment on the letter I and move each point's
     * handles based on time as being evaluated by Sine and Cosine.
     */
    for (this.i = 0; this.i < this.paperI['segments'].length; this.i++) {
      this.tempFloat = ww.util.floatComplexGaussianRandom();

      this.paperI['segments'][this.i]['point']['_x'] = this.iPointX[this.i]
        + Math.cos(this.framesRendered_ / 10)
        * this.iModifier * this.iMultiplier * this.tempFloat[0];

      this.paperI['segments'][this.i]['point']['_y'] = this.iPointY[this.i]
        + Math.sin(this.framesRendered_ / 10)
        * this.iModifier * this.iMultiplier * this.tempFloat[1];
    }

  } else {

    /*
     * If I hasn't been activated recently enough, restore the original handle
     * coordinates.
     */
    for (this.i = 0; this.i < this.paperO['segments'].length; this.i++) {
      this.paperI['segments'][this.i]['point']['_x'] = this.iPointX[this.i];
      this.paperI['segments'][this.i]['point']['_y'] = this.iPointY[this.i];
    }

  }

  /*
   * Run the following code if the letter O is activated.
   */
  if (this.oClicked == true) {

    if (this.oModifier < this.deltaModifier * 10000 &&
      this.oIncrement == true) {      
        this.oModifier += this.deltaModifier * 1000;
    } else if (this.oMultiplier > 1) {
      if (this.oModifier < this.deltaModifier * 10000) {
        this.oModifier += this.deltaModifier * 100;
      }
      if (this.oMultiplier > 1) {
        this.oMultiplier -= .1;
      } else {
        this.oMultiplier = 1;
      }
    } else {
      this.oIncrement = false;
      this.oModifier -= this.deltaModifier * 1000;
      if (this.oMultiplier > 1) {
        this.oMultiplier -= .1;
      } else {
        this.oMultiplier = 1;
      }
    }

    // If oModifier drops too low, reset variables to their default state.
    if (this.oModifier < this.deltaModifier * 1000) {
      this.oClicked = false;
      this.oIncrement = true;
      this.oMultiplier = 1;
    }

    this.delay['feedback'] = this.oMultiplier / 10;

    /*
     * Loop through each path segment on the letter O and move each point's
     * handles based on time as being evaluated by Sine and Cosine.
     */
    for (this.i = 0; this.i < this.paperO['segments'].length; this.i++) {
      this.tempFloat = ww.util.floatComplexGaussianRandom();

      this.paperO['segments'][this.i]['handleIn']['_x'] =
        this.oHandleInX[this.i] + Math.cos(this.framesRendered_ / 10 * this.tempFloat[0])
        * this.oModifier * this.oMultiplier;
      this.paperO['segments'][this.i]['handleIn']['_y'] =
        this.oHandleInY[this.i] + Math.sin(this.framesRendered_ / 10 * this.tempFloat[0])
        * this.oModifier * this.oMultiplier;

      this.paperO['segments'][this.i]['handleOut']['_x'] =
        this.oHandleOutX[this.i] - Math.cos(this.framesRendered_ / 10 * this.tempFloat[0])
        * this.oModifier * this.oMultiplier;
      this.paperO['segments'][this.i]['handleOut']['_y'] =
        this.oHandleOutY[this.i] - Math.sin(this.framesRendered_ / 10 * this.tempFloat[0])
        * this.oModifier * this.oMultiplier;

      this.paperO['segments'][this.i]['point']['_x'] = this.oPointX[this.i]
        - Math.sin(this.framesRendered_ / 10 * this.tempFloat[0])
        * this.oModifier * this.oMultiplier;

      this.paperO['segments'][this.i]['point']['_y'] = this.oPointY[this.i]
        - Math.cos(this.framesRendered_ / 10 * this.tempFloat[0])
        * this.oModifier * this.oMultiplier;
    }

  } else {

    /*
     * If O hasn't been activated recently enough, restore the original handle
     * coordinates.
     */
    for (this.i = 0; this.i < this.paperO['segments'].length; this.i++) {
      this.paperO['segments'][this.i]['handleIn']['_x'] =
        this.oHandleInX[this.i];
      this.paperO['segments'][this.i]['handleIn']['_y'] =
        this.oHandleInY[this.i];

      this.paperO['segments'][this.i]['handleOut']['_x'] =
        this.oHandleOutX[this.i];
      this.paperO['segments'][this.i]['handleOut']['_y'] =
        this.oHandleOutY[this.i];

      this.paperO['segments'][this.i]['point']['_x'] = this.oPointX[this.i];
      this.paperO['segments'][this.i]['point']['_y'] = this.oPointY[this.i];
    }

  }

};