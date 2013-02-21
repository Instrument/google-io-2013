goog.require('ww.mode.Core');
goog.provide('ww.mode.PinataMode');

var TWOPI = TWOPI || Math.PI * 2;

/**
 * @constructor
 * @param {Element} containerElem The containing element.
 * @param {String} assetPrefix The containing element.
 */
ww.mode.PinataMode = function(containerElem, assetPrefix) {
  this.preloadSound('whack.mp3');
  this.preloadSound('whoosh-1.mp3');
  this.preloadSound('whoosh-2.mp3');

  goog.base(this, containerElem, assetPrefix, 'pinata', true, true, true, false);

  this.ballSpeed_ = 250;

  this.COLORS_ = ['#0da960', '#4387fd', '#e04a3f', '#ffd24d'];
  this.NUM_COLORS = this.COLORS_.length;

  this.canvas_ = document.getElementById('pinata-canvas');
};
goog.inherits(ww.mode.PinataMode, ww.mode.Core);

/**
 * Initailize PinataMode.
 */
ww.mode.PinataMode.prototype.init = function() {
  goog.base(this, 'init');

  var world = this.getPhysicsWorld_(new Verlet());
  this.collision_ = new Collision();
  this.force_ = new ConstantForce(new Vector(0, 1000));
  this.originO_ = this.$letterO_.attr('cx') + ', ' + this.$letterO_.attr('cy');
  this.originI_ = this.$letterI_.attr('cx') + ', ' + this.$letterI_.attr('cy');

  // particle representation of robot
  if (!this.robotParticle_) {
    this.robotParticle_ = new Particle(5.0);
    this.robotParticle_.fixed = true;
  }

  this.robotParticle_.behaviours = [this.collision_];
  this.collision_.pool = [this.robotParticle_];

  this.physicsWorld_.particles = [this.robotParticle_];

  this.recenter_();

  this.cracks_ = this.cracks_ || $('[id*=crack-]');
  this.maxWhacks_ = this.maxWhacks_ || this.cracks_.length;

  this.crackedElm_ = this.crackedElm_ || $('#cracked');
  this.crackedParts_ = this.crackedParts_ || $('[id*=part-]');
  this.maxParts_ = this.maxParts_ || this.crackedParts_.length;

  this.resetToStart_();
};

/**
 * Reset styles to default.
 * @private
 */
ww.mode.PinataMode.prototype.resetToStart_ = function() {
  this.$letterO_.css('opacity', 1);
  this.whackCount_ = 0;

  this.cracks_.css('opacity', 0);
  this.crackedElm_.css('opacity', 0);
  this.crackedParts_.attr('transform', '');
};

/**
 * On resize of the window, ecalculate the center and scale.
 * @param {Boolean} redraw Whether resize redraws.
 */
ww.mode.PinataMode.prototype.onResize = function(redraw) {
  goog.base(this, 'onResize', redraw);

  this.recenter_();

  var scale = 1;
  if (this.wantsRetina_) {
    scale = 2;
  }

  this.canvas_.width = this.width_ * scale;
  this.canvas_.height = this.height_ * scale;

  $(this.canvas_).css({
    'width': this.width_,
    'height': this.height_
  });

  if (redraw) {
    this.redraw();
  }
};

/**
 * Center the physics world after resize.
 * @private
 */
ww.mode.PinataMode.prototype.recenter_ = function() {
  this.bounds_ = this.$letterO_[0].getBoundingClientRect();

  this.center_ = {
    'x': ~~(this.bounds_['left'] + (this.bounds_['width'] / 2)),
    'y': ~~(this.bounds_['top'] + (this.bounds_['height'] / 2))
  };

  this.robotParticle_.setRadius(this.bounds_['width']);
  this.robotParticle_.moveTo(new Vector(this.center_['x'], this.center_['y']));
};

/**
 * Step forward in time for physics.
 * @param {Number} delta Ms since last step.
 */
ww.mode.PinataMode.prototype.stepPhysics = function(delta) {
  goog.base(this, 'stepPhysics', delta);

  var forRemoval = [];

  for (var i = 1, l = this.physicsWorld_.particles.length; i < l; i++) {
    var ball = this.physicsWorld_.particles[i];
    var radius = ball.radius;
    var r2 = radius * 2;
    var r6 = radius * 6;

    // ball is out of bounds
    if (ball.pos && ball.pos.x > this.width_ + r6 ||
        ball.pos.x < 0 - r6 ||
        ball.pos.y > this.height_ + r6 ||
        ball.pos.y < 0 - r6) {
      
      forRemoval.push(ball);
    }
  }

  // Remove from world and collision pool
  for (var j = 0, l2 = forRemoval.length; j < l2; j++) {
    var idx1 = this.physicsWorld_.particles.indexOf(forRemoval[j]);
    this.physicsWorld_.particles.splice(idx1, 1);

    var idx2 = this.collision_.pool.indexOf(forRemoval[j]);
    this.collision_.pool.splice(idx2, 1);
  }
};

/**
 * Draw a single frame.
 * @param {Number} delta Ms since last draw.
 */
ww.mode.PinataMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  var ctx = this.canvas_.getContext('2d');
  ctx.clearRect(0, 0, this.canvas_.width, this.canvas_.height);

  var scale = 1;
  if (this.wantsRetina_) {
    scale = 2;
  }

  ctx.save();
  ctx.scale(scale, scale);

  for (var i = 1, l = this.physicsWorld_.particles.length; i < l; i++) {
    var ball = this.physicsWorld_.particles[i];
    var radius = ball.radius;
    var r2 = radius * 2;
    var r6 = radius * 6;

    ball['rotate'] += 10 * delta;

    ctx.save();
    ctx.fillStyle = ball['color'];
    ctx.translate(ball.pos.x, ball.pos.y);
    ctx.rotate(ball['rotate']);

    // pill shape
    ctx.beginPath();
    ctx.arc(-radius, 0, radius, 0, TWOPI);
    ctx.arc(radius, 0, radius, 0, TWOPI);
    ctx.fillRect(-radius, -radius, r2, r2);
    ctx.fill();

    ctx.restore();
  }

  ctx.restore();
};


/**
 * Create a particle and eject it from a position.
 * @private
 * @param {Number} x X from point.
 * @param {Number} y Y from point.
 * @param {Number} dir Direction.
 */
ww.mode.PinataMode.prototype.ejectParticle_ = function(x, y, dir) {
  var ball = new Particle(Random(2, 5.0));
  ball.setRadius(ball.mass * 3);

  ball['rotate'] = ~~Random(-360, 360) * (Math.PI / 180);
  ball['color'] = this.COLORS_[~~Random(0, this.NUM_COLORS)];

  ball.moveTo(new Vector(
    x + (ball.radius / 2) * dir,
    y + (ball.radius / 2)
  ));

  ball.vel = new Vector(Random(3, 6) * this.ballSpeed_ * dir,
                        Random(-3, 1.5) * this.ballSpeed_);

  ball.behaviours.push(this.force_);
  this.collision_.pool.push(ball);
  ball.behaviours.push(this.collision_);

  this.physicsWorld_.particles.push(ball);
};

/**
 * Add a number of given balls.
 * @private
 */
ww.mode.PinataMode.prototype.activateBalls_ = function() {
  var pop = ~~Random(1, 3) + ~~(this.whackCount_ / 3);

  for (var i = 0; i <= pop; i++) {
    var dir = (i % 2 === 0) ? -1 : 1;
    this.ejectParticle_(
      this.center_['x'],
      this.center_['y'],
      dir
    );
  }
};

/**
 * Method called when activating the I.
 * Plays a whack sound and interacts with the O according to number of whacks.
 */
ww.mode.PinataMode.prototype.activateI = function() {
  goog.base(this, 'activateI');

  if (!this.isAnimating_) {
    this.playSound('whack.mp3');
    this.animateI_();

    if (this.whackCount_ < this.maxWhacks_) {
      this.log('whack ' + this.whackCount_ + ' ' + this.reset_);
      this.cracks_[this.whackCount_].style['opacity'] = 1;
      this.activateBalls_();
      this.animateO_();
    } else if (this.whackCount_ === this.maxWhacks_) {
      this.log('reached max whacks. breaking pinata.');
      this.activateBalls_();
      this.animatePartsOut_();
    } else {
      this.animatePartsIn_();
    }

    this.whackCount_++;
  }
};


/**
 * Method called when activating the O.
 * Plays some kind of whoosh sound.
 */
ww.mode.PinataMode.prototype.activateO = function() {
  goog.base(this, 'activateO');

  if (this.wantsAudio_) {
    if (this.whackCount_ % 2 === 0) {
      this.playSound('whoosh-1.mp3');
    } else {
      this.playSound('whoosh-2.mp3');
    }
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

  this.cracks_.css('opacity', 0);
  this.isAnimating_ = true;

  for (var i = 0; i < this.maxParts_; i++) {
    var part = $(self.crackedParts_[i]);

    (function(part, i) {
      var toY = ~~Random(-45, 45);
      var toX = ~~Random(-45, 45);
      var rotate = ~~Random(-90, 90) + 5;

      part.data('movedX', toX);
      part.data('movedY', toY);
      part.data('rotate', rotate);

      var animateOut = new TWEEN.Tween({
        'translateY': 0, 'translateX': 0, 'rotate': 0
      });
      animateOut.to({
        'translateY': toY, 'translateX': toX, 'rotate': rotate
      }, 1000);

      animateOut.easing(TWEEN.Easing.Exponential.Out);

      animateOut.onUpdate(function() {
        part.attr('transform',
          'rotate(' + this['rotate'] + ', ' + self.originO_ + ') ' +
          'translate(' + this['translateX'] + ', ' + this['translateY'] + ') ');
      });

      if (!(i + 1 < self.maxParts_)) {
        animateOut.onComplete(function() {
          self.isAnimating_ = false;
        });
      }

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

  this.isAnimating_ = true;

  for (var i = 0; i < this.maxParts_; i++) {
    var part = $(self.crackedParts_[i]);

    (function(part, i) {
      var toX = parseInt(part.data('movedX'), 10) || 0;
      var toY = parseInt(part.data('movedY'), 10) || 0;
      var rotate = parseInt(part.data('rotate'), 100) || 0;

      var animateBack = new TWEEN.Tween({
        'translateY': toY, 'translateX': toX, 'rotate': rotate
      });
      animateBack.to({
        'translateY': 0, 'translateX': 0, 'rotate': 0
      }, 200);

      animateBack.easing(TWEEN.Easing.Exponential.Out);

      animateBack.onUpdate(function() {
        part.attr('transform',
          'rotate(' + this['rotate'] + ', ' + self.originO_ + ') ' +
          'translate(' + this['translateX'] + ', ' + this['translateY'] + ') ');
      });

      if (!(i + 1 < self.maxParts_)) {
        animateBack.onComplete(function() {
          self.resetToStart_();
          self.isAnimating_ = false;
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
    self.$letterI_.attr('transform',
      'rotate(' + this['rotate'] + ', ' + self.originI_ + ') ' +
      'translate(' + this['translateX'] + ', ' + this['translateY'] + ')');
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
    self.$letterI_.attr('transform',
      'rotate(' + this['rotate'] + ', ' + self.originI_ + ') ' +
      'translate(' + this['translateX'] + ', ' + this['translateY'] + ')');
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

  var wiggleOne = new TWEEN.Tween({ 'rotate': 0 });
  wiggleOne.to({ 'rotate': dir * deg }, pinataDuration);
  wiggleOne.onUpdate(function() {
    self.$letterO_.attr('transform',
      'rotate(' + this['rotate'] + ', ' + self.originO_ + ')');
  });

  var wiggleTwo = new TWEEN.Tween({ 'rotate': dir * deg });
  wiggleTwo.to({ 'rotate': -1 * dir * deg }, pinataDuration);
  wiggleTwo.delay(pinataDuration);
  wiggleTwo.onUpdate(function() {
    self.$letterO_.attr('transform',
      'rotate(' + this['rotate'] + ', ' + self.originO_ + ')');
  });

  var wiggleBack = new TWEEN.Tween({ 'rotate': -1 * dir * deg });
  wiggleBack.to({ 'rotate': 0 }, pinataDuration);
  wiggleBack.delay(pinataDuration * 2);
  wiggleBack.onUpdate(function() {
    self.$letterO_.attr('transform',
      'rotate(' + this['rotate'] + ', ' + self.originO_ + ')');
  });

  self.addTween(wiggleOne);
  self.addTween(wiggleTwo);
  self.addTween(wiggleBack);
};
