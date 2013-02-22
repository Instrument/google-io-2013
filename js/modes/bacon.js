goog.require('ww.mode.Core');
goog.provide('ww.mode.BaconMode');


/**
 * @constructor
 * @param {Element} containerElem The containing element.
 * @param {String} assetPrefix The containing element.
 */
ww.mode.BaconMode = function(containerElem, assetPrefix) {
  this.preloadSound('bacon-sizzle.mp3');
  this.preloadSound('egg-cracked.mp3');
  this.preloadSound('cracked-open.mp3');
  this.preloadSound('eggs-sizzling.mp3');

  goog.base(this, containerElem, assetPrefix, 'bacon', true, true, false);
};
goog.inherits(ww.mode.BaconMode, ww.mode.Core);


/**
 * Initailize BaconMode.
 */
ww.mode.BaconMode.prototype.init = function() {
  goog.base(this, 'init');

  this.stillHasShell = true;
  this.eggWhole_ = $('#egg-whole').css('opacity', 1)[0];
  this.cracks_ = $('[id*=crack-]').css('opacity', 0);
  this.currentCrack_ = 0;
  this.totalCracks_ = this.cracks_.length;

  this.whites_ = $('#egg-whites');
  this.eggOpened_ = $('#egg-cracked').css('opacity', 0);
  this.center_ = this.eggOpened_.attr('cx') + ', ' + this.eggOpened_.attr('cy');
};


/**
 * Plays a sound and stretches the letter i when activated.
 */
ww.mode.BaconMode.prototype.activateI = function() {
  goog.base(this, 'activateI');

  var self = this;

  this.playSound('bacon-sizzle.mp3');

  var stretchOut = new TWEEN.Tween({ 'scaleY': 1, 'translateY': 0 });
  stretchOut.to({ 'scaleY': 1.25, 'translateY': -20 }, 700);
  stretchOut.easing(TWEEN.Easing.Elastic.In);
  stretchOut.onUpdate(function() {
    self.$letterI_.attr('transform',
      'scale(1, ' + this['scaleY'] + ') ' +
      'translate(0, ' + this['translateY'] + ')');
  });

  var stretchBack = new TWEEN.Tween({ 'scaleY': 1.25, 'translateY': -20 });
  stretchBack.to({ 'scaleY': 1, 'translateY': 0 }, 700);
  stretchBack.easing(TWEEN.Easing.Elastic.Out);
  stretchBack.delay(700);
  stretchBack.onUpdate(function() {
    self.$letterI_.attr('transform',
      'scale(1, ' + this['scaleY'] + ') ' +
      'translate(0, ' + this['translateY'] + ')');
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
    this.playSound('egg-cracked.mp3');
  } else {
    if (this.stillHasShell) {
      this.playSound('cracked-open.mp3');
      this.showCracked_();
    } else {
      this.playSound('eggs-sizzling.mp3');
      this.animateSpinEgg_();
    }
  }
};


/**
 * @private
 */
ww.mode.BaconMode.prototype.showCracked_ = function() {
  var self = this;

  var squishShell = new TWEEN.Tween({ 'opacity': 1 });
  squishShell.to({ 'opacity': 0 }, 200);
  squishShell.onUpdate(function() {
    self.eggWhole_.style['opacity'] = this['opacity'];
  });
  squishShell.onComplete(function() {
    self.eggOpened_.css('opacity', 1);
    self.stillHasShell = false;
    self.animateSpinEgg_();
  });

  this.eggOpened_.css('opacity', 0);
  this.addTween(squishShell);
};


/**
 * @private
 */
ww.mode.BaconMode.prototype.animateSpinEgg_ = function() {
  var self = this;

  var pos = -1 * ~~(Math.random() * (270 - 20) + 20);

  var degs = self.eggOpened_.attr('transform') || '';
      degs = parseInt(degs.split('rotate(')[1], 10) || 0;

  var shift = ~~Random(-20, 20);

  var spinEgg = new TWEEN.Tween({
    'rotate': degs
  });

  spinEgg.to({
    'rotate': (degs + pos / 2) / window.devicePixelRatio
  }, 500);

  spinEgg.easing(TWEEN.Easing.Elastic.In);

  spinEgg.onUpdate(function() {
    self.whites_.attr('transform',
      'rotate(' + (this['rotate'] - shift) + ', ' + self.center_ + ')');
    self.eggOpened_.attr('transform',
      'rotate(' + this['rotate'] + ', ' + self.center_ + ')');
  });

  self.addTween(spinEgg);
};


