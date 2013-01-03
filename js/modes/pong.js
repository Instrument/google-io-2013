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

  var startX = this.screenCenterX + (this.screenWidthPixels / 4);

  /**
   * Create ball.
   */
  this.ball = new Particle();
  this.ball['setRadius'](50);
  this.ball['moveTo'](new Vector(startX, this.ball['radius']));
  var world = this.getPhysicsWorld_();
  this.ball['vel'] = new Vector(-1, 1);
  world['particles'].push(this.ball);
};

ww.mode.PongMode.prototype['onclickBlah'] = function() {
  this.playSound('/sounds/cat/cat-1.mp3');
};

ww.mode.PongMode.prototype.drawI = function() {
  this.ctxOne.fillStyle = 'black';
  this.ctxOne.beginPath();

  var iWidth = 20;
  var iHeight = 200;

  var startX = this.screenCenterX - (this.screenWidthPixels / 4);
  var startY = mouseY - 100;

  if (startY < 1) {
    startY = 1;
  }

  this.ctxOne.rect(startX, this.mouseY - iHeight / 2, iWidth, iHeight);

  this.ctxOne.closePath();
  this.ctxOne.fill();
}

ww.mode.PongMode.prototype.moveBall = function(target) {
  if (target['pos']['x'] < target['radius'] || target['pos']['x'] > this.screenWidthPixels - target['radius']) {
    target['vel']['x'] *= -1;
  }

  if (target['pos']['y'] > this.screenHeightPixels - target['radius'] || target['pos']['y'] < target['radius']) {
    target['vel']['y'] *= -1;
  }
}

ww.mode.PongMode.prototype.drawBall = function(target) {
  this.ctxOne.beginPath();

  this.ctxOne.arc(target['pos']['x'], target['pos']['y'], target['radius'], 0, Math.PI * 2);

  this.ctxOne.fill();

  this.ctxOne.closePath();
}

ww.mode.PongMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  $(this.canvasOne).attr('width', window.innerWidth);
  $(this.canvasOne).attr('height', window.innerHeight);

  $(this.canvasTwo).attr('width', window.innerWidth);
  $(this.canvasTwo).attr('height', window.innerHeight);

  $(this.canvasThree).attr('width', window.innerWidth);
  $(this.canvasThree).attr('height', window.innerHeight);

  var self = this;

  $(document).mousemove(function(e){
    self.mouseX = e.pageX;
    self.mouseY = e.pageY;
  });

  this.drawI();
  // this.moveBall(this.ball);
  this.drawBall(this.ball);
};
