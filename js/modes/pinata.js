goog.require('ww.mode.Core');
goog.provide('ww.mode.PinataMode');


/**
 * @constructor
 */
ww.mode.PinataMode = function() {
  goog.base(this, 'pinata', false, true, false);
};
goog.inherits(ww.mode.PinataMode, ww.mode.Core);


/**
 * @private
 */
ww.mode.PinataMode.prototype.init = function() {
  goog.base(this, 'init');

  this.COLORS_ = ['#EB475A', '#E05A91', '#925898',
                  '#E96641','#19A281', '#FAD14A'];

  this.NUM_COLORS = this.COLORS_.length;

  var self = this;

  if (this.hasTouch) {
    this.evt = 'tap';
  } else {
    this.evt = 'click';
  }

  this.screenWidth = window.innerWidth;
  this.screenHeight = window.innerHeight;
  this.centerX = this.screenWidth / 2;
  this.centerY = this.screenHeight / 2;
  this.scale = this.screenWidth / 30;

  this.getPaperCanvas_();

  this.balls = [];

  this.pinata = $('#pinata');
  this.pinata.css('opacity', '1');
  this.hitCount = 0;
  this.maxHit = 10;
};


/**
 * @private
 */
ww.mode.PinataMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  var self = this;

  self.pinata.bind(self.evt, function() {
    self.addBalls_();
  });
};


/**
 * @private
 */
ww.mode.PinataMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  this.pinata.unbind(this.evt);
};


/**
 * @private
 */
ww.mode.PinataMode.prototype.onResize = function(redraw) {
  goog.base(this, 'onResize', redraw);

  this.screenWidth = window.innerWidth;
  this.screenHeight = window.innerHeight;
  this.centerX = this.screenWidth / 2;
  this.centerY = this.screenHeight / 2;
  this.scale = this.screenWidth / 30;
};


/**
 * @private
 */
ww.mode.PinataMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  var length = this.balls.length,
      size = paper['view']['size'],
      ball, pre;

  // update balls to bounce within canvas bounds.
  for (var i = 0; i < length; i ++) {
    ball = this.balls[i];
    ball['vector']['y'] += ball['gravity'];
    ball['vector']['x'] *= 0.99;
    
    pre = this.utilAdd_(ball['point'], ball['vector']);
    
    if (pre['x'] < ball['radius'] ||
        pre['x'] > size['width'] - ball['radius']) {

      ball['vector']['x'] *= -1 * ball['dampen'];
    }

    if (pre['y'] < ball['radius'] ||
        pre['y'] > size['height'] - ball['radius']) {
      
      if (Math.abs(ball['vector']['x']) < 3) {
        ball['vector'] = paper['Point']['random']();
        ball['vector'] = this.utilMultiply_(ball['vector'], [150, 100]);
        ball['vector'] = this.utilAdd_(ball['vector'], [-75, 20]);
      }

      ball['vector']['y'] *= ball['bounce'];
    }

    var ballAndVect = this.utilAdd_(ball['point'], ball['vector']);
    var max = paper['Point']['max'](ball['radius'], ballAndVect);
 

    ball['point'] = paper['Point']['min'](max, size['width'] - ball['radius']);
  
    ball['position'] = ball['point'];
    ball['rotate'](ball['vector']['x'] / 2);
  }
};


/**
 * @private
 */
ww.mode.PinataMode.prototype.utilAdd_ = function(v1, v2) {
  var result = {};

  result['x'] = (v1['x'] || v1[0]) + (v2['x'] || v2[0]);
  result['y'] = (v1['y'] || v1[1]) + (v2['y'] || v2[1]);

  return result;
};


/**
 * @private
 */
ww.mode.PinataMode.prototype.utilMultiply_ = function(v1, v2) {
  var result = {};

  result['x'] = (v1['x'] || v1[0]) * (v2['x'] || v2[0]);
  result['y'] = (v1['y'] || v1[1]) * (v2['y'] || v2[1]);

  return result;
};


/**
 * @private
 */
ww.mode.PinataMode.prototype.addBalls_ = function() {
  var ball, point, radius,
      size = ~~Random(5, 20);

  if (this.hitCount < this.maxHit) {
    this.hitCount++;

    this.log('hit #' + this.hitCount + '. adding ' + size + ' more balls.');

    for (var i = 0; i < size; i++) {
      point = new paper['Point'](this.centerX, this.centerY);
      radius = this.scale * Math.random() + 10;

      ball = new paper['Path']['Circle'](point, radius);
      ball['point'] = point;
      ball['fillColor'] = this.COLORS_[i % this.NUM_COLORS];
      
      ball['vector'] = paper['Point']['random']();
      ball['vector'] = this.utilAdd_(ball['vector'], [-0.5, 0]);
      ball['vector'] = this.utilMultiply_(ball['vector'], [50, 100])

      ball['dampen'] = 0.4;
      ball['gravity'] = 3;
      ball['bounce'] = -0.6;
      ball['radius'] = radius;

      this.balls.push(ball);
    }
  } else {
    this.log('reached max hits. pinata game over.');
  }
};
