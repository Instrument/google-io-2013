function testWwModeBurgerModeActivateI() {
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


// check if makes it to showing/playing a bite.
// after a bite, check if a reset animation happens.
function testWwModeBurgerModeActivateI() {
  mode.unfocus_();
  mode.focus_();

  var letterI = $('#letter-i');
  var tweens = [];
  var playSound = 0;

  mode.biteIIndex_ = 0;
  mode.maxBitesI_ = 1;

  mode.constructor.prototype.playSound = function(fileName) {
    playSound++;
  };

  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('No sound should have been played yet', playSound === 0);
  assertTrue('Number of tweens added should be 0', tweens.length === 0);

  letterI.trigger('mouseup');
  // play sound, show a bite
  assertTrue('Number of sounds played should be greater than 0', playSound > 0);
  
  letterI.trigger('mouseup');
  // reset animation time
  assertTrue('Number of tweens should be greater than 0. Got (' + tweens.length + ')', tweens.length > 0);
}

function testWwModeBurgerModeActivateO() {
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

function testWwModeBurgerModeActivateO() {
  mode.unfocus_();
  mode.focus_();

  var letterO = $('#letter-o');
  var tweens = [];
  var playSound = 0;

  mode.biteOIndex_ = 0;
  mode.maxBitesO_ = 1;

  mode.constructor.prototype.playSound = function(fileName) {
    playSound++;
  };

  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('No sound should have been played yet', playSound === 0);
  assertTrue('Number of tweens added should be 0', tweens.length === 0);

  letterO.trigger('mouseup');
  // play sound, show a bite
  assertTrue('Number of sounds played should be greater than 0', playSound > 0);
  
  letterO.trigger('mouseup');
  // reset animation time
  assertTrue('Number of tweens should be greater than 0. Got (' + tweens.length + ')', tweens.length > 0);
}