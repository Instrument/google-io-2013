goog.require('ww.mode.Core');
goog.provide('ww.mode.MetaBallMode');

/**
 * @constructor
 */
ww.mode.MetaBallMode = function() {
  goog.base(this, 'metaball', true, true, true);

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
goog.inherits(ww.mode.MetaBallMode, ww.mode.Core);

/**
 * Play a sound by url after being processed by Tuna.
 * @private.
 * @param {String} filename Audio file name.
 * @param {Object} filter Audio filter name.
 */
ww.mode.MetaBallMode.prototype.playProcessedAudio_ = function(filename, filter) {
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

  // this.playProcessedAudio_('boing.wav', this.chorus_);
};

/**
 * Method called when activating the O.
 */
ww.mode.MetaBallMode.prototype.activateO = function() {
  this.oClicked_ = true;
  if (this.oMultiplier_ < 10) {
    this.oMultiplier_ += 2;
  }

  // this.playProcessedAudio_('boing.wav', this.delay_);
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

  this.ctx_.fill();
};

/**
 * Function to draw meta balls.
 * @param {Object} target The ball to draw.
 * @private
 */
ww.mode.MetaBallMode.prototype.drawBalls_ = function(target) {
  this.ctx_.save();

  this.ctx_.globalCompositeOperation = 'source-atop';

  this.ctx_.translate(target.pos.x - this.gradSize_,
    target.pos.y - this.gradSize_);

  var radGrad = this.ctx_.createRadialGradient(this.gradSize_,
    this.gradSize_, 0, this.gradSize_, this.gradSize_, this.gradSize_);

  radGrad.addColorStop(0, 'rgba(0,255,0,1)');
  radGrad.addColorStop(1, 'rgba(0,255,0,0)');

  this.ctx_.fillStyle = radGrad;

  this.ctx_.fillRect(0, 0, this.gradSize_ * 2, this.gradSize_ * 2);

  this.ctx_.restore();

  this.ctx_.arc(target.pos.x, target.pos.y, target.radius, 0, Math.PI * 2);

  this.ctx_.fill();  
};

/**
 * Function to draw meta ball gradients.
 * @param {Object} target The ball location to draw a gradient.
 * @private
 */
ww.mode.MetaBallMode.prototype.drawGradients_ = function(target) {
  this.gctx_.save();

  this.gctx_.translate(target.pos.x - this.gradSize_,
    target.pos.y - this.gradSize_);

  var radGrad = this.gctx_.createRadialGradient(this.gradSize_,
    this.gradSize_, 0, this.gradSize_, this.gradSize_, this.gradSize_);

  radGrad.addColorStop(0, 'rgba(255,0,0,1)');
  radGrad.addColorStop(1, 'rgba(255,0,0,0)');

  this.gctx_.fillStyle = radGrad;
  this.gctx_.fillRect(0, 0, this.gradSize_ * 4, this.gradSize_ * 4);

  this.gctx_.restore();
};

ww.mode.MetaBallMode.prototype.drawConnections_ = function(a, b) {
  // The draw distance between the x and y points of a and b 
  var drawX = (a.pos.x - b.pos.x);
  var drawY = (a.pos.y - b.pos.y);

  // The draw distance directly between a and b
  var drawDistance = Math.sqrt((drawX * drawX) + (drawY * drawY));

  // How far away the two circles can be before their connection breaks
  var breakPoint = (a.radius + b.radius) * 2.34 - ((a.radius / b.radius) + (b.radius / a.radius));

  // Angle between the two circles. All units are radians.
  var angle = -Math.atan2(a.pos.x - b.pos.x, a.pos.y - b.pos.y);

  // Modifies how much our dynamic circle coordinates will adjust
  var anchorModifier = (a.radius + b.radius);
  if (drawDistance <= anchorModifier / 1.25) {
    drawDistance = 1;
    anchorModifier = 1;
  } else {
    anchorModifier = Math.tan(drawDistance / anchorModifier);
  }

  // The x and y coordinates of each side of circle a
  var posXA1 = a.pos.x + a.radius * Math.cos(angle);
  var posXA2 = a.pos.x + a.radius * -Math.cos(angle);
  var posYA1 = a.pos.y + a.radius * Math.sin(angle);
  var posYA2 = a.pos.y + a.radius * -Math.sin(angle);

  // The x and y coordinates of each side of circle a based on distance from b
  var dynamicPosXA1 = a.pos.x + (a.radius / anchorModifier) * Math.cos(angle);
  var dynamicPosXA2 = a.pos.x + (a.radius / anchorModifier) * -Math.cos(angle);
  var dynamicPosYA1 = a.pos.y + (a.radius / anchorModifier) * Math.sin(angle);
  var dynamicPosYA2 = a.pos.y + (a.radius / anchorModifier) * -Math.sin(angle);

  // The x and y coordinates of each side of circle b
  var posXB1 = b.pos.x + b.radius * Math.cos(angle);
  var posXB2 = b.pos.x + b.radius * -Math.cos(angle);
  var posYB1 = b.pos.y + b.radius * Math.sin(angle);
  var posYB2 = b.pos.y + b.radius * -Math.sin(angle);

  // The x and y coordinates of each side of circle a based on distance from b
  var dynamicPosXB1 = b.pos.x + (b.radius / anchorModifier) * Math.cos(angle);
  var dynamicPosXB2 = b.pos.x + (b.radius / anchorModifier) * -Math.cos(angle);
  var dynamicPosYB1 = b.pos.y + (b.radius / anchorModifier) * Math.sin(angle);
  var dynamicPosYB2 = b.pos.y + (b.radius / anchorModifier) * -Math.sin(angle);

  /* 
   * Set anchor points for a quadratic curve at the midpoints between each
   * circle.
   */
  if (a.pos.x > b.pos.x) {
    var anchorMidpointX = ((a.pos.x - b.pos.x) / 2) + b.pos.x;
    var anchorX1 = ((dynamicPosXA1 - dynamicPosXB2) / 2) + b.pos.x;
    var anchorX2 = ((dynamicPosXA2 - dynamicPosXB1) / 2) + b.pos.x;
  } else {
    var anchorMidpointX = ((b.pos.x - a.pos.x) / 2) + a.pos.x;
    var anchorX1 = ((dynamicPosXB1 - dynamicPosXA2) / 2) + a.pos.x;
    var anchorX2 = ((dynamicPosXB2 - dynamicPosXA1) / 2) + a.pos.x;
  }

  if (a.pos.y > b.pos.y) {
    var anchorMidpointY = ((a.pos.y - b.pos.y) / 2) + b.pos.y;
    var anchorY1 = ((dynamicPosYA1 - dynamicPosYB2) / 2) + b.pos.y;
    var anchorY2 = ((dynamicPosYA2 - dynamicPosYB1) / 2) + b.pos.y;
  } else {
    var anchorMidpointY = ((b.pos.y - a.pos.y) / 2) + a.pos.y;
    var anchorY1 = ((dynamicPosYB1 - dynamicPosYA2) / 2) + a.pos.y;
    var anchorY2 = ((dynamicPosYB2 - dynamicPosYA1) / 2) + a.pos.y;
  }


  if (breakPoint > drawDistance) {
    this.ctx_.moveTo(posXA1, posYA1);
    this.ctx_.quadraticCurveTo(anchorX1, anchorY1, posXB1, posYB1);
    this.ctx_.lineTo(posXB2, posYB2);
    this.ctx_.quadraticCurveTo(anchorX2, anchorY2, posXA2, posYA2);
  }

  this.ctx_.fill();
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

  this.ctx_.strokeStyle = '#e5e5e5';
  this.ctx_.lineWidth = this.width_ * 0.01388889;

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

  this.world_ = this.getPhysicsWorld_();
  this.world_.viscosity = 0;

  this.world_.particles.push(new Particle());

  this.ballCount_ = this.world_.particles.length;

  // Gets the centerpoint of the viewport.
  this.screenCenterX_ = this.width_ / 2;
  this.screenCenterY_ = this.height_ / 2;

  /**
   * Sets the mouse position to start at the screen center.
   */
  this.mouseX_ = this.screenCenterX_;
  this.mouseY_ = this.screenCenterY_;

  // Set O's radius.
  this.oRad_ = (this.width_ * 0.1944444444) / this.ballCount_;

  // Set O's coordinates.
  this.oX_ = this.screenCenterX_ + this.oRad_;
  this.oY_ = this.screenCenterY_;

  // Set the size of the ball radial gradients.
  this.gradSize_ = this.oRad_ * 2;
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
  // this.ctx_.globalCompositeOperation = 'source-atop';
  this.ctx_.fillStyle = 'black';

  this.$gcanvas_ = $('#gradient-canvas');
  this.gcanvas_ = this.$gcanvas_[0];
  this.gcanvas_.width = this.width_;
  this.gcanvas_.height = this.height_;
  this.gctx_ = this.gcanvas_.getContext('2d');
  this.gctx_.globalCompositeOperation = 'destination-atop';

  this.ballCount_ = 1;

  var self = this;

  var downEvt = 'mousedown';
  $(document).bind(downEvt + '.metaball', function(e) {

    self.mouseX_ = e.pageX;
    self.mouseY_ = e.pageY;

    for (var i = 0; i < self.ballCount_; i++) {
      if (Math.abs(self.mouseX_ - self.world_.particles[i].pos.x) <
        self.world_.particles[i].radius &&
        Math.abs(self.mouseY_ - self.world_.particles[i].pos.y) <
        self.world_.particles[i].radius) {

        var activeBall = self.world_.particles[i];

        if (activeBall === self.world_.particles[0]) {
          self.world_.particles.push(new Particle());
          var newBall = self.world_.particles[self.world_.particles.length - 1];
          activeBall = newBall;
          this.ballCount_ = self.world_.particles.length;
        }
      }
    }
    var moveEvt = Modernizr.touch ? 'touchmove' : 'mousemove';
    $(document).bind(moveEvt + '.metaball', function(e) {
      self.mouseX_ = e.pageX;
      self.mouseY_ = e.pageY;

      if (activeBall) {
        activeBall.pos.x = self.mouseX_;
        activeBall.pos.y = self.mouseY_;
      }
    });

    var upEvt = 'mouseup';
    $(document).bind(upEvt + '.metaball', function(e) {
      $(document).unbind(upEvt + '.metaball');
      $(document).unbind(moveEvt + '.metaball');
    });
  });
};

/**
 * Event is called after a mode unfocused.
 */
ww.mode.MetaBallMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  var evt = Modernizr.touch ? 'touchmove' : 'mousemove';
  $(document).unbind(downEvt + '.metaball');
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
  this.oRad_ = (this.width_ * 0.1944444444) / this.ballCount_;

  // Set O's coordinates.
  this.oX_ = this.screenCenterX_ + this.oRad_;
  this.oY_ = this.screenCenterY_;

  // Set the size of the ball radial gradients.
  this.gradSize_ = this.oRad_ * 2;

  this.redraw();
};

/**
 * On each physics tick, adjust star positions.
 * @param {Float} delta Time since last tick.
 */
ww.mode.MetaBallMode.prototype.stepPhysics = function(delta) {
  goog.base(this, 'stepPhysics', delta);

  this.world_.particles[0].pos.x = this.oX_;
  this.world_.particles[0].pos.y = this.oY_;

  this.world_.particles[0].radius = this.oRad_;

  for (var i = 1; i < this.ballCount_; i++) {
    this.world_.particles[i].radius = this.oRad_ / 2;
  }
};

/**
 * Runs code on each requested frame.
 * @param {Integer} delta The timestep variable for animation accuracy.
 */
ww.mode.MetaBallMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  if (!this.canvas_) { return; }

  this.ctx_.clearRect(0, 0, this.canvas_.width + 1, this.canvas_.height + 1);
  this.gctx_.clearRect(0, 0, this.canvas_.width + 1, this.canvas_.height + 1);

  this.ctx_.beginPath();
  this.gctx_.beginPath();

  this.drawI_();

  for (var i = 0; i < this.ballCount_; i++) {
    this.drawBalls_(this.world_.particles[i]);
    this.drawGradients_(this.world_.particles[i]);
  }

  for (var i = 0; i < this.ballCount_; i++) {
    for (var ii = 0; ii < this.ballCount_; ii++) {
      this.drawConnections_(this.world_.particles[i], this.world_.particles[ii]);
    }
  }

  this.drawSlash_();

  this.ctx_.closePath();
  this.gctx_.closePath();

  this.gctx_.save();

  this.gctx_.drawImage(this.canvas_, 0, 0);

  this.gctx_.restore();
};
