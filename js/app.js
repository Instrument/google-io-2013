goog.provide('ww.app');
goog.require('ww.raf');
goog.require('ww.util');

/** @define {boolean} */
var DEBUG_MODE = false;

/**
 * The "app" controls the initial viewport ("index.html"), initializes new
 * modes in iframes when requested and animates between them.
 * @constructor
 */
ww.app.Core = function() {
  // Save key for CSS3 transforms.
  this.transformKey_ = Modernizr.prefixed('transform');

  // Instance window and sizing.
  this.$window_ = $(window);
  this.width_ = 0;
  this.height_ = 0;

  // Listen (throttled) to window resize events.
  var self = this;
  this.$window_.resize(ww.util.throttle(function() {
    self.onResize_();
  }, 100));
  this.onResize_();

  // Start event listeners.
  this.start_();
};

/**
 * Handles a browser window resize event.
 * @private
 */
ww.app.Core.prototype.onResize_ = function() {
  this.width_ = this.$window_.width();
  this.height_ = this.$window_.height();

  // Update mode iframe sizes.
  $('iframe').attr('width', this.width_).attr('height', this.height_);
};

/**
 * Start listening to message events and initialize home mode.
 * @private
 */
ww.app.Core.prototype.start_ = function() {
  var self = this;

  // Callback to run when a mode says it is ready.
  this.onReady_ = function() {};

  // Listen to message events.
  this.$window_.bind('message', function(evt) {
    var data = evt.originalEvent.data;
    self.log_('Got message: ' + data['name'], data);

    if (data['name'].match(/.ready/)) {
      self.onReady_(data);
    } else if (data['name'] === 'goToMode') {
      self.loadModeByName_(data['data'], true);
    } else if (data['name'] === 'goToHome') {
      self.loadModeByName_('home', true, true);
    }
  });

  // Load home mode.
  this.loadModeByName_('home', false);
};

/**
 * Load (setup iframe) for a mode by name.
 * @private
 * @param {String} modeName The name of the mode.
 * @param {Boolean} transition Whether the mode will animate in.
 * @param {Boolean} reverse Whether the animation should be reversed.
 */
ww.app.Core.prototype.loadModeByName_ = function(modeName, transition, reverse) {
  this.loadedModes_ = this.loadedModes_ || {};
  this.loadedModes_[modeName] = this.loadedModes_[modeName] || { name: modeName };
  this.loadMode_(this.loadedModes_[modeName], transition, reverse);
};

/**
 * Internal log method.
 * @private
 * @param {String} msg Log message;
 */
ww.app.Core.prototype.log_ = function(msg) {
  if (DEBUG_MODE && console && console.log) {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'App: ' + args[0];
    }
    console.log.apply(console, args);
  }
};

/**
 * Send an event to Google Analytics
 * @private
 * @param {String} action Name of the action.
 * @param {Object} value Value of the action.
 */
ww.app.Core.prototype.trackEvent_ = function(action, value) {
  ww.util.trackEvent('app', action, value);
};

/**
 * Load a mode (iframe) and transition it in.
 * @private
 * @param {Object} mode Mode details.
 * @param {Boolean} transition Whether the transition is animated.
 * @param {Boolean} reverse Whether the transition is reversed.
 */
ww.app.Core.prototype.loadMode_ = function(mode, transition, reverse) {
  var onComplete,
      currentFrame = this.currentIframe,
      self = this;

  // If a mode is already focused, unfocus it (stop event handling/animation).
  if (currentFrame) {
    currentFrame.contentWindow.postMessage({
      'name': 'unfocus',
      'data': null
    }, '*');

    currentFrame.style.pointerEvents = 'none';
  }
  
  if (transition) {
    // Transition onload handler
    onComplete = function() {
      // Tell the mode to start listening to events and animating.
      mode.iframe.contentWindow.postMessage({
        'name': 'focus',
        'data': null
      }, '*');
      
      // Transition start position.
      var startX = reverse ? -self.width_ : self.width_;

      // Mode new mode into start position.
      mode.iframe.style[self.transformKey_] = 'translateX(' + startX + 'px)';
      mode.iframe.style.visibility = 'visible';

      // After the DOM settles.
      setTimeout(function() {
        // Animate new mode in.
        var t2 = new TWEEN.Tween({ 'translateX': startX });
        t2.to({ 'translateX': 0 }, 400);
        t2.onUpdate(function() {
          mode.iframe.style[self.transformKey_] = 'translateX(' + this['translateX'] + 'px)';
        });
        t2.onComplete(function() {
          currentFrame.style.pointerEvents = 'auto';
        });
        t2.start();

        // Animate old mode out.
        if (currentFrame) {
          var endX = -startX;
          var t = new TWEEN.Tween({ 'translateX': 0 });
          t.to({ 'translateX': endX }, 400);
          t.onUpdate(function() {
            currentFrame.style[self.transformKey_] = 'translateX(' + this['translateX'] + 'px)';
          });
          t.onComplete(function() {
            currentFrame.style.visibility = 'hidden';
          });
          t.start();
        }

        // Run the scheduled tweens.
        ww.raf.subscribe('app', self, self.renderFrame_);
      }, 50);
    };
  } else {
    // Non-transition onload handler
    onComplete = function() {
      // Tell the mode to start listening to events and animating.
      mode.iframe.contentWindow.postMessage({
        'name': 'focus',
        'data': null
      }, '*');

      // Hide and disable events.
      mode.iframe.style.visibility = 'visible';
      mode.iframe.style.pointerEvents = 'auto';
    };
  }

  // If the mode is already loaded, use that iframe.
  if (mode.iframe) {
    this.currentIframe = mode.iframe;
    if ('function' === typeof onComplete) {
      onComplete();
    }
    return;
  }

  // Once loaded (we get an event of "modeName.ready", call onComplete.
  this.onReady_ = function(data) {
    if (data['name'] === (mode.name + '.ready')) {
      if ('function' === typeof onComplete) {
        onComplete();
      }
    }

    this.onReady_ = function() {};
  };

  // Create the element and add it to the DOM.
  var iFrameElem = document.createElement('iframe');
  iFrameElem.style.visibility = 'hidden';
  iFrameElem.style.pointerEvents = 'none';
  iFrameElem.src = 'modes/' + mode.name + '.html';
  iFrameElem.width = this.width_;
  iFrameElem.height = this.height_;
  $(iFrameElem).appendTo(document.body);

  this.currentIframe = iFrameElem;

  // Store iframe element for later.
  mode.iframe = iFrameElem;
};

/**
 * requestAnimationFrame callback method.
 * @private
 * @param {Number} delta Delta amount.
 */
ww.app.Core.prototype.renderFrame_ = function(delta) {
  if (!TWEEN.update()) {
    ww.raf.unsubscribe('app');
  }
};

// On DocumentReady, start controller.
$(function() {
  new ww.app.Core();
});
