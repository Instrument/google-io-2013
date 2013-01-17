goog.require('ww.mode.Core');
goog.provide('ww.mode.MetaBallMode');

/**
 * @constructor
 */
ww.mode.MetaBallMode = function() {
  goog.base(this, 'metaball', true, false, true);

  var context = this.getAudioContext_();
  this.tuna_ = new Tuna(context);

  /**
   * Create a delay audio filter. Value ranges are as follows.
   * feedback: 0 to 1+
   * delayTime: how many milliseconds should the wet signal be delayed?
   * wetLevel: 0 to 1+
   * dryLevel: 0 to 1+
   * cutoff: cutoff frequency of the built in highpass-filter. 20 to 22050
   * bypass: the value 1 starts the effect as bypassed, 0 or 1
   */
  this.delay_ = new this.tuna_.Delay({
    feedback: 0,
    delayTime: 0,
    wetLevel: 0,
    dryLevel: 0,
    cutoff: 20,
    bypass: 0
  });

  /**
   * Create a chorus audio filter. Value ranges are as follows.
   * rate: 0.01 to 8+
   * feedback: 0 to 1+
   * delay: 0 to 1
   * dryLevel: 0 to 1+
   * bypass: the value 1 starts the effect as bypassed, 0 or 1
   */
  this.chorus_ = new this.tuna_.Chorus({
    rate: 0.01,
    feedback: 0.2,
    delay: 0,
    bypass: 0
  });
};
goog.inherits(ww.mode.MetaBallMode, ww.mode.Core);

/**
 * Play a sound by url after being processed by Tuna.
 * @private.
 * @param {String} filename Audio file name.
 * @param {Object} filter Audio filter name.
 */
ww.mode.MetaBallMode.prototype.playProcessedAudio_ = function(filename, filter) {
  if (!this.wantsAudio_) { return; }

  var url = '../sounds/' + this.name_ + '/' + filename;

  if (ww.testMode) {
    url = '../' + url;
  }

  this.log('Requested sound "' + filename + '" from "' + url + '"');

  var audioContext = this.audioContext_;

  var self = this;

  this.getSoundBufferFromURL_(url, function(buffer) {
    var source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(filter.input);
    filter.connect(audioContext.destination);
    source.noteOn(0);
  });
};

/**
 * Method called when activating the I.
 */
ww.mode.MetaBallMode.prototype.activateI = function() {
  this.iClicked_ = true;
  if (this.iMultiplier_ < 10) {
    this.iMultiplier_ += 2;
  }

  // this.playProcessedAudio_('boing.wav', this.chorus_);
};

/**
 * Method called when activating the O.
 */
ww.mode.MetaBallMode.prototype.activateO = function() {
  this.oClicked_ = true;
  if (this.oMultiplier_ < 10) {
    this.oMultiplier_ += 2;
  }

  // this.playProcessedAudio_('boing.wav', this.delay_);
};

/**
 * Function to create and draw I.
 * @private
 */
ww.mode.MetaBallMode.prototype.drawI_ = function() {
  // Set I's initial dimensions.
  this.iWidth_ = this.width_ * .175;
  this.iHeight_ = this.iWidth_ * 2.12698413;

  // Set coordinates for I's upper left corner.
  this.iX_ = this.screenCenterX_ - this.iWidth_ * 1.5;
  this.iY_ = this.screenCenterY_;

  this.ctx_.fillStyle = '#e5e5e5';

  this.ctx.beginPath();

  this.ctx_.drawRect(this.iX_, this.iY_, this.iWidth_, this.iHeight_);

  thix.ctx_.fill();
};

/**
 * Function to create and draw O.
 * @private
 */
ww.mode.MetaBallMode.prototype.drawBalls_ = function() {
  // Set O's radius.
  this.oRad_ = (this.width_ * 0.1944444444) / this.ballCount_;

  // Set O's coordinates.
  this.oX_ = this.screenCenterX_ + this.oRad_;
  this.oY_ = this.screenCenterY_;
};

/**
 * Function to create and draw Slash.
 * @private
 */
ww.mode.MetaBallMode.prototype.drawSlash_ = function() {
  // Determine the slash's start and end coordinates based on I and O sizes.
  /*this.slashStart_ = this.screenCenterX_ + this.oRad_ / 8,
    this.screenCenterY_ - (this.iHeight_ / 2) -
    ((this.iHeight_ * 1.5) * 0.17475728);

  this.slashEnd_ = this.ix + this.iWidth_,
    this.screenCenterY_ + (this.iHeight_ / 2) +
    ((this.iHeight_ * 1.5) * 0.17475728);*/
};

/**
 * Function to initialize the current mode.
 * Sets initial variables.
 */
ww.mode.MetaBallMode.prototype.init = function() {
  goog.base(this, 'init');

  this.world_ = this.getPhysicsWorld_();
  this.world_.viscosity = 0;

  this.ballCount_ = 1;

  // Gets the centerpoint of the viewport.
  this.screenCenterX_ = this.width_ / 2;
  this.screenCenterY_ = this.height_ / 2;

  /**
   * Sets the mouse position to start at the screen center.
   */
  this.mouseX_ = this.screenCenterX_;
  this.mouseY_ = this.screenCenterY_;
};

/**
 * Event is called after a mode focused.
 */
ww.mode.MetaBallMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  this.$canvas_ = $('#metaball-canvas');
  this.canvas_ = this.$canvas_[0];
  this.canvas_.width = this.width_;
  this.canvas_.height = this.height_;
  this.ctx_ = this.canvas_.getContext('2d');
  this.ctx_.fillStyle = '#424242';

  var self = this;

  var evt = Modernizr.touch ? 'touchmove' : 'mousemove';
  $(document).bind(evt + '.metaball', function(e) {
    self.mouseX_ = e.pageX;
    self.mouseY_ = e.pageY;
  });
};

/**
 * Event is called after a mode unfocused.
 */
ww.mode.MetaBallMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  var evt = Modernizr.touch ? 'touchmove' : 'mousemove';
  $(document).unbind(evt + '.metaball');
};

/**
 * Handles a browser window resize.
 * @param {Boolean} redraw Whether resize redraws.
 */
ww.mode.MetaBallMode.prototype.onResize = function(redraw) {
  goog.base(this, 'onResize', false);

  if (this.canvas_) {
    this.canvas_.width = this.width_;
    this.canvas_.height = this.height_;
  }

  // Recalculate the center of the screen based on the new window size.
  this.screenCenterX_ = this.width_ / 2;
  this.screenCenterY_ = this.height_ / 2;

  this.redraw();
};

/**
 * On each physics tick, adjust star positions.
 * @param {Float} delta Time since last tick.
 */
ww.mode.MetaBallMode.prototype.stepPhysics = function(delta) {
  goog.base(this, 'stepPhysics', delta);

};

/**
 * Runs code on each requested frame.
 * @param {Integer} delta The timestep variable for animation accuracy.
 */
ww.mode.MetaBallMode.prototype.onFrame = function(delta) {
  goog.base(this, 'onFrame', delta);

  var i;
  var ii;

  if (!this.canvas_) { return; }

  this.ctx_.clearRect(0, 0, this.canvas_.width + 1, this.canvas_.height + 1);
};
