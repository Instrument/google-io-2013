// Test if I becomes this.iClicked_ and increments its this.iMultiplier_ correctly.
function testWwModeSpaceModeActivateI() {
  mode.init();
  assertFalse('iClicked_ should be false', mode.iClicked_);
  assertEquals('iMultiplier_ should be 1', 1, mode.iMultiplier_);

  mode.activateI();

  assertTrue('iClicked_  should now be true', mode.iClicked_);
  assertEquals('iMultiplier_ should be 3', 3, mode.iMultiplier_);
}

// Test if I's multiplier caps at 10
function testWwModeSpaceModeActivateI() {
  mode.init();

  mode.iMultiplier_ = 10;

  assertEquals('iMultiplier_ should be 10', 10, mode.iMultiplier_);

  mode.activateI();

  assertEquals('iMultiplier_ should still be 10', 10, mode.iMultiplier_);
}

// Test that the I dimensions and coordinates gets established.
function testWwModeSpaceModeDrawI_() {
  mode.drawI_();

  assertNotEquals('iWidth_ should exist', undefined, mode.iWidth_);
  assertNotEquals('iHeight_ should exist', undefined, mode.iHeight_);
  assertNotEquals('iX_ should exist', undefined, mode.iX_);
  assertNotEquals('iY_ should exist', undefined, mode.iY_);

  // The first time I is called, paperI_ shouldn't exist.
  assertEquals('paperI_ should not exist yet', undefined, mode.paperI_);

  // Since paperI_ doesn't exist yet, variables and objects are created for it.
  assertNotEquals('pathX should exist', undefined, pathX);
  assertNotEquals('pathY should exist', undefined, pathY);
  assertNotEquals('pathStart should exist', undefined, pathStart);
  assertNotEquals('pathMidOne should exist', undefined, pathMidOne);
  assertNotEquals('pathMidTwo should exist', undefined, pathMidTwo);
  assertNotEquals('pathEnd should exist', undefined, pathEnd);
  assertNotEquals('pathLength should exist', undefined, pathLength);
  assertNotEquals('iPaths_ should exist', undefined, mode.iPaths_);

  // Make sure paper objects are instantiated.
  assertNotEquals('iTopLeft should exist', undefined, iTopLeft);
  assertNotEquals('iSize should exist', undefined, iSize);
  assertNotEquals('letterI should exist', undefined, letterI);
  assertNotEquals('paperI_ should now exist', undefined, mode.paperI_);
}