function testWwModeDonutModeActivateI() {
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


// check if makes it to showing/playing a bite.
// after a bite, check if a reset animation happens.
function testWwModeDonutModeActivateI() {
  mode.unfocus_();
  mode.focus_();

  var playSound = 0;
  var tweens = [];

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

  mode.$letterI_.trigger('mouseup');
  // play sound, show a bite
  assertTrue('Number of sounds played should be greater than 0', playSound > 0);
  
  mode.$letterI_.trigger('mouseup');
  // reset animation time
  assertTrue('Number of tweens should be greater than 0. Got (' + tweens.length + ')', tweens.length > 0);
}

function testWwModeDonutModeActivateO() {
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

function testWwModeDonutModeActivateO() {
  mode.unfocus_();
  mode.focus_();

  var playSound = 0;
  var tweens = [];

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

  mode.$letterO_.trigger('mouseup');
  // play sound, show a bite
  assertTrue('Number of sounds played should be greater than 0', playSound > 0);
  
  mode.$letterO_.trigger('mouseup');
  // reset animation time
  assertTrue('Number of tweens should be greater than 0. Got (' + tweens.length + ')', tweens.length > 0);
}