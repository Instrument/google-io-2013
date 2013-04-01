goog.require('ww.mode.Core');
goog.provide('ww.mode.EightBitMode');

/**
 * @constructor
 * @param {Element} containerElem The containing element.
 * @param {String} assetPrefix The containing element.
 */
ww.mode.EightBitMode = function(containerElem, assetPrefix) {
  this.preloadSound('i.mp3');
  this.preloadSound('o.mp3');
  this.preloadSound('error.mp3');

  goog.base(this, containerElem, assetPrefix, 'eightbit', true, true, true,
    false);

  // Prep paperjs
  this.getPaperCanvas_();

  this.frontmostRequestsRetina_ = (window.devicePixelRatio > 1);
  this.frontmostWantsRetina_ = this.frontmostRequestsRetina_;

  this.canvas_ = document.getElementById('eightbit-canvas');
};
goog.inherits(ww.mode.EightBitMode, ww.mode.Core);

/**
 * Method called when activating the I.
 */
ww.mode.EightBitMode.prototype.activateI = function() {
  goog.base(this, 'activateI');

  this.pushPoints_(this.paperI_, this.lastClick_, 10);

  this.playSound('i.mp3');
};

/**
 * Method called when activating the O.
 */
ww.mode.EightBitMode.prototype.activateO = function() {
  goog.base(this, 'activateO');

  this.pushPoints_(this.paperO_, this.lastClick_, 10);

  this.playSound('o.mp3');
};

/**
 * Function to create and draw I.
 * @private
 */
ww.mode.EightBitMode.prototype.drawI_ = function() {
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
 * Function to initialize the current mode.
 * Requests a paper canvas and creates paths.
 * Sets initial variables.
 */
ww.mode.EightBitMode.prototype.init = function() {
  goog.base(this, 'init');

  // Create physics world to support stepPhysics.
  this.world_ = this.getPhysicsWorld_();

  this.pixelScale_ = $('#pixel')[0].value / 100;

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

  this.$canvas_ = $(this.canvas_);
  var demo = $("#demo-wrapper");

  var self = this;

  // Check to see if the I or O were clicked.
  var evt = ww.util.getPointerEventNames('down', this.name_);
  demo.bind(evt, function(e) {
    e.preventDefault();
    e.stopPropagation();

    self.lastClick_ = new paper['Point'](self.getCoords(e)['x'],
      self.getCoords(e)['y']);

    if (self.lastClick_['getDistance'](self.paperO_['position']) < self.oRad * .75) {
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
  demo.bind(evt2, function(e) {
    e.preventDefault();
    e.stopPropagation();

    var lastPos = new paper['Point'](self.getCoords(e)['x'],
      self.getCoords(e)['y']);

    if (lastPos['getDistance'](self.paperO_['position']) < self.oRad * .75 ||
      Math.abs(lastPos['x'] - self.paperI_['position']['x']) <
      self.iWidth / 2 && Math.abs(lastPos['y'] -
      self.paperI_['position']['y']) <
      self.iHeight / 2) {
      if (self.hasFocus) {
        self.canvas_.style.cursor = 'pointer';
        demo[0].style.cursor = 'pointer';
      }
    } else {
      self.canvas_.style.cursor = 'default';
      demo[0].style.cursor = 'default';
    }
  });

  $("#pan").bind('change', function(e) {
    $("#canvas-wrapper").css({
      "width": self.width_ * ($(this)[0].value / 100) + "px"
    });
  });

  $("#pixel").bind('change', function(e) {
    self.pixelScale_ = $(this)[0].value / 100;
  });

  $("#killscreen").bind('change', function(e) {
    $("body").toggleClass('kill-on');

    if ($(this)[0].checked) {
      self.playSound('error.mp3');
    }
  });
};

/**
 * Event is called after a mode is unfocused.
 */
ww.mode.EightBitMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  this.unbindEvent_($(this.paperCanvas_), 'down');
  this.unbindEvent_($(this.paperCanvas_), 'move');
};

/**
 * Handles a browser window resize.
 * @param {Boolean} redraw Whether resize redraws.
 */
ww.mode.EightBitMode.prototype.onResize = function(redraw) {
  goog.base(this, 'onResize', false);

  if (this.frontmostRequestsRetina_) {
    this.frontmostWantsRetina_ = !($.browser.safari && (this.width_ > 1024));
  }

  this.setPaperShapeData();

  // Draw I.
  this.drawI_();

  // Draw O.
  this.drawO_();

  /*if (this.height_ * 6 < this.width_) {
    this.playSound('error.mp3');
  }*/

  var scale = 1;
  if (this.frontmostWantsRetina_) {
    scale = 2;
  }

  this.canvas_.width = this.width_ * scale;
  this.canvas_.height = this.height_ * scale;

  $(this.canvas_).css({
    'width': this.width_,
    'height': this.height_
  });

  $("#canvas-wrapper").css({
    "width": this.width_ * ($("#pan")[0].value / 100) + "px"
  });

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
 * @return {Number} pixelData.data.length The length of the pixelData array.
 * @private
 */
ww.mode.EightBitMode.prototype.drawPixels_ = function() {
  var sourceCanvas = this.paperCanvas_;
  var targetCanvas = this.canvas_;

  if (!sourceCanvas.width || sourceCanvas.width < 1) { return; }
  if (!sourceCanvas.height || sourceCanvas.height < 1) { return; }

  var pctx = sourceCanvas.getContext('2d');
  var tctx = targetCanvas.getContext('2d');

  var pixelData = pctx.getImageData(0, 0, sourceCanvas.width,
    sourceCanvas.height);

  tctx.clearRect(0, 0, targetCanvas.width + 1,
    targetCanvas.height + 1);

  // tctx.imageSmoothingEnabled = false;
  // tctx.mozImageSmoothingEnabled = false;
  // tctx.oImageSmoothingEnabled = false;
  // tctx.webkitImageSmoothingEnabled = false;

  var size = ~~(this.width_ * 0.0625);

  /*if (this.height_ * 6 < this.width_) {
    size /= 8;
  }*/

  if ($('#killscreen')[0].checked) {
    size /= 8;
  }

  var increment = Math.min(Math.round(size * 80) / 4, 980);

  size *= this.pixelScale_;

  paper = this.paperScope_;

  var scale = 1;
  if (this.frontmostWantsRetina_) {
    scale = 2;
  }

  tctx.save();
  tctx.scale(scale, scale);

  for (i = 0; i < pixelData.data.length; i += increment) {
    if (pixelData.data[i + 3] !== 0) {
      var r = pixelData.data[i];
      var g = pixelData.data[i + 1];
      var b = pixelData.data[i + 2];
      var pixel = Math.ceil(i / 4);
      var x = pixel % this.width_;
      var y = Math.floor(pixel / this.width_);

      var color = 'rgba(' + r + ', ' + g + ', ' + b + ', 1)';

      tctx.fillStyle = color;
      tctx.fillRect(x - ~~(size / 2), y - ~~(size / 2), size,
        size);
    }
  }

  tctx.restore();

  return pixelData.data.length;
};

/**
 * On each physics tick, update vectors.
 * @param {Float} delta Time since last tick.
 */
ww.mode.EightBitMode.prototype.stepPhysics = function(delta) {
  goog.base(this, 'stepPhysics', delta);

  if (this.paperI_ && this.paperO_) {
    this.fillI_();
    this.fillO_();

    this.updateVectors_(this.paperI_);
    this.updatePoints_(this.paperI_);

    this.updateVectors_(this.paperO_);
    this.updatePoints_(this.paperO_);

    if (this.frontmostWantsRetina_) {
      this.paperI_['scale'](0.65);
      this.paperO_['scale'](0.65);
    } else {
      this.paperI_['scale'](0.55);
      this.paperO_['scale'](0.55);
    }
  }
};

/**
 * Runs code on each requested frame.
 * @param {Number} delta Ms since last draw.
 */
ww.mode.EightBitMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  this.drawPixels_(this.paperCanvas_);
};
