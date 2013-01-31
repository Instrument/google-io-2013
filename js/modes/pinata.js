goog.require('ww.mode.Core');
goog.provide('ww.mode.PinataMode');

TWOPI = TWOPI || Math.PI * 2;

/**
 * @constructor
 */
ww.mode.PinataMode = function() {
  goog.base(this, 'pinata', true, false, true);

  this.preloadSound('whack.mp3');
  this.preloadSound('whoosh-1.wav');
  this.preloadSound('whoosh-2.wav');

  this.ballSpeed_ = 250;

  this.COLORS_ = ['#0da960', '#4387fd', '#e04a3f', '#ffd24d'];
  this.NUM_COLORS = this.COLORS_.length;
};
goog.inherits(ww.mode.PinataMode, ww.mode.Core);


/**
 * Initailize PinataMode.
 */
ww.mode.PinataMode.prototype.init = function() {
  goog.base(this, 'init');

  var world = this.getPhysicsWorld_(new Verlet());
  this.collision_ = new Collision();
  this.force_ = new ConstantForce(new Vector(0, 2000));
};


/**
 * Bind mouse/touch events which focus is gained.
 */
ww.mode.PinataMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  this.$letterO_.css('opacity', 1);

  this.whackCount_ = 0;
  this.cracks_ = this.cracks_ || $('[id*=crack-]');
  this.cracks_.css('opacity', 0);
  this.maxWhacks_ = this.maxWhacks_ || this.cracks_.length;

  this.crackedElm_ = this.crackedElm_ || $('#cracked');
  this.crackedElm_.css('opacity', 0);
  this.crackedParts_ = this.crackedParts_ || $('[id*=part-]');
  this.maxParts_ = this.maxParts_ || this.crackedParts_.length;

  var part;
  for (var i = 0; i < this.maxParts_; i++) {
    part = this.crackedParts_[i];
    this.transformElem_(part, 'translateX(0px) translateY(0px) rotate(0deg)');
  }

  this.$canvas_ = this.$canvas_ || $('#pinata-canvas');
  this.canvas_ = this.$canvas_[0];
  this.canvas_.width = this.width_;
  this.canvas_.height = this.height_;
  this.ctx_ = this.ctx_ || this.canvas_.getContext('2d');

  this.bounds_ = this.$letterO_[0].getBoundingClientRect();
  this.center_ = this.center_ || {};
  this.center_['x'] = ~~(this.bounds_['left'] + (this.bounds_['width'] / 2));
  this.center_['y'] = ~~(this.bounds_['top'] + (this.bounds_['height'] / 2));

  if (this.physicsWorld_ && this.physicsWorld_.particles.length) {
    this.physicsWorld_.particles = [];
  }
};


/**
 * On resize of the window, ecalculate the center and scale.
 * @param {Boolean} redraw Whether resize redraws.
 */
ww.mode.PinataMode.prototype.onResize = function(redraw) {
  goog.base(this, 'onResize', redraw);

  if (this.canvas_) {
    this.canvas_.width = this.width_;
    this.canvas_.height = this.height_;
  }

  this.bounds_ = this.$letterO_[0].getBoundingClientRect();

  this.center_ = this.center_ || {};
  this.center_['x'] = ~~(this.bounds_['left'] + (this.bounds_['width'] / 2));
  this.center_['y'] = ~~(this.bounds_['top'] + (this.bounds_['height'] / 2));

  this.shiftX_ = this.bounds_['width'] / 8;
  this.shiftY_ = this.bounds_['height'] / 8;

  var bottom = new Vector(this.width_, this.height_ - 1);

  this.edge_ = new EdgeBounce(
               new Vector(0, 0),
               new Vector(this.width_ , this.height_));

  if (this.physicsWorld_.particles && this.physicsWorld_.particles.length > 0) {
    var ball;
    for (var i = 0, l = this.physicsWorld_.particles.length; i < l; i++) {
      ball = this.physicsWorld_.particles[i];

      // if it's a hidden ball, needs start x/y to be updated
      if (ball.fixed) {
        ball['startX'] = this.center_['x'] +
                         ~~Random(-this.shiftX_, this.shiftX_);

        ball['startY'] = this.center_['y'] +
                         ~~Random(-this.shiftY_, this.shiftY_);

        ball.moveTo(new Vector(ball['startX'], ball['startY']));
      }
    }
  }
};


/**
 * Step forward in time for physics.
 * @param {Number} delta Ms since last step.
 */
ww.mode.PinataMode.prototype.stepPhysics = function(delta) {
  goog.base(this, 'stepPhysics', delta);

  if (this.canvas_) {
    this.ctx_.clearRect(0, 0, this.width_, this.height_);
  }

  var ball, radius, r2, r6;
  for (var i = 0, l = this.physicsWorld_.particles.length; i < l; i++) {
    ball = this.physicsWorld_.particles[i];
    radius = ball.radius;
    r2 = radius * 2;
    r6 = radius * 6;

    if (ball.pos.x > this.width_ + r6 ||
        ball.pos.x < 0 - r6 ||
        ball.pos.y > this.height_ + r6 ||
        ball.pos.y < 0 - r6) {
      // ball is out of bounds, so make it hidden/fixed 
      ball.fixed = true;
    }

    if (!ball.fixed) {
      ball['rotate'] += 10 * delta;
      this.ctx_.fillStyle = ball['color'];

      this.ctx_.save();
      this.ctx_.translate(ball.pos.x, ball.pos.y);
      this.ctx_.rotate(ball['rotate']);

      // pill shape      
      this.ctx_.beginPath();
      this.ctx_.arc(-radius, 0, radius, 0, TWOPI);
      this.ctx_.arc(radius, 0, radius, 0, TWOPI);
      this.ctx_.fillRect(-radius, -radius, r2, r2);
      this.ctx_.fill();

      this.ctx_.restore();
    }
  }
};


/**
 * Add a number of given balls.
 * @param {Number} number Number of balls to add.
 * @private
 */
ww.mode.PinataMode.prototype.addCandy_ = function(number) {
  var ball;
  for (var i = 0; i < number; i++) {
    var dir = (i % 2 === 0) ? -1 : 1;
    ball = new Particle(Random(1, 5.0));
    ball.setRadius(ball.mass * 4 + 10);

    ball['startX'] = this.center_['x'] + ~~Random(-this.shiftX_, this.shiftX_);
    ball['startY'] = this.center_['y'] + ~~Random(-this.shiftY_, this.shiftY_);

    ball['rotate'] = ~~Random(-360, 360) * (Math.PI / 180);

    ball.moveTo(new Vector(ball['startX'], ball['startY']));

    ball.vel = new Vector(
                Random(3, 6) * this.ballSpeed_ * dir,
                Random(-3, 0.5) * this.ballSpeed_);

    this.collision_.pool.push(ball);

    ball.behaviours.push(this.collision_);
    ball.behaviours.push(this.force_);

    ball['color'] = this.COLORS_[~~Random(0, this.NUM_COLORS)];

    this.physicsWorld_.particles.push(ball);
  }
};


/**
 * @private
 */
ww.mode.PinataMode.prototype.moveAllCandyBack_ = function() {
  var ball;
  for (var i = 0, l = this.physicsWorld_.particles.length; i < l; i++) {
    ball = this.physicsWorld_.particles[i];
    ball.moveTo(new Vector(ball['startX'], ball['startY']));
    ball.fixed = false;
  }
};


/**
 * Method called when activating the I.
 * Plays a whack sound and interacts with the O according to number of whacks.
 */
ww.mode.PinataMode.prototype.activateI = function() {
  goog.base(this, 'activateI');

  this.playSound('whack.mp3');

  this.animateI_();

  if (this.whackCount_ < this.maxWhacks_) {
    this.log('whack ' + this.whackCount_);

    this.addCandy_(~~Random(5, 10));
    this.cracks_[this.whackCount_].style['opacity'] = 1;

    this.animateO_();
  } else if (this.whackCount_ === this.maxWhacks_) {
    this.log('reached max whacks. breaking pinata.');
    this.moveAllCandyBack_();
    this.addCandy_(~~Random(15, 25));
    this.animatePartsOut_();
  } else {
    this.log('pinata is done. still whacking. so showing reload.');
    this.animatePartsIn_();
  }

  this.whackCount_++;
};


/**
 * Method called when activating the O.
 * Plays some kind of whoosh sound.
 */
ww.mode.PinataMode.prototype.activateO = function() {
  goog.base(this, 'activateO');

  if (this.whackCount_ % 2 === 0) {
    this.playSound('whoosh-1.wav');
  } else {
    this.playSound('whoosh-2.wav');
  }

  this.animateO_();
};


/**
 * Animates broken O parts out.
 * @private
 */
ww.mode.PinataMode.prototype.animatePartsOut_ = function() {
  this.log('animating final break.');

  var self = this;

  self.$letterO_.css('opacity', 0);
  self.crackedElm_.css('opacity', 1);

  for (var i = 0; i < this.maxParts_; i++) {
    var part = self.crackedParts_[i];

    (function(part, i) {
      var bounds = part.getBoundingClientRect();
      var toY = ~~((self.height_ - bounds['top']) / 3);
      var toX = ~~Random(-200, 200) + 50;
      var deg = ~~Random(-270, 270) + 360;

      var animateOut = new TWEEN.Tween({
        'translateY': 0,
        'translateX': 0
      });

      animateOut.to({
        'translateY': toY,
        'translateX': toX
      }, 5000);

      animateOut.easing(TWEEN.Easing.Exponential.Out);

      animateOut.onUpdate(function() {
        var transform = 'translateX(' + this['translateX'] + 'px) ' +
                        'translateY(' + this['translateY'] + 'px) ' +
                        'rotate(' + deg++ + 'deg)';
        self.transformElem_(part, transform);
      });

      self.addTween(animateOut);
    })(part, i);
  }
};


/**
 * Animates broken O parts back in.
 * @private
 */
ww.mode.PinataMode.prototype.animatePartsIn_ = function() {
  this.log('animating back after break.');

  var self = this;
  var windowHeight = window.innerHeight;
  var windowWidth = window.innerWidth;

  self.$letterO_.css('opacity', 0);
  self.crackedElm_.css('opacity', 1);

  for (var i = 0; i < this.maxParts_; i++) {
    var part = self.crackedParts_[i];

    (function(part, i) {
      var toY = part.style[self.prefix_].split('translateY(')[1];
          toY = parseInt(toY) || 0;

      var toX = part.style[self.prefix_].split('translateX(')[1];
          toX = parseInt(toX) || 0;

      var animateBack = new TWEEN.Tween({
        'translateY': toY,
        'translateX': toX
      });

      animateBack.to({
        'translateY': 0,
        'translateX': 0
      }, 500);

      animateBack.easing(TWEEN.Easing.Exponential.Out);

      animateBack.onUpdate(function() {
        var transform = 'translateX(' + this['translateX'] + 'px) ' +
                        'translateY(' + this['translateY'] + 'px) ' +
                        'rotate(0deg)';
        self.transformElem_(part, transform);
      });

      if (!(i + 1 < self.maxParts_)) {
        animateBack.onComplete(function() {
          self.showReload();
        });
      }

      self.addTween(animateBack);
    })(part, i);
  }
};


/**
 * Animates I whack.
 * @private
 */
ww.mode.PinataMode.prototype.animateI_ = function() {
  var self = this;
  var stickDuration = 190;

  var whackOver = new TWEEN.Tween({
    'translateX': 0,
    'translateY': 0,
    'rotate': 0
  });

  whackOver.to({
    'translateX': 40,
    'translateY': -40,
    'rotate': 30
  }, stickDuration);

  whackOver.onUpdate(function() {
    self.transformElem_(self.$letterI_[0],
      'rotate(' + this['rotate'] + 'deg) ' +
      'translateX(' + this['translateX'] + 'px) ' +
      'translateY(' + this['translateY'] + 'px)');
  });

  var whackBack = new TWEEN.Tween({
    'rotate': 30,
    'translateX': 40,
    'translateY': -40
  });

  whackBack.to({
    'rotate': 0,
    'translateX': 0,
    'translateY': 0
  }, stickDuration);
  whackBack.delay(stickDuration);

  whackBack.onUpdate(function() {
    self.transformElem_(self.$letterI_[0],
      'rotate(' + this['rotate'] + 'deg) ' +
      'translateX(' + this['translateX'] + 'px) ' +
      'translateY(' + this['translateY'] + 'px)');
  });

  self.addTween(whackOver);
  self.addTween(whackBack);
};


/**
 * Animates O swing.
 * @private
 */
ww.mode.PinataMode.prototype.animateO_ = function() {
  var self = this;
  var pinataDuration = 200;
  var deg = ~~Random(10, 45);
  var dir = (this.whackCount_ % 2 === 0) ? -1 : 1;

  var wiggleOne = new TWEEN.Tween({ 'deg': 0 });
  wiggleOne.to({ 'deg': dir * deg }, pinataDuration);
  wiggleOne.onUpdate(function() {
    self.transformElem_(self.$letterO_[0], 'rotate(' + this['deg'] + 'deg)');
  });

  var wiggleTwo = new TWEEN.Tween({ 'deg': dir * deg });
  wiggleTwo.to({ 'deg': -1 * dir * deg }, pinataDuration);
  wiggleTwo.delay(pinataDuration);
  wiggleTwo.onUpdate(function() {
    self.transformElem_(self.$letterO_[0], 'rotate(' + this['deg'] + 'deg)');
  });

  var wiggleBack = new TWEEN.Tween({ 'deg': -1 * dir * deg });
  wiggleBack.to({ 'deg': 0 }, pinataDuration);
  wiggleBack.delay(pinataDuration * 2);
  wiggleBack.onUpdate(function() {
    self.transformElem_(self.$letterO_[0], 'rotate(' + this['deg'] + 'deg)');
  });

  self.addTween(wiggleOne);
  self.addTween(wiggleTwo);
  self.addTween(wiggleBack);
};
