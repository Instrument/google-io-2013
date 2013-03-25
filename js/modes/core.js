goog.provide('ww.mode.Core');
goog.require('ww.raf');
goog.require('ww.util');

/**
 * @constructor
 * @param {Element} containerElem Element of the mode.
 * @param {String} assetPrefix The containing element.
 * @param {String} name Name of the mode.
 * @param {Boolean} wantsAudio Whether this mode needs webAudio.
 * @param {Boolean} wantsDrawing Whether this mode needs to draw onFrame.
 * @param {Boolean} wantsPhysics Whether this mode needs physics.
 * @param {Boolean} wantsRetina Whether this mode should try to draw at 2x.
 */
ww.mode.Core = function(containerElem,
  assetPrefix, name, wantsAudio, wantsDrawing, wantsPhysics, wantsRetina) {

  // Define transform prefix.
  this.prefix_ = Modernizr.prefixed('transform');
  this.assetPrefix_ = assetPrefix || '';

  this.containerElem_ = containerElem;

  this.name_ = name;

  this.hasFocus = false;

  // By default, modes don't need audio.
  var aCtx = ww.util.getAudioContextConstructor();
  this.wantsAudio_ = (wantsAudio && aCtx) || false;

  if (this.wantsAudio_) {
    ww.mode.Core.audioContext = ww.mode.Core.audioContext || new aCtx();
    this.audioContext_ = ww.mode.Core.audioContext;
  }

  // By default, modes don't need audio.
  this.wantsDrawing_ = wantsDrawing || false;

  // By default, modes don't need audio.
  this.wantsPhysics_ = wantsPhysics || false;

  // By default, modes don't need retina scaling.
  this.requestsRetina_ = (wantsRetina && window.devicePixelRatio > 1) || false;
  this.wantsRetina_ = this.requestsRetina_;

  // By default, modes don't need rAF.
  this.wantsRenderLoop_ = this.wantsDrawing_ || this.wantsPhysics_ || false;

  this.tweens_ = [];

  this.$window_ = $(window);
  this.width_ = 0;
  this.height_ = 0;

  this.$bounds = this.find('.bounds');
  this.$letterI_ = this.find('.letter-i');
  this.$letterO_ = this.find('.letter-o');

  var self = this;
  setTimeout(function() {
    // Mark this mode as ready.
    self.log('Starting preload');
    self.loadSounds_(function() {
      self.log('Preload complete');

      self.init();
      self.onResize(true);

      var modeDetails = ww.mode.findModeByName(self.name_);

      if (modeDetails.pattern) {
        self.$back = $('<div class="back"></div>');
        self.$back.prependTo(self.containerElem_);

        var modePattern = ww.util.pad(modeDetails.pattern.toString(2),
          modeDetails.len);
        var modeHTML = modePattern.replace(/1/g,
          '<span class="i"></span>').replace(/0/g, '<span class="o"></span>');

        $('<div class="code">' + modeHTML +
          '</div>').prependTo(self.containerElem_);
      }

      // Autofocus
      self.focus_();

      self.ready_();
    });
  }, 10);
};

/**
 * Find a dom element.
 * @param {String} query The query to use to find a dom element.
 * @return {Object} $(this.containerElem_).find(query) The dom element.
 */
ww.mode.Core.prototype.find = function(query) {
  return $(this.containerElem_).find(query);
};

/**
 * Log a message.
 * @param {String} msg The message to log.
 */
ww.mode.Core.prototype.log = function(msg) {
  if (DEBUG_MODE &&
      ('undefined' !== typeof console) &&
      ('undefined' !== typeof console.log)) {
    var log = Function.prototype.bind.call(console.log, console);
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = this.name_ + ': ' + args[0];
    }
    log.apply(console, args);
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

  if (this.paperCanvas_) {
    paper = this.paperScope_;
  }
};

/**
 * Vind an event.
 * @private
 * @param {String} elem Element to bind.
 * @param {String} evt Type of event.
 * @param {Function} onEvent Callback.
 */
ww.mode.Core.prototype.bindEvent_ = function(elem, evt, onEvent) {
  var $elem = $(elem);
  var evtName = ww.util.getPointerEventNames(evt, this.name_);

  $elem.bind(evtName, onEvent);
};

/**
 * Unbind an event.
 * @private
 * @param {String} elem Element to unbind.
 * @param {String} evt Type of event.
 */
ww.mode.Core.prototype.unbindEvent_ = function(elem, evt) {
  var $elem = $(elem);
  var evtName = ww.util.getPointerEventNames(evt, this.name_);

  $elem.unbind(evtName);
};

/**
 * Block screen with modal reload button.
 * @param {Function} onReload A callback.
 * @param {Boolean} shouldAnimate Whether modal should animate.
 */
ww.mode.Core.prototype.showReload = function(onReload, shouldAnimate) {
  // this.unfocus_();

  var self = this;

  if (!this.$reloadModal_) {
    this.$reloadModal_ = $(this.containerElem_).find('.reload');
    if (!this.$reloadModal_.length) {
      this.$reloadModal_ =
        $("<div class='reload'></div>").appendTo(this.containerElem_);
    }
  }

  this.$reloadModal_.hide();

  var upEvt = ww.util.getPointerEventNames('up', 'reload');
  this.$reloadModal_.bind(upEvt, function() {

    if (shouldAnimate) {
      self.$reloadModal_.fadeOut();
    } else {
      self.$reloadModal_.hide();
    }

    if ('function' === typeof onReload) {
      onReload();
    }
  });

  if (shouldAnimate) {
    this.$reloadModal_.fadeIn();
  } else {
    this.$reloadModal_.show();
  }
};

/**
 * Handles a browser window resize.
 * @param {Boolean} redraw Whether resize redraws.
 */
ww.mode.Core.prototype.onResize = function(redraw) {
  this.width_ = $(this.containerElem_).width();
  this.height_ = $(this.containerElem_).height();

  if (this.requestsRetina_) {
    this.wantsRetina_ = !((this.height_ > 1024) || (this.width_ > 1024));
  }

  var scale = 1;
  if (this.wantsRetina_) {
    // Hack around iPad 3 landscape GPU issue
    if (this.width_ === 1024) {
      this.width_ -= 2;
      this.height_ -= 2;
    }

    scale = 2;
  }

  this.log('Resize ' + this.width_ + 'x' + this.height_);

  this.updateBounds();

  if (this.paperCanvas_) {
    paper = this.paperScope_;
    this.paperCanvas_.width = this.width_ * scale;
    this.paperCanvas_.height = this.height_ * scale;
    paper['view']['setViewSize'](this.width_ * scale, this.height_ * scale);

    $(this.paperCanvas_).css({
      'width': this.width_,
      'height': this.height_
    });
  }

  if (redraw) {
    this.redraw();
  }
};

/**
 * Figure out content bounds.
 */
ww.mode.Core.prototype.updateBounds = function() {
  var maxContentWidth = 500; // Ratio 4x3
  var maxContentHeight = maxContentWidth * (3 / 4); // Ratio 4x3
  var horizontalBuffer = 30;
  var topBuffer = 60;
  var bottomBuffer = 20;

  if (this.width_ > this.height_) {
    var relativeHeight = (this.height_ - topBuffer - bottomBuffer);
    var desiredHeight = Math.min(maxContentHeight, relativeHeight);

    this.boundsHeight_ = desiredHeight;
    this.boundsWidth_ = this.boundsHeight_ * (4 / 3);
  } else {
    var relativeWidth = (this.width_ - (horizontalBuffer * 2));
    var desiredWidth = Math.min(maxContentWidth, relativeWidth);

    this.boundsWidth_ = desiredWidth;
    this.boundsHeight_ = this.boundsWidth_ * (3 / 4);
  }

  this.boundsCenterX_ = Math.floor(this.width_ / 2);
  this.boundsCenterY_ = Math.floor(this.height_ / 2);
  // + Math.floor((topBuffer - bottomBuffer) / 2);

  this.boundsX_ = this.boundsCenterX_ - Math.floor(this.boundsWidth_ / 2);
  this.boundsY_ = this.boundsCenterY_ - Math.floor(this.boundsHeight_ / 2);

  this.$bounds.css({
    'left': this.boundsX_,
    'top': this.boundsY_,
    'width': this.boundsWidth_,
    'height': this.boundsHeight_
  });
};

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
 * @param {Number} delta Ms since last draw.
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
  if (this.paperCanvas_ &&
      (this.paperCanvas_.width > 0) &&
      (this.paperCanvas_.height > 0)) {
    var scale = 1;
    if (this.wantsRetina_) {
      scale = 2;
    }

    paper = this.paperScope_;
    var pctx = this.paperCanvas_.getContext('2d');
    pctx.save();
    pctx.scale(scale, scale);
    paper['view']['draw']();
    pctx.restore();
  }
};

/**
 * Load the sounds, trigger ready when complete.
 * @private
 * @param {Function} onComplete After sounds are loaded.
 */
ww.mode.Core.prototype.loadSounds_ = function(onComplete) {
  if (!this.wantsAudio_) {
    onComplete();
    return;
  }

  var self = this;
  var needingLoad = 0;
  var filename;

  for (filename in this.unloadedSounds_) {
    if (this.unloadedSounds_.hasOwnProperty(filename)) {
      needingLoad++;
    }
  }

  if (needingLoad <= 0) {
    onComplete();
    return;
  }

  for (filename in this.unloadedSounds_) {
    if (this.unloadedSounds_.hasOwnProperty(filename)) {
      (function(filename) {
        var url = self.assetPrefix_ + 'sounds/' + self.name_ + '/' + filename;

        self.log('Requested sound "' + url + '"');

        self.fetchSoundBufferFromURL_(url, function() {
          needingLoad--;
          delete self.unloadedSounds_[url];

          if (needingLoad === 0) {
            onComplete();
          }
        });
      })(filename);
    }
  }
};

/**
 * Tell parent frame that this mode is ready.
 * @private
 */
ww.mode.Core.prototype.ready_ = function() {
  // if (DEBUG_MODE) {
  //   window['currentMode'] = this;
  // }

  if (window['onModeReady']) {
    window['onModeReady'](this);
  }

  this.log('Is ready');

  // Notify parent frame that we are ready.
  this.sendMessage_(this.name_ + '.ready');
};

/**
 * Log the current mode status. Focus and unfocus when necessary.
 * @param {Object} data The data to check for focus.
 */
ww.mode.Core.prototype.postMessage = function(data) {
  this.log('Got message: ' + data['name'], data);

  if (data['name'] === 'focus') {
    this.focus_();
  } else if (data['name'] === 'unfocus') {
    this.unfocus_();
  }
};

/**
 * Send the parent a message.
 * @private
 * @param {String} msgName DNS-style message path.
 * @param {Object} value The data to send.
 */
ww.mode.Core.prototype.sendMessage_ = function(msgName, value) {
  if (window['app'] && window['app'].postMessage) {
    window['app'].postMessage({
      'name': msgName,
      'data': value
    });
  }
};

/**
 * Return from this mode to the home screen.
 */
ww.mode.Core.prototype.goBack = function() {
  this.sendMessage_('goToHome');
};

/**
 * Send an event to Google Analytics
 * @private
 * @param {String} action Name of the action.
 * @param {Object} value Value of the action.
 */
ww.mode.Core.prototype.trackEvent_ = function(action, value) {
  var category = 'mode-' + this._name;
  ww.util.trackEvent(category, action, value);
};

/**
 * Focus this mode (start rendering).
 * @private
 */
ww.mode.Core.prototype.focus_ = function() {
  if (this.hasFocus) { return; }

  if (this.paperCanvas_) {
    paper = this.paperScope_;
  }

  // Re-init
  if (this.hasInited_) {
    this.init();
  }

  this.willFocus();

  this.log('Got focus');
  this.hasFocus = true;

  // Try to start rAF if requested.
  this.startRendering();

  this.didFocus();
};

/**
 * Event is called before a mode focused.
 */
ww.mode.Core.prototype.willFocus = function() {
  // No-op
};

/**
 * Event is called after a mode focused.
 */
ww.mode.Core.prototype.didFocus = function() {
  var self = this;

  var upEvt = ww.util.getPointerEventNames('up', this.name_);

  this.$letterI_.bind(upEvt, function() {
    self.activateI();
  });

  this.$letterO_.bind(upEvt, function() {
    self.activateO();
  });

  if (this.$back) {
    this.$back.bind(upEvt, function() {
      self.goBack();
    });
  }

  $(document).bind('keyup.' + this.name_, function(e) {
    if (e.keyCode === 105 || e.keyCode === 49 || e.keyCode === 73) {
      self.activateI();
    } else if (e.keyCode === 111 || e.keyCode === 48 || e.keyCode === 79) {
      self.activateO();
    } else if (e.keyCode === 27) {
      self.goBack();
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
 * @private
 */
ww.mode.Core.prototype.unfocus_ = function() {
  if (!this.hasFocus) { return; }

  this.willUnfocus();

  this.log('Lost focus');
  this.hasFocus = false;

  // Try to stop rAF if requested.
  this.stopRendering();

  this.didUnfocus();
};

/**
 * Event is called before a mode unfocused.
 */
ww.mode.Core.prototype.willUnfocus = function() {
  // No-op
};

/**
 * Event is called after a mode unfocused.
 */
ww.mode.Core.prototype.didUnfocus = function() {
  var upEvt = ww.util.getPointerEventNames('up', this.name_);
  this.$letterI_.unbind(upEvt);
  this.$letterO_.unbind(upEvt);

  if (this.$back) {
    this.$back.unbind(upEvt);
  }

  if (this.$reloadModal_) {
    this.$reloadModal_.hide();
    this.$reloadModal_.unbind(ww.util.getPointerEventNames('up', 'reload'));
  }

  $(document).unbind('keyup.' + this.name_);
};

/**
 * Get a preloaded sound buffer (binary audio file).
 * @private
 * @param {String} url Audio file URL.
 * @return {AudioBuffer} Buffer representing sound.
 */
ww.mode.Core.prototype.getLoadedSoundBufferFromURL_ = function(url) {
  this.soundBuffersFromURL_ = this.soundBuffersFromURL_ || {};

  if (this.soundBuffersFromURL_[url]) {
    return this.soundBuffersFromURL_[url];
  }
};

/**
 * Load a sound buffer (binary audio file).
 * @private
 * @param {String} url Audio file URL.
 * @param {Function} gotSound On-load callback.
 */
ww.mode.Core.prototype.fetchSoundBufferFromURL_ = function(url, gotSound) {
  this.soundBuffersFromURL_ = this.soundBuffersFromURL_ || {};
  gotSound = gotSound || function() {};

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
 * @param {Object} integrator The Physics integrator.
 * @return {Physics} The shared audio context.
 */
ww.mode.Core.prototype.getPhysicsWorld_ = function(integrator) {
  if (this.physicsWorld_) { return this.physicsWorld_; }
  this.physicsWorld_ = new Physics(integrator);
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
    var world = this.getPhysicsWorld_();

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
 * Get an audio context.
 * @private
 * @return {AudioContext} The shared audio context.
 */
ww.mode.Core.prototype.getAudioContext_ = function() {
  return this.audioContext_;
};

/**
 * Cache a sound file.
 * @param {String} filename Audio file name.
 */
ww.mode.Core.prototype.preloadSound = function(filename) {
  this.unloadedSounds_ = this.unloadedSounds_ || {};
  this.unloadedSounds_[filename] = true;
};

/**
 * Play a sound by url.
 * @param {String} filename Audio file name.
 * @param {Function} onPlay Callback on play.
 * @param {Boolean} loop To loop the audio, or to not loop the audio.
 */
ww.mode.Core.prototype.playSound = function(filename, onPlay, loop) {
  if (!this.wantsAudio_) { return; }

  var url = this.assetPrefix_ + 'sounds/' + this.name_ + '/' + filename;

  this.log('Playing sound "' + filename + '"');

  var audioContext = this.getAudioContext_();

  var buffer = this.getLoadedSoundBufferFromURL_(url);

  var source = audioContext.createBufferSource();
  var gain = audioContext.createGainNode();
  gain.gain.value = 0.1;
  source.buffer = buffer;
  source.loop = loop || false;
  source.connect(gain);
  gain.connect(audioContext.destination);
  source.noteOn(0);

  if ('function' === typeof onPlay) {
    onPlay(source);
  }
};

/**
 * Method called when activating the I.
 */
ww.mode.Core.prototype.activateI = function() {
  // no-op
  this.log('Activated "I"');
  this.trackEvent_('activated-i');
};

/**
 * Method called when activating the O.
 */
ww.mode.Core.prototype.activateO = function() {
  // no-op
  this.log('Activated "O"');
  this.trackEvent_('activated-o');
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
 * @param {boolean} doNotAdd Adds a canvas element if left as false.
 * @return {Element} The canvas element.
 * @private
 */
ww.mode.Core.prototype.getPaperCanvas_ = function(doNotAdd) {
  if (!this.paperCanvas_) {
    this.paperCanvas_ = document.createElement('canvas');

    var scale = 1;
    if (this.wantsRetina_) {
      scale = 2;
    }

    this.paperCanvas_.width = this.width_ * scale;
    this.paperCanvas_.height = this.height_ * scale;

    $(this.paperCanvas_).css({
      'width': this.width_,
      'height': this.height_
    });

    $(this.containerElem_).prepend(this.paperCanvas_);

    paper = new paper['PaperScope']();
    paper['setup'](this.paperCanvas_);

    this.paperScope_ = paper;

    if (doNotAdd) {
      $(this.paperCanvas_).remove();
    }
  }

  return this.paperCanvas_;
};

/**
 * Adds and runs a tween.
 * @param {Object} tween The tween to add and run.
 */
ww.mode.Core.prototype.addTween = function(tween) {
  tween.start(this.timeElapsed_);
};

/**
 * Function to return mouse or touch coordinates depending on what's available.
 * @param {Object} e The event to get X and Y coordinates from.
 * @return {Object} coords The X and Y coordinates of the click or touch.
 */
ww.mode.Core.prototype.getCoords = function(e) {
  var coords = [
    {
      'x': 0,
      'y': 0
    }
  ];

  if (e.originalEvent.changedTouches) {
    coords['x'] = e.originalEvent.changedTouches[0].pageX;
    coords['y'] = e.originalEvent.changedTouches[0].pageY;
  } else {
    coords['x'] = e.pageX;
    coords['y'] = e.pageY;
  }

  return coords;
};

/**
 * Shared function for modes using home's shape and interaction.
 */
ww.mode.Core.prototype.setPaperShapeData = function() {
  // Set I's initial dimensions.
  this.iWidth = this.boundsWidth_ * 0.2;
  this.iHeight = this.boundsWidth_ * 0.43058824;

  // Set coordinates for I's upper left corner.
  this.iX = this.boundsX_ + (this.boundsWidth_ * 0.10352941);
  this.iY = this.boundsY_ + (this.boundsWidth_ * 0.16);

  this.iCenter = new paper['Point'](this.iX + this.iWidth / 2,
    this.iY + this.iHeight / 2);

  // Set O's radius.
  this.oRad = this.boundsWidth_ * 0.22588235;

  // Set O's coordinates.
  this.oX = this.boundsX_ +
    (this.boundsWidth_ * 0.69647059);
  this.oY = this.boundsY_ + (this.boundsWidth_ * 0.37411765);

  this.oCenter = new paper['Point'](this.oX, this.oY);

  // Set Slash's coordinates.
  this.slashStartX = this.boundsX_ + (this.boundsWidth_ * 0.50352941);
  this.slashStartY = this.boundsY_ + (this.boundsWidth_ * 0.06823529);
  this.slashEndX = this.boundsX_ + (this.boundsWidth_ * 0.32);
  this.slashEndY = this.boundsY_ + (this.boundsWidth_ * 0.68705882);

  this.slashWidth = this.boundsWidth_ * 0.02212389;

  if (this.find('.year-mark')) {
    this.find('.year-mark').css({
      'left': this.boundsX_ + (this.boundsWidth_ * 0.85411765),
      'top': this.boundsY_ + (this.boundsWidth_ * 0.08705882)
    });
  }
};
