function testWwModeCatModeActivateI() {
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

function testWwModeCatModeActivateI() {
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

function testWwModeCatModeActivateI() {
  var tweens = [];
  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('Number of tweens added should be 0', tweens.length === 0);

  mode.$letterI_.trigger('mouseup');
  assertTrue('Number of tweens should be greater than 0. Got (' + tweens.length + ')', tweens.length > 0);
}

function testWwModeCatModeActivateO() {
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

function testWwModeCatModeActivateO() {
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

function testWwModeCatModeActivateO() {
  var tweens = [];
  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('Number of tweens added should be 0', tweens.length === 0);

  mode.$letterO_.trigger('mouseup');
  assertTrue('Number of tweens should be greater than 0. Got (' + tweens.length + ')', tweens.length > 0);
}