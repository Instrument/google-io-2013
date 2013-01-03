goog.require('ww.mode.Core');
goog.provide('ww.mode.CatMode');

/**
 * @constructor
 */
ww.mode.CatMode = function() {
  goog.base(this, 'cat', true, true);
};
goog.inherits(ww.mode.CatMode, ww.mode.Core);


/**
 * Function to initialize the current mode.
 * Creates canvas contexts and sets their size.
 */
ww.mode.CatMode.prototype.init = function() {
  goog.base(this, 'init');

  var canvasOne = document.getElementById('canvas-one');
  var canvasTwo = document.getElementById('canvas-two');
  var canvasThree = document.getElementById('canvas-three');

  if(canvasOne.getContext) {
    var ctxOne = canvasOne.getContext('2d');
  }

  if(canvasTwo.getContext) {
    var ctxTwo = canvasTwo.getContext('2d');
  }

  if(canvasThree.getContext) {
    var ctxThree = canvasThree.getContext('2d');
  }

  $('canvasOne').attr('width', window.innerWidth);
  $('canvasOne').attr('height', window.innerHeight);

  $('canvasTwo').attr('width', window.innerWidth);
  $('canvasTwo').attr('height', window.innerHeight);

  $('canvasThree').attr('width', window.innerWidth);
  $('canvasThree').attr('height', window.innerHeight);
};

ww.mode.CatMode.prototype['onclickBlah'] = function() {
  this.playSound('/sounds/cat/cat-1.mp3');
};

ww.mode.CatMode.prototype.draw = function() {
  goog.base(this, 'draw');
  console.log('test');
};
