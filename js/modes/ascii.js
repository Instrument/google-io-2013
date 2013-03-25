goog.require('ww.mode.Core');
goog.provide('ww.mode.AsciiMode');

/**
 * @constructor
 * @param {Element} containerElem The containing element.
 * @param {String} assetPrefix The containing element.
 */
ww.mode.AsciiMode = function(containerElem, assetPrefix) {
  this.preloadSound('i.mp3');
  this.preloadSound('o.mp3');

  goog.base(this, containerElem, assetPrefix, 'ascii', true, true, true);

  // Prep paperjs
  this.getPaperCanvas_(true);
};
goog.inherits(ww.mode.AsciiMode, ww.mode.Core);

/**
 * Method called when activating the I.
 */
ww.mode.AsciiMode.prototype.activateI = function() {
  goog.base(this, 'activateI');

  this.pushPoints_(this.paperI_, this.lastClick_, 10);

  this.playSound('i.mp3');
};

/**
 * Method called when activating the O.
 */
ww.mode.AsciiMode.prototype.activateO = function() {
  goog.base(this, 'activateO');

  this.pushPoints_(this.paperO_, this.lastClick_, 10);

  this.playSound('o.mp3');
};

/**
 * Function to create and draw I.
 * @private
 */
ww.mode.AsciiMode.prototype.drawI_ = function() {
  if (this.paperI_) {
    this.paperI_['remove']();
  }
  // Create a new paper.js path based on the previous variables.
  var iTopLeft = new paper['Point'](this.iX, this.iY);
  var iSize = new paper['Size'](this.iWidth, this.iHeight);
  var letterI = new paper['Rectangle'](iTopLeft, iSize);
  this.paperI_ = new paper['Path']['Rectangle'](letterI);

  this.paperI_['closed'] = true;

  this.paperI_['vectors'] = [];

  // Add an array of vector points and properties to the object.
  for (var i = 0; i < this.paperI_['segments'].length; i++) {
    var point = this.paperI_['segments'][i]['point']['clone']();
    point = point['subtract'](this.iCenter);

    point['velocity'] = 0;
    point['acceleration'] = Math.random() * 5 + 10;
    point['bounce'] = Math.random() * 0.1 + 1.05;

    this.paperI_['vectors'].push(point);
  }
};

/**
 * Function to fill I with a gradient.
 * @private
 */
ww.mode.AsciiMode.prototype.fillI_ = function() {
  // The stops array: yellow mixes with red between 0 and 15%,
  // 15% to 30% is pure red, red mixes with black between 30% to 100%:
  var stops = [['#000', 0], ['#eee', 1]];

  // Create a linear gradient using the color stops array:
  var gradient = new paper['Gradient'](stops);

  // Left side of the I is the origin of the gradient.
  var from = this.paperI_['position']['clone']();
  from['x'] -= this.iWidth / 2;

  // Right side of the I is the end point of the gradient.
  var to = this.paperI_['position']['clone']();
  to['x'] += this.iWidth / 2;

  // Create the gradient color:
  var gradientColor = new paper['GradientColor'](gradient, from, to);

  this.paperI_['fillColor'] = gradientColor;
};

/**
 * Function to create and draw O.
 * @private
 */
ww.mode.AsciiMode.prototype.drawO_ = function() {
  if (this.paperO_) {
    this.paperO_['remove']();
  }
  // Create a new paper.js path for O based off the previous variables.
  this.paperO_ = new paper['Path']['RegularPolygon'](this.oCenter, 6,
    this.oRad);

  this.paperO_['smooth']();

  this.paperO_['vectors'] = [];

  // Add an array of vector points and properties to the object.
  for (var i = 0; i < this.paperO_['segments'].length; i++) {
    var point = this.paperO_['segments'][i]['point']['clone']();
    point = point['subtract'](this.oCenter);

    point['velocity'] = 0;
    point['acceleration'] = Math.random() * 5 + 10;
    point['bounce'] = Math.random() * 0.1 + 1.05;

    this.paperO_['vectors'].push(point);
  }
};

/**
 * Function to fill O with a gradient.
 * @private
 */
ww.mode.AsciiMode.prototype.fillO_ = function() {
  // The stops array: yellow mixes with red between 0 and 15%,
  // 15% to 30% is pure red, red mixes with black between 30% to 100%:
  var stops = [['#000', 0], ['#eee', 1]];

  // Create a linear gradient using the color stops array:
  var gradient = new paper['Gradient'](stops);

  // Left side of the O is the origin of the gradient.
  var from = this.paperO_['position']['clone']();
  from['x'] -= this.oRad;

  // Right side of the O is the end point of the gradient.
  var to = this.paperO_['position']['clone']();
  to['x'] += this.oRad;

  // Create the gradient color:
  var gradientColor = new paper['GradientColor'](gradient, from, to);

  this.paperO_['fillColor'] = gradientColor;
};

/**
 * Function to create and draw Slash.
 * @private
 */
ww.mode.AsciiMode.prototype.drawSlash_ = function() {
  if (!this.paperSlash_) {
    // Determine the slash's start and end coordinates based on I and O sizes.
    this.slashStart_ = new paper['Point'](this.slashStartX, this.slashStartY);

    this.slashEnd_ = new paper['Point'](this.slashEndX, this.slashEndY);

    // Create a new paper.js path for the slash based on screen dimensions.
    this.paperSlash_ = new paper['Path']();
    this.paperSlash_['strokeWidth'] = this.slashWidth;
    this.paperSlash_['strokeColor'] = '#ebebeb';

    this.paperSlash_['add'](this.slashStart_, this.slashEnd_);
  } else {
    this.slashStart_['x'] = this.slashStartX;
    this.slashStart_['y'] = this.slashStartY;

    this.slashEnd_['x'] = this.slashEndX;
    this.slashEnd_['y'] = this.slashEndY;

    this.paperSlash_['segments'][0]['point'] = this.slashStart_;
    this.paperSlash_['segments'][1]['point'] = this.slashEnd_;

    this.paperSlash_['strokeWidth'] = this.slashWidth;
  }
};

/**
 * Function to size the '13' svg respective to the O size.
 * @param {Object} el The dom element containing the '13' svg.
 * @private
 */
ww.mode.AsciiMode.prototype.draw13_ = function(el) {
  el.css({
    'width': this.oRad * 0.33333333,
    'height': this.oRad * 0.25555556,
    'left': this.oX + (this.oRad * 0.38888889),
    'top': this.oY - this.oRad - (this.oRad * 0.37777778)
  });
};

/**
 * Function to initialize the current mode.
 * Requests a paper canvas and creates paths.
 * Sets initial variables.
 */
ww.mode.AsciiMode.prototype.init = function() {
  goog.base(this, 'init');

  // Create physics world to support stepPhysics.
  this.world_ = this.getPhysicsWorld_();

  // Variable to store the screen coordinates of the last click/tap/touch.
  this.lastClick_ =
    new paper['Point'](this.oX, this.oY);

  if (0 < this.paperCanvas_.height) {
    // Draw Slash.
    this.drawSlash_();

    // Draw I.
    this.drawI_();

    // Draw O.
    this.drawO_();
  }
};

/**
 * Event is called after a mode focused.
 */
ww.mode.AsciiMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  this.$canvas_ = $('#ascii-canvas');
  this.$canvas_.css({'z-index': 3});
  this.canvas_ = this.$canvas_[0];
  this.canvas_.width = this.width_;
  this.canvas_.height = this.height_;

  var self = this;

  // Check to see if the I or O were clicked.
  var evt = ww.util.getPointerEventNames('down', this.name_);
  this.$canvas_.bind(evt, function(e) {
    e.preventDefault();
    e.stopPropagation();

    self.lastClick_ = new paper['Point'](self.getCoords(e)['x'],
      self.getCoords(e)['y']);

    if (self.lastClick_['getDistance'](self.paperO_['position']) < self.oRad) {
      if (self.hasFocus) {
        self.activateO();
      }
    }

    if (Math.abs(self.lastClick_['x'] - self.paperI_['position']['x']) <
      self.iWidth / 2 && Math.abs(self.lastClick_['y'] -
      self.paperI_['position']['y']) <
      self.iHeight / 2) {

      if (self.hasFocus) {
        self.activateI();
      }
    }
  });

  // Check to see if the I or O were moused over.
  var evt2 = ww.util.getPointerEventNames('move', this.name_);
  this.$canvas_.bind(evt2, function(e) {
    e.preventDefault();
    e.stopPropagation();

    var lastPos = new paper['Point'](self.getCoords(e)['x'],
      self.getCoords(e)['y']);

    if (lastPos['getDistance'](self.paperO_['position']) < self.oRad ||
      Math.abs(lastPos['x'] - self.paperI_['position']['x']) <
      self.iWidth / 2 && Math.abs(lastPos['y'] -
      self.paperI_['position']['y']) <
      self.iHeight / 2) {
      if (self.hasFocus) {
        document.getElementById('ascii-canvas').style.cursor = 'pointer';
      }
    } else {
      document.getElementById('ascii-canvas').style.cursor = 'default';
    }
  });
};

/**
 * Event is called after a mode is unfocused.
 */
ww.mode.AsciiMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  var evt = ww.util.getPointerEventNames('down', this.name_);
  this.$canvas_.unbind(evt);

  var evt2 = ww.util.getPointerEventNames('move', this.name_);
  this.$canvas_.unbind(evt2);
};

/**
 * Handles a browser window resize.
 * @param {Boolean} redraw Whether resize redraws.
 */
ww.mode.AsciiMode.prototype.onResize = function(redraw) {
  goog.base(this, 'onResize', false);

  this.setPaperShapeData();

  // Draw Slash.
  this.drawSlash_();

  // Draw I.
  this.drawI_();

  // Draw O.
  this.drawO_();

  if (redraw) {
    this.redraw();
  }
};

/**
 * Updates point vectors based on click/tap position.
 * @param {Object} path The path to modify.
 * @param {Object} clickPoint The coordinates of the most recent click/tap.
 * @param {Number} speed Affects the speed of the animation.
 * @private
 */
ww.mode.AsciiMode.prototype.pushPoints_ = function(path, clickPoint, speed) {
  for (var i = 0; i < path['vectors'].length; i++) {
    var point = path['vectors'][i];
    var vector;
    var distance;

    if (path === this.paperO_) {
      vector = point['add'](this.oCenter);
      vector = vector['subtract'](clickPoint);
      distance = Math.max(0, this.oRad - vector['length']);
    } else {
      vector = point['add'](this.iCenter);
      vector = vector['subtract'](clickPoint);
      distance = Math.max(0, this.iWidth - vector['length']);
    }

    point['length'] += Math.max(distance * 4, 100);
    point['velocity'] += speed;
    point['velocity'] = Math.min(5, point['velocity']);
  }
};

/**
 * Updates point vectors based on their length and velocity values.
 * @param {Object} path The path to modify.
 * @private
 */
ww.mode.AsciiMode.prototype.updateVectors_ = function(path) {
  for (var i = 0; i < path['segments'].length; i++) {
    var point = path['vectors'][i];
    var tempPoint = new paper['Point'](this.iX, this.iY);

    if (path === this.paperO_) {
      point['velocity'] = ((this.oRad - point['length']) /
        point['acceleration'] + point['velocity']) / point['bounce'];
    } else {
      point['velocity'] = ((tempPoint['getDistance'](this.iCenter) -
        point['length']) / point['acceleration'] + point['velocity']) /
        point['bounce'];
    }

    point['length'] = Math.max(0, point['length'] + point['velocity']);
  }
};

/**
 * Updates point coordinates based on their vectors.
 * @param {Object} path The path to modify.
 * @private
 */
ww.mode.AsciiMode.prototype.updatePoints_ = function(path) {
  for (var i = 0; i < path['segments'].length; i++) {
    var point = path['vectors'][i];

    var newPoint = point['clone']();

    if (path === this.paperO_) {
      this.paperO_['segments'][i]['point'] = newPoint['add'](this.oCenter);
      this.paperO_['smooth']();
    } else {
      this.paperI_['segments'][i]['point'] = newPoint['add'](this.iCenter);
    }
  }
};

/**
 * On each physics tick, update vectors.
 * @param {Float} delta Time since last tick.
 */
ww.mode.AsciiMode.prototype.stepPhysics = function(delta) {
  goog.base(this, 'stepPhysics', delta);

  if (this.paperI_ && this.paperO_) {
    this.fillI_();
    this.fillO_();

    this.updateVectors_(this.paperI_);
    this.updatePoints_(this.paperI_);

    this.updateVectors_(this.paperO_);
    this.updatePoints_(this.paperO_);
  }
};

/**
 * Runs code on each requested frame.
 * @param {Number} delta Ms since last draw.
 */
ww.mode.AsciiMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  this.asciifyCanvas_(this.paperCanvas_);
};


/**
 * Rewritten, but based on blog post/source code with the following license:
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk,
 *  http://blog.nihilogic.dk/
 * MIT License [http://www.nihilogic.dk/licenses/mit-license.txt]
 */

var aDefaultCharList = (' .[]{}@!=-$%^&();:\',golei2013').split('');
// var aDefaultCharList = (" .,:;i1tfLCG08@").split("");

/**
 * Convert img element to ascii.
 * @private
 * @param {Element} sourceCanvas Source image canvas.
 * @return {String} strChars The string of characters to output.
 */
ww.mode.AsciiMode.prototype.asciifyCanvas_ = function(sourceCanvas) {
  var oAscii = document.getElementById('ascii-canvas');
  var aCharList = aDefaultCharList;

  if (!sourceCanvas.width || sourceCanvas.width < 1) { return; }
  if (!sourceCanvas.height || sourceCanvas.height < 1) { return; }

  var iWidth = sourceCanvas.width;
  var iHeight = sourceCanvas.height;

  var oCtx = sourceCanvas.getContext('2d');
  var sourceCanvasData = oCtx.getImageData(0, 0, iWidth, iHeight).data;

  oCtx.clearRect(0, 0, sourceCanvas.width + 1, sourceCanvas.height + 1);

  var strChars = '';
  var strChars2 = '';
  var strChars3 = '';

  for (var y = 0; y < iHeight; y += 16) {
    for (var x = 0; x < iWidth; x += 8) {
      var iOffset = (y * iWidth + x) * 4;

      var iRed = sourceCanvasData[iOffset];
      var iGreen = sourceCanvasData[iOffset + 1];
      var iBlue = sourceCanvasData[iOffset + 2];
      var iAlpha = sourceCanvasData[iOffset + 3];

      var iCharIdx;
      if (iAlpha === 0) {
        iCharIdx = 0;
      } else {
        var fBrightness = (0.3 * iRed + 0.59 * iGreen + 0.11 * iBlue) / 255;
        iCharIdx = (aCharList.length - 1) - Math.round(fBrightness *
          (aCharList.length - 1));
      }

      var strThisChar = aCharList[iCharIdx];

      if (strThisChar == ' ') {
        strThisChar = '&nbsp;';
      }

      strChars += strThisChar;
    }
    strChars += '\n';
  }

  oAscii.innerHTML = strChars;

  return strChars;
};
