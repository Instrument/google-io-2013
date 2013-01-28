goog.require('ww.mode.Core');
goog.provide('ww.mode.MetaBallMode');

/**
 * @constructor
 */
ww.mode.MetaBallMode = function() {
  goog.base(this, 'metaball', true, true, true);

  // Set up audio context and create three sources.
  this.getAudioContext_();
  this.sources_ = [];

  this.notes_ = [
    {
      // ball 1
      'frequency': 0,
      'detune': 0,
      'type': 1
    },
    {
      // ball 2
      'frequency': 0,
      'detune': 0,
      'type': 1
    },
    {
      // ball 3
      'frequency': 0,
      'detune': 0,
      'type': 1
    }
  ];
};
goog.inherits(ww.mode.MetaBallMode, ww.mode.Core);

/**
 * Play a sound by url after being processed by Tuna.
 * @private.
 * @param {String} filename Audio file name.
 * @param {Object} filter Audio filter name.
 */
ww.mode.MetaBallMode.prototype.playProcessedAudio_ = function(filename,
  filter) {

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
ww.mode.MetaBallMode.prototype.activateI = function() {
  this.iClicked_ = true;
  if (this.iMultiplier_ < 10) {
    this.iMultiplier_ += 2;
  }
};

/**
 * Method called when activating the O.
 */
ww.mode.MetaBallMode.prototype.activateO = function() {
  this.oClicked_ = true;
  if (this.oMultiplier_ < 10) {
    this.oMultiplier_ += 2;
  }
};

/**
 * Function to create and draw I.
 * @private
 */
ww.mode.MetaBallMode.prototype.drawI_ = function() {
  // Set I's initial dimensions.
  this.iWidth_ = this.width_ * .175;
  this.iHeight_ = this.iWidth_ * 2.12698413;

  // Set coordinates for I's upper left corner.
  this.iX_ = this.screenCenterX_ - this.iWidth_ * 1.5;
  this.iY_ = this.screenCenterY_ - this.iHeight_ / 2;

  this.ctx_.fillStyle = '#e5e5e5';

  this.ctx_.beginPath();

  this.ctx_.fillRect(this.iX_, this.iY_, this.iWidth_, this.iHeight_);

  this.ctx_.stroke();
};

/**
 * Function to draw meta balls.
 * @param {Object} target The ball to draw.
 * @private
 */
ww.mode.MetaBallMode.prototype.drawBalls_ = function(target) {
  this.ctx_.beginPath();

  if (target != this.world_.particles[0]) {
    target.radius = this.oRad_  / 2;
  } else {
    target.radius = this.oRad_;
  }

  this.ctx_.arc(target.pos.x, target.pos.y, target.radius, 0, Math.PI * 2);

  this.ctx_.stroke();

  this.ctx_.closePath();
};

/**
 * Function to draw meta ball gradients.
 * @param {Object} target The ball to draw a gradient for.
 * @private
 */
ww.mode.MetaBallMode.prototype.drawGradients_ = function(target) {
  if (target != this.world_.particles[0]) {
    target.radius = this.oRad_  / 2;
  } else {
    target.radius = this.oRad_;
  }

  this.gctx_.beginPath();

  this.gctx_.save();

  // Set the size of the ball radial gradients.
  this.gradSize_ = target.radius * 4;

  this.gctx_.translate(target.pos.x - this.gradSize_,
    target.pos.y - this.gradSize_);

  var radGrad = this.gctx_.createRadialGradient(this.gradSize_,
    this.gradSize_, 0, this.gradSize_, this.gradSize_, this.gradSize_);

  radGrad.addColorStop(0, target['color'] + '1)');
  radGrad.addColorStop(1, target['color'] + '0)');

  this.gctx_.fillStyle = radGrad;
  this.gctx_.fillRect(0, 0, this.gradSize_ * 4, this.gradSize_ * 4);

  this.gctx_.restore();

  this.gctx_.closePath();
};

ww.mode.MetaBallMode.prototype.getVector_ = function(radians, length) {
  return new paper['Point']({
    // Convert radians to degrees:
    angle: radians * 180 / Math.PI,
    length: length
  });
}

ww.mode.MetaBallMode.prototype.metaball_ = function(ball1,
  ball2, v, handleLenRate, maxDistance) {

  var center1 = ball1['position'];
  var center2 = ball2['position'];
  var radius1 = ball1['bounds']['width'] / 2;
  var radius2 = ball2['bounds']['width'] / 2;
  var pi2 = Math.PI / 2;
  var d = center1['getDistance'](center2);
  var u1, u2;

  if (radius1 == 0 || radius2 == 0) {
    return;
  }

  if (d > maxDistance || d <= Math.abs(radius1 - radius2)) {
    return;
  } else if (d < radius1 + radius2) { // case circles are overlapping
    u1 = Math.acos((radius1 * radius1 + d * d - radius2 * radius2) /
      (2 * radius1 * d));

    u2 = Math.acos((radius2 * radius2 + d * d - radius1 * radius1) /
      (2 * radius2 * d));
  } else {
    u1 = 0;
    u2 = 0;
  }

  var angle1 = Math.atan2(center2['x'] - center1['x'],
    center1['y'] - center2['y']);
  // var angle1 = (center2 - center1)['getAngleInRadians']();
  var angle2 = Math.acos((radius1 - radius2) / d);
  var angle1a = angle1 + u1 + (angle2 - u1) * v;
  var angle1b = angle1 - u1 - (angle2 - u1) * v;
  var angle2a = angle1 + Math.PI - u2 - (Math.PI - u2 - angle2) * v;
  var angle2b = angle1 - Math.PI + u2 + (Math.PI - u2 - angle2) * v;
  var p1a = center1 + this.getVector_(angle1a, radius1);
  var p1b = center1 + this.getVector_(angle1b, radius1);
  var p2a = center2 + this.getVector_(angle2a, radius2);
  var p2b = center2 + this.getVector_(angle2b, radius2);

  // define handle length by the distance between
  // both ends of the curve to draw
  var totalRadius = (radius1 + radius2);
  var d2 = Math.min(v * handleLenRate, (p1a - p2a)['length'] / totalRadius);

  // case circles are overlapping:
  d2 *= Math.min(1, d * 2 / (radius1 + radius2));

  radius1 *= d2;
  radius2 *= d2;

  var path = new paper['Path'](p1a, p2a, p2b, p1b);
  path['style'] = ball1['style'];
  path['closed'] = true;
  var segments = path['segments'];
  segments[0]['handleOut'] = this.getVector_(angle1a - pi2, radius1);
  segments[1]['handleIn'] = this.getVector_(angle2a + pi2, radius2);
  segments[2]['handleOut'] = this.getVector_(angle2b - pi2, radius2);
  segments[3]['handleIn'] = this.getVector_(angle1b + pi2, radius1);
  return path;
}

/**
 * Function to draw meta ball connections.
 * @param {Object} a The array containing the metaballs.
 * @private
 */
ww.mode.MetaBallMode.prototype.drawConnections_ = function(paths) {
  if (this.connections_) {
    this.connections_['remove']();
  }

  this.connections_ = new paper['Group']();

  for (var i = 0, l = paths.length; i < l; i++) {
    for (var ii = i + 1; ii < paths.length; ii++) {
      var path = this.metaball_(paths[i], paths[ii], 0.5, this.handleLenRate_, 300);
      if (path) {
        this.connections_['appendTop'](path);
        // path['removeOnMove']();
      }
    }
  }
}

/**
 * Function to draw meta ball connections.
 * @param {Object} a The starting ball.
 * @param {Object} b The destination ball.
 * @private
 */
ww.mode.MetaBallMode.prototype.drawConnectionsOld_ = function(a, b) {
  // The draw distance between the x and y points of a and b.
  var drawX = (a.pos.x - b.pos.x);
  var drawY = (a.pos.y - b.pos.y);

  // The draw distance directly between a and b.
  var drawDistance = Math.sqrt((drawX * drawX) + (drawY * drawY));

  // How far away the two circles can be before their connection breaks.
  var breakPoint = (a.radius + b.radius) * 1.7;

  // Angle between the two circles. All units are radians.
  var angle = -Math.atan2(a.pos.x - b.pos.x, a.pos.y - b.pos.y);

  // Modifies how much our dynamic circle coordinates will adjust.
  var anchorModifier = (a.radius + b.radius);
  if (drawDistance <= anchorModifier / 1.25) {
    drawDistance = 1;
    anchorModifier = 1;
  } else {
    anchorModifier = Math.tan(drawDistance / anchorModifier);
  }

  // The x and y coordinates of each side of circle a.
  var posXA1 = a.pos.x + a.radius * Math.cos(angle);
  var posXA2 = a.pos.x + a.radius * -Math.cos(angle);
  var posYA1 = a.pos.y + a.radius * Math.sin(angle);
  var posYA2 = a.pos.y + a.radius * -Math.sin(angle);

  // The x and y coordinates of each side of circle a based on distance from b.
  var dynamicPosXA1 = a.pos.x + (a.radius / anchorModifier) * Math.cos(angle);
  var dynamicPosXA2 = a.pos.x + (a.radius / anchorModifier) * -Math.cos(angle);
  var dynamicPosYA1 = a.pos.y + (a.radius / anchorModifier) * Math.sin(angle);
  var dynamicPosYA2 = a.pos.y + (a.radius / anchorModifier) * -Math.sin(angle);

  // The x and y coordinates of each side of circle b.
  var posXB1 = b.pos.x + b.radius * Math.cos(angle);
  var posXB2 = b.pos.x + b.radius * -Math.cos(angle);
  var posYB1 = b.pos.y + b.radius * Math.sin(angle);
  var posYB2 = b.pos.y + b.radius * -Math.sin(angle);

  // The x and y coordinates of each side of circle a based on distance from b.
  var dynamicPosXB1 = b.pos.x + (b.radius / anchorModifier) * Math.cos(angle);
  var dynamicPosXB2 = b.pos.x + (b.radius / anchorModifier) * -Math.cos(angle);
  var dynamicPosYB1 = b.pos.y + (b.radius / anchorModifier) * Math.sin(angle);
  var dynamicPosYB2 = b.pos.y + (b.radius / anchorModifier) * -Math.sin(angle);

  /*
   * Set anchor points for a quadratic curve at the midpoints between each
   * circle.
   */
  var anchorMidpointX;
  var anchorMidpointY;
  var anchorX1;
  var anchorX2;
  var anchorY1;
  var anchorY2;

  if (a.pos.x > b.pos.x) {
    anchorMidpointX = ((a.pos.x - b.pos.x) / 2) + b.pos.x;
    anchorX1 = ((dynamicPosXA1 - dynamicPosXB2) / 2) + b.pos.x;
    anchorX2 = ((dynamicPosXA2 - dynamicPosXB1) / 2) + b.pos.x;
  } else {
    anchorMidpointX = ((b.pos.x - a.pos.x) / 2) + a.pos.x;
    anchorX1 = ((dynamicPosXB1 - dynamicPosXA2) / 2) + a.pos.x;
    anchorX2 = ((dynamicPosXB2 - dynamicPosXA1) / 2) + a.pos.x;
  }

  if (a.pos.y > b.pos.y) {
    anchorMidpointY = ((a.pos.y - b.pos.y) / 2) + b.pos.y;
    anchorY1 = ((dynamicPosYA1 - dynamicPosYB2) / 2) + b.pos.y;
    anchorY2 = ((dynamicPosYA2 - dynamicPosYB1) / 2) + b.pos.y;
  } else {
    anchorMidpointY = ((b.pos.y - a.pos.y) / 2) + a.pos.y;
    anchorY1 = ((dynamicPosYB1 - dynamicPosYA2) / 2) + a.pos.y;
    anchorY2 = ((dynamicPosYB2 - dynamicPosYA1) / 2) + a.pos.y;
  }

  // In-progress code for drawing proper tangents.
  /*var midDistA = Math.sqrt((distAX * distAX) + (distAY * distAY));
  var midDistB = Math.sqrt((distBX * distBX) + (distBY * distBY));

  var missingSideA = Math.sqrt((a.radius * a.radius) + (midDistA * midDistA));
  var missingSideB = Math.sqrt((b.radius * b.radius) + (midDistB * midDistB));

  var angleA = Math.sin(a.radius / midDistA);
  angleA += angle;*/

  var angleA1 = -Math.atan2(posXA1 - anchorMidpointX,
    posYA1 - anchorMidpointY);
  var angleA2 = -Math.atan2(posXA2 - anchorMidpointX,
    posYA2 - anchorMidpointY);

  var angleB1 = -Math.atan2(posXB1 - anchorMidpointX,
    posYB1 - anchorMidpointY);
  var angleB2 = -Math.atan2(posXB2 - anchorMidpointX,
    posYB2 - anchorMidpointY);

  posXA1 = a.pos.x + a.radius * Math.cos(angleA1);
  posYA1 = a.pos.y + a.radius * Math.sin(angleA1);

  posXA2 = a.pos.x + a.radius * -Math.cos(angleA2);
  posYA2 = a.pos.y + a.radius * -Math.sin(angleA2);

  posXB1 = b.pos.x + b.radius * -Math.cos(angleB1);
  posYB1 = b.pos.y + b.radius * -Math.sin(angleB1);

  posXB2 = b.pos.x + b.radius * Math.cos(angleB2);
  posYB2 = b.pos.y + b.radius * Math.sin(angleB2);

  dynamicPosXA1 = a.pos.x + (a.radius / anchorModifier) * Math.cos(angleA1);
  dynamicPosXA2 = a.pos.x + (a.radius / anchorModifier) * -Math.cos(angleA2);
  dynamicPosYA1 = a.pos.y + (a.radius / anchorModifier) * Math.sin(angleA1);
  dynamicPosYA2 = a.pos.y + (a.radius / anchorModifier) * -Math.sin(angleA2);

  dynamicPosXB1 = b.pos.x + (b.radius / anchorModifier) * Math.cos(angleB1);
  dynamicPosXB2 = b.pos.x + (b.radius / anchorModifier) * -Math.cos(angleB2);
  dynamicPosYB1 = b.pos.y + (b.radius / anchorModifier) * Math.sin(angleB1);
  dynamicPosYB2 = b.pos.y + (b.radius / anchorModifier) * -Math.sin(angleB2);

  this.ctx_.beginPath();

  // Draw connections only if the draw distance is smaller than the break point.
  if (breakPoint > drawDistance) {
    this.ctx_.moveTo(anchorMidpointX, anchorMidpointY);
    this.ctx_.arc(anchorMidpointX, anchorMidpointY, 10, 0, Math.PI * 2);
    this.ctx_.moveTo(posXA1, posYA1);
    this.ctx_.quadraticCurveTo(anchorX1, anchorY1, posXB1, posYB1);
    this.ctx_.lineTo(posXB2, posYB2);
    this.ctx_.quadraticCurveTo(anchorX2, anchorY2, posXA2, posYA2);
  }

  this.ctx_.stroke();

  this.ctx_.closePath();
};

/**
 * Function to create and draw Slash.
 * @private
 */
ww.mode.MetaBallMode.prototype.drawSlash_ = function() {
  // Determine the slash's start and end coordinates based on I and O sizes.
  this.slashStartX_ = this.screenCenterX_ + this.oRad_ / 8;
  this.slashStartY_ = this.screenCenterY_ - (this.iHeight_ / 2) -
    ((this.iHeight_ * 1.5) * 0.17475728);

  this.slashEndX_ = this.iX_ + this.iWidth_;
  this.slashEndY_ = this.screenCenterY_ + (this.iHeight_ / 2) +
    ((this.iHeight_ * 1.5) * 0.17475728);

  this.ctx_.fillStyle = '#e5e5e5';
  this.ctx_.lineWidth = 1;
  // this.ctx_.lineWidth = this.width_ * 0.01388889;

  this.ctx_.beginPath();

  this.ctx_.moveTo(this.slashStartX_, this.slashStartY_);
  this.ctx_.lineTo(this.slashEndX_, this.slashEndY_);

  this.ctx_.stroke();
};

/**
 * Function to initialize the current mode.
 * Sets initial variables.
 */
ww.mode.MetaBallMode.prototype.init = function() {
  goog.base(this, 'init');

  this.getPaperCanvas_();
  paper['project']['activeLayer']['style'] = {
    fillColor: 'black'
  }

  this.world_ = this.getPhysicsWorld_();
  this.world_.viscosity = 0;

  this.world_.particles.push(new Particle());

  this.ballCount_ = this.world_.particles.length;

  // Set O's radius.
  this.oRad_ = this.width_ * 0.1944444444;
  this.world_.particles[0].radius = this.oRad_;

  this.handleLenRate_ = 2.4;
  this.oPaths_ = [];

  // Set O's coordinates.
  this.oX_ = this.screenCenterX_ + this.oRad_;
  this.oY_ = this.screenCenterY_;

  this.oCenter_ = new paper['Point'](this.oX_, this.oY_);

  this.oPaths_.push(new paper['Path']['Circle'](this.oCenter_, this.oRad_));

  // Create an array of colors.
  this.colors_ = [
    'rgba(210, 59, 48,',
    'rgba(67, 134, 251,',
    'rgba(249, 188, 71,',
    'rgba(17, 168, 96,'
  ];

  // Set the main O color.
  this.world_.particles[0]['color'] = this.colors_[0];

  // Create a variable to store connections between metaballs.
  this.connections_ = 0;

  // Gets the centerpoint of the viewport.
  this.screenCenterX_ = this.width_ / 2;
  this.screenCenterY_ = this.height_ / 2;

  /**
   * Sets the mouse position to start at the screen center.
   */
  this.mouseX_ = this.screenCenterX_;
  this.mouseY_ = this.screenCenterY_;
};

/**
 * Event is called after a mode focused.
 */
ww.mode.MetaBallMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  // Create the ball and gradient canvases.
  this.$canvas_ = $('#metaball-canvas');
  this.canvas_ = this.$canvas_[0];
  this.canvas_.width = this.width_;
  this.canvas_.height = this.height_;
  this.ctx_ = this.paperCanvas_.getContext('2d');
  this.ctx_.fillStyle = 'black';

  // Test code for image smoothing.
  /*var imageSmoothing = Modernizr.prefixed('imageSmoothingEnabled',
    this.ctx_, false);

  if (imageSmoothing) {
    this.ctx_[imageSmoothing] = true;
  }*/

  // this.ctx_.webkitImageSmoothingEnabled = false;

  this.$gcanvas_ = $('<canvas></canvas>');
  this.gcanvas_ = this.$gcanvas_[0];
  this.gcanvas_.width = this.width_;
  this.gcanvas_.height = this.height_;
  this.gctx_ = this.gcanvas_.getContext('2d');

  // Make sure the ball count is at 1 when focused/refocused.
  this.ballCount_ = 1;

  var self = this;

  // Multiple bound events upon click or touch.
  var downEvt = Modernizr.touch ? 'touchstart' : 'mousedown';
  this.$canvas_.bind(downEvt + '.metaball', function(e) {

    var activeBall;

    self.mouseX_ = e.pageX;
    self.mouseY_ = e.pageY;

    // Lock any ball clicked to the mouse coordinates.
    for (var i = 0; i < self.ballCount_; i++) {
      if (Math.abs(self.mouseX_ - self.world_.particles[i].pos.x) <
        self.world_.particles[i].radius &&
        Math.abs(self.mouseY_ - self.world_.particles[i].pos.y) <
        self.world_.particles[i].radius) {

        activeBall = self.world_.particles[i];

        // If the O is clicked create a new ball if there are less than 4 balls.
        if (activeBall === self.world_.particles[0] && self.ballCount_ < 4) {
          self.world_.particles.push(new Particle());
          self.oPaths_.push(new paper['Path']['Circle'](self.oCenter_,
            self.oRad_ / 2));
          var newBall = self.world_.particles[self.world_.particles.length - 1];
          var attraction = new Attraction(self.world_.particles[0].pos);
          activeBall = newBall;
          activeBall.behaviours.push(attraction);
          activeBall.pos.x = self.mouseX_;
          activeBall.pos.y = self.mouseY_;
          activeBall.mass = Math.random() * (255 - 1) + 1;
          activeBall['color'] = self.colors_[self.ballCount_];
          self.ballCount_ = self.world_.particles.length;
          self.sources_.push(self.audioContext_.createOscillator());
          self.sources_[self.sources_.length - 1].connect(self.audioContext_.destination);
          self.sources_[self.sources_.length - 1].noteOn(0);
        } else if (activeBall != self.world_.particles[0]) {
          // If any other existing ball is clicked, reset it's velocity.
          activeBall['fixed'] = true;
          activeBall.vel.x = 0;
          activeBall.vel.y = 0;
        }
      }
    }

    // Update mouse or touch coordinates on move.
    var moveEvt = Modernizr.touch ? 'touchmove' : 'mousemove';
    self.$canvas_.bind(moveEvt + '.metaball', function(e) {
      self.mouseX_ = e.pageX;
      self.mouseY_ = e.pageY;

      // If a ball has been activated keep it locked to mouse/touch coordinates.
      if (activeBall) {
        activeBall.pos.x = self.mouseX_;
        activeBall.pos.y = self.mouseY_;
      }

    });

    // On mouseup or touchend, let go of all our events and unlock any balls.
    var upEvt = Modernizr.touch ? 'touchend' : 'mouseup';
    self.$canvas_.bind(upEvt + '.metaball', function(e) {
      if (activeBall) {
        activeBall['fixed'] = false;
      }
      self.$canvas_.unbind(upEvt + '.metaball');
      self.$canvas_.unbind(moveEvt + '.metaball');
    });

    e.preventDefault();
    e.stopPropagation();
  });
};

/**
 * Event is called after a mode unfocused.
 */
ww.mode.MetaBallMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  var downEvt = Modernizr.touch ? 'touchstart' : 'mousedown';
  this.$canvas_.unbind(downEvt + '.metaball');

  for (var i = 0; i < this.sources_.length; i++) {
    this.sources_[i].disconnect();
  }
};

/**
 * Handles a browser window resize.
 * @param {Boolean} redraw Whether resize redraws.
 */
ww.mode.MetaBallMode.prototype.onResize = function(redraw) {
  goog.base(this, 'onResize', false);

  if (this.canvas_) {
    this.canvas_.width = this.width_;
    this.canvas_.height = this.height_;
  }

  if (this.gcanvas_) {
    this.gcanvas_.width = this.width_;
    this.gcanvas_.height = this.height_;
  }

  // Recalculate the center of the screen based on the new window size.
  this.screenCenterX_ = this.width_ / 2;
  this.screenCenterY_ = this.height_ / 2;

  // Set O's radius.
  this.oRad_ = this.width_ * 0.1944444444;

  if (this.oPaths_[0]) {
    this.oPaths_[0]['scale'](this.oRad_ * 2 /
    this.oPaths_[0]['bounds']['height']);

    for (var i = 1; i < this.oPaths_.length; i++) {
      if (this.oPaths_[i]) {
        this.oPaths_[i]['scale']((this.oRad_ * 2 /
          this.oPaths_[i]['bounds']['height']) / 2);
      }
    }
  }

  // Set O's coordinates.
  this.oX_ = this.screenCenterX_ + this.oRad_;
  this.oY_ = this.screenCenterY_;

  this.oCenter_ = new paper['Point'](this.oX_, this.oY_);

  // Set the size of the ball radial gradients.
  this.gradSize_ = this.oRad_ * 4;

  this.redraw();
};

/**
 * On each physics tick, adjust star positions.
 * @param {Float} delta Time since last tick.
 */
ww.mode.MetaBallMode.prototype.stepPhysics = function(delta) {
  goog.base(this, 'stepPhysics', delta);

  // Make sure the O does not move.
  this.world_.particles[0].pos.x = this.oX_;
  this.world_.particles[0].pos.y = this.oY_;

  var i;

  // Update positions and velocities for each ball.
  for (i = 0; i < this.world_.particles.length; i++) {
    if (this.world_.particles[i]['fixed'] === true) {
      this.world_.particles[i].pos.x = this.mouseX_;
      this.world_.particles[i].pos.y = this.mouseY_;
      this.oPaths_[0]['position']['x'] = this.mouseX_;
      this.oPaths_[0]['position']['y'] = this.mouseY_;
    }
    if (this.world_.particles[i].pos.x >
      this.width_ - this.world_.particles[i].radius) {

      this.world_.particles[i].vel.x *= -1;

      this.world_.particles[i].pos.x = this.width_ -
        (this.world_.particles[i].radius + 1);
    } else if (this.world_.particles[i].pos.x <
      this.world_.particles[i].radius) {

      this.world_.particles[i].vel.x *= -1;

      this.world_.particles[i].pos.x = this.world_.particles[i].radius + 1;
    }

    if (this.world_.particles[i].pos.y >
      this.height_ - this.world_.particles[i].radius) {

      this.world_.particles[i].vel.y *= -1;

      this.world_.particles[i].pos.y = this.height_ -
        (this.world_.particles[i].radius + 1);
    } else if (this.world_.particles[i].pos.y <
      this.world_.particles[i].radius) {

      this.world_.particles[i].vel.y *= -1;

      this.world_.particles[i].pos.y = this.world_.particles[i].radius + 1;
    }

    // Set the audio properties for each note based on ball positions.
    if (this.world_.particles[i] != this.world_.particles[0]) {
      this.notes_[i - 1]['frequency'] = this.world_.particles[0].pos.x -
        this.world_.particles[i].pos.x;

      this.notes_[i - 1]['detune'] = this.world_.particles[0].pos.y -
        this.world_.particles[i].pos.y;
    }
  }

  // Play each note if its corresponding ball exists.
  for (i = 0; i < this.sources_.length; i++) {
    if (this.world_.particles[i + 1]) {
      this.sources_[i].type = this.notes_[i]['type'];
      this.sources_[i].frequency.value = this.notes_[i]['frequency'];
      this.sources_[i].detune.value = this.notes_[i]['detune'];
    }
  }

  // Draw the paper objects to the same positions as the coffee physics objects.
  for (i = 0; i < this.oPaths_.length; i++) {
    if (this.oPaths_[i] && this.world_.particles[i]) {
      this.oPaths_[i]['position']['x'] = this.world_.particles[i].pos.x;
      this.oPaths_[i]['position']['y'] = this.world_.particles[i].pos.y;
    }
  }
};

/**
 * Runs code on each requested frame.
 * @param {Integer} delta The timestep variable for animation accuracy.
 */
ww.mode.MetaBallMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);  

  if (!this.canvas_) { return; }

  // Clear both canvases every frame
  this.ctx_.clearRect(0, 0, this.canvas_.width + 1, this.canvas_.height + 1);
  this.gctx_.clearRect(0, 0, this.gcanvas_.width + 1, this.gcanvas_.height + 1);

  this.drawI_();

  // Loop through every ball and draw it and its gradient.
  for (var i = 0; i < this.ballCount_; i++) {
    // this.drawBalls_(this.world_.particles[i]);
    this.drawGradients_(this.world_.particles[i]);
  }

  // Compare every ball to each other without repeating and draw connections.
  /*for (var i = 0; i < this.ballCount_; i++) {
    for (var ii = i + 1; ii < this.ballCount_; ii++) {
      this.drawConnections_(this.world_.particles[i],
        this.world_.particles[ii]);
    }
  }*/

  if (this.oPaths_.length > 1) {
    this.drawConnections_(this.oPaths_);
  }

  this.drawSlash_();

  this.ctx_.save();

  // Make the ball canvas the source of the mask.
  this.ctx_.globalCompositeOperation = 'source-atop';

  // Set the blend mode for the gradients to lighter to make it look cool.
  this.gctx_.globalCompositeOperation = 'lighter';

  // Draw the ball canvas onto the gradient canvas to complete the mask.
  this.ctx_.drawImage(this.gcanvas_, 0, 0);

  this.ctx_.restore();
};
