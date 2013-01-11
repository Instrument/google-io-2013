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