goog.require('ww.mode.Core');
goog.provide('ww.mode.PinataMode');


/**
 * @constructor
 */
ww.mode.PinataMode = function() {
  goog.base(this, 'pinata', true, true, false);
  this.preloadSound('whack.mp3');
};
goog.inherits(ww.mode.PinataMode, ww.mode.Core);


/**
 * Initailize PinataMode.
 */
ww.mode.PinataMode.prototype.init = function() {
  goog.base(this, 'init');

  this.COLORS_ = ['#EB475A', '#E05A91', '#925898',
                  '#E96641', '#19A281', '#FAD14A'];

  this.NUM_COLORS = this.COLORS_.length;

  this.prefix = Modernizr.prefixed('transform');

  var self = this;

  this.centerX = window.innerWidth / 2;
  this.centerY = window.innerHeight / 2;
  this.scale = window.innerWidth / 30;

  this.getPaperCanvas_();

  // restart all active elements
  if (this.active && this.active.length) {
    var temp;
    for (var i = 0, l = this.active.length; i < l; i++) {
      temp = this.active.pop();
      temp['fillColor'] = 'rgba(255,255,255,0.01)';
      temp['point'] = new paper['Point'](this.centerX, this.centerY);
      temp['position'] = temp['point'];
      this.deactive.push(temp);
    }
  } else {
    this.deactive = this.prepopulate_(200);
    this.active = [];
  }

  this.pinata = $('#pinata');
  this.pinata.css('opacity', '1');
  this.hitCount = 0;
  this.maxHit = 10;
};


/**
 * On focus, make the pinata interactive.
 */
ww.mode.PinataMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  var self = this;

  var evt = Modernizr.touch ? 'touchend' : 'mouseup';
  self.pinata.bind(evt + '.pinata', function() {
    self.popBalls_();
  });
};


/**
 * On unfocus, deactivate the pinata.
 */
ww.mode.PinataMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  var evt = Modernizr.touch ? 'touchend' : 'mouseup';
  this.pinata.unbind(evt + '.pinata');
};


/**
 * On resize of the window, ecalculate the center and scale.
 * @param {Boolean} redraw Whether resize redraws.
 */
ww.mode.PinataMode.prototype.onResize = function(redraw) {
  goog.base(this, 'onResize', redraw);

  this.centerX = window.innerWidth / 2;
  this.centerY = window.innerHeight / 2;
  this.scale = window.innerWidth / 30;
};


/**
 * Per animated frame, update physics and positioning of balls.
 * @param {number} delta Animation delta.
 */
ww.mode.PinataMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  var length = this.active.length,
      size = paper['view']['size'],
      ball, pre;

  // update balls to bounce within canvas bounds.
  for (var i = 0; i < length; i++) {
    ball = this.active[i];
    ball['vector']['y'] += ball['gravity'];
    ball['vector']['x'] *= 0.99;

    pre = this.utilAdd_(ball['point'], ball['vector']);

    if (pre['x'] < ball.radius ||
        pre['x'] > size['width'] - ball.radius) {

      ball['vector']['x'] *= -1 * ball['dampen'];
    }

    if (pre['y'] < ball.radius ||
        pre['y'] > size['height'] - ball.radius) {

      if (Math.abs(ball['vector']['x']) < 3) {
        ball['vector'] = paper['Point']['random']();
        ball['vector'] = this.utilAdd_(ball['vector'], [-0.5, 0]);
        ball['vector'] = this.utilMultiply_(ball['vector'], [50, 100]);
      }

      ball['vector']['y'] *= ball['bounce'];
    }

    var ballAndVect = this.utilAdd_(ball['point'], ball['vector']);
    var max = paper['Point']['max'](ball.radius, ballAndVect);


    ball['point'] = paper['Point']['min'](max, size['width'] - ball.radius);

    ball['position'] = ball['point'];
    ball['rotate'](ball['vector']['x'] / 2);
  }
};


/**
 * Utility to add two x/y representations together.
 * @param {object} v1 Vector one.
 * @param {object} v2 Vector two.
 * @return {object} Result of v1 + v2.
 * @private
 */
ww.mode.PinataMode.prototype.utilAdd_ = function(v1, v2) {
  var result = {};

  result['x'] = (v1['x'] || v1[0]) + (v2['x'] || v2[0]);
  result['y'] = (v1['y'] || v1[1]) + (v2['y'] || v2[1]);

  return result;
};


/**
 * Utility to multiply two x/y representations together.
 * @param {object} v1 Vector one.
 * @param {object} v2 Vector two.
 * @return {object} Result of v1 * v2.
 * @private
 */
ww.mode.PinataMode.prototype.utilMultiply_ = function(v1, v2) {
  var result = {};

  result['x'] = (v1['x'] || v1[0]) * (v2['x'] || v2[0]);
  result['y'] = (v1['y'] || v1[1]) * (v2['y'] || v2[1]);

  return result;
};


/**
  * Prepopulate a max number of balls.
  * @param {number} max Maximum number to prepopulate.
  * @return {array} Array of prepopulated papaer objects.
  * @private
  */
ww.mode.PinataMode.prototype.prepopulate_ = function(max) {
  var balls = [];

  for (var i = 0; i < max; i++) {
    var point = new paper['Point'](this.centerX, this.centerY);
    var radius = this.scale * Math.random() + 10;

    var ball = new paper['Path']['Circle'](point, radius);
    ball['point'] = point;
    ball['fillColor'] = 'rgba(255,255,255,0.01)';

    ball['vector'] = paper['Point']['random']();
    ball['vector'] = this.utilAdd_(ball['vector'], [-0.5, 0]);
    ball['vector'] = this.utilMultiply_(ball['vector'], [50, 100]);

    ball['dampen'] = 0.4;
    ball['gravity'] = 3;
    ball['bounce'] = -0.6;
    ball.radius = radius;

    balls.push(ball);
  }

  return balls;
};


/**
 * Activate a random number of balls.
 * @private
 */
ww.mode.PinataMode.prototype.popBalls_ = function() {
  var ball, point, radius, toPop, self = this;

  this.playSound('whack.mp3');

  if (this.hitCount < this.maxHit) {
    this.hitCount++;
    toPop = Math.min(this.deactive.length, ~~Random(1, 5) * this.hitCount);

    this.log('hit #' + this.hitCount + '. adding ' + toPop + ' more balls.');

    for (var i = 0; i < toPop; i++) {
      ball = this.deactive.pop();
      ball['fillColor'] = this.COLORS_[~~Random(0, this.NUM_COLORS)];
      this.active.push(ball);
    }

    // TO-DO: SWAP OPACITY CHANGE FOR DIFFERENT PINATA BASHED STATE
    // this.pinata.css('opacity', (this.maxHit - this.hitCount) / this.maxHit);

    // animate wiggle
    var deg = ~~Random(10, 45);
    var dir = (this.hitCount % 2 === 0) ? -1 : 1;
    var duration = 150;
    var wiggleOne = new TWEEN.Tween({ 'deg': 0 });
    wiggleOne.to({ 'deg': dir * deg }, duration);
    wiggleOne.onUpdate(function() {
      self.pinata[0].style[self.prefix] = 'rotate(' + this['deg'] + 'deg)';
    });

    var wiggleTwo = new TWEEN.Tween({ 'deg': dir * deg });
    wiggleTwo.to({ 'deg': -1 * dir * deg }, duration);
    wiggleTwo.delay(duration);
    wiggleTwo.onUpdate(function() {
      self.pinata[0].style[self.prefix] = 'rotate(' + this['deg'] + 'deg)';
    });

    var wiggleBack = new TWEEN.Tween({ 'deg': -1 * dir * deg });
    wiggleBack.to({ 'deg': 0 }, duration);
    wiggleBack.delay(duration * 2);
    wiggleBack.onUpdate(function() {
      self.pinata[0].style[self.prefix] = 'rotate(' + this['deg'] + 'deg)';
    });

    self.addTween(wiggleOne);
    self.addTween(wiggleTwo);
    self.addTween(wiggleBack);
  } else {
    this.log(
      'reached max hits. pinata game over. ' +
      this.deactive.length + ' balls remaining.'
    );
  }
};
