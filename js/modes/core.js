goog.provide('ww.mode.Core');
goog.require('goog.events');
goog.require('ww.util');
goog.require('ww.raf');

/**
 * @constructor
 * @param {String} name Name of the mode.
 * @param {Boolean} wantsAudio Whether this mode needs webAudio.
 * @param {Boolean} wantsDrawing Whether this mode needs to draw onFrame.
 * @param {Boolean} wantsPhysics Whether this mode needs physics.
 */
ww.mode.Core = function(name, wantsAudio, wantsDrawing, wantsPhysics) {
  // Define transform prefix.
  this.prefix_ = Modernizr.prefixed('transform');

  this.name_ = name;

  this.hasFocus = false;

  // By default, modes don't need audio.
  var aCtx = this.getAudioContextConstructor_();
  this.wantsAudio_ = (wantsAudio && aCtx) || false;

  // By default, modes don't need audio.
  this.wantsDrawing_ = wantsDrawing || false;

  // By default, modes don't need audio.
  this.wantsPhysics_ = wantsPhysics || false;

  // By default, modes don't need rAF.
  this.wantsRenderLoop_ = this.wantsDrawing_ || this.wantsPhysics_ || false;

  this.tweens_ = [];

  if (!ww.testMode && DEBUG_MODE) {
    this.addDebugUI_();
  }

  var self = this;

  goog.events.listen(window, 'message', function(evt) {
    var data = evt.getBrowserEvent().data;
    self.log('Got message: ' + data['name'], data);

    if (data['name'] === 'focus') {
      self.focus_();
    } else if (data['name'] === 'unfocus') {
      self.unfocus_();
    }
  });

  this.window_ = $(window);
  this.width_ = 0;
  this.height_ = 0;

  // TODO: Throttle

  // Catch top-level touch events and cancel them to avoid
  // mobile browser scroll.
  if (Modernizr.touch) {
    document.body.style[Modernizr.prefixed('userSelect')] = 'none';
    document.body.style[Modernizr.prefixed('userDrag')] = 'none';
    document.body.style[Modernizr.prefixed('tapHighlightColor')] = 'rgba(0,0,0,0)';
  }

  // $(document.body).addClass(this.name_ + '-mode');
  
  $(function() {
    self.letterI = $('#letter-i');
    self.letterO = $('#letter-o');

    self.init();

    self.window_.resize(function() {
      self.onResize(true);
    });
    self.onResize();

    var modeDetails = ww.mode.findModeByName(self.name_);

    if (modeDetails.pattern) {
      self.$back = $('<div id="back"></div>').prependTo(document.body);

      var modePattern = ww.util.pad(modeDetails.pattern.toString(2), modeDetails.len);
      var modeHTML = modePattern.replace(/1/g, '<span class="i"></span>').replace(/0/g, '<span class="o"></span>');

      $('<div id="code">' + modeHTML + '</div>').prependTo(document.body);
    }

    // Autofocus
    self.focus_();

    // Mark this mode as ready.
    self.ready_();
  });
};

/**
 * Log a message.
 * @param {String} msg The message to log.
 */
ww.mode.Core.prototype.log = function(msg) {
  if (DEBUG_MODE && console && console.log) {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = this.name_ + ': ' + args[0];
    }
    console.log.apply(console, args);
  }
};

/**
 * Initialize (or re-initialize) the mode
 */
ww.mode.Core.prototype.init = function() {
  this.log('Init');

  this.hasInited_ = true;

  if (this.wantsPhysics_) {
    this.resetPhysicsWorld_();
  }
};

/**
 * Block screen with modal reload button.
 */
ww.mode.Core.prototype.showReload = function() {
  this.unfocus_();

  var self = this;

  if (!this.$reloadModal_) {
    this.$reloadModal_ = $('#reload');
    if (!this.$reloadModal_.length) {
      this.$reloadModal_ = $("<div id='reload'></div>").appendTo(document.body);
    }

    var evt = Modernizr.touch ? 'touchend' : 'mouseup';

    this.$reloadModal_.bind(evt + '.reload', function() {
      self.$reloadModal_.hide();
      self.focus_();
    });
  }

  this.$reloadModal_.show();
};

/**
 * Handles a browser window resize.
 * @param {Boolean} redraw Whether resize redraws.
 */
ww.mode.Core.prototype.onResize = function(redraw) {
  this.width_ = this.window_.width();
  this.height_ = this.window_.height();
  this.log('Resize ' + this.width_ + 'x' + this.height_);

  if (this.paperCanvas_) {
    this.paperCanvas_.width = this.width_;
    this.paperCanvas_.height = this.height_;
    paper['view']['setViewSize'](this.width_, this.height_);
  }

  if (redraw) {
    this.redraw();
  }
};

if (DEBUG_MODE) {
  /**
   * Add play/pause/restart UI.
   * @private
   */
  ww.mode.Core.prototype.addDebugUI_ = function() {
    var self = this;

    var focusElem = document.createElement('button');
    focusElem.style.fontSize = '12px';
    focusElem.innerHTML = 'Focus';
    focusElem.onclick = function() {
      self.focus_();
    };

    var unfocusElem = document.createElement('button');
    unfocusElem.style.fontSize = '12px';
    unfocusElem.innerHTML = 'Unfocus';
    unfocusElem.onclick = function() {
      self.unfocus_();
    };

    var restartElem = document.createElement('button');
    restartElem.style.fontSize = '12px';
    restartElem.innerHTML = 'Restart';
    restartElem.onclick = function() {
      self.unfocus_();
      self.focus_();
    };

    var containerElem = document.createElement('div');
    containerElem.style.position = 'fixed';
    containerElem.style.bottom = 0;
    containerElem.style.left = 0;
    containerElem.style.right = 0;
    containerElem.style.height = '1.5em';
    containerElem.style.background = 'rgba(0,0,0,0.2)';
    containerElem.style.zIndex = 20;

    containerElem.appendChild(focusElem);
    containerElem.appendChild(unfocusElem);
    containerElem.appendChild(restartElem);

    document.body.appendChild(containerElem);
  };
}

/**
 * Begin running rAF, but only if mode needs it.
 */
ww.mode.Core.prototype.startRendering = function() {
  // No-op if mode doesn't need rAF
  if (!this.wantsRenderLoop_) { return; }

  this.framesRendered_ = 0;
  this.timeElapsed_ = 0;

  ww.raf.subscribe(this.name_, this, this.renderFrame);
};

/**
 * Stop running rAF, but only if mode needs it.
 */
ww.mode.Core.prototype.stopRendering = function() {
  // No-op if mode doesn't need rAF
  if (!this.wantsRenderLoop_) { return; }

  ww.raf.unsubscribe(this.name_);
};

/**
 * Render a single frame. Call the mode's draw method,
 * then schedule the next frame if we need it.
 */
ww.mode.Core.prototype.renderFrame = function(delta) {
  this.timeElapsed_ += delta;

  delta *= 0.001;

  // Reduce large gaps (returning from background tab) to
  // a single frame.
  if (delta > 0.5) {
    delta = 0.016;
  }

  if (this.wantsPhysics_) {
    this.stepPhysics(delta);
  }

  TWEEN.update(this.timeElapsed_);

  if (this.wantsDrawing_) {
    this.onFrame(delta);
  }

  this.framesRendered_++;
};

/**
 * Redraw without stepping (for resizes).
 */
ww.mode.Core.prototype.redraw = function() {
  if (this.wantsDrawing_) {
    this.onFrame(0);
  }
};

/**
 * Draw a single frame.
 * @param {Number} delta Ms since last draw.
 */
ww.mode.Core.prototype.onFrame = function(delta) {
  // Render paper if we're using it
  if (this.paperCanvas_) {
    paper['view']['draw']();
  }
};

/**
 * Tell parent frame that this mode is ready.
 * @private
 */
ww.mode.Core.prototype.ready_ = function() {
  if (DEBUG_MODE) {
    window['currentMode'] = this;
  }

  if (window['onModeReady']) {
    window['onModeReady'](this);
  }

  this.log('Is ready');

  // Notify parent frame that we are ready.
  this.sendMessage_(this.name_ + '.ready');
};

/**
 * Send the parent a message.
 * @private
 * @param {String} msgName DNS-style message path.
 * @param {Object} value The data to send.
 */
ww.mode.Core.prototype.sendMessage_ = function(msgName, value) {
  if (window.parent && window.parent.postMessage) {
    window.parent.postMessage({
      'name': msgName,
      'data': value
    }, '*');
  }
};

/**
 * Return from this mode to the home screen.
 */
ww.mode.Core.prototype.goBack = function() {
  this.sendMessage_('goToHome');
};

/**
 * Focus this mode (start rendering).
 */
ww.mode.Core.prototype.focus_ = function() {
  if (this.hasFocus) { return; }

  // Re-init
  if (this.hasInited_) {
    this.init();
  }

  this.log('Got focus');
  this.hasFocus = true;

  // Try to start rAF if requested.
  this.startRendering();

  this.didFocus();
};

/**
 * Event is called after a mode focused.
 */
ww.mode.Core.prototype.didFocus = function() {
  var self = this;

  var evt = Modernizr.touch ? 'touchend' : 'mouseup';

  this.letterI.bind(evt + '.core', function() {
    self.activateI();
  });

  this.letterO.bind(evt + '.core', function() {
    self.activateO();
  });

  if (this.$back) {
    this.$back.bind(evt + '.core', function() {
      self.goBack();
    });
  }

  $(document).bind('keypress.core', function(e) {
    if ((e.keyCode === 105) || (e.keyCode === 49)) {
      self.activateI();
    } else if ((e.keyCode === 111) || (e.keyCode === 48)) {
      self.activateO();
    } else {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    return false;
  });
};

/**
 * Unfocus this mode (stop rendering).
 */
ww.mode.Core.prototype.unfocus_ = function() {
  if (!this.hasFocus) { return; }

  this.log('Lost focus');
  this.hasFocus = false;

  // Try to stop rAF if requested.
  this.stopRendering();

  this.didUnfocus();
};

/**
 * Event is called after a mode unfocused.
 */
ww.mode.Core.prototype.didUnfocus = function() {
  var evt = Modernizr.touch ? 'touchend' : 'mouseup';

  this.letterI.unbind(evt + '.core');
  this.letterO.unbind(evt + '.core');
  
  if (this.$back) {
    this.$back.unbind(evt + '.core');
  }

  $(document).unbind('keypress.core');
};

/**
 * Load a sound buffer (binary audio file).
 * @private
 * @param {String} url Audio file URL.
 * @param {Function} gotSound On-load callback.
 */
ww.mode.Core.prototype.getSoundBufferFromURL_ = function(url, gotSound) {
  this.soundBuffersFromURL_ = this.soundBuffersFromURL_ || {};
  gotSound = gotSound || function(){};

  if (this.soundBuffersFromURL_[url]) {
    gotSound(this.soundBuffersFromURL_[url]);
    return;
  }

  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  var self = this;
  request.onload = function() {
    var audioContext = self.getAudioContext_();
    audioContext.decodeAudioData(request.response, function(buffer) {
      self.soundBuffersFromURL_[url] = buffer;
      gotSound(self.soundBuffersFromURL_[url]);
    });
  };
  request.send();
};

/**
 * Get a physics world.
 * @private
 * @return {Physics} The shared audio context.
 */
ww.mode.Core.prototype.getPhysicsWorld_ = function() {
  if (this.physicsWorld_) { return this.physicsWorld_; }
  this.physicsWorld_ = new Physics();
  return this.physicsWorld_;
};

/**
 * Clear world.
 * @private
 */
ww.mode.Core.prototype.resetPhysicsWorld_ = function() {
  if (this.physicsWorld_ && this.physicsWorld_.destroy) {
    this.physicsWorld_.destroy();
  }

  this.physicsWorld_ = null;
};

/**
 * Step forward in time for physics.
 * @param {Number} delta Ms since last step.
 */
ww.mode.Core.prototype.stepPhysics = function(delta) {
  if (delta > 0) {
    var world = this.physicsWorld_;

    world.integrate(delta);

    if (this.paperCanvas_) {
      for (var i = 0; i < world.particles.length; i++) {
        var p = world.particles[i];
        if ((typeof p['drawObj'] !== 'undefined') && p['drawObj']['position']) {
          p['drawObj']['position']['x'] = p.pos.x;
          p['drawObj']['position']['y'] = p.pos.y;
        }
      }
    }
  }
};

/**
 * Get the prefixed audio constructor.
 * @private
 * @return {Function} The constructor.
 */
ww.mode.Core.prototype.getAudioContextConstructor_ = function() {
  if ('undefined' !== typeof AudioContext) {
    return AudioContext;
  } else if ('undefined' !== typeof webkitAudioContext) {
    return webkitAudioContext;
  }

  return null;
};

/**
 * Get an audio context.
 * @private
 * @return {AudioContext} The shared audio context.
 */
ww.mode.Core.prototype.getAudioContext_ = function() {
  if (!this.audioContext_) {
    var aCtx = this.getAudioContextConstructor_();
    this.audioContext_ = new aCtx();
  }

  return this.audioContext_;
};

/**
 * Cache a sound file.
 * @param {String} filename Audio file name.
 */
ww.mode.Core.prototype.preloadSound = function(filename) {
  if (!this.wantsAudio_) { return; }

  var url = '../sounds/' + this.name_ + '/' + filename;
  if (ww.testMode) {
    url = '../' + url;
  }

  this.log('Requested sound "' + filename + '" from "' + url + '"');

  this.getSoundBufferFromURL_(url);
};

/**
 * Play a sound by url.
 * @param {String} filename Audio file name.
 * @param {Function} onPlay Callback on play.
 * @param {Boolean} loop To loop the audio, or to not loop the audio.
 */
ww.mode.Core.prototype.playSound = function(filename, onPlay, loop) {
  if (!this.wantsAudio_) { return; }

  var url = '../sounds/' + this.name_ + '/' + filename;
  if (ww.testMode) {
    url = '../' + url;
  }

  this.log('Playing sound "' + filename + '"');

  var audioContext = this.getAudioContext_();

  this.getSoundBufferFromURL_(url, function(buffer) {
    var source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = loop || false;
    source.connect(audioContext.destination);
    source.noteOn(0);

    if ('function' === typeof onPlay) {
      onPlay(source);
    }
  });
};

/**
 * Method called when activating the I.
 */
ww.mode.Core.prototype.activateI = function() {
  // no-op
  this.log('Activated "I"');
};

/**
 * Method called when activating the O.
 */
ww.mode.Core.prototype.activateO = function() {
  // no-op
  this.log('Activated "O"');
};

/**
 * CSS Transform an element.
 * @private
 * @param {Element} elem The element.
 * @param {String} value The CSS Value.
 */
ww.mode.Core.prototype.transformElem_ = function(elem, value) {
  elem.style[this.prefix_] = value;
};

/**
 * Get a canvas for use with paperjs.
 * @return {Element} The canvas element.
 */
ww.mode.Core.prototype.getPaperCanvas_ = function() {
  if (!this.paperCanvas_) {
    this.paperCanvas_ = document.createElement('canvas');
    this.paperCanvas_.width = this.width_;
    this.paperCanvas_.height = this.height_;
    $(document.body).prepend(this.paperCanvas_);

    paper['setup'](this.paperCanvas_);
  }

  return this.paperCanvas_;
};

ww.mode.Core.prototype.addTween = function(tween) {
  tween.start(this.timeElapsed_);
};
