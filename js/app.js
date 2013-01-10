goog.provide('ww.app');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events');

/** @define {boolean} */
var DEBUG_MODE = false;

/**
 * @constructor
 */
ww.app.Core = function() {
  this.width_ = window.innerWidth;
  this.height_ = window.innerHeight;
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
      self.loadModeByName(data['data']);
    }
  });

  this.loadModeByName('home');
};

ww.app.Core.prototype.loadModeByName = function(modeName) {
  this.loadMode({ name: modeName });
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

ww.app.Core.prototype.loadMode = function(mode, onComplete) {
  if (this.currentIframe) {
    this.currentIframe.style.display = 'none';
  }

  if (mode.iframe) {
    this.currentIframe = mode.iframe;
    mode.iframe.style.display = 'block';
    mode.iframe.style.opacity = 1;
    if (goog.isFunction(onComplete)) {
      onComplete();
    }
    return;
  }

  this.onReady_ = function(data) {
    if (data['name'] === (mode.name + '.ready')) {
      iFrameElem.style.opacity = 1;

      iFrameElem.contentWindow.postMessage({
        'name': 'focus',
        'data': null
      }, '*');

      if (goog.isFunction(onComplete)) {
        onComplete();
      }
    }

    this.onReady_ = function() {};
  };

  var iFrameElem = goog.dom.createElement('iframe');
  iFrameElem.style.opacity = 0;
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
