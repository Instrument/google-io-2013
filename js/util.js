goog.provide('ww.raf');
goog.provide('ww.util');

/**
 * Whether we're in test mode.
 * @type {boolean}
 */
ww.testMode = window.location.href.indexOf('test') > -1;

/**
 * Used to generate random X and Y coordinates.
 * @return {array} containing two random uniformly distributed floats.
 */
ww.util.floatComplexGaussianRandom = function() {
  var x1;
  var x2;
  var w;
  var out = [];

  /*
   * x1 + I * x2 is uniformly distributed inside unit circle in the complex
   * plane. W is its magnitude squared.
   */
  do {
      x1 = 2.0 * Math.random() - 1.0;
      x2 = 2.0 * Math.random() - 1.0;
      w = x1 * x1 + x2 * x2;
  } while (w >= 1.0);

  w = Math.sqrt((-1.0 * Math.log(w)) / w);
  out[0] = x1 * w;
  out[1] = x2 * w;

  return out;
};

/**
 * Get the current time, depending on the browser's level of support.
 * @return {Number}
 */
ww.util.rightNow = function() {
  if (window['performance'] && window['performance']['now']) {
    return window['performance']['now']();
  } else {
    return +(new Date());
  }
};

/**
 * Pad a string to a given number of characters.
 * @param {Number} num Initial number.
 * @param {Number} len Desired length.
 * @return {String} String of desired length.
 */
ww.util.pad = function(num, len) {
  var str = '' + num;
  while (str.length < len) {
    str = '0' + str;
  }
  return str;
};


/**
 * Send an event to Google Analytics
 * @param {String} category Category of the action.
 * @param {String} action Name of the action.
 * @param {Object} value Value of the action.
 */
ww.util.trackEvent = function(category, action, value) {
  if (_gaq) {
    _gaq.push(['_trackEvent', category, action, value]);
  }
};

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
 * List of all subscribers.
 * @type {Array}
 */
ww.raf.subscribers_ = {};

/**
 * If rAF is running
 * @type {Boolean}
 */
ww.raf.isRunning_ = false;

/**
 * Last frame timestamp.
 * @type {Number}
 */
ww.raf.lastTime = 0;

/**
 * On-frame loop.
 * @private
 * @param {Number} t timer.
 */
ww.raf.onFrame_ = function(t) {
  var loopCurrentTime = t || ww.util.rightNow();
  var loopDelta = loopCurrentTime - ww.raf.lastTime;

  for (var subscriberKey in ww.raf.subscribers_) {
    if (ww.raf.subscribers_.hasOwnProperty(subscriberKey)) {
      var loopSubscriber = ww.raf.subscribers_[subscriberKey];
      loopSubscriber[1].call(loopSubscriber[0], loopDelta);
    }
  }

  ww.raf.lastTime = loopCurrentTime;

  if (ww.raf.isRunning_) {
    requestAnimationFrame(ww.raf.onFrame_);
  }
};

/**
 * After adding/removing a callback, see if we need to
 * stop/start the loop.
 * @private
 */
ww.raf.updateStatus_ = function() {
  var len = 0;
  for (var key in ww.raf.subscribers_) {
    if (ww.raf.subscribers_.hasOwnProperty(key)) {
      len++;
    }
  }

  if (len > 0) {
    if (!ww.raf.isRunning_) {
      ww.raf.isRunning_ = true;
      ww.raf.lastTime = ww.util.rightNow();
      ww.raf.onFrame_();
    }
  } else {
    if (ww.raf.isRunning_) {
      ww.raf.isRunning_ = false;
    }
  }
};

/**
 * Subscribe a named callback as needing a rAF loop.
 * @param {String} name The name of the callback.
 * @param {Object} obj The instance needing to be called.
 * @param {Function} func The reference to the function to be called.
 */
ww.raf.subscribe = function(name, obj, func) {
  ww.raf.subscribers_[name] = [obj, func];
  ww.raf.updateStatus_();
};

/**
 * Unsubscribe a named callback from needing a rAF loop.
 * @param {String} name The name of the callback.
 */
ww.raf.unsubscribe = function(name) {
  delete ww.raf.subscribers_[name];
  ww.raf.updateStatus_();
};
