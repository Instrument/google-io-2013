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

function testWwModeAsciiModeActivateI() {
  mode.onResize(true);

  var tempX = mode.paperI_['vectors'][0]['velocity'];

  mode.activateI();

  assertNotEquals('paperI_ vectors should have changed', tempX,
    mode.paperI_['vectors'][0]['velocity']);
}

function testWwModeAsciiModeActivateO() {
  mode.onResize(true);

  var tempX = mode.paperO_['vectors'][0]['velocity'];

  mode.activateO();

  assertNotEquals('paperO_ vectors should have changed', tempX,
    mode.paperO_['vectors'][0]['velocity']);
}

function testWwModeAsciiModeDrawI_() {
  mode.paperI_ = undefined;

  mode.onResize(true);

  assertNotEquals('paperI_ should have been created', undefined, mode.paperI_);

  var tempPosition = mode.paperI_['position']['x'];
  var tempSize = mode.paperI_['bounds']['width'];

  mode.iWidth = 20;
  mode.iCenter['x'] = 20;

  mode.drawI_();

  assertNotEquals('paperI_ should have changed position', tempPosition,
    mode.paperI_['position']['x']);

  assertNotEquals('paperI_ should have changed scale', tempSize,
    mode.paperI_['bounds']['width']);
}

function testWwModeAsciiModeDrawO_() {
  mode.paperO_ = undefined;

  mode.onResize(true);

  assertNotEquals('paperO_ should have been created', undefined, mode.paperO_);

  var tempPosition = mode.paperO_['position']['x'];
  var tempSize = mode.paperO_['bounds']['width'];

  mode.oCenter['x'] = 20;
  mode.oRad = 20;

  mode.drawO_();

  assertNotEquals('paperO_ should have changed position', tempPosition,
    mode.paperO_['position']['x']);

  assertNotEquals('paperO_ should have changed scale', tempSize,
    mode.paperO_['bounds']['width']);
}

function testWwModeAsciiModeDrawSlash_() {
  mode.paperSlash_ = undefined;

  mode.onResize(true);

  assertNotEquals('paperSlash_ should have been created', undefined,
    mode.paperSlash_);

  var tempPosition = mode.paperSlash_['segments'][0]['point']['x'];

  mode.slashStartX = 20;

  mode.drawSlash_();

  assertNotEquals('paperSlash_ should have changed position and scale',
    tempPosition, mode.paperSlash_['segments'][0]['point']['x']);
}

function testWwModeAsciiModeInit() {
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

function testWwModeAsciiModeOnResize() {
  var dataIsSet = false;

  mode.constructor.prototype.setPaperShapeData = function() {
    dataIsSet = true;
  };

  mode.onResize(true);

  assertTrue('paper data should be set', dataIsSet);
}

function testWwModeAsciiModePushPoints_() {
  mode.init();
  mode.onResize(true);

  mode.paperI_['vectors'][0]['velocity'] = 0;

  mode.pushPoints_(mode.paperI_, mode.lastClick_, 10);

  assertNotEquals('paperI_ should now have velocity', 0,
    mode.paperI_['vectors'][0]['velocity']);

  mode.paperO_['vectors'][0]['velocity'] = 0;

  mode.pushPoints_(mode.paperO_, mode.lastClick_, 10);

  assertNotEquals('paperO_ should now have velocity', 0,
    mode.paperO_['vectors'][0]['velocity']);
}

function testWwModeAsciiModeUpdateVectors_() {
  mode.init();
  mode.onResize(true);

  mode.paperI_['vectors'][0]['velocity'] = 10;

  mode.updateVectors_(mode.paperI_);

  assertNotEquals('paperI_ should now have a new length', 0,
    mode.paperI_['vectors'][0]['length']);

  mode.paperO_['vectors'][0]['velocity'] = 10;

  mode.updateVectors_(mode.paperO_);

  assertNotEquals('paperO_ should now have a new length', 0,
    mode.paperO_['vectors'][0]['length']);
}

function testWwModeAsciiModeUpdatePoints_() {
  mode.init();
  mode.onResize(true);

  mode.paperI_['vectors'][0]['length'] = 0;

  mode.updateVectors_(mode.paperI_);
  mode.updatePoints_(mode.paperI_);

  var tempPoint = mode.paperI_['vectors'][0]['add'](mode.iCenter);

  assertEquals('paperI_ should match its static coordinates', tempPoint['x'],
    mode.paperI_['segments'][0]['point']['x']);

  mode.paperO_['vectors'][0]['length'] = 0;

  mode.updateVectors_(mode.paperO_);
  mode.updatePoints_(mode.paperO_);

  tempPoint = mode.paperO_['vectors'][0]['add'](mode.oCenter);

  assertEquals('paperO_ should match its static coordinates', tempPoint['x'],
    mode.paperO_['segments'][0]['point']['x']);
}

function testWwModeAsciiModeStepPhysics() {
  mode.oRad = 10;
  var tempX1 = mode.paperI_['segments'][0]['point']['x'];
  var tempX2 = mode.paperO_['segments'][0]['point']['x'];

  mode.paperI_['vectors'][0]['velocity'] = 10;
  mode.paperO_['vectors'][0]['velocity'] = 10;

  mode.stepPhysics();

  assertNotEquals('paperI_ points should have updated', tempX1,
    mode.paperI_['segments'][0]['point']['x']);

  assertNotEquals('paperO_ points should have updated', tempX2,
    mode.paperO_['segments'][0]['point']['x']);
}

function testWwModeAsciiModeOnFrame() {
  var redrawPixel = false;

  mode.constructor.prototype.asciifyCanvas_ = function() {
    redrawPixel = true;
  };

  mode.onFrame();

  assertTrue('redrawPixel should now be true', redrawPixel);
}

function testWwModeAsciiModeAsciifyCanvas_() {
  mode.paperCanvas_.height = 10;

  var asciiString = mode.asciifyCanvas_(mode.paperCanvas_);

  assertNotEquals('asciiString should have data', undefined, asciiString);
}