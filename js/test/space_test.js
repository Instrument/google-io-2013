// Test if I becomes clicked and increments its multiplier correctly.
function testWwModeSpaceModeActivateI() {
	clicked = false;
  multiplier = 0;

  assertFalse('clicked should be false', clicked);
  assertEquals('multiplier should be 0', 0, multiplier);

  mode.constructor.prototype.activateI = function() {
    clicked = true;
    multiplier += 2;
  }

  mode.activateI();

  assertTrue('this.iClicked should now be true', clicked);
  assertEquals('multiplier should be 2', 2, multiplier);
}