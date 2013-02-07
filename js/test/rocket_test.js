function testWwModeRocketModeActivateI() {
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

function testWwModeRocketModeActivateI() {
  var letterI = $('#letter-i');
  var tweens = [];

  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('Number of tweens added should be 0', tweens.length === 0);

  letterI.trigger('mouseup');
  assertTrue('Number of tweens should be greater than 0. Got (' + tweens.length + ')', tweens.length > 0);
}

function testWwModeRocketModeActivateO() {
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

function testWwModeRocketModeActivateO() {
  var letterO = $('#letter-o');
  var tweens = [];

  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('Number of tweens added should be 0', tweens.length === 0);

  letterO.trigger('mouseup');
  assertTrue('Number of tweens should be greater than 0. Got (' + tweens.length + ')', tweens.length > 0);
}