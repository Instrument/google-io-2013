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

/*function testWwModeHomeModeActivateI() {
  mode.patternMatcher_.reset();

  mode.init();

  var tempX = mode.paperI_['vectors'][0]['velocity'];

  mode.activateI();

  assertNotEquals('paperI_ vectors should have changed', tempX, mode.paperI_['vectors'][0]['velocity']);

  assertEquals('currentPattern_ should be 1', '1', mode.patternMatcher_.currentPattern_);
}

function testWwModeHomeModeActivateO() {
  mode.patternMatcher_.reset();

  mode.init();

  var tempX = mode.paperO_['vectors'][0]['velocity'];

  mode.activateO();

  assertNotEquals('paperO_ vectors should have changed', tempX, mode.paperO_['vectors'][0]['velocity']);

  assertEquals('currentPattern_ should be 0', '0', mode.patternMatcher_.currentPattern_);
}*/