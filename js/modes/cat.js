goog.require('ww.mode.Core');
goog.provide('ww.mode.CatMode');


/**
 * @constructor
 */
ww.mode.CatMode = function() {
  goog.base(this, 'cat', true, true);
};
goog.inherits(ww.mode.CatMode, ww.mode.Core);


/**
 * Initailize CateMode. Define tranform prefix.
 * @private
 */
ww.mode.CatMode.prototype.init = function() {
  goog.base(this, 'init');

  this.prefix = Modernizr['prefixed']('transform');
};


/**
 * Plays a sound and stretches the letter i when activated.
 * @private
 */
ww.mode.CatMode.prototype.activateI_ = function() {
  goog.base(this, 'activateI_');

  var self = this;

  self.playSound('cat-1.mp3');

  var stretchOut = new TWEEN['Tween'](
    { 'scaleY': 1 })['to'](
    { 'scaleY': 1.55 }, 200)['easing'](
      TWEEN['Easing']['Bounce']['InOut']
    )['onUpdate'](
      function() {
        self.letterI[0].style[self.prefix] = 'scaleY(' + this['scaleY'] + ')';
      }
  );

  var stretchBack = new TWEEN['Tween'](
    { 'scaleY': 1.55 })['to'](
    { 'scaleY': 1 }, 200)['easing'](
      TWEEN['Easing']['Bounce']['InOut']
    )['delay'](200)['onUpdate'](
      function() {
        self.letterI[0].style[self.prefix] = 'scaleY(' + this['scaleY'] + ')';
      }
  );

  self.addTween(stretchOut);
  self.addTween(stretchBack);
};


/**
 * Plays a sound and stretches the letter o when activated.
 * @private
 */
ww.mode.CatMode.prototype.activateO_ = function() {
  goog.base(this, 'activateO_');
  
  var self = this;

  self.playSound('cat-2.mp3');

  var position = [Random(-200, 200), Random(-50, 50)];

  var moveOut = new TWEEN['Tween'](
    { 'scale': 1, 'x': 0, 'y': 0 })['to'](
    { 'scale': 1.5, 'x': position[0], 'y': position[1] },
      200
    )['easing'](TWEEN['Easing']['Bounce']['InOut'])['onUpdate'](
      function() {
        var translate = 'translate(' + this['x'] + 'px, ' + this['y'] + 'px) ';
            translate += 'scale(' + this['scale'] + ')';
        self.letterO[0].style[self.prefix] = translate;
      }
  );

  var moveBack = new TWEEN['Tween'](
    { 'scale': 1.5, 'x': position[0], 'y': position[1] })['to'](
    { 'scale': 1, 'x': 0, 'y': 0 }, 200)['delay'](
      200
    )['easing'](TWEEN['Easing']['Bounce']['InOut'])['onUpdate'](
      function() {
        var translate = 'translate(' + this['x'] + 'px, ' + this['y'] + 'px) ';
            translate += 'scale(' + this['scale'] + ')';
        self.letterO[0].style[self.prefix] = translate;
      }
  );

  self.addTween(moveOut);
  self.addTween(moveBack);
};
