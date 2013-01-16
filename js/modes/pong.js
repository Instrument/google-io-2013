goog.require('ww.mode.Core');
goog.provide('ww.mode.PongMode');

var TWOPI = Math.PI * 2;

/**
 * @constructor
 */
ww.mode.PongMode = function() {
  this.startBallSpeed_ = this.ballSpeed_ = 250;
  this.maxBallSpeed_ = 800;
  this.startBallRadius_ = this.ballRadius_ = 30;
  this.minBallRadius_ = 10;
  this.paddleX_ = 40;
  this.paddleY_ = 80;
  this.paddleWidth_ = 40;
  this.paddleHeight_ = 160;

  this['topWallOpacity_'] = 0;
  this['rightWallOpacity_'] = 0;
  this['bottomWallOpacity_'] = 0;

  goog.base(this, 'pong', true, true, true);
  this.preloadSound('1.wav');
  this.preloadSound('2.wav');
};
goog.inherits(ww.mode.PongMode, ww.mode.Core);

/**
 * Function to initialize the current mode.
 * Creates canvas contexts and sets their size.
 * Sets initial variables.
 */
ww.mode.PongMode.prototype.init = function() {
  goog.base(this, 'init');

  var world = this.getPhysicsWorld_();
  world.viscosity = 0;

  /**
   * Create ball.
   */
  this.ball_ = this.ball_ || new Particle();
  world.particles.push(this.ball_);

  /**
   * Gets the width of the viewport and its center point.
   */
  this.screenCenterX = this.width_ / 2;
  this.screenCenterY = this.height_ / 2;

  /**
   * Sets the mouse position to start at the screen center.
   */
  this.mouseX_ = this.screenCenterX;
  this.mouseY_ = this.screenCenterY;

  /**
   * Create paddle.
   */
  this.paddleY_ = this.mouseY_ - this.paddleHeight_ / 2;
  this.resetGame_();
};

/**
 * Reset the ball to its starting position.
 * @private
 */
ww.mode.PongMode.prototype.resetGame_ = function() {
  this.setScore_(0);

  this['topWallOpacity_'] = 0;
  this['rightWallOpacity_'] = 0;
  this['bottomWallOpacity_'] = 0;

  this.ballRadius_ = this.startBallRadius_;
  this.ballSpeed_ = this.startBallSpeed_;
  this.startXBall_ = this.screenCenterX + (this.width_ / 4);

  this.ball_.setRadius(this.ballRadius_);
  this.ball_.pos.x = this.startXBall_;
  this.ball_.pos.y = this.ballRadius_;
  this.ball_.vel.x = -this.ballSpeed_;
  this.ball_.vel.y = this.ballSpeed_;
};

ww.mode.PongMode.prototype.onResize = function(redraw) {
  goog.base(this, 'onResize', false);

  if (this.canvas_) {
    this.canvas_.width = this.width_;
    this.canvas_.height = this.height_;
  }

  if (redraw) {
    this.redraw();
  }
};

/**
 * Bind mouse/touch events which focus is gained.
 */
ww.mode.PongMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  this.$score_ = $('#score');

  this.$canvas_ = $('#pong-canvas');
  this.canvas_ = this.$canvas_[0];
  this.canvas_.width = this.width_;
  this.canvas_.height = this.height_;
  this.ctx_ = this.canvas_.getContext('2d');

  var self = this;
  var evt = Modernizr.touch ? 'touchmove' : 'mousemove';

  this.$canvas_.bind(evt + '.pong', function(e) {
    e.preventDefault();
    e.stopPropagation();

    self.mouseX_ = e.pageX;
    self.mouseY_ = e.pageY;
  });
};

/**
 * Unbind mouse/touch events which focus is lost.
 */
ww.mode.PongMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  var evt = Modernizr.touch ? 'touchmove' : 'mousemove';
  this.$canvas_.unbind(evt + '.pong');
};

/**
 * Pulse walls when they are hit.
 * @private
 * @param {String} wall Wall name.
 */
ww.mode.PongMode.prototype.hitWall_ = function(wall) {
  this.playSound('1.wav');

  var key = wall + 'Opacity_';

  var inFromParams = {};
  inFromParams[key] = this[key];

  var inToParams = {};
  inToParams[key] = 1;

  var self = this;

  var fadeInTween = new TWEEN.Tween(inFromParams);
  fadeInTween.to(inToParams, 200);
  fadeInTween.onUpdate(function() {
    self[key] = this[key];
  });

  this.addTween(fadeInTween);
};

/**
 * When the paddle hits the ball.
 * @private
 */
ww.mode.PongMode.prototype.hitPaddle_ = function() {
  this.playSound('2.wav');


  var newScore = this.score_ + 1;

  if ((this['topWallOpacity_'] > 0) && (this['rightWallOpacity_'] > 0) && (this['bottomWallOpacity_'] > 0)) {
    newScore += 3;
  }

  this.setScore_(newScore);

  // Clear sides
  var self = this;
  var fadeOutTween = new TWEEN.Tween({
    'topWallOpacity': this['topWallOpacity_'],
    'rightWallOpacity': this['rightWallOpacity_'],
    'bottomWallOpacity': this['bottomWallOpacity_']
  });
  fadeOutTween.to({
    'topWallOpacity': 0,
    'rightWallOpacity': 0,
    'bottomWallOpacity': 0
  }, 200);
  fadeOutTween.onUpdate(function() {
    self['topWallOpacity_'] = this['topWallOpacity'];
    self['rightWallOpacity_'] = this['rightWallOpacity'];
    self['bottomWallOpacity_'] = this['bottomWallOpacity'];
  });

  this.addTween(fadeOutTween);

  // Add points
};

/**
 * When the paddle misses the ball, it's game over.
 * @private
 */
ww.mode.PongMode.prototype.gameOver_ = function() {
  this.log('You Lose');
  this.showReload();
};

/**
 * Update the score.
 * @private
 * @param {Number} val The new score.
 */
ww.mode.PongMode.prototype.setScore_ = function(val) {
  this.score_ = val;
  if (this.$score_ && this.$score_.length) {
    this.$score_.text(this.score_);
  }
};

/**
 * Handle collisions.
 * @private
 */
ww.mode.PongMode.prototype.reflectBall_ = function() {
  /**
   * Window boundary collision detection.
   */
  if (this.ball_.pos.x <= this.ball_.radius) {
    this.gameOver_();
  }

  var self;
  if ((this.ball_.vel.x > 0) &&
      (this.ball_.pos.x >= this.width_ - this.ball_.radius)) {
    this.ball_.vel.x *= -1;
    this.hitWall_('rightWall');
  }

  if ((this.ball_.vel.y > 0) &&
     (this.ball_.pos.y >= this.height_ - this.ball_.radius)) {
    this.ball_.vel.y *= -1;
    this.hitWall_('bottomWall');
  }

  if ((this.ball_.vel.y < 0) &&
      (this.ball_.pos.y <= this.ball_.radius)) {
    this.ball_.vel.y *= -1;
    this.hitWall_('topWall');
  }

  /**
   * Paddle collision detection.
   */
  var paddleTop = this.paddleY_ - (this.paddleHeight_ / 2);
  var paddleBottom = this.paddleY_ + (this.paddleHeight_ / 2);

  if (
    (this.ball_.vel.x < 0) &&
    (this.ball_.pos.x <= (this.paddleX_ + (this.paddleWidth_ / 2) + this.ball_.radius)) &&
    (this.ball_.pos.y >= paddleTop) &&
    (this.ball_.pos.y <= paddleBottom)
  ) {
    this.ball_.vel.x *= -1;

    var mag = this.ball_.vel.mag();

    if (!this.norm_) {
      this.norm_ = this.ball_.vel.clone();
    } else {
      this.norm_.copy(this.ball_.vel);
    }

    this.norm_.norm();

    this.changeVec_ = this.changeVec_ || new Vector();
    var diff = (this.ball_.pos.y - this.paddleY_) / (this.paddleHeight_ / 2);
    this.changeVec_.set(0, diff);

    this.norm_.add(this.changeVec_);
    this.norm_.norm();
    this.norm_.scale(mag);

    this.ball_.vel.copy(this.norm_);

    this.hitPaddle_();
  }
};

/**
 * On each physics tick, check for collisions and adjust speed.
 * @param {Float} delta Time since last tick.
 */
ww.mode.PongMode.prototype.stepPhysics = function(delta) {
  goog.base(this, 'stepPhysics', delta);

  var currentPaddleY = this.paddleY_;
  var targetPaddleY = this.mouseY_;

  // Min/Max top bottom
  if (targetPaddleY < (this.paddleHeight_ / 2)) {
    targetPaddleY = this.paddleHeight_ / 2;
  } else if (targetPaddleY > (this.height_ - (this.paddleHeight_ / 2))) {
    targetPaddleY = this.height_ - (this.paddleHeight_ / 2);
  }

  var newPaddleY = currentPaddleY + ((targetPaddleY - currentPaddleY) * 0.5 * (delta * 10));
  this.paddleY_ = newPaddleY;

  // Speed up
  if (this.ball_.vel.x > 0) {
    if (this.ballRadius_ >= this.minBallRadius_) {
      this.ballRadius_ *= 0.9995;
      this.ball_.setRadius(this.ballRadius_);
    }

    if (this.ballSpeed_ <= this.maxBallSpeed_) {
      this.ballSpeed_ *= 1.001;
      this.ball_.vel.x = (this.ball_.vel.x < 0) ? -this.ballSpeed_ : this.ballSpeed_;
      this.ball_.vel.y = (this.ball_.vel.y < 0) ? -this.ballSpeed_ : this.ballSpeed_;
    }
  }

  this.reflectBall_();
};

ww.mode.PongMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  if (!this.canvas_) { return; }

  this.ctx_.clearRect(0, 0, this.canvas_.width + 1, this.canvas_.height + 1);

  this.ctx_.fillStyle = '#e0493e';
  this.ctx_.beginPath();
  this.ctx_.arc(this.ball_.pos.x, this.ball_.pos.y, this.ball_.radius, 0, TWOPI);
  this.ctx_.fill();

  this.ctx_.fillStyle = '#d0d0d0';
  this.ctx_.fillRect(this.paddleX_ - (this.paddleWidth_ / 2), this.paddleY_ - (this.paddleHeight_ / 2), this.paddleWidth_, this.paddleHeight_);

  this.ctx_.fillStyle = '#f3cdca';

  if (this['topWallOpacity_'] > 0.0) {
    this.ctx_.save();
    this.ctx_.globalAlpha = this['topWallOpacity_'];
    this.ctx_.fillRect(0, 0, this.width_, 10);
    this.ctx_.restore();
  }

  if (this['bottomWallOpacity_'] > 0.0) {
    this.ctx_.save();
    this.ctx_.globalAlpha = this['bottomWallOpacity_'];
    this.ctx_.fillRect(0, this.height_ - 10, this.width_, 10);
    this.ctx_.restore();
  }

  if (this['rightWallOpacity_'] > 0.0) {
    this.ctx_.save();
    this.ctx_.globalAlpha = this['rightWallOpacity_'];
    this.ctx_.fillRect(this.width_ - 10, 0, 10, this.height_);
    this.ctx_.restore();
  }
};
