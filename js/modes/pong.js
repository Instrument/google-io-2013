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
 * Function to initialize the current mode.
 * Creates canvas contexts and sets their size.
 * Sets initial variables.
 */
ww.mode.PongMode.prototype.init = function() {
  goog.base(this, 'init');

  /**
   * Assign each canvas element to a variable.
   */
  var canvasOne = document.getElementById('canvas-one');
  var canvasTwo = document.getElementById('canvas-two');
  var canvasThree = document.getElementById('canvas-three');

  /**
   * Assign each canvas context to a variable if the elements exist.
   */
  if(canvasOne.getContext) {
    var ctxOne = canvasOne.getContext('2d');
  }

  if(canvasTwo.getContext) {
    var ctxTwo = canvasTwo.getContext('2d');
  }

  if(canvasThree.getContext) {
    var ctxThree = canvasThree.getContext('2d');
  }

  /**
   * Set each canvas element to be the size of the viewport.
   */
  $('canvasOne').attr('width', window.innerWidth);
  $('canvasOne').attr('height', window.innerHeight);

  $('canvasTwo').attr('width', window.innerWidth);
  $('canvasTwo').attr('height', window.innerHeight);

  $('canvasThree').attr('width', window.innerWidth);
  $('canvasThree').attr('height', window.innerHeight);

  /**
   * Gets the center of the screen.
   */
  var screenCenterX = window.innerWidth / 2;
  var screenCenterY = window.innerHeight / 2;

  /**
   * Sets the mouse position to start at the screen center.
   */
  var mouseX = screenCenterX;
  var mouseY = screenCenterY;
};

ww.mode.PongMode.prototype['onclickBlah'] = function() {
  this.playSound('/sounds/cat/cat-1.mp3');
};

ww.mode.PongMode.drawI = function() {
  ctxOne.beginPath();

  ctxOne.moveTo(mouseX, mouseY);

  ctxOne.fill();
}

ww.mode.PongMode.prototype.draw = function() {
  goog.base(this, 'draw');

  $(document).mousemove(function(e){
    mouseX = e.pageX;
    mouseY = e.pageY;
  });

  ww.mode.PongMode.drawI();
};
