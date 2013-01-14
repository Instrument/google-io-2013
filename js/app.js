goog.provide('ww.app');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('ww.util');
goog.require('ww.raf');

/** @define {boolean} */
var DEBUG_MODE = false;

/**
 * @constructor
 */
ww.app.Core = function() {
  this.window_ = $(window);
  this.width_ = 0;
  this.height_ = 0;

  this.transformKey_ = Modernizr['prefixed']('transform');

  // TODO: Throttle
  var self = this;
  this.window_.resize(function() {
    self.onResize();
  });
  this.onResize();
};

ww.app.Core.prototype.renderFrame_ = function(delta) {
  if (TWEEN['update']()) {
    // ww.raf.unsubscribe('app');
  }
};

/**
 * Handles a browser window resize.
 */
ww.app.Core.prototype.onResize = function() {
  this.width_ = this.window_.width();
  this.height_ = this.window_.height();

  $('iframe').attr('width', this.width_).attr('height', this.height_);
};

ww.app.Core.prototype.start = function() {
  var self = this;

  this.onReady_ = function() {};

  goog.events.listen(window, 'message', function(evt) {
    var data = evt.getBrowserEvent().data;
    self.log('Got message: ' + data['name'], data);

    if (data['name'].match(/.ready/)) {
      self.onReady_(data);
    } else if (data['name'] === 'goToMode') {
      self.loadModeByName(data['data'], true);
    }
  });

  this.loadModeByName('home', false);
};

ww.app.Core.prototype.loadModeByName = function(modeName, transition) {
  this.loadMode({ name: modeName }, transition);
};

ww.app.Core.prototype.log = function(msg) {
  if (DEBUG_MODE && console && console.log) {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'App: ' + args[0];
    }
    console.log.apply(console, args);
  }
};

ww.app.Core.prototype.loadMode = function(mode, transition) {
  var onComplete;

  var currentFrame = this.currentIframe;
  var self = this;

  if (transition) {
    onComplete = function() {
      mode.iframe.contentWindow.postMessage({
        'name': 'focus',
        'data': null
      }, '*');
      
      mode.iframe.style[self.transformKey_] = "translateX(" + self.width_ + "px)";
      mode.iframe.style.visibility = 'visible';

      setTimeout(function() {
        var t2 = new TWEEN["Tween"]({ 'translateX': self.width_ });
        t2['to']({ 'translateX': 0 }, 400);
        t2['onUpdate'](function() {
          mode.iframe.style[self.transformKey_] = "translateX(" + this['translateX'] + "px)";
        });
        t2['onComplete'](function() {
          currentFrame.style.pointerEvents = 'auto';
        });
        t2['start']();

        if (currentFrame) {
          currentFrame.contentWindow.postMessage({
            'name': 'unfocus',
            'data': null
          }, '*');

          currentFrame.style.pointerEvents = 'none';

          var t = new TWEEN["Tween"]({ 'translateX': 0 });
          t['to']({ 'translateX': -self.width_ }, 400);
          t['onUpdate'](function() {
            currentFrame.style[self.transformKey_] = "translateX(" + this['translateX'] + "px)";
          });
          t['onComplete'](function() {
            currentFrame.style.visibility = 'hidden';
          });
          t['start']();
        }

        ww.raf.subscribe('app', self, self.renderFrame_);
      }, 50);
    };
  } else {
    onComplete = function() {
      mode.iframe.contentWindow.postMessage({
        'name': 'focus',
        'data': null
      }, '*');
      mode.iframe.style.visibility = 'visible';
      mode.iframe.style.pointerEvents = 'auto';
    };
  }

  if (mode.iframe) {
    this.currentIframe = mode.iframe;
    if (goog.isFunction(onComplete)) {
      onComplete();
    }
    return;
  }

  this.onReady_ = function(data) {
    if (data['name'] === (mode.name + '.ready')) {
      if (goog.isFunction(onComplete)) {
        onComplete();
      }
    }

    this.onReady_ = function() {};
  };

  var iFrameElem = goog.dom.createElement('iframe');
  iFrameElem.style.visibility = 'hidden';
  iFrameElem.style.pointerEvents = 'none';
  iFrameElem.src = 'modes/' + mode.name + '.html';
  iFrameElem.width = this.width_;
  iFrameElem.height = this.height_;
  goog.dom.appendChild(document.body, iFrameElem);

  this.currentIframe = iFrameElem;
  mode.iframe = iFrameElem;
};

window['jQuery'](function() {
	var app = new ww.app.Core();
	app.start();
});
