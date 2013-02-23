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

function testWwModeMetaBallModeMetaball_() {
  var ballCenter = new paper['Point'](mode.screenCenterX_, mode.screenCenterY_);
  mode.oPaths_.push(new paper['Path']['Circle'](ballCenter, 100));

  var path = mode.metaball_(mode.oPaths_[0], mode.oPaths_[1], .45, 2.4, 500);

  assertNotEquals('path should have been created', undefined, path);
}

function testWwModeMetaBallModeDrawSlash_() {
  assertNotEquals('slashStartX_ should exist', undefined, mode.slashStartX_);
  assertNotEquals('slashStartY_ should exist', undefined, mode.slashStartY_);
  assertNotEquals('slashEndX_ should exist', undefined, mode.slashEndX_);
  assertNotEquals('slashEndY_ should exist', undefined, mode.slashEndY_);
}

function testWwModeMetaBallModeDrawConnections_() {
  mode.oPaths_.push(new paper['Path']['Circle'](mode.oCenter_, 100));

  mode.drawConnections_(mode.oPaths_);

  assertNotEquals('connections_ should contain a paper path', undefined,
    mode.connections_['parent']);
}

function testWwModeMetaBallModeInit() {
  assertNotEquals('sources_ should exist', undefined, mode.sources_);
  assertNotEquals('gainNodes_ should exist', undefined, mode.gainNodes_);
  assertNotEquals('paperCanvas_ should exist', undefined, mode.paperCanvas_);
  assertNotEquals('world_ should exist', undefined, mode.world_);

  assertNotEquals('ballCount_ should exist', undefined, mode.ballCount_);

  assertNotEquals('oRad_ should exist', undefined, mode.oRad_);
  assertNotEquals('oPaths_ should exist', undefined, mode.oPaths_);
  assertNotEquals('oX_ should exist', undefined, mode.oX_);
  assertNotEquals('oY_ should exist', undefined, mode.oY_);
  assertNotEquals('oCenter_ should exist', undefined, mode.oCenter_);

  assertNotEquals('colors_ should exist', undefined, mode.colors_);

  assertNotEquals('screenCenterX_ should exist',
    undefined, mode.screenCenterY_);

  assertNotEquals('screenCenterY_ should exist',
    undefined, mode.screenCenterY_);

  assertNotEquals('mouseX_ should exist', undefined, mode.mouseX_);
  assertNotEquals('mouseY_ should exist', undefined, mode.mouseY_);

  mode.init();

  assertEquals('there should only be two paper objects now', 2,
    paper['projects'][0]['layers'][0]['children'].length);

  assertEquals('oPaths_ should only have one path assigned now', 1,
    mode.oPaths_.length);
}

function testWwModeMetaBallModeDidFocus() {
  assertNotEquals('canvas_ should exist', undefined, mode.canvas_);
  assertNotEquals('ctx_ should exist', undefined, mode.ctx_);

  assertNotEquals('pctx_ should exist', undefined, mode.pctx_);

  assertNotEquals('gcanvas_ should exist', undefined, mode.gcanvas_);
  assertNotEquals('gctx_ should exist', undefined, mode.gctx_);
}

function testWwModeMetaBallModeOnResize() {
  mode.init();

  mode.canvas_.width = 1;
  mode.canvas_.height = 1;

  mode.paperCanvas_.width = 1;
  mode.paperCanvas_.height = 1;

  mode.gcanvas_.width = 1;
  mode.gcanvas_.height = 1;

  mode.oPaths_[0]['bounds']['height'] = 10;
  var oHeight = mode.oPaths_[0]['bounds']['height'];

  mode.oPaths_.push(new paper['Path']['Circle'](mode.oCenter_, 100));
  var oHeight2 = mode.oPaths_[1]['bounds']['height'];

  mode.onResize(true);

  assertEquals('canvas_.width should equal width_', mode.width_,
    mode.canvas_.width);
  assertEquals('canvas_.height should equal height_', mode.height_,
    mode.canvas_.height);

  assertEquals('paperCanvas_.width should equal width_', mode.width_,
    mode.paperCanvas_.width);
  assertEquals('paperCanvas_.height should equal height_', mode.height_,
    mode.paperCanvas_.height);

  assertEquals('gcanvas_.width should equal width_', mode.width_,
    mode.gcanvas_.width);
  assertEquals('gcanvas_.height should equal height_', mode.height_,
    mode.gcanvas_.height);

  assertNotEquals('the scale for oPaths_ objects should have changed', oHeight,
    mode.oPaths_[0]['bounds']['height']);

  assertNotEquals('the scale for oPaths_ objects should have changed', oHeight2,
    mode.oPaths_[1]['bounds']['height']);
}

// Check if balls have hit the bounds of the window.
function testWwModeMetaBallModeStepPhysics() {
  mode.init();

  mode.world_.particles.push(new Particle());
  mode.world_.particles[1]['color'] = 'rgba(0, 0, 0, ';

  // Check right side and bottom window boundaries.

  var limitX = mode.width_ - (mode.world_.particles[1].radius + 1);
  var limitY = mode.height_ - (mode.world_.particles[1].radius + 1);

  mode.world_.particles[1].vel.x = 10;
  mode.world_.particles[1].vel.y = 10;

  mode.world_.particles[1].pos.x = mode.width_ * 2;
  mode.world_.particles[1].pos.y = mode.height_ * 2;

  mode.stepPhysics();

  assertEquals('the particle x position should have been moved to limitX',
    limitX, mode.world_.particles[1].pos.x);
  assertEquals('the particle x velocity should have been reversed',
    -10, mode.world_.particles[1].vel.x);

  assertEquals('the particle Y position should have been moved to limitY',
    limitY, mode.world_.particles[1].pos.y);
  assertEquals('the particle y velocity should have been reversed',
    -10, mode.world_.particles[1].vel.y);


  // Check left side and top window boundaries.

  limitX = mode.world_.particles[1].radius + 1;
  limitY = mode.world_.particles[1].radius + 1;

  mode.world_.particles[1].pos.x = -100;
  mode.world_.particles[1].pos.y = -100;

  mode.stepPhysics();

  assertEquals('the particle x position should have been moved to limitX',
    limitX, mode.world_.particles[1].pos.x);
  assertEquals('the particle x velocity should have been reversed again',
    10, mode.world_.particles[1].vel.x);

  assertEquals('the particle Y position should have been moved to limitY',
    limitY, mode.world_.particles[1].pos.y);
  assertEquals('the particle y velocity should have been reversed again',
    10, mode.world_.particles[1].vel.y);
}

// Check if balls stick to the mouse position.
function testWwModeMetaBallModeStepPhysics() {
  mode.init();

  mode.world_.particles.push(new Particle());
  mode.world_.particles[1]['color'] = 'rgba(0, 0, 0, ';

  mode.world_.particles[1]['fixed'] = true;

  mode.mouseX_ = 10;
  mode.mouseY_ = 10;

  mode.stepPhysics();

  assertEquals('the particle x position should match mouseX_',
    mode.mouseX_, mode.world_.particles[1].pos.x);

  assertEquals('the particle Y position should have been moved to mouseY_',
    mode.mouseY_, mode.world_.particles[1].pos.y);
}

// Check if sounds and draw positions are updating correctly.
function testWwModeMetaBallModeStepPhysics() {
  mode.init();

  mode.world_.particles.push(new Particle());
  mode.world_.particles[1]['color'] = 'rgba(0, 0, 0, ';

  mode.oPaths_.push(new paper['Path']['Circle'](mode.oCenter_, 100));

  var distX = mode.world_.particles[0].pos.x - mode.world_.particles[1].pos.x;
  var distY = mode.world_.particles[0].pos.y - mode.world_.particles[1].pos.y;

  mode.oPaths_[1]['position']['x'] = 1000;

  mode.stepPhysics();

  assertEquals('notes_[1] frequency should match the distX', distX,
    mode.notes_[1]['frequency']);

  assertEquals('notes_[1] detune should match distY', distY,
    mode.notes_[1]['detune']);

  assertEquals('the paper path should match the physics particle position',
    mode.world_.particles[1].pos.x, mode.oPaths_[1]['position']['x']);
}