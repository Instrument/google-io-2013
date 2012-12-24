goog.provide('ww.mode.Core');

/**
 * RequestAnimationFrame polyfill.
 */
 (function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] +
                                      'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x] + 'CancelAnimationFrame'] ||
          window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
              callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/**
 * @constructor
 * @param {String} name Name of the mode.
 * @param {Boolean} wantsRenderLoop Whether this mode needs rAF.
 */
ww.mode.Core = function(name, wantsRenderLoop) {
  this.name_ = name;

  this.hasFocus = false;

  // By default, modes don't need rAF.
  this.wantsRenderLoop_ = wantsRenderLoop || false;
  this.shouldRenderNextFrame_ = false;

  // Bind a copy of render method for rAF
  this.boundDraw_ = goog.bind(this.renderFrame_, this);

  // Mark this mode as ready.
  this.ready();
};

ww.mode.Core.prototype.log = function(msg) {
  if (DEBUG_MODE) {
    console.log(this.name_ + ': ' + msg);
  }
};

/**
 * Begin running rAF, but only if mode needs it.
 */
ww.mode.Core.prototype.startRendering = function() {
  // No-op if mode doesn't need rAF
  if (!this.wantsRenderLoop_) { return; }

  // Only start rAF if we're not already rendering.
  if (!this.shouldRenderNextFrame_) {
    this.shouldRenderNextFrame_ = true;
    this.boundDraw_();
  }
};

/**
 * Stop running rAF, but only if mode needs it.
 */
ww.mode.Core.prototype.stopRendering = function() {
  // No-op if mode doesn't need rAF
  if (!this.wantsRenderLoop_) { return; }

  this.shouldRenderNextFrame_ = false;
};

/**
 * Render a single frame. Call the mode's draw method,
 * then schedule the next frame if we need it.
 */
ww.mode.Core.prototype.renderFrame_ = function() {
  // Call the mode's draw method.
  this['draw']();

  // Schedule the next frame.
  if (!this.shouldRenderNextFrame_) {
    requestAnimationFrame(this.boundDraw_);
  }
};

/**
 * Draw a single frame.
 */
ww.mode.Core.prototype['draw'] = function() {
  // No-op, by default.
};

/**
 * Tell parent frame that this mode is ready.
 */
ww.mode.Core.prototype.ready = function() {
  window['currentMode'] = this;

  this.log('Is ready');

  // Notify parent frame that we are ready.
  window.parent.postMessage(this.name_ + '.ready', '*');
};

ww.mode.Core.prototype['focus'] = function() {
  if (this.hasFocus) { return; }

  this.log('Got focus');

  // Try to start rAF if requested.
  this.startRendering();
};

ww.mode.Core.prototype['unfocus'] = function() {
  if (!this.hasFocus) { return; }

  this.log('Lost focus');

  // Try to stop rAF if requested.
  this.stopRendering();
};