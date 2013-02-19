goog.require('ww.PatternMatcher');
goog.require('ww.mode.Core');
goog.provide('ww.mode.HomeMode');

/**
 * @constructor
 * @param {Element} containerElem The containing element.
 * @param {String} assetPrefix The containing element.
 */
ww.mode.HomeMode = function(containerElem, assetPrefix) {
  this.preloadSound('i.mp3');
  this.preloadSound('o.mp3');

  goog.base(this, containerElem, assetPrefix, 'home', true, true, false, true);

  this.patternMatcher_ = new ww.PatternMatcher(ww.mode.modes);

  this.wentIdleTime_ = 0;
  this.isIdle_ = true;
  this.maxIdleTime_ = 12000; // 12 seconds
};
goog.inherits(ww.mode.HomeMode, ww.mode.Core);

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
  this.$date_.fadeIn(300);
  this.$pattern_.fadeOut(300);
};

/**
 * Leave idle mode.
 * @private
 */
ww.mode.HomeMode.prototype.leaveIdle_ = function() {
  this.isIdle_ = false;
  this.$date_.fadeOut(300);
  this.$pattern_.fadeIn(300);
};

/**
 * Add a character to the current pattern.
 * @param {String} character The character to add to the current pattern.
 */
ww.mode.HomeMode.prototype.addPatternCharacter = function(character) {
  if (this.$pattern_.hasClass('success')) {
    this.$pattern_.removeClass('success');
    this.patternMatcher_.reset();
  }

  if (this.$pattern_.hasClass('failure')) {
    this.$pattern_.removeClass('failure');
    this.patternMatcher_.reset();
  }

  var self = this;
  this.patternMatcher_.addCharacter(character,
    function(currentPattern, matched) {

    self.log('current pattern: ' + currentPattern);

    var patternHTML = currentPattern.replace(/1/g,
      '<span class="i"></span>').replace(/0/g, '<span class="o"></span>');
    self.$pattern_.html(patternHTML);
    self.$pattern_.css('marginLeft', -((self.$pattern_.width() + 15) / 2));

    if (matched) {
      self.log('matched', matched);

      if (matched.isPartial) {
        // Highlight partial match in UI?
      } else {
        self.$pattern_.addClass('success');
        self.goToMode_(matched.key);
      }
    } else {
      self.$pattern_.removeClass('success');
      self.$pattern_.addClass('failure');
    }
  });

  this.resetIdle_();
};

/**
 * Method called when activating the I.
 */
ww.mode.HomeMode.prototype.activateI = function() {
  goog.base(this, 'activateI');

  this.pushPoints_(this.paperI_, this.lastClick_, 10);

  this.playSound('i.mp3');

  this.addPatternCharacter('1');
};

/**
 * Method called when activating the O.
 */
ww.mode.HomeMode.prototype.activateO = function() {
  goog.base(this, 'activateO');

  this.pushPoints_(this.paperO_, this.lastClick_, 10);

  this.playSound('o.mp3');

  this.addPatternCharacter('0');
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
ww.mode.HomeMode.prototype.fillI_ = function() {
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
ww.mode.HomeMode.prototype.drawO_ = function() {
  if (this.paperO_) {
    this.paperO_['remove']();
  }

  this.paperO_ = new paper['Path']['RegularPolygon'](this.oCenter, 6,
    this.oRad);

  this.paperO_['vectors'] = [];

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
ww.mode.HomeMode.prototype.fillO_ = function() {
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
ww.mode.HomeMode.prototype.drawSlash_ = function() {
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
 * Function to initialize the current mode.
 * Requests a paper canvas and creates paths.
 * Sets initial variables.
 */
ww.mode.HomeMode.prototype.init = function() {
  goog.base(this, 'init');

  this.$date_ = this.find('#date');
  this.$pattern_ = this.find('#pattern');

  this.patternMatcher_.reset();

  // Prep paperjs
  this.getPaperCanvas_();

  // Gets the centerpoint of the viewport.
  this.screenCenterX_ = this.width_ / 2;
  this.screenCenterY_ = this.height_ / 2;

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
ww.mode.HomeMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  var self = this;

  this.bindEvent_(this.find('#menu'), 'up', function() {
    $(self.containerElem_).addClass('nav-visible');
  });

  this.bindEvent_(this.find('#modal'), 'up', function() {
    $(self.containerElem_).removeClass('nav-visible');
  });

  this.bindEvent_(this.find('#dropdown'), 'up', function(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  });

  this.bindEvent_($(this.paperCanvas_), 'down', function(event) {
    self.lastClick_ = new paper['Point'](self.getCoords(event)['x'],
      self.getCoords(event)['y']);
    if (self.paperO_['hitTest'](self.lastClick_)) {
      if (self.hasFocus) {
        self.activateO();
      }
    }

    if (self.paperI_['hitTest'](self.lastClick_)) {
      if (self.hasFocus) {
        self.activateI();
      }
    }
  });

  var lastPos = new paper['Point'](0, 0);

  this.bindEvent_($(this.paperCanvas_), 'move', function(event) {
    lastPos = {'x': self.getCoords(event)['x'],
      'y': self.getCoords(event)['y']};
    if (self.paperO_['hitTest'](lastPos) ||
      self.paperI_['hitTest'](lastPos)) {

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
ww.mode.HomeMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  this.unbindEvent_(this.find('#menu'), 'up');
  this.unbindEvent_(this.find('#modal'), 'up');
  this.unbindEvent_(this.find('#dropdown'), 'up');

  this.unbindEvent_($(this.paperCanvas_), 'down');
  this.unbindEvent_($(this.paperCanvas_), 'move');
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
ww.mode.HomeMode.prototype.pushPoints_ = function(path, clickPoint, speed) {
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
  }
};

/**
 * Updates point vectors based on their length and velocity values.
 * @param {Object} path The path to modify.
 * @private
 */
ww.mode.HomeMode.prototype.updateVectors_ = function(path) {
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
ww.mode.HomeMode.prototype.updatePoints_ = function(path) {
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
 * Runs code on each requested frame.
 * @param {Number} delta Ms since last draw.
 */
ww.mode.HomeMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  if (!this.isIdle_) {
    var hasBeenIdle = this.timeElapsed_ - this.wentIdleTime_;

    if (hasBeenIdle > this.maxIdleTime_) {
      this.enterIdle_();
    }
  }

  if (this.paperI_ && this.paperO_) {
    this.fillI_();
    this.fillO_();
  }

  if (delta > 0 && this.paperI_ && this.paperO_) {
    this.updateVectors_(this.paperI_);
    this.updatePoints_(this.paperI_);

    this.updateVectors_(this.paperO_);
    this.updatePoints_(this.paperO_);
  }
};
