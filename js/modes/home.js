goog.require('ww.mode.Core');
goog.provide('ww.mode.HomeMode');

/**
 * @constructor
 */
ww.mode.HomeMode = function() {
  goog.base(this, 'home', true, true);

  this.setupPatternMatchers_();

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

  var matched = this.runMatchers_();
  if (matched) {
    this.log('matched', matched);

    if (matched.isPartial) {
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

ww.mode.HomeMode.prototype.activateI = function() {
  this.addCharacter_('1');
};

ww.mode.HomeMode.prototype.activateO = function() {
  this.addCharacter_('0');
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

  /**
   * Floats that increment when objects are clicked. Used to adjust paths.
   */
  this.iModifier = 0;
  this.oModifier = 0;

  /**
   * Gets the width of the viewport and its center point.
   */
  this.screenWidthPixels = window.innerWidth;
  this.screenHeightPixels = window.innerHeight;
  this.screenCenterX = this.screenWidthPixels / 2;
  this.screenCenterY = this.screenHeightPixels / 2;

  this.mouseX = this.screenCenterX;
  this.mouseY = this.screenCenterY;

  /**
   * Create the letter I.
   */
  var iWidth = 100;
  var iHeight = 200;
  var iX = this.screenCenterX - (this.screenWidthPixels / 8);
  var iY = this.screenCenterY - iHeight / 2;

  var iTopLeft = new paper['Point'](iX, iY);
  var iSize = new paper['Size'](iWidth, iHeight);
  this.letterI = new paper['Rectangle'](iTopLeft, iSize);
  this.paperI = new paper['Path']['Rectangle'](this.letterI);
  this.paperI['fillColor'] = '#F2B50F';
  // this.paperI['fullySelected'] = true;

  this.iHandleInX = [];
  this.iHandleInY = [];
  this.iHandleOutX = [];
  this.iHandleOutY = [];
  for (var i = 0; i < this.paperI['segments'].length; i++) {
    this.iHandleInX[i] = this.paperI['segments'][i]['handleIn']['_x'];
    this.iHandleInY[i] = this.paperI['segments'][i]['handleIn']['_y'];
    this.iHandleOutX[i] = this.paperI['segments'][i]['handleOut']['_x'];
    this.iHandleOutY[i] = this.paperI['segments'][i]['handleOut']['_y'];
  }

  /**
   * Create the letter O.
   */
  var oRad = 100;
  var oX = this.screenCenterX + (this.screenWidthPixels / 8);
  var oY = this.screenCenterY;

  var oCenter = new paper['Point'](oX, oY);
  this.paperO = new paper['Path']['Circle'](oCenter, oRad);
  this.paperO['fillColor'] = '#00933B';

  this.oHandleInX = [];
  this.oHandleInY = [];
  this.oHandleOutX = [];
  this.oHandleOutY = [];
  for (var i = 0; i < this.paperO['segments'].length; i++) {
    this.oHandleInX[i] = this.paperO['segments'][i]['handleIn']['_x'];
    this.oHandleInY[i] = this.paperO['segments'][i]['handleIn']['_y'];
    this.oHandleOutX[i] = this.paperO['segments'][i]['handleOut']['_x'];
    this.oHandleOutY[i] = this.paperO['segments'][i]['handleOut']['_y'];
  }
};

ww.mode.HomeMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  var self = this;
  var canvas = this.getPaperCanvas_();
  var evt = Modernizr['touch'] ? 'touchmove' : 'mousemove';
  var tempPoint;

  var tool = new paper['Tool']();

  tool['onMouseDown'] = function(event) {
    tempPoint = { x: self.paperO['position']['_x'], y: self.paperO['position']['_y'] };
    if (event['point']['getDistance'](tempPoint) < self.paperO['bounds']['width'] / 2) {
      if (self.oModifier < 5) {
        self.oModifier += 30;
      } else {
        self.oModifier += 2;
      }
    }

    if (self.paperI['hitTest'](event['point'])) {
      if (self.iModifier < 5) {
        self.iModifier += 5;
      } else {
        self.iModifier += 1;
      }
    }
  }

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

  if (this.iModifier > 1) {
    this.iModifier -= .1;

    for (var i = 0; i < this.paperO['segments'].length; i++) {
      this.paperI['segments'][i]['handleIn']['_x'] = this.iHandleInX[i]
        + Math.cos(this.iModifier) * this.iModifier;
      this.paperI['segments'][i]['handleIn']['_y'] = this.iHandleInY[i]
        + Math.sin(this.iModifier) * this.iModifier;

      this.paperI['segments'][i]['handleOut']['_x'] = this.iHandleOutX[i]
        - Math.cos(this.iModifier) * this.iModifier;
      this.paperI['segments'][i]['handleOut']['_y'] = this.iHandleOutY[i]
        - Math.sin(this.iModifier) * this.iModifier;
    }
  } else {
    for (var i = 0; i < this.paperO['segments'].length; i++) {
      this.paperI['segments'][i]['handleIn']['_x'] = this.iHandleInX[i];
      this.paperI['segments'][i]['handleIn']['_y'] = this.iHandleInY[i];

      this.paperI['segments'][i]['handleOut']['_x'] = this.iHandleOutX[i];
      this.paperI['segments'][i]['handleOut']['_y'] = this.iHandleOutY[i];
    }
  }

  if (this.oModifier > 1) {
    this.oModifier -= .1;

    for (var i = 0; i < this.paperO['segments'].length; i++) {
      this.paperO['segments'][i]['handleIn']['_x'] = this.oHandleInX[i]
        + Math.cos(this.oModifier) * this.oModifier;
      this.paperO['segments'][i]['handleIn']['_y'] = this.oHandleInY[i]
        + Math.sin(this.oModifier) * this.oModifier;

      this.paperO['segments'][i]['handleOut']['_x'] = this.oHandleOutX[i]
        - Math.cos(this.oModifier) * this.oModifier;
      this.paperO['segments'][i]['handleOut']['_y'] = this.oHandleOutY[i]
        - Math.sin(this.oModifier) * this.oModifier;
    }
  } else {
    for (var i = 0; i < this.paperO['segments'].length; i++) {
      this.paperO['segments'][i]['handleIn']['_x'] = this.oHandleInX[i];
      this.paperO['segments'][i]['handleIn']['_y'] = this.oHandleInY[i];

      this.paperO['segments'][i]['handleOut']['_x'] = this.oHandleOutX[i];
      this.paperO['segments'][i]['handleOut']['_y'] = this.oHandleOutY[i];
    }
  }
};