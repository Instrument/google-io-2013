goog.require('ww.mode.Core');
goog.provide('ww.mode.PongMode');

/**
 * @constructor
 */
ww.mode.PongMode = function() {
  this.startBallSpeed_ = this.ballSpeed_ = 250;
  this.maxBallSpeed_ = 800;
  this.startBallRadius_ = this.ballRadius_ = 30;
  this.minBallRadius_ = 10;
  this.paddleWidth_ = 10;
  this.paddleHeight_ = 140;

  goog.base(this, 'pong', true, true, true);
};
goog.inherits(ww.mode.PongMode, ww.mode.Core);

/**
 * Function to initialize the current mode.
 * Creates canvas contexts and sets their size.
 * Sets initial variables.
 */
ww.mode.PongMode.prototype.init = function() {
  goog.base(this, 'init');

  // Prep paperjs
  var can = this.getPaperCanvas_();
  var ctx = can.getContext('2d');
  var prefixed = Modernizr['prefixed']('imageSmoothingEnabled');
  ctx[prefixed] = false;

  /**
   * Gets the width of the viewport and its center point.
   */

  this.screenWidthPixels = window.innerWidth;
  this.screenHeightPixels = window.innerHeight;
  this.screenCenterX = this.screenWidthPixels / 2;
  this.screenCenterY = this.screenHeightPixels / 2;

  /**
   * Sets the mouse position to start at the screen center.
   */
  this.mouseX_ = this.screenCenterX;
  this.mouseY_ = this.screenCenterY;

  var world = this.getPhysicsWorld_();
  world['viscosity'] = 0;

  /**
   * Create paddle.
   */
  // var paddleX = this.screenCenterX - (this.screenWidthPixels / 4);
  var paddleX = this.paddleWidth_ / 2;
  var paddleY = this.mouseY_ - this.paddleHeight_ / 2;

  var paddleTopLeft = new paper['Point'](paddleX, paddleY);
  var paddleSize = new paper['Size'](this.paddleWidth_, this.paddleHeight_);
  this.paperPaddle_ = new paper['Path']['RoundRectangle'](
    new paper['Rectangle'](paddleTopLeft, paddleSize),
    new paper['Size'](5, 5)
  );
  this.paperPaddle_['fillColor'] = 'white';

  this.topWall_ = new paper['Path']['Rectangle'](
    new paper['Rectangle'](
      new paper['Point'](0, 0),
      new paper['Size'](window.innerWidth, 10)
    )
  );
  this.topWall_['fillColor'] = 'orange';
  this.topWall_['opacity'] = 0;

  this.bottomWall_ = new paper['Path']['Rectangle'](
    new paper['Rectangle'](
      new paper['Point'](0, window.innerHeight - 10),
      new paper['Size'](window.innerWidth, 10)
    )
  );
  this.bottomWall_['fillColor'] = 'orange';
  this.bottomWall_['opacity'] = 0;

  this.rightWall_ = new paper['Path']['Rectangle'](
    new paper['Rectangle'](
      new paper['Point'](window.innerWidth - 10, 0),
      new paper['Size'](10, window.innerHeight)
    )
  );
  this.rightWall_['fillColor'] = 'orange';
  this.rightWall_['opacity'] = 0;

  /**
   * Create ball.
   */
  this.ball = new Particle();
  this.resetBall_();
  world['particles'].push(this.ball);
};

ww.mode.PongMode.prototype.resetBall_ = function() {
  this.ballRadius_ = this.startBallRadius_;
  this.ballSpeed_ = this.startBallSpeed_;

  if (this.paperBall) {
    this.paperBall['remove']();
  }

  this.startXBall_ = this.screenCenterX + (this.screenWidthPixels / 4);

  this.paperBall = new paper['Path']['Circle'](
    new paper['Point'](this.startXBall_, this.ballRadius_ * 3),
    this.ballRadius_
  );
  this.paperBall['fillColor'] = 'white';

  this.ball['setRadius'](this.ballRadius_);
  this.ball['moveTo'](new Vector(this.startXBall_, this.ballRadius_));
  this.ball['vel'] = new Vector(-this.ballSpeed_, this.ballSpeed_);
  this.ball['drawObj'] = this.paperBall;
};

ww.mode.PongMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  var self = this;
  var canvas = this.getPaperCanvas_();
  var evt = Modernizr['touch'] ? 'touchmove' : 'mousemove';

  $(canvas).bind(evt, function(e){
    e.preventDefault();
    e.stopPropagation();

    self.mouseX_ = e.pageX;
    self.mouseY_ = e.pageY;
  });
};

ww.mode.PongMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  var canvas = this.getPaperCanvas_();
  var evt = Modernizr['touch'] ? 'touchmove' : 'mousemove';

  $(canvas).unbind(evt);
};

ww.mode.PongMode.prototype.hitWall_ = function(wall) {
  this.playSound('1.wav');

  var t = new TWEEN['Tween']({ 'opacity': 0 })['to']({ 'opacity': 1 }, 400)['onUpdate'](function() {
    wall['opacity'] = this['opacity'];
  });

  var t2 = new TWEEN['Tween']({ 'opacity': 1 })['to']({ 'opacity': 0 }, 400)['delay'](800)['onUpdate'](function() {
    wall['opacity'] = this['opacity'];
  });

  this.addTween(t);
  this.addTween(t2);
};

ww.mode.PongMode.prototype.hitPaddle_ = function() {
  this.playSound('2.wav');
};

ww.mode.PongMode.prototype.gameOver_ = function() {
  this.log('You Lose');
  this.resetBall_();
};

ww.mode.PongMode.prototype.reflectBall_ = function() {
  /**
   * Window boundary collision detection.
   */
  if (this.ball['pos']['x'] <= this.ball['radius']) {
    this.gameOver_();
  }

  var self;
  if ((this.ball['vel']['x'] > 0) &&
      (this.ball['pos']['x'] >= this.screenWidthPixels - this.ball['radius'])) {
    this.ball['vel']['x'] *= -1;
    this.hitWall_(this.rightWall_);
  }

  if ((this.ball['vel']['y'] > 0) &&
     (this.ball['pos']['y'] >= this.screenHeightPixels - this.ball['radius'])) {
    this.ball['vel']['y'] *= -1;
    this.hitWall_(this.bottomWall_);
  }

  if ((this.ball['vel']['y'] < 0) &&
      (this.ball['pos']['y'] <= this.ball['radius'])) {
    this.ball['vel']['y'] *= -1;
    this.hitWall_(this.topWall_);
  }

  /**
   * Paddle collision detection.
   */
  var paddleTop = this.paperPaddle_['position']['y'] - (this.paddleHeight_ / 2);
  var paddleBottom = this.paperPaddle_['position']['y'] + (this.paddleHeight_ / 2);

  if (
    (this.ball['vel']['x'] < 0) &&
    (this.ball['pos']['x'] <= (this.paperPaddle_['position']['x'] + (this.paddleWidth_ / 2) + this.ball['radius'])) &&
    (this.ball['pos']['y'] >= paddleTop) &&
    (this.ball['pos']['y'] <= paddleBottom)
  ) {
    this.ball['vel']['x'] *= -1;

    var mag = this.ball['vel']['mag']();

    if (!this.norm_) {
      this.norm_ = this.ball['vel']['clone']();
    } else {
      this.norm_['copy'](this.ball['vel']);
    }

    this.norm_['norm']();

    this.changeVec_ = this.changeVec_ || new Vector();
    var diff = (this.ball['pos']['y'] - this.paperPaddle_['position']['y']) / (this.paddleHeight_ / 2);
    this.changeVec_['set'](0, diff);

    this.norm_['add'](this.changeVec_);
    this.norm_['norm']();
    this.norm_['scale'](mag);

    this.ball['vel']['copy'](this.norm_);

    this.hitPaddle_();
  }

  // if (this.ball['pos']['x'] < (this.paperPaddle_['position']['x'] + this.ball['radius'] + (this.paddleWidth / 2)) &&
  //   (this.ball['pos']['y'] < paddleTop && this.ball['pos']['y'] > paddleBottom)) {
  //   alert('derp');
  //   this.ball['vel']['x'] *= -1;
  //   this.hitPaddle_();
  // }
};

ww.mode.PongMode.prototype.stepPhysics = function(delta) {
  goog.base(this, 'stepPhysics', delta);

  var currentPaddleY = this.paperPaddle_['position']['y'];
  var targetPaddleY = this.mouseY_;
  
  // Min/Max top bottom
  if (targetPaddleY < (this.paddleHeight_ / 2)) {
    targetPaddleY = this.paddleHeight_ / 2;
  } else if (targetPaddleY > (this.height_ - (this.paddleHeight_ / 2))) {
    targetPaddleY = this.height_ - (this.paddleHeight_ / 2);
  }

  var newPaddleY = currentPaddleY + ((targetPaddleY - currentPaddleY) * 0.5 * (delta * 10));
  this.paperPaddle_['position']['y'] = newPaddleY;

  // Speed up
  if (this.ballRadius_ >= this.minBallRadius_) {
    this.ballRadius_ *= 0.9995;
    this.ball['setRadius'](this.ballRadius_);
    this.paperBall['scale'](0.9995);
  }

  if (this.ballSpeed_ <= this.maxBallSpeed_) {
    this.ballSpeed_ *= 1.001;
    this.ball['vel']['x'] = (this.ball['vel']['x'] < 0) ? -this.ballSpeed_ : this.ballSpeed_;
    this.ball['vel']['y'] = (this.ball['vel']['y'] < 0) ? -this.ballSpeed_ : this.ballSpeed_;
  }

  this.reflectBall_();
};

// ww.mode.PongMode.prototype.onFrame = function(delta) {
//   goog.base(this, 'onFrame', delta);
// };
