var savedFunctions = {};
function setUp() {
  for (var key in mode.constructor.prototype) {
    if (mode.constructor.prototype.hasOwnProperty(key)) {
      savedFunctions[key] = mode.constructor.prototype[key];
    }
  }
}

function tearDown() {
  for (var key in savedFunctions) {
    if (savedFunctions.hasOwnProperty(key)) {
      mode.constructor.prototype[key] = savedFunctions[key];
    }
  }
}

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
  mode.paperCanvas_.height = 0;
  mode.paperI_ = false;
  mode.paperO_ = false;

  var iCreated = false;
  var oCreated = false;

  mode.constructor.prototype.drawI_ = function() {
    iCreated = true;
  }

  mode.constructor.prototype.drawO_ = function() {
    oCreated = true;
  }

  mode.init();

  assertFalse('I should not be detected as created yet', iCreated);
  assertFalse('I should not be detected as created yet', oCreated);

  mode.paperCanvas_.height = 10;

  mode.init();

  assertTrue('I should now be detected as created', iCreated);
  assertTrue('O should now be detected as created', oCreated);
}

// Don't update canvas and particle properties if they don't already exist. 
function testWwModeSpaceModeOnResize() {
  mode.tempFloat_ = 0;
  mode.canvas_ = false;
  mode.world_ = false;

  mode.onResize(true);

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

  mode.onResize(true);

  assertNotEquals('canvas_.width should have changed', 0,
    mode.canvas_.width);

  assertNotEquals('tempFloat_ should have changed', 0, mode.tempFloat_);
}

// Make sure the I, O, Slash and redraw functions are called.
function testWwModeSpaceModeOnResize() {
  var callO = false;
  var callI = false;
  var callRedraw = false;

  mode.constructor.prototype.drawO_ = function() {
    callO = true;
  }

  mode.constructor.prototype.drawI_ = function() {
    callI = true;
  }

  mode.constructor.prototype.redraw = function() {
    callRedraw = true;
  }

  mode.onResize(true);

  assertTrue('drawO_ should have been called', callO);
  assertTrue('drawI_ should have been called', callI);
  assertTrue('redraw should have been called', callRedraw);
}

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

  mode.copyXY_(paper, xArray, yArray, true);

  assertNotEquals('Check if a nested x array was created', undefined,
    xArray[0][0]);

  assertNotEquals('Check if a nested y array was created', undefined,
    yArray[0][0]);

  xArray[0][0] = 1;
  yArray[0][0] = 1;

  mode.copyXY_(paper, xArray, yArray, false);

  assertEquals('Check if the paper array was assigned the xArray values',
    xArray[0][0], paper[0]['segments'][0]['point']['x']);

  assertEquals('Check if the paper array was assigned the yArray values',
    yArray[0][0], paper[0]['segments'][0]['point']['y']);
}

// Test I's modifiers.
function testWwModeSpaceModeAdjustModifiers_() {
  mode.deltaModifier_ = 1;
  var modifier = 1;
  var incrementer = true;
  var multiplier = 1;
  var clicker = true;

  mode.adjustModifiers_(modifier, incrementer, multiplier, clicker, true);

  assertTrue('iModifier_ should be greater than modifier',
    mode.iModifier_ > modifier);

  assertTrue('iIncrement_ should be true', mode.iIncrement_);

  assertEquals('iMultiplier_ should equal multiplier', multiplier, mode.iMultiplier_);

  assertTrue('iClicked_ should be true', mode.iClicked_);

  modifier = 3;

  mode.adjustModifiers_(modifier, incrementer, multiplier, clicker, true);

  multiplier = 10;
  incrementer = false;

  mode.adjustModifiers_(modifier, incrementer, multiplier, clicker, true);

  assertTrue('iMultiplier_ should be less than multiplier',
    mode.iMultiplier_ < multiplier);

  modifier = 20000;
  incrementer = true;

  mode.adjustModifiers_(modifier, incrementer, multiplier, clicker, true);

  assertEquals('iModifier_ should not have incremented higher', modifier,
    mode.iModifier_);

  multiplier = 1;

  mode.adjustModifiers_(modifier, incrementer, multiplier, clicker, true);

  assertFalse('iIncrement_ should be false', mode.iIncrement_);

  modifier = 1;
  incrementer = false;

  mode.adjustModifiers_(modifier, incrementer, multiplier, clicker, true);

  assertFalse('iClicked_ should be false', mode.iClicked_);
}

// Test O's modifiers.
function testWwModeSpaceModeAdjustModifiers_() {
  mode.deltaModifier_ = 1;
  var modifier = 1;
  var incrementer = true;
  var multiplier = 1;
  var clicker = true;

  mode.adjustModifiers_(modifier, incrementer, multiplier, clicker, false);

  assertTrue('oModifier_ should be greater than modifier',
    mode.oModifier_ > modifier);

  assertTrue('oIncrement_ should be true', mode.oIncrement_);

  assertEquals('oMultiplier_ should equal multiplier', multiplier, mode.oMultiplier_);

  assertTrue('oClicked_ should be true', mode.oClicked_);

  modifier = 3;

  mode.adjustModifiers_(modifier, incrementer, multiplier, clicker, false);

  multiplier = 10;
  incrementer = false;

  mode.adjustModifiers_(modifier, incrementer, multiplier, clicker, false);

  assertTrue('oMultiplier_ should be less than multiplier',
    mode.oMultiplier_ < multiplier);

  modifier = 20000;
  incrementer = true;

  mode.adjustModifiers_(modifier, incrementer, multiplier, clicker, false);

  assertEquals('oModifier_ should not have incremented higher', modifier,
    mode.oModifier_);

  multiplier = 1;

  mode.adjustModifiers_(modifier, incrementer, multiplier, clicker, false);

  assertFalse('oIncrement_ should be false', mode.oIncrement_);

  modifier = 1;
  incrementer = false;

  mode.adjustModifiers_(modifier, incrementer, multiplier, clicker, false);

  assertFalse('oClicked_ should be false', mode.oClicked_);
}

function testWwModeSpaceModeModCoords_() {
  var source = 10;
  var mod1 = 2;
  var mod2 = 1;
  var mod3 = 3;
  var mod4 = 4;

  var result = mode.modCoords_(source, true, mod1, mod2, mod3, mod4);

  assertNotEquals('Result should be different than source', result, source);

  result = mode.modCoords_(source, false, mod1, mod2, mod3, mod4);
    
  assertNotEquals('Result should be different than source', result, source);
}

function testWwModeSpaceModeOnFrame() {
  mode.width_ = 500;
  mode.height_ = 500;
  mode.updateBounds();
  mode.setPaperShapeData();
  mode.drawI_();
  mode.drawO_();

  mode.iClicked_ = true;
  mode.oClicked_ = true;

  mode.onFrame();

  assertNotEquals('iPaths_ should have changed', mode.iPathsX_[0][0],
    mode.iPaths_[0]['segments'][0]['point']['x']);

  assertNotEquals('oPaths_ should have changed', mode.oPathsX_[0][0],
    mode.oPaths_[0]['segments'][0]['point']['x']);

  mode.iClicked_ = false;
  mode.oClicked_ = false;

  mode.onFrame();

  assertEquals('iPaths_ should be restored to its initial value',
    mode.iPathsX_[0][0], mode.iPaths_[0]['segments'][0]['point']['x']);

  assertEquals('oPaths_ should be restored to its initial value',
    mode.oPathsX_[0][0], mode.oPaths_[0]['segments'][0]['point']['x']);
}