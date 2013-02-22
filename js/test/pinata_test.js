function testWwModePinataModeEjectParticle_() {
  var prevParticleCount = mode.physicsWorld_.particles.length;

  mode.ejectParticle_(20, 20, -1); // dummy x, y, and direction values
  assertNotEquals('After ejecting a particle, there should be more particles then previously found.',
                  prevParticleCount, mode.physicsWorld_.particles.length);
}


function testWwModePinataModeStepPhysics() {
  // add dummy particles
  mode.ejectParticle_(20, 20, 1);
  mode.ejectParticle_(25, 20, -1);
  mode.ejectParticle_(25, 25, 1);
  mode.ejectParticle_(20, 25, -1);
  mode.ejectParticle_(10, 10, 1);
  mode.ejectParticle_(10000, 10000, -1); // ensure dummy is out of bounds

  var particleCount = mode.physicsWorld_.particles.length;

  mode.stepPhysics();
  assertTrue('Particle count should be less after removal/particle out of bounds',
              mode.physicsWorld_.particles.length < particleCount);
}


function testWwModePinataModeActivateBalls_() {
  var ejectedCount = 0;

  mode.constructor.prototype.ejectParticle_ = function() {
    ejectedCount++;
  };

  mode.activateBalls_();

  assertTrue('One particle or more should have been ejected/activated', ejectedCount > 0);
}


function testWwModePinataModeOnResize() {
  var canvas = document.createElement('canvas');
      canvas.width = 10;
      canvas.height = 10;
  var ctx = canvas.getContext('2d');

  mode.wantsRetina_ = false;
  mode.canvas_ = canvas;

  mode.onResize(false);

  assertTrue('After resize, canvas width should have changed', mode.canvas_.width != 10);
  assertTrue('After resize, canvas height should have changed', mode.canvas_.height != 10);

  var redraw = 0;
  mode.constructor.prototype.redraw = function() {
    redraw++;
  };

  mode.onResize(true);
  assertTrue('Redraw should have been called', redraw > 0);

  var prevWidth = mode.canvas_.width;
  var prevHeight = mode.canvas_.height;
  mode.wantsRetina_ = true;
  mode.onResize();
  assertNotEquals('After wants retina for canvas and resize, canvas width should have changed', mode.canvas_.width, prevWidth);
  assertNotEquals('After wants retina for canvas and resize, canvas height should have changed', mode.canvas_.height, prevHeight);
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

  mode.$letterI_.trigger('mouseup');
  assertEquals('animated should been called once', 1, animated);
  assertEquals('playedSound should been called once', 1, playedSound);
  assertEquals('activated should been called once', 1, activated);

  mode.$letterI_.trigger('mouseup');
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

  mode.$letterO_.trigger('mouseup');
  assertEquals('activateO should been called once', 1, activateO);
  assertEquals('animated should been called once', 1, animated);
  assertEquals('playedSound should been called once', 1, playedSound);

  mode.$letterO_.trigger('mouseup');
  assertEquals('activateO should been called twice', 2, activateO);
  assertEquals('animated should been called twice', 2, animated);
  assertEquals('playedSound should been called twice', 2, playedSound);
}

function testWwModePinataModeActivateO() {
  mode.whackCount_ = 0;

  var playedSound = 0;
  mode.constructor.prototype.playSound = function(audioFile) {
    playedSound++;
  };

  assertEquals('playedSound should not have been called yet', 0, playedSound);

  mode.$letterO_.trigger('mouseup');
  assertEquals('playedSound should been called once', 1, playedSound);

  mode.$letterO_.trigger('mouseup');
  assertEquals('playedSound should been called twice', 2, playedSound);
}

function testWwModePinataModeAnimatePartsIn_() {
  var tweens = [];
  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('Number of tweens added should be 0', tweens.length === 0);

  mode.animatePartsIn_();
  assertTrue('Number of tweens should be greater than 0. Got (' + tweens.length + ')', tweens.length > 0);
}

function testWwModePinataModeAnimatePartsOut_() {
  var tweens = [];
  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('Number of tweens added should be 0', tweens.length === 0);

  mode.animatePartsOut_();
  assertTrue('Number of tweens should be greater than 0. Got (' + tweens.length + ')', tweens.length > 0);
}
