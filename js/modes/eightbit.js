goog.require('ww.mode.Core');
goog.provide('ww.mode.EightBitMode');

/**
 * @constructor
 * @param {Element} containerElem The containing element.
 * @param {String} assetPrefix The containing element.
 */
ww.mode.EightBitMode = function(containerElem, assetPrefix) {
  this.preloadSound('i.wav');
  this.preloadSound('o.wav');

  goog.base(this, containerElem, assetPrefix, 'eightbit', true, true, true);
};
goog.inherits(ww.mode.EightBitMode, ww.mode.Core);

/**
 * Method called when activating the I.
 */
ww.mode.EightBitMode.prototype.activateI = function() {
  goog.base(this, 'activateI');

  this.pushPoints_(this.paperI_, this.lastClick_, 10);

  this.playSound('i.wav');
};

/**
 * Method called when activating the O.
 */
ww.mode.EightBitMode.prototype.activateO = function() {
  goog.base(this, 'activateO');

  this.pushPoints_(this.paperO_, this.lastClick_, 10);

  this.playSound('o.wav');
};

/**
 * Function to create and draw I.
 * @private
 */
ww.mode.EightBitMode.prototype.drawI_ = function() {
  if (!this.paperI_) {
    // Create a new paper.js path based on the previous variables.
    var iTopLeft = new paper['Point'](this.iX, this.iY);
    var iSize = new paper['Size'](this.iWidth, this.iHeight);
    var letterI = new paper['Rectangle'](iTopLeft, iSize);
    this.paperI_ = new paper['Path']['Rectangle'](letterI);

    this.paperI_['closed'] = true;

    this.paperI_['vectors'] = [];

    for (var i = 0; i < this.paperI_['segments'].length; i++) {
      var point = this.paperI_['segments'][i]['point']['clone']();
      point = point['subtract'](this.iCenter);

      point['velocity'] = 0;
      point['acceleration'] = Math.random() * 5 + 10;
      point['bounce'] = Math.random() * .1 + 1.05;

      this.paperI_['vectors'].push(point);
    }
  } else {
    // Change the position based on new screen size values.
    this.paperI_['position'] = this.iCenter;

    // Change the scale based on new screen size values.
    this.paperI_['scale'](this.iWidth / this.paperI_['bounds']['width']);
  }
};

/**
 * Function to fill I with a gradient.
 * @private
 */
ww.mode.EightBitMode.prototype.fillI_ = function() {
  // The stops array: yellow mixes with red between 0 and 15%,
  // 15% to 30% is pure red, red mixes with black between 30% to 100%:
  var stops = [['#4487fc', 0], ['#826eb1', 1]];

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
ww.mode.EightBitMode.prototype.drawO_ = function() {
  if (this.paperO_) {
    this.paperO_['remove']();
  }
  // Create a new paper.js path for O based off the previous variables.
  this.paperO_ = new paper['Path']['RegularPolygon'](this.oCenter, 6,
    this.oRad);

  this.paperO_['vectors'] = [];

  for (var i = 0; i < this.paperO_['segments'].length; i++) {
    var point = this.paperO_['segments'][i]['point']['clone']();
    point = point['subtract'](this.oCenter);

    point['velocity'] = 0;
    point['acceleration'] = Math.random() * 5 + 10;
    point['bounce'] = Math.random() * .1 + 1.05;

    this.paperO_['vectors'].push(point);
  }
};

/**
 * Function to fill O with a gradient.
 * @private
 */
ww.mode.EightBitMode.prototype.fillO_ = function() {
  // The stops array: yellow mixes with red between 0 and 15%,
  // 15% to 30% is pure red, red mixes with black between 30% to 100%:
  var stops = [['#93689c', 0], ['#df4a40', 1]];

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
ww.mode.EightBitMode.prototype.drawSlash_ = function() {
  var pctx = this.paperCanvas_.getContext('2d');

  // Determine the slash's start and end coordinates based on I and O sizes.
  pctx.strokeStyle = '#e5e5e5';
  pctx.lineWidth = this.slashWidth;

  pctx.beginPath();

  pctx.moveTo(this.slashStartX, this.slashStartY);
  pctx.lineTo(this.slashEndX, this.slashEndY);

  pctx.stroke();
};

/**
 * Function to initialize the current mode.
 * Requests a paper canvas and creates paths.
 * Sets initial variables.
 */
ww.mode.EightBitMode.prototype.init = function() {
  goog.base(this, 'init');

  // Create physics world to support stepPhysics.
  this.world_ = this.getPhysicsWorld_();

  // Prep paperjs
  this.getPaperCanvas_();

  // Gets the centerpoint of the viewport.
  this.screenCenterX_ = this.width_ / 2;
  this.screenCenterY_ = this.height_ / 2;

  if (this.canvas_) {
    this.canvas_.width = this.width_;
    this.canvas_.height = this.height_;
  }

  // Variable to store the screen coordinates of the last click/tap/touch.
  this.lastClick_ =
    new paper['Point'](this.oX, this.oY);
  
  if (0 < this.paperCanvas_.height) {
    // Draw I.
    this.drawI_();

    // Draw O.
    this.drawO_();
  }
};

/**
 * Event is called after a mode focused.
 */
ww.mode.EightBitMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  var self = this;

  var oSize;
  var iSizeX;
  var iSizeY;
  var distX;
  var distY;

  var evt = this.getPointerEventNames_('down', this.name_);

  $(this.paperCanvas_).bind(evt, function(event) {
    self.lastClick_ = new paper['Point'](self.getCoords(event)['x'],
      self.getCoords(event)['y']);
    oSize = Math.round(self.width_ * 0.03125) + self.oRad;
    iSizeX = Math.round(self.width_ * 0.03125) + self.iWidth / 2;
    iSizeY = Math.round(self.width_ * 0.03125) + self.iHeight / 2;

    distX = Math.abs(self.paperI_['position']['x'] - self.lastClick_['x']);
    distY = Math.abs(self.paperI_['position']['y'] - self.lastClick_['y']);

    if (self.paperO_['position']['getDistance'](self.lastClick_) < oSize) {
      if (self.hasFocus) {
        self.activateO();
      }
    }

    if (distX < iSizeX && distY < iSizeY) {
      if (self.hasFocus) {
        self.activateI();
      }
    }
  });

  var evt2 = this.getPointerEventNames_('move', this.name_);

  var lastPos = new paper['Point'](0, 0);

  $(this.paperCanvas_).bind(evt2, function(event) {
    lastPos = {'x': self.getCoords(event)['x'],
      'y': self.getCoords(event)['y']};
    oSize = Math.round(self.width_ * 0.03125) + self.oRad;
    iSizeX = Math.round(self.width_ * 0.03125) + self.iWidth / 2;
    iSizeY = Math.round(self.width_ * 0.03125) + self.iHeight / 2;

    distX = Math.abs(self.paperI_['position']['x'] - lastPos['x']);
    distY = Math.abs(self.paperI_['position']['y'] - lastPos['y']);

    if (self.paperO_['position']['getDistance'](lastPos) < oSize) {
      if (self.hasFocus) {
        document.body.style.cursor = 'pointer';
      }
    } else if (distX < iSizeX && distY < iSizeY) {
      if (self.hasFocus) {
        document.body.style.cursor = 'pointer';
      }
    } else {
      document.body.style.cursor = 'default';
    }
  });
};

/**
 * Event is called after a mode is unfocused.
 */
// ww.mode.EightBitMode.prototype.didUnfocus = function() {
//   goog.base(this, 'didUnfocus');
// };

/**
 * Handles a browser window resize.
 * @param {Boolean} redraw Whether resize redraws.
 */
ww.mode.EightBitMode.prototype.onResize = function(redraw) {
  goog.base(this, 'onResize', false);

  if (this.canvas_) {
    this.canvas_.width = this.width_;
    this.canvas_.height = this.height_;
  }

  // Recalculate the center of the screen based on the new window size.
  this.screenCenterX_ = this.width_ / 2;
  this.screenCenterY_ = this.height_ / 2;

  this.setPaperShapeData();

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
ww.mode.EightBitMode.prototype.pushPoints_ = function(path, clickPoint, speed) {
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

    point['length'] += distance;
    point['velocity'] += speed;
    point['velocity'] = Math.min(5, point['velocity']);
  }
};

/**
 * Updates point vectors based on their length and velocity values.
 * @param {Object} path The path to modify.
 * @private
 */
ww.mode.EightBitMode.prototype.updateVectors_ = function(path) {
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
ww.mode.EightBitMode.prototype.updatePoints_ = function(path) {
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
 * Draws pixels over the paper canvas.
 * @param {Object} sourceCanvas The canvas to sample data from.
 * @return {Number} pixelData.data.length The length of the pixelData array.
 * @private
 */
ww.mode.EightBitMode.prototype.drawPixels_ = function(sourceCanvas) {
  if (!sourceCanvas.width || sourceCanvas.width < 1) { return; }
  if (!sourceCanvas.height || sourceCanvas.height < 1) { return; }

  var pctx = sourceCanvas.getContext('2d');

  var pixelData = pctx.getImageData(0, 0, sourceCanvas.width,
    sourceCanvas.height);

  pctx.clearRect(0, 0, sourceCanvas.width + 1,
    sourceCanvas.height + 1);

  this.drawSlash_();

  var size = Math.round(this.width_ * 0.0625);
  var increment = Math.round(size * 80) / 4;

  for (i = 0; i < pixelData.data.length; i += increment) {
    if (pixelData.data[i + 3] != 0) {
      var r = pixelData.data[i];
      var g = pixelData.data[i + 1];
      var b = pixelData.data[i + 2];
      var pixel = Math.ceil(i / 4);
      var x = pixel % this.width_;
      var y = Math.floor(pixel / this.width_);

      var color = 'rgba(' + r + ', ' + g + ', ' + b + ', 1)';

      pctx.fillStyle = color;
      pctx.fillRect(x - size / 2, y - size / 2, size, size);
    }
  }

  return pixelData.data.length;
};

/**
 * On each physics tick, update vectors.
 * @param {Float} delta Time since last tick.
 */
ww.mode.EightBitMode.prototype.stepPhysics = function(delta) {
  goog.base(this, 'stepPhysics', delta);

  this.fillI_();
  this.fillO_();

  this.updateVectors_(this.paperI_);
  this.updatePoints_(this.paperI_);

  this.updateVectors_(this.paperO_);
  this.updatePoints_(this.paperO_);

  this.paperI_['scale'](.75);
  this.paperO_['scale'](.75);
};

/**
 * Runs code on each requested frame.
 * @param {Number} delta Ms since last draw.
 */
ww.mode.EightBitMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  this.drawPixels_(this.paperCanvas_);
};
