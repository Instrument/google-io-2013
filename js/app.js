goog.provide('ww.app');
goog.provide('ww.app.Core');
goog.require('ww.mode');
goog.require('ww.raf');
goog.require('ww.util');

/** @define {boolean} Engage debug mode or not. */
var DEBUG_MODE = false;

/**
 * The "app" controls the initial viewport ("index.html"), initializes new
 * modes in iframes when requested and animates between them.
 * @constructor
 */
ww.app.Core = function() {
  // Detect invalid browser
  this.isSupported_ = Modernizr.svg && Modernizr.csstransforms &&
    Modernizr.canvas;

  var upEvt = ww.util.getPointerEventNames('up', 'app');

  // Manually disable on given browser combos here:
  // if (oldAndroid) { isSupported = false; }
  // if (specificDevice) { isSupported = false; }

  if (!this.isSupported_) {
    $(document.body).addClass('unsupported');
    // Show disabled page.

    var $menu = $('#menu-fallback');
    var $modal = $('#modal-fallback');
    var $dropdown = $('#dropdown-fallback');
    $menu.bind(upEvt, function(e) {
      if (!$(e.target).is('a, label')) {
        $('#unsupported').addClass('modal-visible');
      }
    });

    $modal.bind(upEvt, function(e) {
      if (!$(e.target).is('a, label')) {
        $('#unsupported').removeClass('modal-visible');
      }
    });

    $dropdown.bind(upEvt, function(e) {
      if (!$(e.target).is('a, label')) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    if (Modernizr.touch) {
      $('.has-dropdown label').bind(upEvt, function() {
        $(self.containerElem_).addClass('nav-visible');
        $('.dropdown-visible').removeClass('dropdown-visible');
        $(this).closest('.has-dropdown').addClass('dropdown-visible');
      });

      $(window).bind(upEvt, function(e) {
        if (!$(e.target).is('a, label, #menu')) {
          $(self.containerElem_).removeClass('nav-visible');
          $('.dropdown-visible').removeClass('dropdown-visible');
        }
      });
    }
  }

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
  }, 50));
  this.onResize_();

  // Don't start the whole system if we're showing the fallback.
  if (!this.isSupported_) {
    return;
  }

  this.history_ = window['History'];

  // Bind to StateChange Event
  this.history_['Adapter'].bind(window, 'statechange', function() {
    var state = self.history_['getState']();
    var parts = state['url'].split('/');
    var lastPart = parts[parts.length - 1].replace('experiment-', '');

    if (ww.mode.modes[lastPart]) {
      self.loadModeByName_(lastPart, true);
    } else {
      self.loadModeByName_('home', true, true);
    }
  });

  // Catch top-level touch events and cancel them to avoid
  // mobile browser scroll.
  if (Modernizr.touch) {
    document.body.style[Modernizr.prefixed('userSelect')] = 'none';
    document.body.style[Modernizr.prefixed('userDrag')] = 'none';
    document.body.style[
      Modernizr.prefixed('tapHighlightColor')] = 'rgba(0,0,0,0)';

    var moveEvt = ww.util.getPointerEventNames('move', 'app');
    this.$window_.bind(moveEvt, function(e) {
      e.preventDefault();
      e.stopPropagation();
    });

    this.$window_.bind(upEvt, function(e) {
      if (!$(e.target).is('a, label')) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    var downEvt = ww.util.getPointerEventNames('down', 'app');
    this.$window_.bind(downEvt, function(e) {
      if (!$(e.target).is('a, label')) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    this.$window_.bind('dblclick.app', function(e) {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  self.start_();
};

/**
 * Handles a browser window resize event.
 * @private
 */
ww.app.Core.prototype.onResize_ = function() {
  this.width_ = this.$window_.width();
  this.height_ = this.$window_.height();

  // Update wrapper sizes
  $('#wrapper').css({
    'width': this.width_,
    'height': this.height_
  });

  this.fallbackCenterX_ = Math.floor(this.width_ / 2);
  this.fallbackCenterY_ = Math.floor(this.height_ / 2);

  this.fallbackWidth_ = 425;
  this.fallbackHeight_ = 318;

  if ($('.logo-io-fallback').hasClass('mobile-logo')) {
    $('.logo-io-fallback').removeClass('mobile-logo');
  }

  var pixelRatio = window.devicePixelRatio;

  if (this.width_ / pixelRatio < 525 || this.height_ / pixelRatio < 418) {
    this.fallbackWidth_ = 318;
    this.fallbackHeight_ = 238;
    $('.logo-io-fallback').addClass('mobile-logo');
  }

  this.fallbackX_ = this.fallbackCenterX_ - (this.fallbackWidth_ / 2);
  this.fallbackY_ = this.fallbackCenterY_ - (this.fallbackHeight_ / 2);

  $('.bounds-fallback').css({
    'left': this.fallbackX_,
    'top': this.fallbackY_,
    'width': this.fallbackWidth_ + 'px',
    'height': this.fallbackHeight_ + 'px'
  });

  $('.logo-io-fallback').css({
    'width': this.fallbackWidth_ + 'px',
    'height': this.fallbackHeight_ + 'px'
  });

  // Update mode iframe sizes.
  if (this.isSupported_ && this.loadedModes_) {
    for (var key in this.loadedModes_) {
      if (this.loadedModes_.hasOwnProperty(key)) {
        var mode = this.loadedModes_[key];

        if (mode.containerElem) {
          mode.containerElem.style.width = this.width_ + 'px';
          mode.containerElem.style.height = this.height_ + 'px';
        }

        if (mode.instance) {
          mode.instance.onResize(true);
        }
      }
    }
  }
};

/**
 * Start listening to message events and initialize home mode.
 * @private
 */
ww.app.Core.prototype.start_ = function() {
  var self = this;

  // Callback to run when a mode says it is ready.
  this.onReady_ = function() {};

  // Load home mode.
  this.loadModeByName_('home', false);
};

/**
 * @param {String} data Data message to post.
 */
ww.app.Core.prototype.postMessage = function(data) {
  this.log_('Got message: ' + data['name'], data);

  if (data['name'].match(/.ready/)) {
    this.onReady_(data);
  } else if (data['name'] === 'goToMode') {
    this.history_['pushState'](null, 'Google I/O 2013', 'experiment-' + data['data']);
  } else if (data['name'] === 'goToHome') {
    this.history_['back']();
  }
};

/**
 * Load (setup iframe) for a mode by name.
 * @private
 * @param {String} modeName The name of the mode.
 * @param {Boolean} transition Whether the mode will animate in.
 * @param {Boolean} reverse Whether the animation should be reversed.
 */
ww.app.Core.prototype.loadModeByName_ = function(modeName,
                                                 transition, reverse) {
  this.loadedModes_ = this.loadedModes_ || {};
  this.loadedModes_[modeName] = this.loadedModes_[modeName] ||
                                { name: modeName };
  this.loadMode_(this.loadedModes_[modeName], transition, reverse);
};

/**
 * Internal log method.
 * @private
 * @param {String} msg Log message.
 */
ww.app.Core.prototype.log_ = function(msg) {
  if (DEBUG_MODE &&
      ('undefined' !== typeof console) &&
      ('undefined' !== typeof console.log)) {
    var log = Function.prototype.bind.call(console.log, console);
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'App: ' + args[0];
    }
    log.apply(console, args);
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
 * Get a CSS translation string.
 * @private
 * @param {Number} x X value.
 * @return {String} Translated string value.
 */
ww.app.Core.prototype.translateXString_ = function(x) {
  if (Modernizr.csstransforms3d) {
    return 'translate3d(' + x + 'px, 0, 0)';
  } else {
    return 'translate(' + x + 'px, 0)';
  }
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
      currentMode = this.currentMode,
      self = this;

  if (currentMode && (currentMode.name == mode.name)) {
    return;
  }

  // If a mode is already focused, unfocus it (stop event handling/animation).
  if (currentMode) {
    currentMode.instance.postMessage({
      'name': 'unfocus',
      'data': null
    });

    currentMode.containerElem.style.pointerEvents = 'none';
  }

  if (transition) {
    // Transition onload handler
    onComplete = function() {
      // Tell the mode to start listening to events and animating.
      mode.instance.postMessage({
        'name': 'focus',
        'data': null
      });

      // Transition start position.
      var startX = reverse ? -self.width_ : self.width_;

      // Mode new mode into start position.
      mode.containerElem.style[self.transformKey_] =
        self.translateXString_(startX);
      mode.containerElem.style.visibility = 'visible';

      // After the DOM settles.
      setTimeout(function() {
        // Animate new mode in.
        var t2 = new TWEEN.Tween({ 'translateX': startX });
        t2.to({ 'translateX': 0 }, 800);
        t2.easing(TWEEN.Easing.Exponential.InOut);
        t2.onUpdate(function() {
          mode.containerElem.style[self.transformKey_] =
            self.translateXString_(this['translateX']);
        });
        t2.onComplete(function() {
          mode.containerElem.style.pointerEvents = 'auto';
        });
        t2.start();

        // Animate old mode out.
        if (currentMode) {
          var endX = -startX;
          var t = new TWEEN.Tween({ 'translateX': 0 });
          t.easing(TWEEN.Easing.Exponential.InOut);
          t.to({ 'translateX': endX }, 800);
          t.onUpdate(function() {
            currentMode.containerElem.style[self.transformKey_] =
              self.translateXString_(this['translateX']);
          });
          t.onComplete(function() {
            currentMode.containerElem.style.visibility = 'hidden';
          });
          t.start();
        }

        // Run the scheduled tweens.
        ww.raf.subscribe('app', self, self.renderFrame_);
      }, 10);
    };
  } else {
    // Non-transition onload handler
    onComplete = function() {
      // Tell the mode to start listening to events and animating.
      mode.instance.postMessage({
        'name': 'focus',
        'data': null
      });

      // Hide and disable events.
      mode.containerElem.style.visibility = 'visible';
      mode.containerElem.style.pointerEvents = 'auto';
    };
  }

  // If the mode is already loaded, use that instance.
  if (mode.instance) {
    this.currentMode = mode;
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
  var modeElem = document.createElement('div');
  modeElem.className = 'mode ' + mode.name + '-mode';
  modeElem.style.visibility = 'hidden';
  modeElem.style.pointerEvents = 'none';
  modeElem.style.width = this.width_ + 'px';
  modeElem.style.height = this.height_ + 'px';

  this.fetchModeContent_(mode.name, function(html) {
    $(modeElem).html(html).appendTo($('#wrapper'));

    // Look up the mode by name.
    var pair = ww.mode.findModeByName(mode.name);

    // Initialize
    if (pair && pair.klass) {
      mode.instance = new pair.klass(modeElem, ww.testMode ? '../../' : '');
    }

    self.currentMode = mode;

    // Store iframe element for later.
    mode.containerElem = modeElem;
  });
};

/**
 * @private
 * @param {String} name Name of mode to fetch.
 * @param {Function} onComplete On complete callback function.
 */
ww.app.Core.prototype.fetchModeContent_ = function(name, onComplete) {
  var url = 'modes/' + name + '.html?' + (+(new Date()));
  if (ww.testMode) {
    url = '../../' + url;
  }

  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'html',

    // Complete callback (responseText is used internally)
    complete: function(jqXHR, status, responseText) {
      responseText = jqXHR.responseText;

      if (jqXHR.isResolved()) {
        jqXHR.done(function(r) {
          responseText = r;
        });

        var result = responseText.split('<body>')[1];
        result = result.split('</body>')[0];
        onComplete(result);
      }
    }
  });
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

window['ww'] = window['ww'] || {};
window['ww']['app'] = window['ww']['app'] || {};
window['ww']['app']['Core'] = ww.app.Core;

goog.exportSymbol('ww.app.Core', ww.app.Core);
