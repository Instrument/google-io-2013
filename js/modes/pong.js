goog.require('ww.mode.Core');
goog.provide('ww.mode.PongMode');

/**
 * @constructor
 */
ww.mode.PongMode = function() {
  goog.base(this, 'pong', true, true);
};
goog.inherits(ww.mode.PongMode, ww.mode.Core);

/**
 * A ball object with position and veloctity.
 * Creates canvas contexts and sets their size.
 * Sets initial variables.
 */
ww.mode.PongMode.prototype.ball = function(pX, pY, vX, vY, radius) {
  this.pX = screenCenterX + (screenWidthPixels / 4);
  this.pY = screenCenterY;
  this.vX = -1;
  this.vY = 1;
  this.radius = 50;
}

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
  this.canvasOne;
  this.canvasTwo;
  this.canvasThree;

  canvasOne = document.getElementById('canvas-one');
  canvasTwo = document.getElementById('canvas-two');
  canvasThree = document.getElementById('canvas-three');

  /**
   * Assign each canvas context to a variable if the elements exist.
   */
  this.ctxOne;
  this.ctxTwo;
  this.ctxThree;

  if(canvasOne.getContext) {
    ctxOne = canvasOne.getContext('2d');
  }

  if(canvasTwo.getContext) {
    ctxTwo = canvasTwo.getContext('2d');
  }

  if(canvasThree.getContext) {
    ctxThree = canvasThree.getContext('2d');
  }

  /**
   * Set each canvas element to be the size of the viewport.
   */
  $(canvasOne).attr('width', window.innerWidth);
  $(canvasOne).attr('height', window.innerHeight);

  $(canvasTwo).attr('width', window.innerWidth);
  $(canvasTwo).attr('height', window.innerHeight);

  $(canvasThree).attr('width', window.innerWidth);
  $(canvasThree).attr('height', window.innerHeight);

  /**
   * Gets the width of the viewport and its center point.
   */
  this.screenWidthPixels;
  this.screenHeightPixels;
  this.screenCenterX;
  this.screenCenterY;

  screenWidthPixels = window.innerWidth;
  screenHeightPixels = window.innerHeight;
  screenCenterX = screenWidthPixels / 2;
  screenCenterY = screenHeightPixels / 2;

  /**
   * Sets the mouse position to start at the screen center.
   */
  this.mouseX;
  this.mouseY;

  mouseX = screenCenterX;
  mouseY = screenCenterY;
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

  ctxOne.fill();
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
};
