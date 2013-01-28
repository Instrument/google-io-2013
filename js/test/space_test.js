// Test if I becomes clicked and increments its multiplier correctly.
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

// Test if O becomes clicked and increments its multiplier correctly.
function testWwModeSpaceModeActivateO() {
  assertFalse('oClicked_ should be false', mode.oClicked_);
  assertEquals('oMultiplier_ should be 1', 1, mode.oMultiplier_);

  mode.activateO();

  assertTrue('oClicked_  should now be true', mode.oClicked_);
  assertEquals('oMultiplier_ should be 3', 3, mode.oMultiplier_);
}

// Test if O's multiplier caps at 10
function testWwModeSpaceModeActivateO() {
  mode.oMultiplier_ = 10;

  assertEquals('oMultiplier_ should be 10', 10, mode.oMultiplier_);

  mode.activateO();

  assertEquals('oMultiplier_ should still be 10', 10, mode.oMultiplier_);
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
  mode.paperI_ = false;

  mode.drawI_();

  // Make sure I now exists.
  assertNotEquals('paperI_ should now exist', undefined, mode.paperI_);
}

// Test that I gets redrawn if drawI_() is called and paperI_ already exists.
function testWwModeSpaceModeDrawI_() {
  var redrawn = false;

  mode.constructor.prototype.copyXY_ = function() {
    redrawn = true;
  }

  mode.drawI_();

  assertTrue('paperI_ should have been redrawn', redrawn);
}

// Test that O's dimensions and coordinates are set.
function testWwModeSpaceModeDrawO_() {
  assertNotEquals('oRad_ should exist', undefined, mode.oRad_);
  assertNotEquals('oX_ should exist', undefined, mode.oX_);
  assertNotEquals('oY_ should exist', undefined, mode.oY_);
}

// Test that O gets created if it doesn't exist yet
function testWwModeSpaceModeDrawO_() {
  mode.paperO_ = false;
  mode.oGroup_ = false;

  mode.drawO_();

  // Make sure O now exists.
  assertNotEquals('paperO_ should now exist', undefined, mode.paperI_);
  assertNotEquals('oGroup_ should now exist', undefined, mode.oGroup_);
}

// Test that I gets redrawn if drawO_() is called and paperO_ already exists.
function testWwModeSpaceModeDrawO_() {
  var redrawn = false;

  mode.constructor.prototype.copyXY_ = function() {
    redrawn = true;
  }

  mode.drawO_();

  assertTrue('paperO_ should have been redrawn', redrawn);
}

// Test that the slash gets drawn if it doesn't exist yet.
function testWwModeSpaceModeDrawSlash_() {
  mode.paperSlash_ = false;

  mode.drawSlash_();

  assertNotEquals('paperSlash_ should now exist', undefined, mode.paperSlash_);
}

// Test that the slash gets redrawn if paperSlash_ already exists.
function testWwModeSpaceModeDrawSlash_() {
  mode.iX_ = 1;
  mode.iWidth_ = 1;

  // slashEnd_['x'] should equal iX_ + iWidth_ after being redrawn.
  mode.drawSlash_();

  assertEquals('paperSlash_ should have been redrawn', 2, mode.slashEnd_['x']);
}

// Make sure initial variables are created.
function testWwModeSpaceModeInit() {
  assertNotEquals('world_ should exist', undefined, mode.world_);

  assertNotEquals('deltaModifier_ should exist',
    undefined, mode.deltaModifier_);

  assertNotEquals('tempFloat_ should exist', undefined, mode.tempFloat_);

  assertNotEquals('screenCenterX_ should exist', undefined,
    mode.screenCenterX_);

  assertNotEquals('screenCenterY_ should exist', undefined,
    mode.screenCenterY_);

  assertNotEquals('mouseX_ should exist', undefined, mode.mouseX_);
  assertNotEquals('mouseY_ should exist', undefined, mode.mouseY_);

  assertNotEquals('iClicked_ should exist', undefined, mode.iClicked_);
  assertNotEquals('iIncrement_ should exist', undefined, mode.iIncrement_);
  assertNotEquals('iModifier_ should exist', undefined, mode.iModifier_);
  assertNotEquals('iMultiplier_ should exist', undefined, mode.iMultiplier_);

  assertNotEquals('oClicked_ should exist', undefined, mode.oClicked_);
  assertNotEquals('oIncrement_ should exist', undefined, mode.oIncrement_);
  assertNotEquals('oModifier_ should exist', undefined, mode.oModifier_);
  assertNotEquals('oMultiplier_ should exist', undefined, mode.oMultiplier_);
}

// Check to see if drawI() and drawO() get called.
function testWwModeSpaceModeInit() {
  var iCreated = false;
  var oCreated = false;

  mode.paperI_ = false;
  mode.paperO_ = false;

  mode.constructor.prototype.drawI_ = function() {
    iCreated = true;
  }

  mode.constructor.prototype.drawO_ = function() {
    oCreated = true;
  }

  mode.init();

  assertFalse('I should not be detected as created yet', iCreated);
  assertFalse('I should not be detected as created yet', oCreated);

  mode.paperI_ = true;
  mode.paperO_ = true;

  mode.init();

  assertTrue('I should now be detected as created', iCreated);
  assertTrue('O should now be detected as created', oCreated);
}

// Make sure initial variables are created.
function testWwModeSpaceModeDidFocus() {
  mode.unfocus_();
  mode.focus_();


}

// Don't update canvas and particle properties if they don't already exist. 
function testWwModeSpaceModeOnResize() {
  mode.tempFloat_ = 0;
  mode.canvas_ = false;
  mode.world_ = false;

  mode.onResize();

  var tempWidth = mode.canvas_.width;

  assertEquals('canvas_.width should not get set', undefined,
    tempWidth);

  assertEquals('tempFloat_ should not have changed', 0, mode.tempFloat_);
}

// Update canvas and particle properties if they exist. 
function testWwModeSpaceModeOnResize() {
  mode.canvas_.width = 0;
  mode.width_ = 0;
  mode.tempFloat_ = 0;

  mode.onResize();

  assertNotEquals('canvas_.width should have changed', 0,
    mode.canvas_.width);

  assertNotEquals('tempFloat_ should have changed', 0, mode.tempFloat_);
}

// Make sure the I, O, Slash and redraw functions are called.
function testWwModeSpaceModeOnResize() {
  var callO = false;
  var callI = false;
  var callSlash = false;
  var callRedraw = false;

  mode.constructor.prototype.drawO_ = function() {
    callO = true;
  }

  mode.constructor.prototype.drawI_ = function() {
    callI = true;
  }

  mode.constructor.prototype.drawSlash_ = function() {
    callSlash = true;
  }

  mode.constructor.prototype.redraw = function() {
    callRedraw = true;
  }

  mode.onResize();

  assertTrue('drawO_ should have been called', callO);
  assertTrue('drawI_ should have been called', callI);
  assertTrue('drawSlash_ should have been called', callSlash);
  assertTrue('redraw should have been called', callRedraw);
}

// Test to make sure nested arrays are created if they don't exist
function testWwModeSpaceModeCopyXY_() {
  var paper = [
    {
      'segments': [
        {
          'point': {
            'x': 0,
            'y': 0
          }
        }
      ]
    }
  ];

  var xArray = [];
  var yArray = [];
  // console.log(paper[0]['segments'][0]['point']['x']);


  mode.copyXY_(paper, xArray, yArray, true);

  assertNotEquals('Check if a nested x array was created', undefined,
    xArray[0][0]);

  assertNotEquals('Check if a nested y array was created', undefined,
    yArray[0][0]);
}