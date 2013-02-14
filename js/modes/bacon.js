goog.require('ww.mode.Core');
goog.provide('ww.mode.BaconMode');


/**
 * @constructor
 * @param {Element} containerElem The containing element.
 * @param {String} assetPrefix The containing element.
 */
ww.mode.BaconMode = function(containerElem, assetPrefix) {
  this.preloadSound('bacon-sizzle.m4a');
  this.preloadSound('egg-cracked.m4a');
  this.preloadSound('cracked-open.m4a');
  this.preloadSound('eggs-sizzling.m4a');

  goog.base(this, containerElem, assetPrefix, 'bacon', true, true, false);
};
goog.inherits(ww.mode.BaconMode, ww.mode.Core);


/**
 * Initailize BaconMode.
 */
ww.mode.BaconMode.prototype.init = function() {
  goog.base(this, 'init');
  this.stripes_ = $('[id*=fat-]');

  this.stillHasShell = true;
  this.eggWhole_ = $('#egg-whole')[0];
  this.cracks_ = $('[id*=crack-]');
  this.currentCrack_ = 0;
  this.totalCracks_ = this.cracks_.length;

  this.yolk_ = $('#egg-yolk');
  this.whites_ = $('#egg-whites');
  this.eggOpened_ = $('#egg-cracked');
  this.center_ = this.eggOpened_.attr('cx') + ', ' + this.eggOpened_.attr('cy');
};


/**
 * Plays a sound and stretches the letter i when activated.
 */
ww.mode.BaconMode.prototype.activateI = function() {
  goog.base(this, 'activateI');

  var self = this;

  this.playSound('bacon-sizzle.m4a');

  var stretchOut = new TWEEN.Tween({ 'scaleX': 1, 'scaleY': 1 });
  stretchOut.to({ 'scaleX': 1.75, 'scaleY': 1.2 }, 400);
  stretchOut.easing(TWEEN.Easing.Elastic.In);
  stretchOut.onUpdate(function() {
    self.stripes_.css(self.prefix_, 'scale(' + this['scaleX'] + ', 1)');
    self.transformElem_(self.$letterI_[0], 'scale(1, ' + this['scaleY'] + ')');
  });

  var stretchBack = new TWEEN.Tween({ 'scaleX': 1.75, 'scaleY': 1.2 });
  stretchBack.to({ 'scaleX': 1, 'scaleY': 1 }, 600);
  stretchBack.easing(TWEEN.Easing.Elastic.Out);
  stretchBack.delay(400);
  stretchBack.onUpdate(function() {
    self.stripes_.css(self.prefix_, 'scale(' + this['scaleX'] + ', 1)');
    self.transformElem_(self.$letterI_[0], 'scale(1, ' + this['scaleY'] + ')');
  });

  this.addTween(stretchOut);
  this.addTween(stretchBack);
};


/**
 * Plays a sound and stretches the letter o when activated.
 */
ww.mode.BaconMode.prototype.activateO = function() {
  goog.base(this, 'activateO');

  if (this.currentCrack_ < this.totalCracks_) {
    this.cracks_[this.currentCrack_].style['opacity'] = 1;
    this.currentCrack_++;
    this.playSound('egg-cracked.m4a');
  } else {
    if (this.stillHasShell) {
      this.playSound('cracked-open.m4a');
      this.showCracked_();
    } else {
      this.playSound('eggs-sizzling.m4a');
      this.animateSpinEgg_();
    }
  }
};


/**
 * @private
 */
ww.mode.BaconMode.prototype.showCracked_ = function() {
  var self = this;

  var squishShell = new TWEEN.Tween({
    'opacity': 1,
    'scale': 1
  });

  squishShell.to({
    'opacity': 0,
    'scale': 0.25
  }, 200);

  squishShell.onUpdate(function() {
    self.eggWhole_.style['opacity'] = this['opacity'];
    self.transformElem_(self.eggWhole_, 'scale(' + this['scale'] + ')');
  });

  var showWhites = new TWEEN.Tween({ 'scale': 2 });
  showWhites.to({ 'scale': 1 }, 200);

  showWhites.onStart(function() {
    self.eggOpened_.css('opacity', 1);
  });

  showWhites.onUpdate(function() {
    self.transformElem_(self.eggOpened_[0], 'scale(' + this['scale'] + ')');
  });

  showWhites.onComplete(function() {
    self.stillHasShell = false;
    self.animateSpinEgg_();
    self.transformElem_(self.eggOpened_[0], '');
  });

  this.eggOpened_.css('opacity', 0);
  this.addTween(squishShell);
  this.addTween(showWhites);
};


/**
 * @private
 */
ww.mode.BaconMode.prototype.animateSpinEgg_ = function() {
  var self = this;

  var shift = -1 * ~~(Math.random() * (270 - 20) + 20);
  var pos = [~~Random(-75, 75), ~~Random(-75, 75)];

  var degs = self.eggOpened_.attr('transform') || '';
      degs = parseInt(degs.split('rotate(')[1], 10) || 0;

  var posX = self.yolk_[0].style[self.prefix_].split('translateX(')[1];
      posX = parseInt(posX, 10) || 0;

  var posY = self.yolk_[0].style[self.prefix_].split('translateY(')[1];
      posY = parseInt(posY, 10) || 0;

  var sizeX = self.whites_[0].style[self.prefix_].split('skewX(')[1];
      sizeX = ~~parseFloat(sizeX) || 0;

  var sizeY = self.whites_[0].style[self.prefix_].split('skewY(')[1];
      sizeY = ~~parseFloat(sizeY) || 0;

  var sizing = [~~Random(-20, 20), ~~Random(-20, 20)];

  var spinEgg = new TWEEN.Tween({
    'translateX': posX,
    'translateY': posY,
    'skewX': sizeX,
    'skewY': sizeY,
    'rotate': degs
  });

  spinEgg.to({
    'translateX': pos[0],
    'translateY': pos[1],
    'skewX': sizing[0],
    'skewY': sizing[1],
    'rotate': (degs + shift / 2) / window.devicePixelRatio
  }, 500);

  spinEgg.easing(TWEEN.Easing.Elastic.In);

  spinEgg.onUpdate(function() {
    var whites = 'skewX(' + this['skewX'] + 'deg) ' +
                 'skewY(' + this['skewY'] + 'deg)';
    self.transformElem_(self.whites_[0], whites);
    self.eggOpened_.attr('transform', 'rotate(' + this['rotate'] + ', ' +
                          self.center_ + ')');
  });

  self.addTween(spinEgg);
};


