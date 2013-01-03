goog.require('ww.mode.Core');
goog.provide('ww.mode.PongMode');

/**
 * @constructor
 */
ww.mode.PongMode = function() {
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

  /**
   * Assign each canvas element to a variable.
   */

  this.canvasOne = document.getElementById('canvas-one');
  this.canvasTwo = document.getElementById('canvas-two');
  this.canvasThree = document.getElementById('canvas-three');

  /**
   * Assign each canvas context to a variable if the elements exist.
   */
  this.ctxOne = canvasOne.getContext('2d');
  this.ctxTwo = canvasTwo.getContext('2d');
  this.ctxThree = canvasThree.getContext('2d');

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
  this.screenCenterX = screenWidthPixels / 2;
  this.screenCenterY = screenHeightPixels / 2;

  /**
   * Sets the mouse position to start at the screen center.
   */
  this.mouseX = screenCenterX;
  this.mouseY = screenCenterY;

  /**
   * Create ball.
   */
  this.ball = new Particle();
  this.ball.moveTo(new Vector(screenCenterX + (screenWidthPixels / 4), 0));
  var world = this.getPhysicsWorld_();
  this.ball.setRadius(50);
  this.ball.vel = new Vector(-1, 1);
  world.particles.push(this.ball);
};

ww.mode.PongMode.prototype['onclickBlah'] = function() {
  this.playSound('/sounds/cat/cat-1.mp3');
};

ww.mode.PongMode.drawI = function() {
  ctxOne.fillStyle = 'black';
  ctxOne.beginPath();

  var iWidth = 20;
  var iHeight = 200;

  var startX = screenCenterX - (screenWidthPixels / 4);
  var startY = mouseY - 100;

  if (startY < 1) {
    startY = 1;
  }

  ctxOne.rect(startX, mouseY - iHeight / 2, iWidth, iHeight);

  ctxOne.closePath();
  ctxOne.fill();
}

ww.mode.PongMode.moveBall = function(ball) {
  if (ball.pos.x <= 0) {
    ball.vel.x *= -1;
  }
  ball.pos.y;
}

ww.mode.PongMode.drawBall = function(ball) {
  ctxOne.beginPath();

  ctxOne.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2);

  ctxOne.fill();

  ctxOne.closePath();
}

ww.mode.PongMode.prototype.onFrame = function() {
  goog.base(this, 'onFrame');

  $(canvasOne).attr('width', window.innerWidth);
  $(canvasOne).attr('height', window.innerHeight);

  $(canvasTwo).attr('width', window.innerWidth);
  $(canvasTwo).attr('height', window.innerHeight);

  $(canvasThree).attr('width', window.innerWidth);
  $(canvasThree).attr('height', window.innerHeight);

  $(document).mousemove(function(e){
    mouseX = e.pageX;
    mouseY = e.pageY;
  });

  ww.mode.PongMode.drawI();
  ww.mode.PongMode.moveBall(ball);
  ww.mode.PongMode.drawBall(ball);
};
