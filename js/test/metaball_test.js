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

// Test that I's dimensions and coordinates are set.
function testWwModeMetaBallModeDrawI_() {
  assertNotEquals('iWidth_ should exist', undefined, mode.iWidth_);
  assertNotEquals('iHeight_ should exist', undefined, mode.iHeight_);
  assertNotEquals('iX_ should exist', undefined, mode.iX_);
  assertNotEquals('iY_ should exist', undefined, mode.iY_);
}

function testWwModeMetaBallModeDrawGradients_() {
  mode.world_.particles[0].radius = 1;

  mode.drawGradients_(mode.world_.particles[0]);

  assertEquals('target radius should equal oRad_',
    mode.world_.particles[0].radius, mode.oRad_);

  mode.world_.particles.push(new Particle());

  mode.world_.particles[1]['color'] = 'rgba(0, 0, 0, ';

  mode.drawGradients_(mode.world_.particles[1]);

  assertEquals('target radius should equal oRad_ / 2',
    mode.world_.particles[1].radius, mode.oRad_ / 2);
}

function testWwModeMetaBallModeGetVector_() {
  var radians = 1;
  var length = 1;

  var point = new paper['Point']({
    'angle': radians * 180 / Math.PI,
    'length': length
  });

  var result = mode.getVector_(radians, length);

  assertEquals('result should equal point', point['x'], result['x']);
}

function testWwModeMetaBallModeDrawSlash_() {
  assertNotEquals('slashStartX_ should exist', undefined, mode.slashStartX_);
  assertNotEquals('slashStartY_ should exist', undefined, mode.slashStartY_);
  assertNotEquals('slashEndX_ should exist', undefined, mode.slashEndX_);
  assertNotEquals('slashEndY_ should exist', undefined, mode.slashEndY_);
}