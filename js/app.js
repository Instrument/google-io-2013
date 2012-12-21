goog.provide('ww.app');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events');

/**
 * @constructor
 */
ww.app.Core = function() {
  this.modes_ = [];

  this.width_ = window.innerWidth;
  this.height_ = window.innerHeight;
};

ww.app.Core.prototype.registerMode = function(name, uid) {
  this.modes_.push({
    name: name,
    code: uid
  });
};

ww.app.Core.prototype.start = function() {
  this.loadMode(this.modes_[0]);
};

ww.app.Core.prototype.loadModeByName = function(modeName) {
  var mode = goog.array.find(this.modes_, function(mode) {
    return mode.name === modeName;
  });

  this.loadMode(mode);
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
  
  var iFrameElem = goog.dom.createElement('iframe');

  var listenKey = goog.events.listen(window, 'message', function(evt) {
    var data = evt.getBrowserEvent().data;
    if (data === (mode.name + '.ready')) {
      goog.events.unlistenByKey(listenKey);
      iFrameElem.style.opacity = 1;

      if (goog.isFunction(onComplete)) {
        onComplete();
      }
    }
  });

  iFrameElem.style.opacity = 0;
  iFrameElem.src = 'modes/' + mode.name + '.html';
  iFrameElem.width = this.width_;
  iFrameElem.height = this.height_;
  goog.dom.appendChild(document.body, iFrameElem);

  this.currentIframe = iFrameElem;
  mode.iframe = iFrameElem;
};

// iframe.contentWindow.postMessage('sup', '*');

var app = new ww.app.Core();
app.registerMode('cat', 83);
app.registerMode('dog', 84);
app.start();

window['catMe'] = function catMe() {
  app.loadModeByName('cat');
};

window['dogMe'] = function dogMe() {
  app.loadModeByName('dog');
};