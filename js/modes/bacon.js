goog.require('ww.mode.Core');
goog.provide('ww.mode.BaconMode');


/**
 * @constructor
 */
ww.mode.BaconMode = function() {
  goog.base(this, 'bacon', true, true, false);

  this.preloadSound('bacon-sizzle.m4a');
  this.preloadSound('egg-cracked.m4a');
  this.preloadSound('cracked-open.m4a');
  this.preloadSound('eggs-sizzling.m4a');
};
goog.inherits(ww.mode.BaconMode, ww.mode.Core);


/**
 * Initailize BaconMode.
 */
ww.mode.BaconMode.prototype.init = function() {
  goog.base(this, 'init');
  this.stripes = $('[id*=fat-]');

  this.stillHasShell = true;
  this.eggWhole = $('#egg-whole')[0];
  this.cracks = $('[id*=crack-]');
  this.currentCrack = 0;
  this.totalCracks = this.cracks.length;

  this.yolk = $('#egg-yolk');
  this.whites = $('#egg-whites');
  this.eggOpened = $('#egg-cracked')[0];
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
    self.transformElem_(self.$letterI_[0], 'scaleY(' + this['scaleY'] + ')');
    self.transformElem_(self.stripes[0], 'scaleX(' + this['scaleX'] + ')');
    self.transformElem_(self.stripes[1], 'scaleX(' + this['scaleX'] + ')');
    self.transformElem_(self.stripes[2], 'scaleX(' + this['scaleX'] + ')');
  });

  var stretchBack = new TWEEN.Tween({ 'scaleX': 1.75, 'scaleY': 1.2 });
  stretchBack.to({ 'scaleX': 1, 'scaleY': 1 }, 600);
  stretchBack.easing(TWEEN.Easing.Elastic.Out);
  stretchBack.delay(400);
  stretchBack.onUpdate(function() {
    self.transformElem_(self.$letterI_[0], 'scaleY(' + this['scaleY'] + ')');
    self.transformElem_(self.stripes[0], 'scaleX(' + this['scaleX'] + ')');
    self.transformElem_(self.stripes[1], 'scaleX(' + this['scaleX'] + ')');
    self.transformElem_(self.stripes[2], 'scaleX(' + this['scaleX'] + ')');
  });

  this.addTween(stretchOut);
  this.addTween(stretchBack);
};


/**
 * Plays a sound and stretches the letter o when activated.
 */
ww.mode.BaconMode.prototype.activateO = function() {
  goog.base(this, 'activateO');

  if (this.currentCrack < this.totalCracks) {
    this.cracks[this.currentCrack].style['opacity'] = 1;
    this.currentCrack++;
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
    self.eggWhole.style['opacity'] = this['opacity'];
    self.transformElem_(self.eggWhole, 'scale(' + this['scale'] + ')');
  });

  var showWhites = new TWEEN.Tween({ 'scale': 2 });
  showWhites.to({ 'scale': 1 }, 200);

  showWhites.onStart(function() {
    self.eggOpened.style['opacity'] = 1;
  });

  showWhites.onUpdate(function() {
    self.transformElem_(self.eggOpened, 'scale(' + this['scale'] + ')');
  });

  showWhites.onComplete(function() {
    self.stillHasShell = false;
    self.animateSpinEgg_();
  });

  this.eggOpened.style['opacity'] = 0;
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

  var degs = self.whites[0].style[self.prefix_].split('rotate(')[1];
      degs = parseInt(degs) || 0;

  var posX = self.yolk[0].style[self.prefix_].split('translateX(')[1];
      posX = parseInt(posX) || 0;

  var posY = self.yolk[0].style[self.prefix_].split('translateY(')[1];
      posY = parseInt(posY) || 0;

  var sizeX = self.whites[0].style[self.prefix_].split('skewX(')[1];
      sizeX = ~~parseFloat(sizeX) || 0;

  var sizeY = self.whites[0].style[self.prefix_].split('skewY(')[1];
      sizeY = ~~parseFloat(sizeY) || 0;

  var sizing = [~~Random(-10, 10), ~~Random(-10, 10)];

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
    'rotate': (degs + shift / 2)
  }, 500);

  spinEgg.easing(TWEEN.Easing.Elastic.In);

  spinEgg.onUpdate(function() {
    var translate = 'translateX(' + this['translateX'] + 'px) ' +
                    'translateY(' + this['translateY'] + 'px) ' +
                    'rotate(' + (-1 * this['rotate']) + 'deg) ';

    var whites = 'rotate(' + this['rotate'] + 'deg) ' +
                 'skewX(' + this['skewX'] + 'deg) ' +
                 'skewY(' + this['skewY'] + 'deg)';

    self.transformElem_(self.whites[0], whites);
    self.transformElem_(self.yolk[0], translate);
  });

  self.addTween(spinEgg);
};


