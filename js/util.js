goog.provide('ww.util');

/**
 * Used to generate random X and Y coordinates.
 * @return array containing two random uniformly distributed floats.
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

ww.raqSubscribers = {};
ww.raqRunning = false;

ww.lastTime = 0;
ww.testMode = window.location.href.indexOf('test') > -1;

var subscriberKey, loopSubscriber, loopCurrentTime, loopDelta;
ww.raqOnFrame = function(t) {
  loopCurrentTime = t || new Date().getTime();
  loopDelta = loopCurrentTime - ww.lastTime;

  for (subscriberKey in ww.raqSubscribers) {
    if (ww.raqSubscribers.hasOwnProperty(subscriberKey)) {
      loopSubscriber = ww.raqSubscribers[subscriberKey];
      loopSubscriber[1].call(loopSubscriber[0], loopDelta);
    }
  }

  ww.lastTime = loopCurrentTime;

  if (ww.raqRunning) {
    requestAnimationFrame(ww.raqOnFrame);
  }
};

ww.raqUpdateStatus = function() {
  var len = 0;
  for (var key in ww.raqSubscribers) {
    if (ww.raqSubscribers.hasOwnProperty(key)) {
      len++;
    }
  }

  if (len > 0) {
    if (!ww.raqRunning) {
      ww.raqRunning = true;
      ww.lastTime = new Date().getTime();
      ww.raqOnFrame();
    }
  } else {
    if (ww.raqRunning) {
      ww.raqRunning = false;
    }
  }
};

ww.raqSubscribe = function(name, obj, func) {
  ww.raqSubscribers[name] = [obj, func];
  ww.raqUpdateStatus();
};

ww.raqUnsubscribe = function(name) {
  delete ww.raqSubscribers[name];
  ww.raqUpdateStatus();
};