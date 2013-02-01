function testIdle() {
  assertTrue('Should start out idle', mode.isIdle_);

  mode.leaveIdle_();
  assertFalse('Should move out of idle', mode.isIdle_);

  mode.enterIdle_();
  assertTrue('Should return to idle', mode.isIdle_);

  mode.resetIdle_();
  assertFalse('Should move out of idle', mode.isIdle_);
}

function testFullPattern() {
  mode.patternMatcher_.reset();

  var matchedModeName = false;

  mode.constructor.prototype.goToMode_ = function(key) {
    matchedModeName = key;
  };

  mode.addPatternCharacter('00000001');

  assertEquals('Should request song mode', 'song', matchedModeName);
  assertTrue('Added success class', mode.$pattern_.hasClass('success'));
}

function testPartialPattern() {
  mode.patternMatcher_.reset();

  var matchedModeName = false;

  mode.constructor.prototype.goToMode_ = function(key) {
    matchedModeName = key;
  };

  mode.addPatternCharacter('0000000');

  assertEquals('Should not request any mode', false, matchedModeName);
  assertFalse('No success class', mode.$pattern_.hasClass('success'));
  assertFalse('No failure class', mode.$pattern_.hasClass('failure'));
}

function testBadPattern() {
  mode.patternMatcher_.reset();
  
  var matchedModeName = false;

  mode.constructor.prototype.goToMode_ = function(key) {
    matchedModeName = key;
  };

  mode.addPatternCharacter('10000000');

  assertEquals('Should not request any mode', false, matchedModeName);
  assertTrue('Added success class', mode.$pattern_.hasClass('failure'));
}

function testWwModeHomeModeActivateI() {
  mode.patternMatcher_.reset();

  mode.onResize();

  var tempX = mode.paperI_['vectors'][0]['velocity'];

  mode.activateI();

  assertNotEquals('paperI_ vectors should have changed', tempX,
    mode.paperI_['vectors'][0]['velocity']);

  assertEquals('currentPattern_ should be 1', '1',
    mode.patternMatcher_.currentPattern_);
}

function testWwModeHomeModeActivateO() {
  mode.patternMatcher_.reset();

  mode.onResize();

  var tempX = mode.paperO_['vectors'][0]['velocity'];

  mode.activateO();

  assertNotEquals('paperO_ vectors should have changed', tempX,
    mode.paperO_['vectors'][0]['velocity']);

  assertEquals('currentPattern_ should be 0', '0',
    mode.patternMatcher_.currentPattern_);
}

function testWwModeHomeModeDrawI_() {
  mode.paperI_ = undefined;

  mode.onResize();

  assertNotEquals('paperI_ should have been created', undefined, mode.paperI_);

  var tempPosition = mode.paperI_['position']['x'];
  var tempSize = mode.paperI_['bounds']['width'];

  mode.iWidth_ = 20;

  mode.drawI_();

  assertNotEquals('paperI_ should have changed position', tempPosition,
    mode.paperI_['position']['x']);

  assertNotEquals('paperI_ should have changed scale', tempSize,
    mode.paperI_['bounds']['width']);
}

function testWwModeHomeModeDrawO_() {
  mode.paperO_ = undefined;

  mode.onResize();

  assertNotEquals('paperO_ should have been created', undefined, mode.paperO_);

  var tempPosition = mode.paperO_['position']['x'];
  var tempSize = mode.paperO_['bounds']['width'];

  mode.oX_ = 20;
  mode.oRad_ = 20;

  mode.drawO_();

  assertNotEquals('paperO_ should have changed position', tempPosition,
    mode.paperO_['position']['x']);

  assertNotEquals('paperO_ should have changed scale', tempSize,
    mode.paperO_['bounds']['width']);
}

function testWwModeHomeModeDrawSlash_() {
  mode.paperSlash_ = undefined;

  mode.onResize();

  assertNotEquals('paperSlash_ should have been created', undefined,
    mode.paperSlash_);

  var tempPosition = mode.paperSlash_['segments'][0]['point']['x'];

  mode.oRad_ = 20;

  mode.drawSlash_();

  assertNotEquals('paperSlash_ should have changed position and scale',
    tempPosition, mode.paperSlash_['segments'][0]['point']['x']);
}

function testWwModeHomeModeInit() {
  mode.activateO();

  mode.oX_ = 10;

  mode.init();

  assertEquals('the pattern should be reset', '',
    mode.patternMatcher_.currentPattern_);

  assertEquals('lastClick_ should equal oX_', mode.oX_, mode.lastClick_['x']);
}

function testWwModeHomeModeOnResize() {
  mode.screenCenterX_ = 20;

  mode.onResize();

  assertNotEquals('screenCenterX_ should have changed on resize', 20,
    mode.screenCenterX_);
}

function testWwModeHomeModePushPoints_() {
  mode.init();
  mode.onResize();

  mode.paperI_['vectors'][0]['velocity'] = 0;

  mode.pushPoints_(mode.paperI_, mode.lastClick_, 10);

  assertNotEquals('paperI_ should now have velocity', 0,
    mode.paperI_['vectors'][0]['velocity']);

  mode.paperO_['vectors'][0]['velocity'] = 0;

  mode.pushPoints_(mode.paperO_, mode.lastClick_, 10);

  assertNotEquals('paperO_ should now have velocity', 0,
    mode.paperO_['vectors'][0]['velocity']);
}

function testWwModeHomeModeUpdateVectors_() {
  mode.init();
  mode.onResize();

  mode.paperI_['vectors'][0]['length'] = 0;

  mode.updateVectors_(mode.paperI_);

  assertNotEquals('paperI_ should now have a new length', 0,
    mode.paperI_['vectors'][0]['velocity']);

  mode.paperO_['vectors'][0]['length'] = 0;

  mode.updateVectors_(mode.paperO_);

  assertNotEquals('paperO_ should now have a new length', 0,
    mode.paperO_['vectors'][0]['length']);
}

function testWwModeHomeModeUpdatePoints_() {
  mode.init();
  mode.onResize();

  mode.paperI_['vectors'][0]['length'] = 0;

  mode.updateVectors_(mode.paperI_);
  mode.updatePoints_(mode.paperI_);

  var tempPoint = mode.paperI_['vectors'][0]['add'](mode.iCenter_);

  assertEquals('paperI_ should match its static coordinates', tempPoint['x'],
    mode.paperI_['segments'][0]['point']['x']);

  mode.paperO_['vectors'][0]['length'] = 0;

  mode.updateVectors_(mode.paperO_);
  mode.updatePoints_(mode.paperO_);

  tempPoint = mode.paperO_['vectors'][0]['add'](mode.oCenter_);

  assertEquals('paperO_ should match its static coordinates', tempPoint['x'],
    mode.paperO_['segments'][0]['point']['x']);
}

function testWwModeHomeModeOnFrame() {
  mode.isIdle_ = false;

  mode.timeElapsed_ = 10;
  mode.wentIdleTime_ = 2;
  mode.maxIdleTime_ = 5;

  var tempX1 = mode.paperI_['segments'][0]['point']['x'];
  var tempX2 = mode.paperO_['segments'][0]['point']['x'];

  mode.onFrame();

  assertTrue('isIdle_ should now be true', mode.isIdle_);

  assertNotEquals('paperI_ points should have updated', tempX1,
    mode.paperI_['segments'][0]['point']['x']);

  assertNotEquals('paperO_ points should have updated', tempX2,
    mode.paperO_['segments'][0]['point']['x']);
}