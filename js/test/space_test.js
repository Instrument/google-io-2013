// Test if I becomes this.iClicked_ and increments its this.iMultiplier_ correctly.
function testWwModeSpaceModeActivateI() {
  assertFalse('iClicked_ should be false', mode.iClicked_);
  assertEquals('iMultiplier_ should be 1', 1, mode.iMultiplier_);

  mode.activateI();

  assertTrue('iClicked_  should now be true', mode.iClicked_);
  assertEquals('iMultiplier_ should be 3', 3, mode.iMultiplier_);
}

// Test if I's multiplier caps at 10
function testWwModeSpaceModeActivateI() {
  mode.iMultiplier_ = 10;

  assertEquals('iMultiplier_ should be 10', 10, mode.iMultiplier_);

  mode.activateI();

  assertEquals('iMultiplier_ should still be 10', 10, mode.iMultiplier_);
}

// Test that I's dimensions and coordinates are set.
function testWwModeSpaceModeDrawI_() {
  assertNotEquals('iWidth_ should exist', undefined, mode.iWidth_);
  assertNotEquals('iHeight_ should exist', undefined, mode.iHeight_);
  assertNotEquals('iX_ should exist', undefined, mode.iX_);
  assertNotEquals('iY_ should exist', undefined, mode.iY_);
}

// Test that I gets created if it doesn't exist yet
function testWwModeSpaceModeDrawI_() {
  // Start out I as false.
  mode.paperI_ = false;

  mode.drawI_();

  // Make sure I now exists.
  assertNotEquals('paperI_ should now exist', undefined, mode.paperI_);
}