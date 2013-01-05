goog.require('ww.mode.Core');
goog.provide('ww.mode.PinataMode');

/**
 * @constructor
 */
ww.mode.PinataMode = function() {
  goog.base(this, 'pinata', true, true, true);
};
goog.inherits(ww.mode.PinataMode, ww.mode.Core);

ww.mode.PinataMode.PARTY_COLORS = ['#EB475A', '#E05A91', '#925898',
                                   '#E96641','#19A281', '#FAD14A'];

ww.mode.PinataMode.prototype.init = function() {
  goog.base(this, 'init');
  
  var self = this;

  var evt;
  if (this.hasTouch) {
    evt = 'tap';
  } else {
    evt = 'click';
  }

  // Prepare PaperJs
  var can = this.getPaperCanvas_();
  var ctx = can.getContext('2d');
  var prefixed = Modernizr['prefixed']('imageSmoothingEnabled');
  ctx[prefixed] = false;

  this.pinata = $('#pinata');
  this.pinata.css('opacity', '1');

  // Prepare canvas, especially for retina
  this.canvas = document.getElementById('confetti');
  this.ctx = this.canvas.getContext('2d');

  this.width = $(window).width();
  this.height = $(window).height();

  this.canvas.width = this.width;
  this.canvas.height = this.height;

  var devicePixelRatio = window['devicePixelRatio'] || 1,
      backingStoreRatio = this.ctx.webkitBackingStorePixelRatio ||
                          this.ctx.mozBackingStorePixelRatio ||
                          this.ctx.msBackingStorePixelRatio ||
                          this.ctx.oBackingStorePixelRatio ||
                          this.ctx.backingStorePixelRatio || 1,
      ratio = devicePixelRatio / backingStoreRatio;

  if (devicePixelRatio !== backingStoreRatio) {
      var oldWidth = this.canvas.width;
      var oldHeight = this.canvas.height;

      this.canvas.width = oldWidth * ratio;
      this.canvas.height = oldHeight * ratio;

      this.canvas.style.width = oldWidth + 'px';
      this.canvas.style.height = oldHeight + 'px';

      this.ctx.scale(ratio, ratio);
  }

  this.balls = [];
  // this.group = new paper['Group']();

  this.createWalls();
};

ww.mode.PinataMode.prototype.createWalls = function() {
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

  this.leftWall_ = new paper['Path']['Rectangle'](
    new paper['Rectangle'](
      new paper['Point'](-10, 0),
      new paper['Size'](10, window.innerHeight)
    )
  );
  this.leftWall_['fillColor'] = 'orange';
  this.leftWall_['opacity'] = 0;

  this.rightWall_ = new paper['Path']['Rectangle'](
    new paper['Rectangle'](
      new paper['Point'](window.innerWidth - 10, 0),
      new paper['Size'](10, window.innerHeight)
    )
  );
  this.rightWall_['fillColor'] = 'orange';
  this.rightWall_['opacity'] = 0;

  // this.group['addChild'](this.topWall_);
  // this.group['addChild'](this.bottomWall_);
  // this.group['addChild'](this.leftWall_);
  // this.group['addChild'](this.rightWall_);
};

ww.mode.PinataMode.prototype.drawParticles = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);

};

ww.mode.PinataMode.prototype.addParticles = function() {
  var ball = new paper['Path']['Circle'](
    new paper['Point'](100, 100),
    20
  );
  ball['fillColor'] = 'red';
  
  ball['item'] = new paper['Group'](ball);

  // this.group['addChild'](ball['item']);
  this.balls.push(ball);
};
