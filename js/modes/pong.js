goog.require('ww.mode.Core');
goog.provide('ww.mode.PongMode');

/**
 * @constructor
 */
ww.mode.PongMode = function() {
  goog.base(this, 'pong', true, true, true);

  var self = this;

  $(document).mousemove(function(e){
    self.mouseX = e.pageX;
    self.mouseY = e.pageY;
  });
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
  this.getPaperCanvas_();

  /**
   * Assign each canvas element to a variable.
   */

  this.canvasOne = document.getElementById('canvas-one');
  this.canvasTwo = document.getElementById('canvas-two');
  this.canvasThree = document.getElementById('canvas-three');

  /**
   * Assign each canvas context to a variable if the elements exist.
   */
  this.ctxOne = this.canvasOne.getContext('2d');
  this.ctxTwo = this.canvasTwo.getContext('2d');
  this.ctxThree = this.canvasThree.getContext('2d');

  /**
   * Set each canvas element to be the size of the viewport.
   */
  $(this.canvasOne).attr('width', window.innerWidth);
  $(this.canvasOne).attr('height', window.innerHeight);

  $(this.canvasTwo).attr('width', window.innerWidth);
  $(this.canvasTwo).attr('height', window.innerHeight);

  $(this.canvasThree).attr('width', window.innerWidth);
  $(this.canvasThree).attr('height', window.innerHeight);

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
  this.mouseX = this.screenCenterX;
  this.mouseY = this.screenCenterY;

  var world = this.getPhysicsWorld_();
  world['viscosity'] = 0;

  /**
   * Create paddle.
   */
  var paddleWidth = 20;
  var paddleHeight = 200;
  var paddleX = this.screenCenterX - (this.screenWidthPixels / 4);
  var paddleY = this.mouseY - paddleHeight / 2;

  var paddleTopLeft = new paper['Point'](paddleX, paddleY);
  var paddleSize = new paper['Size'](paddleWidth, paddleHeight);
  this.paddle = new paper['Rectangle'](paddleTopLeft, paddleSize);
  this.paperPaddle = new paper['Path']['Rectangle'](this.paddle);
  this.paperPaddle['fillColor'] = 'black';

  /**
   * Create ball.
   */
  var startXBall = this.screenCenterX + (this.screenWidthPixels / 4);
  var rad = 50;
  var paperBall = new paper['Path']['Circle'](new paper['Point'](startXBall,
    rad), rad);
  paperBall['fillColor'] = 'black';

  this.ball = new Particle();
  this.ball['setRadius'](rad);
  this.ball['moveTo'](new Vector(startXBall, rad));
  this.ball['drawObj'] = paperBall;
  this.ball['vel'] = new Vector(-50, 50);
  world['particles'].push(this.ball);
};

ww.mode.PongMode.prototype.drawPaddle = function() {
  this.ctxOne.fillStyle = 'black';
  this.ctxOne.beginPath();

  this.ctxOne.rect(this.paddleX, this.paddleY,
    this.paddleWidth, this.paddleHeight);

  this.ctxOne.closePath();
  this.ctxOne.fill();
};

ww.mode.PongMode.prototype.moveBall = function(target) {
  /**
   * Window boundary collision detection.
   */
  if (target['pos']['x'] < target['radius']
    || target['pos']['x'] > this.screenWidthPixels - target['radius']) {
    target['vel']['x'] *= -1;
  }

  if (target['pos']['y'] > this.screenHeightPixels - target['radius'] || target['pos']['y'] < target['radius']) {
    target['vel']['y'] *= -1;
  }

  /**
   * Paddle collision detection.
   */
  var paddleTop = (this.paddleY - this.paddleHeight / 2) - target['radius'];
  var paddleBottom = this.paddleY + this.paddleHeight / 2 + target['radius'];

  if (target['pos']['x'] < (this.paddleX + target['radius'])
      + this.paddleWidth / 2
    && (target['pos']['y'] > paddleTop && target['pos']['y'] < paddleBottom)) {
    target['vel']['x'] *= -1;
  }
};

ww.mode.PongMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  $(this.canvasOne).attr('width', window.innerWidth);
  $(this.canvasOne).attr('height', window.innerHeight);

  $(this.canvasTwo).attr('width', window.innerWidth);
  $(this.canvasTwo).attr('height', window.innerHeight);

  $(this.canvasThree).attr('width', window.innerWidth);
  $(this.canvasThree).attr('height', window.innerHeight);

  var currentPaddleY = this.mouseY - this.paddle['size']['_height'] / 2;
  var targetPaddleY = this.mouseY - this.paddle['size']['_height'] / 2;
  this.paperPaddle['position']['_y'] = currentPaddleY +
    ((targetPaddleY - currentPaddleY) * 0.5 * (delta/100));


  // this.drawPaddle();
  this.moveBall(this.ball);
};
