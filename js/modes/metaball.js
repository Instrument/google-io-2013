goog.require('ww.mode.Core');
goog.provide('ww.mode.MetaBallMode');

/**
 * @constructor
 * @param {Element} containerElem The containing element.
 * @param {String} assetPrefix The containing element.
 */
ww.mode.MetaBallMode = function(containerElem, assetPrefix) {
  goog.base(this, containerElem, assetPrefix, 'metaball', true, true, true);

  // Set up audio context and create three sources.
  this.notes_ = [
    {
      // ball 1
      'frequency': 0,
      'detune': 0,
      'type': 0
    },
    {
      // ball 2
      'frequency': 0,
      'detune': 0,
      'type': 0
    },
    {
      // ball 3
      'frequency': 0,
      'detune': 0,
      'type': 0
    }
  ];
};
goog.inherits(ww.mode.MetaBallMode, ww.mode.Core);

/**
 * Function to create and draw I.
 * @private
 */
ww.mode.MetaBallMode.prototype.drawI_ = function() {
  this.ctx_.beginPath();

  this.ctx_.fillRect(this.iX, this.iY, this.iWidth, this.iHeight);

  this.ctx_.stroke();
};

/**
 * Function to draw meta ball gradients.
 * @param {Object} target The ball to draw a gradient for.
 * @private
 */
ww.mode.MetaBallMode.prototype.drawGradients_ = function(target) {
  if (target != this.world_.particles[0]) {
    target.radius = this.oRad / 2;
  } else {
    target.radius = this.oRad;
  }

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
};

/**
 * Function to calculate a vector.
 * @param {Number} radians The angle in radians.
 * @param {Number} length The length with which to calculate the angle.
 * @return {Object} A new paper point object with the resulting vector.
 * @private
 */
ww.mode.MetaBallMode.prototype.getVector_ = function(radians, length) {
  return new paper['Point']({
    // Convert radians to degrees:
    'angle': radians * 180 / Math.PI,
    'length': length
  });
};

/**
 * Function to calculate the connecting paths between balls.
 * Ported from the paper.js Metaball example which was ported from the original
 *  Metaball script by SATO Hiroyuki.
 *  http://park12.wakwak.com/~shp/lc/et/en_aics_script.html
 * @param {Object} ball1 The first ball to compare.
 * @param {Object} ball2 The second ball to compare.
 * @param {Number} v The extremity of the curves generated.
 * @param {Number} handleLenRate Affects drawing.
 * @param {Number} maxDistance The distance at which ball connections break.
 * @return {Object} path The path created between each ball.
 * @private
 */
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

  var angle1 = center2['subtract'](center1)['getAngleInRadians']();
  var angle2 = Math.acos((radius1 - radius2) / d);
  var angle1a = angle1 + u1 + (angle2 - u1) * v;
  var angle1b = angle1 - u1 - (angle2 - u1) * v;
  var angle2a = angle1 + Math.PI - u2 - (Math.PI - u2 - angle2) * v;
  var angle2b = angle1 - Math.PI + u2 + (Math.PI - u2 - angle2) * v;

  var p1a = {x: center1['x'] + this.getVector_(angle1a, radius1)['x'],
    y: center1['y'] + this.getVector_(angle1a, radius1)['y']};

  var p1b = {x: center1['x'] + this.getVector_(angle1b, radius1)['x'],
    y: center1['y'] + this.getVector_(angle1b, radius1)['y']};

  var p2a = {x: center2['x'] + this.getVector_(angle2a, radius2)['x'],
    y: center2['y'] + this.getVector_(angle2a, radius2)['y']};

  var p2b = {x: center2['x'] + this.getVector_(angle2b, radius2)['x'],
    y: center2['y'] + this.getVector_(angle2b, radius2)['y']};

  // define handle length by the distance between
  // both ends of the curve to draw
  var totalRadius = (radius1 + radius2);
  var lengthX = p1a['x'] - p2a['x'];
  var lengthY = p1a['y'] - p2a['y'];
  var length = Math.sqrt((lengthX * lengthX) + (lengthY * lengthY));
  var d2 = Math.min(v * handleLenRate, length / totalRadius);

  // case circles are overlapping:
  d2 *= Math.min(1, d * 2 / (radius1 + radius2));

  radius1 *= d2;
  radius2 *= d2;

  var path = new paper['Path']([p1a, p2a, p2b, p1b]);

  path['style'] = ball1['style'];
  path['closed'] = true;
  var segments = path['segments'];
  segments[0]['handleOut'] = this.getVector_(angle1a - pi2, radius1);
  segments[1]['handleIn'] = this.getVector_(angle2a + pi2, radius2);
  segments[2]['handleOut'] = this.getVector_(angle2b - pi2, radius2);
  segments[3]['handleIn'] = this.getVector_(angle1b + pi2, radius1);
  return path;
};

/**
 * Function to draw meta ball connections.
 * @param {Object} paths The array containing the metaball paths.
 * @private
 */
ww.mode.MetaBallMode.prototype.drawConnections_ = function(paths) {
  if (this.connections_) {
    this.connections_['remove']();
  }

  this.connections_ = new paper['Group']();
  var path;
  var breakPoint =
    Math.round(Math.max(this.screenCenterX_, this.screenCenterY_) * .7);

  for (var i = 0; i < paths.length; i++) {
    for (var ii = i + 1; ii < paths.length; ii++) {
      path = this.metaball_(paths[i], paths[ii], .45, 2.4, breakPoint);
      if (path) {
        this.connections_['appendTop'](path);
      }
    }
  }
};


/**
 * Function to initialize the current mode.
 * Sets initial variables.
 */
ww.mode.MetaBallMode.prototype.init = function() {
  goog.base(this, 'init');

  this.setPaperShapeData();

  this.sources_ = [];
  this.gainNodes_ = [];

  this.getPaperCanvas_(true);

  this.world_ = this.getPhysicsWorld_();
  this.world_.viscosity = 0;

  this.world_.particles.push(new Particle(), new Particle(), new Particle());

  this.ballCount_ = this.world_.particles.length;

  var attraction = new Attraction(this.world_.particles[0].pos);
  this.world_.particles[1].behaviours.push(attraction);
  this.world_.particles[2].behaviours.push(attraction);

  this.world_.particles[1].mass = Math.random() * (255 - 1) + 1;
  this.world_.particles[2].mass = Math.random() * (255 - 1) + 1;

  // Set O's radius.
  this.world_.particles[0].radius = this.oRad;
  this.world_.particles[1].radius = this.oRad / 2;
  this.world_.particles[2].radius = this.oRad / 2;

  // If paper objects already exist, remove them.
  if (this.oPaths_) {
    for (var i = 0; i < this.oPaths_.length; i++) {
      this.oPaths_[i]['remove']();
    }
  }

  if (this.connections_) {
    this.connections_['remove']();
  }

  this.oPaths_ = [];

  this.oPaths_.push(new paper['Path']['Circle'](this.oCenter, this.oRad));
  this.oPaths_.push(new paper['Path']['Circle'](this.iCenter, this.oRad / 2));

  var tempPoint =
    new paper['Point'](this.iCenter['x'] + 100, this.iCenter['y'] - 100);
  this.oPaths_.push(new paper['Path']['Circle'](tempPoint, this.oRad / 2));

  // Create an array of colors.
  this.colors_ = [
    'rgba(210, 59, 48,',
    'rgba(67, 134, 251,',
    'rgba(249, 188, 71,',
    'rgba(17, 168, 96,'
  ];

  // Set the main O color.
  this.world_.particles[0]['color'] = this.colors_[0];
  this.world_.particles[1]['color'] = this.colors_[1];
  this.world_.particles[2]['color'] = this.colors_[2];

  this.world_.particles[1].pos.x = this.iCenter['x'];
  this.world_.particles[1].pos.y = this.iCenter['y'];

  this.world_.particles[2].pos.x = tempPoint['x'];
  this.world_.particles[2].pos.y = tempPoint['y'];


  // Gets the centerpoint of the viewport.
  this.screenCenterX_ = this.width_ / 2;
  this.screenCenterY_ = this.height_ / 2;

  /**
   * Sets the mouse position to start at the screen center.
   */
  this.mouseX_ = [];
  this.mouseY_ = [];

  paper['view']['setViewSize'](this.width_, this.height_);
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
  this.ctx_ = this.canvas_.getContext('2d');

  this.pctx_ = this.paperCanvas_.getContext('2d');

  this.gcanvas_ = document.createElement('canvas');
  this.gcanvas_.width = this.width_;
  this.gcanvas_.height = this.height_;
  this.gctx_ = this.gcanvas_.getContext('2d');

  // Make sure the ball count is at 1 when focused/refocused.
  this.ballCount_ = 3;

  var self = this;

  // Multiple bound events upon click or touch.
  var downEvt = ww.util.getPointerEventNames('down', this.name_);
  this.$canvas_.bind(downEvt, function(e) {

    self.mouseX_ = self.getCoords(e)['x'];
    self.mouseY_ = self.getCoords(e)['y'];

    var activeBall;

    // Lock any ball clicked to the mouse coordinates.
    for (var i = 0; i < self.ballCount_; i++) {
      if (self.world_.particles[i]['fixed']) {
        self.world_.particles[i]['fixed'] = false;
      }

      if (Math.abs(self.mouseX_ - self.world_.particles[i].pos.x) <
        self.world_.particles[i].radius &&
        Math.abs(self.mouseY_ - self.world_.particles[i].pos.y) <
        self.world_.particles[i].radius) {

        activeBall = self.world_.particles[i];

        // If the O is clicked create a new ball if there are less than 4 balls.
        if (activeBall === self.world_.particles[0] && self.ballCount_ < 4) {
          self.world_.particles.push(new Particle());

          self.oPaths_.push(new paper['Path']['Circle'](self.oCenter,
            self.oRad / 2));

          var newBall = self.world_.particles[self.world_.particles.length - 1];
          activeBall = newBall;

          var attraction = new Attraction(self.world_.particles[0].pos);
          activeBall.behaviours.push(attraction);

          activeBall.pos.x = self.mouseX_;
          activeBall.pos.y = self.mouseY_;

          activeBall.mass = Math.random() * (255 - 1) + 1;

          activeBall['color'] = self.colors_[self.ballCount_];
          activeBall['fixed'] = true;

          self.ballCount_ = self.world_.particles.length;

          /*if (self.wantsAudio_) {
            var aCtx = self.getAudioContext_();

            self.sources_.push(aCtx.createOscillator());
            self.gainNodes_.push(aCtx.createGainNode());

            self.sources_[self.sources_.length - 1].connect(
              self.gainNodes_[self.sources_.length - 1]);
            self.gainNodes_[self.sources_.length - 1].connect(
              aCtx.destination);

            self.sources_[self.sources_.length - 1].noteOn(0);
            self.gainNodes_[self.gainNodes_.length - 1].gain.value = 0.1;
          }*/
        } else if (activeBall != self.world_.particles[0]) {
          // If any other existing ball is clicked, reset it's velocity.
          activeBall['fixed'] = true;
          activeBall.vel.x = 0;
          activeBall.vel.y = 0;
        }
      }
    }

    // Update mouse or touch coordinates on move.
    var moveEvt = ww.util.getPointerEventNames('move', self.name_);
    self.$canvas_.bind(moveEvt, function(e) {
      self.mouseX_ = self.getCoords(e)['x'];
      self.mouseY_ = self.getCoords(e)['y'];

      // If a ball has been activated keep it locked to mouse/touch coordinates.
      if (activeBall && activeBall['fixed'] === true) {
        activeBall.pos.x = self.mouseX_;
        activeBall.pos.y = self.mouseY_;
      }
    });

    // On mouseup or touchend, let go of all our events and unlock any balls.
    var upEvt = ww.util.getPointerEventNames('up', self.name_);
    self.$canvas_.bind(upEvt, function(e) {
      if (activeBall) {
        activeBall['fixed'] = false;
      }
      self.$canvas_.unbind(upEvt);
      self.$canvas_.unbind(moveEvt);
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

  var downEvt = ww.util.getPointerEventNames('down', this.name_);
  this.$canvas_.unbind(downEvt);

  if (this.wantsAudio_) {
    for (var i = 0; i < this.sources_.length; i++) {
      this.sources_[i].disconnect();
      this.gainNodes_[i].disconnect();
    }
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

  this.setPaperShapeData();

  this.world_.particles[0].radius = this.oRad;
  this.oPaths_[0]['remove']();
  this.oPaths_[0] = new paper['Path']['Circle'](this.oCenter, this.oRad);

  if (this.oPaths_.length > 1) {
    for (var i = 1; i < this.oPaths_.length; i++) {
      this.oPaths_[i]['remove']();
      this.oPaths_[i] =
        new paper['Path']['Circle'](this.oCenter, this.oRad / 2);
    }
  }

  // Set the size of the ball radial gradients.
  this.gradSize_ = this.oRad * 4;

  this.redraw();
};

/**
 * On each physics tick, adjust star positions.
 * @param {Float} delta Time since last tick.
 */
ww.mode.MetaBallMode.prototype.stepPhysics = function(delta) {
  goog.base(this, 'stepPhysics', delta);

  // Make sure the O does not move.
  this.world_.particles[0].pos.x = this.oX;
  this.world_.particles[0].pos.y = this.oY;

  var i;

  // Update positions and velocities for each ball.
  for (i = 0; i < this.world_.particles.length; i++) {
    if (this.world_.particles[i]['fixed'] === true) {
      this.world_.particles[i].pos.x = this.mouseX_;
      this.world_.particles[i].pos.y = this.mouseY_;
      this.oPaths_[i]['position']['x'] = this.mouseX_;
      this.oPaths_[i]['position']['y'] = this.mouseY_;
    }

    // Bounce off the sides of the window.
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

  /*if (this.wantsAudio_) {
    // Play each note if its corresponding ball exists.
    for (i = 0; i < this.sources_.length; i++) {
      if (this.world_.particles[i + 1]) {
        this.sources_[i].type = this.notes_[i]['type'];
        this.sources_[i].frequency.value = this.notes_[i]['frequency'];
        this.sources_[i].detune.value = this.notes_[i]['detune'];
      }
    }
  }*/

  // Draw the paper objects to the same positions as the coffee physics objects.
  for (i = 0; i < this.oPaths_.length; i++) {
    if (this.oPaths_[i] && this.world_.particles[i]) {
      this.oPaths_[i]['position']['x'] = this.world_.particles[i].pos.x;
      this.oPaths_[i]['position']['y'] = this.world_.particles[i].pos.y;
      if (!$("#mask-check")[0].checked && !$("#gradient-check")[0].checked) {
        this.oPaths_[i]['fillColor'] = 'black';
      } else {
        this.oPaths_[i]['fillColor'] = 'white';
      }
    }
  }

  if (this.oPaths_.length > 1) {
    this.drawConnections_(this.oPaths_);
  }
};

/**
 * Runs code on each requested frame.
 * @param {Number} delta Ms since last draw.
 */
ww.mode.MetaBallMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  if (!this.canvas_) { return; }

  // Clear both canvases every frame
  this.ctx_.clearRect(0, 0, this.canvas_.width + 1, this.canvas_.height + 1);
  this.gctx_.clearRect(0, 0, this.gcanvas_.width + 1, this.gcanvas_.height + 1);

  this.ctx_.fillStyle = '#d9d9d9';

  this.drawI_();

  // Loop through every ball and draw it and its gradient.
  for (var i = 0; i < this.ballCount_; i++) {
    this.drawGradients_(this.world_.particles[i]);
  }

  this.pctx_.save();

  // Make the ball canvas the source of the mask.
  if ($("#mask-check")[0].checked) {
    this.pctx_.globalCompositeOperation = 'source-atop';
  }

  // Set the blend mode for the gradients to lighter to make it look cool.
  // this.gctx_.globalCompositeOperation = 'lighter';
  // this.gctx_.globalAlpha = 0.75;

  // Draw the ball canvas onto the gradient canvas to complete the mask.
  if (0 < this.gcanvas_.height) {
    if ($("#gradient-check")[0].checked) {
      this.pctx_.drawImage(this.gcanvas_, 0, 0);
    } else {
      // this.ctx_.drawImage(this.gcanvas_, 0, 0);
    }
  }

  if (0 < this.paperCanvas_.height) {
    if ($("#mask-check")[0].checked) {
      this.ctx_.drawImage(this.paperCanvas_, 0, 0);
    } else if (!$("#mask-check")[0].checked &&
      $("#gradient-check")[0].checked) {
      
      this.ctx_.drawImage(this.gcanvas_, 0, 0);
    } else {
      this.ctx_.drawImage(this.paperCanvas_, 0, 0);
    }
  }

  this.pctx_.restore();
};
