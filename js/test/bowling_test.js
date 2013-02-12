function testWwModeBowlingModeActivateI() {
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

function testWwModeBowlingModeActivateI() {
  var tweens = [];
  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('Number of tweens added should be 0', tweens.length === 0);

  mode.$letterI_.trigger('mouseup');
  assertTrue('Number of tweens should be greater than 0. Got (' + tweens.length + ')', tweens.length > 0);
}

function testWwModeBowlingModeActivateO() {
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

function testWwModeBowlingModeActivateO() {
  var tweens = [];
  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('Number of tweens added should be 0', tweens.length === 0);

  mode.$letterO_.trigger('mouseup');
  assertTrue('Number of tweens should be greater than 0. Got (' + tweens.length + ')', tweens.length > 0);
}