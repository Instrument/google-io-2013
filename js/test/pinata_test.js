function testWwModePinataModeDidFocus() {
  mode.unfocus_();

  var prepopCount = 0;

  mode.constructor.prototype.prepopulate_ = function(number) {
    prepopCount++;
  };

  mode.focus_();

  assertTrue('Some particles should be prepopulated', prepopCount > 0);
}

function testWwModePinataModeOnResize() {
  var canvas = document.createElement('canvas');
      canvas.width = 10;
      canvas.height = 10;
  var ctx = canvas.getContext('2d');

  mode.canvas_ = canvas;
  mode.ratio_ = null;

  mode.onResize();

  assertTrue('After resize, canvas width should have changed', mode.canvas_.width != 10);

  var oldWidth = mode.canvas_.width;

  mode.ratio_ = 2;
  mode.onResize();
  
  assertNotEquals('After resize with a DPI ratio, canvas width should have changed',
                mode.canvas_.width, oldWidth);
}

function testWwModePinataModeAnimateI_() {
  var tweens = [];

  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('Number of tweens added should be 0', tweens.length === 0);

  mode.animateI_();
  assertNotEquals('Number of tweens should not be 0', 0, tweens.length);
}

function testWwModePinataModeActivateI() {
  var letterI = $('#letter-i');

  mode.whackCount_ = 0;
  mode.maxWhacks_ = 10;

  var playedSound = 0;
  mode.constructor.prototype.playSound = function(audioFile) {
    playedSound++;
  };

  var animated = 0;
  mode.constructor.prototype.animateI_ = function() {
    animated++;
  };

  var activated = 0;
  mode.constructor.prototype.activateBalls_ = function() {
    activated++;
  };

  assertEquals('animated should not have been called yet', 0, animated);
  assertEquals('playedSound should not have been called yet', 0, playedSound);
  assertEquals('activated should not have been called yet', 0, activated);

  letterI.trigger('mouseup');
  assertEquals('animated should been called once', 1, animated);
  assertEquals('playedSound should been called once', 1, playedSound);
  assertEquals('activated should been called once', 1, activated);

  letterI.trigger('mouseup');
  assertEquals('animated should been called twice', 2, animated);
  assertEquals('playedSound should been called twice', 2, playedSound);
}

function testWwModePinataModeAnimateO_() {
  var tweens = [];

  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('Number of tweens added should be 0', tweens.length === 0);

  mode.animateO_();
  assertNotEquals('Number of tweens should not be 0', 0, tweens.length);
}

function testWwModePinataModeActivateO() {
  var letterO = $('#letter-o');

  var activateO = 0;
  mode.constructor.prototype.activateO = function() {
    activateO++;
    mode.playSound('filename');
    mode.animateO_();
  };

  var animated = 0;
  mode.constructor.prototype.animateO_ = function() {
    animated++;
  };

  var playedSound = 0;
  mode.constructor.prototype.playSound = function(audioFile) {
    playedSound++;
  };

  assertEquals('activateO should not have been called yet', 0, activateO);
  assertEquals('animated should not have been called yet', 0, animated);
  assertEquals('playedSound should not have been called yet', 0, playedSound);

  letterO.trigger('mouseup');
  assertEquals('activateO should been called once', 1, activateO);
  assertEquals('animated should been called once', 1, animated);
  assertEquals('playedSound should been called once', 1, playedSound);

  letterO.trigger('mouseup');
  assertEquals('activateO should been called twice', 2, activateO);
  assertEquals('animated should been called twice', 2, animated);
  assertEquals('playedSound should been called twice', 2, playedSound);
}

function testWwModePinataModeActivateO() {
  var letterO = $('#letter-o');

  mode.whackCount_ = 0;

  var playedSound = 0;
  mode.constructor.prototype.playSound = function(audioFile) {
    playedSound++;
  };

  assertEquals('playedSound should not have been called yet', 0, playedSound);

  letterO.trigger('mouseup');
  assertEquals('playedSound should been called once', 1, playedSound);

  letterO.trigger('mouseup');
  assertEquals('playedSound should been called twice', 2, playedSound);
}