// test if activateI gets called from triggering i
function testWwModeCatModeActivateI() {
  var letterI = $('#letter-i');

  var activatedI = 0;
  mode.constructor.prototype.activateI = function() {
    activatedI++;
  };

  assertEquals('activateI should not have been called yet', activatedI, 0);

  letterI.trigger('mouseup');
  assertEquals('activateI should been called once', activatedI, 1);

  letterI.trigger('mouseup');
  assertEquals('activateI should been called twice', activatedI, 2);
}

// test if playSound gets called within activateI
function testWwModeCatModeActivateI() {
  var letterI = $('#letter-i');

  var playedAudio = 0;
  var fileName = '';

  mode.constructor.prototype.playSound = function(audioFile) {
    fileName = audioFile;
    playedAudio++;
  };

  assertEquals('playSound should not have been called yet', playedAudio, 0);
  assertEquals('fileName should be empty', fileName, '');

  letterI.trigger('mouseup');
  assertEquals('playSound should have been called once from activateI', playedAudio, 1);
  assertTrue('fileName should not be empty', fileName !== '');

  letterI.trigger('mouseup');
  assertEquals('playSound should have been called twice from activateI', playedAudio, 2);
  assertTrue('fileName should not be empty', fileName !== '');
}

// test that two tween animations get added within activateI
function testWwModeCatModeActivateI() {
  var letterI = $('#letter-i');
  var tweens = [];

  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('Number of tweens added should be 0', tweens.length === 0);

  letterI.trigger('mouseup');
  assertTrue('Number of tweens should be 2', tweens.length === 2);
}

// test if activateO gets called from triggering o
function testWwModeCatModeActivateO() {
  var letterO = $('#letter-o');

  var activatedO = 0;
  mode.constructor.prototype.activateO = function() {
    activatedO++;
  };

  assertEquals('activateO should not have been called yet', activatedO, 0);

  letterO.trigger('mouseup');
  assertEquals('activateO should been called once', activatedO, 1);

  letterO.trigger('mouseup');
  assertEquals('activateO should been called twice', activatedO, 2);
}

// test if playSound gets called within activateO
function testWwModeCatModeActivateO() {
  var letterO = $('#letter-o');

  var playedAudio = 0;
  var fileName = '';

  mode.constructor.prototype.playSound = function(audioFile) {
    fileName = audioFile;
    playedAudio++;
  };

  assertEquals('playSound should not have been called yet', playedAudio, 0);
  assertEquals('fileName should be empty', fileName, '');

  letterO.trigger('mouseup');
  assertEquals('playSound should have been called once from activateO', playedAudio, 1);
  assertTrue('fileName should not be empty', fileName !== '');

  letterO.trigger('mouseup');
  assertEquals('playSound should have been called twice from activateO', playedAudio, 2);
  assertTrue('fileName should not be empty', fileName !== '');
}

// test that two tween animations get added within activateO
function testWwModeCatModeActivateO() {
  var letterO = $('#letter-o');
  var tweens = [];

  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('Number of tweens added should be 0', tweens.length === 0);

  letterO.trigger('mouseup');
  assertTrue('Number of tweens should be 2', tweens.length === 2);
}