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

window['AudioContext'] = (
  window['AudioContext'] ||
  window['webkitAudioContext'] ||
  null
);

/**
 * @constructor
 * @param {String} name Name of the mode.
 * @param {Boolean} wantsAudio Whether this mode needs webAudio.
 * @param {Boolean} wantsDrawing Whether this mode needs to draw onFrame.
 * @param {Boolean} wantsPhysics Whether this mode needs physics.
 */
ww.mode.Core = function(name, wantsAudio, wantsDrawing, wantsPhysics) {
  this.name_ = name;

  this.hasFocus = false;

  // By default, modes don't need audio.
  this.wantsAudio_ = (wantsAudio && window['AudioContext']) || false;

  // By default, modes don't need audio.
  this.wantsDrawing_ = wantsDrawing || false;

  // By default, modes don't need audio.
  this.wantsPhysics_ = wantsPhysics || false;

  // By default, modes don't need rAF.
  this.wantsRenderLoop_ = this.wantsDrawing_ || this.wantsPhysics_ || false;
  this.shouldRenderNextFrame_ = false;

  // Bind a copy of render method for rAF
  this.boundRenderFrame_ = goog.bind(this.renderFrame_, this);

  if (DEBUG_MODE) {
    this.addDebugUI_();
  }

  // Short-cuts to activating letters for basics setup.
  $('#letter-i').live('click', goog.bind(this.activateI, this));
  $('#letter-o').live('click', goog.bind(this.activateO, this));
  $(document).keypress(goog.bind(function(e) {
    if (e.keyCode === 105) {
      this.activateI();
      return false;
    } else if (e.keyCode === 111) {
      this.activateO();
      return false;
    }
  }, this));

  this.init();

  // Mark this mode as ready.
  this['ready']();
};

/**
 * Initialize (or re-initialize) the mode
 */
ww.mode.Core.prototype.init = function() {
  this.log('Init');
};

/**
 * Log a message.
 * @param {String} msg The message to log.
 */
ww.mode.Core.prototype.log = function(msg) {
  if (DEBUG_MODE) {
    console.log(this.name_ + ': ' + msg);
  }
};

/**
 * Add play/pause/restart UI.
 * @private
 */
ww.mode.Core.prototype.addDebugUI_ = function() {
  var self = this;

  var focusElem = document.createElement('button');
  focusElem.innerHTML = "Focus";
  focusElem.onclick = function() {
    self['focus']();
  };

  var unfocusElem = document.createElement('button');
  unfocusElem.innerHTML = "Unfocus";
  unfocusElem.onclick = function() {
    self['unfocus']();
  };

  var restartElem = document.createElement('button');
  restartElem.innerHTML = "Restart";
  restartElem.onclick = function() {
    self.init();
  };

  var containerElem = document.createElement('div');
  containerElem.style.position = 'absolute';
  containerElem.style.bottom = 0;
  containerElem.style.left = 0;
  containerElem.style.right = 0;
  containerElem.style.height = '30px';
  containerElem.style.background = 'rgba(0,0,0,0.2)';

  containerElem.appendChild(focusElem);
  containerElem.appendChild(unfocusElem);
  containerElem.appendChild(restartElem);

  document.body.appendChild(containerElem);
};

/**
 * Begin running rAF, but only if mode needs it.
 */
ww.mode.Core.prototype.startRendering = function() {
  // No-op if mode doesn't need rAF
  if (!this.wantsRenderLoop_) { return; }

  this.lastTime_ = Date.now();

  // Only start rAF if we're not already rendering.
  if (!this.shouldRenderNextFrame_) {
    this.shouldRenderNextFrame_ = true;
    this.boundRenderFrame_();
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
  var currentTime = Date.now();
  var delta = currentTime - this.lastTime_;

  /**
   * TODO: Lock max delta to avoid massive jumps.
   */

  if (this.wantsPhysics) {
    this.stepPhysics(delta);
  }

  if (this.wantsDrawing_) {
    this.onFrame(delta);
  }

  this.lastTime_ = currentTime;

  // Schedule the next frame.
  if (this.shouldRenderNextFrame_) {
    requestAnimationFrame(this.boundRenderFrame_);
  }
};

/**
 * Redraw without stepping (for resizes).
 */
ww.mode.Core.prototype.redraw = function() {
  this.onFrame(0);
};

/**
 * Draw a single frame.
 * @param {Number} delta Ms since last draw.
 */
ww.mode.Core.prototype.onFrame = function(delta) {
  // no-rop
};

/**
 * Tell parent frame that this mode is ready.
 */
ww.mode.Core.prototype['ready'] = function() {
  window['currentMode'] = this;

  this.log('Is ready');

  // Notify parent frame that we are ready.
  window.parent.postMessage(this.name_ + '.ready', '*');
};

/**
 * Focus this mode (start rendering).
 */
ww.mode.Core.prototype['focus'] = function() {
  if (this.hasFocus) { return; }

  this.log('Got focus');
  this.hasFocus = true;

  // Try to start rAF if requested.
  this.startRendering();

  var self = this;
  setTimeout(function() {
    self['didFocus']();
  }, 10);
};

/**
 * Event is called after a mode focused.
 */
ww.mode.Core.prototype['didFocus'] = function() {
  // no-op
};

/**
 * Unfocus this mode (stop rendering).
 */
ww.mode.Core.prototype['unfocus'] = function() {
  if (!this.hasFocus) { return; }

  this.log('Lost focus');
  this.hasFocus = false;

  // Try to stop rAF if requested.
  this.stopRendering();

  var self = this;
  setTimeout(function() {
    self['didUnfocus']();
  }, 10);
};

/**
 * Event is called after a mode unfocused.
 */
ww.mode.Core.prototype['didUnfocus'] = function() {
  // no-op
};

/**
 * Load a sound buffer (binary audio file).
 * @private
 * @param {String} url Audio file URL.
 * @param {Function} gotSound On-load callback.
 */
ww.mode.Core.prototype.getSoundBuffer_ = function(url, gotSound) {
  this.soundBuffers_ = this.soundBuffers_ || {};

  if (this.soundBuffers_[url]) {
    gotSound(this.soundBuffers_[url]);
    return;
  }

  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  var self = this;
  request.onload = function() {
    var audioContext = this.getAudioContext_();
    audioContext['decodeAudioData'](request.response, function(buffer) {
      self.soundBuffers_[url] = buffer;
      gotSound(self.soundBuffers_[url]);
    }, function() {
      // debugger;
    });
  };
  request.send();
};

/**
 * Step forward in time for physics.
 * @param {Number} delta Ms since last step.
 */
ww.mode.Core.prototype.stepPhysics = function(delta) {
  if (delta > 0) {
    this.physicsWorld_ = this.physicsWorld_ || new window['Physics']();
    this.physicsWorld_.step();
  }
};

/**
 * Get an audio context.
 * @private
 * @return {AudioContext} The shared audio context.
 */
ww.mode.Core.prototype.getAudioContext_ = function() {
  this.audioContext_ = this.audioContext_ || new window['AudioContext']();
  return this.audioContext_;
};

/**
 * Play a sound by url.
 * @param {String} filename Audio file name.
 */
ww.mode.Core.prototype.playSound = function(filename) {
  if (!this.wantsAudio_) { return; }

  var url = '../sounds/' + this.name_ + '/' + filename;

  this.log('Requested sound "' + filename + '" from "' + url + '"');

  var audioContext = this.getAudioContext_();

  this.getSoundBuffer_(url, function(buffer) {
    var source = audioContext['createBufferSource']();
    source['buffer'] = buffer;
    source['connect'](audioContext['destination']);
    source['noteOn'](0);
  });
};

/**
 * Method called when activating the I.
 */
ww.mode.CatMode.prototype.activateI = function() {
  // no-op
};

/**
 * Method called when activating the O.
 */
ww.mode.CatMode.prototype.activateO = function() {
  // no-op
};
