function testWwModeBaconModeActivateI() {
  var activatedI = 0;
  mode.constructor.prototype.activateI = function() {
    activatedI++;
  };

  assertEquals('activateI should not have been called yet', activatedI, 0);

  mode.$letterI_.trigger('mouseup');
  assertEquals('activateI should been called once', activatedI, 1);

  mode.$letterI_.trigger('mouseup');
  assertEquals('activateI should been called twice', activatedI, 2);
}

function testWwModeBaconModeActivateI() {
  var playedAudio = 0;
  var fileName = '';
  mode.constructor.prototype.playSound = function(audioFile) {
    fileName = audioFile;
    playedAudio++;
  };

  assertEquals('playSound should not have been called yet', playedAudio, 0);
  assertEquals('fileName should be empty', fileName, '');

  mode.$letterI_.trigger('mouseup');
  assertEquals('playSound should have been called once from activateI', playedAudio, 1);
  assertTrue('fileName should not be empty', fileName !== '');

  mode.$letterI_.trigger('mouseup');
  assertEquals('playSound should have been called twice from activateI', playedAudio, 2);
  assertTrue('fileName should not be empty', fileName !== '');
}

function testWwModeBaconModeActivateI() {
  var tweens = [];
  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('Number of tweens added should be 0', tweens.length === 0);

  mode.$letterI_.trigger('mouseup');
  assertTrue('Number of tweens should be 2. Got (' + tweens.length + ')', tweens.length === 2);
}

function testWwModeBaconModeActivateO() {
  var playedAudio = 0;
  var fileName = '';
  mode.constructor.prototype.playSound = function(audioFile) {
    fileName = audioFile;
    playedAudio++;
  };

  assertEquals('playSound should not have been called yet', playedAudio, 0);
  assertEquals('fileName should be empty', fileName, '');

  mode.$letterO_.trigger('mouseup');
  assertEquals('playSound should have been called once from activateO', playedAudio, 1);
  assertTrue('fileName should not be empty', fileName !== '');

  mode.$letterO_.trigger('mouseup');
  assertEquals('playSound should have been called twice from activateO', playedAudio, 2);
  assertTrue('fileName should not be empty', fileName !== '');
}

function testWwModeBaconModeActivateO() {
  mode.currentCrack = 0;
  mode.totalCracks = 10;

  var playedAudio = showCracked = spinEgg = 0;

  mode.constructor.prototype.playSound = function(audioFile) {
    playedAudio++;
  };

  mode.constructor.prototype.showCracked_ = function() {
    showCracked++;
    mode.stillHasShell = false;
  };

  mode.constructor.prototype.animateSpinEgg_ = function() {
    spinEgg++;
  };

  mode.$letterO_.trigger('mouseup');
  assertEquals('Played audio once if current crack is less than total', 1, playedAudio);
  assertEquals('Current crack count should be increased by 1', 1, mode.currentCrack);

  // force into else state
  mode.currentCrack = 10;
  mode.stillHasShell = true;

  mode.$letterO_.trigger('mouseup');
  assertEquals('Played audio should be increased after trigger', 2, playedAudio);
  assertEquals('Show cracked egg animation should have been called once', 1, showCracked); 

  mode.$letterO_.trigger('mouseup');
  assertEquals('Played audio should be increased after trigger', 3, playedAudio);
  assertEquals('Show cracked egg animation should be once still', 1, showCracked); 
  assertEquals('Animate spinning egg should have been called once', 1, spinEgg);
}

function testWwModeBaconModeShowCracked_() {
  var tweens = [];
  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('Number of tweens added should be 0', tweens.length === 0);

  mode.showCracked_();
  assertNotEquals('Number of tweens should not be 0', 0, tweens.length);
}

function testWwModeBaconModeAnimateSpinEgg_() {
  var tweens = [];
  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('Number of tweens added should be 0', tweens.length === 0);

  mode.animateSpinEgg_();
  assertNotEquals('Number of tweens should not be 0', 0, tweens.length);
}

function testWwModeBaconModeActivateO() {
  var activatedO = 0;
  mode.constructor.prototype.activateO = function() {
    activatedO++;
  };

  assertEquals('activateO should not have been called yet', activatedO, 0);

  mode.$letterO_.trigger('mouseup');
  assertEquals('activateO should been called once', activatedO, 1);

  mode.$letterO_.trigger('mouseup');
  assertEquals('activateO should been called twice', activatedO, 2);
}