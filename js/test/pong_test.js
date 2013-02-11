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

function testWwModePongModeInit() {
  mode['topWallOpacity_'] = 1;

  mode.init();

  assertEquals('game values should be reset', 0, mode['topWallOpacity_']);
}

function testWwModePongModeStartRound_() {
  mode.roundNumber_ = 5;
  mode.gamesPlayed_ = 1;
  mode.setScore_(10);

  mode.startRound_();

  assertEquals('roundNumber_ should be set to 2', 2, mode.roundNumber_);

  assertEquals('gamesPlayed_ should increment by 1', 2,
    mode.roundNumber_);

  assertEquals('score_ should be set to 0', 0, mode.score_);
}

function testWwModePongModeResetGame_() {
  mode['topWallOpacity_'] = 1;
  mode['rightWallOpacity_'] = 1;
  mode['bottomWallOpacity_'] = 1;

  mode.ball_.radius = 1000;
  mode.ball_.pos.x = -1000;
  mode.ball_.pos.y = -1000;
  mode.ball_.vel.x = 1000;
  mode.ball_.vel.y = 1000;

  mode.resetGame_();

  assertEquals('topWallOpacity_ should be reset', 0, mode['topWallOpacity_']);

  assertEquals('rightWallOpacity_ should be reset', 0,
    mode['rightWallOpacity_']);

  assertEquals('bottomWallOpacity_ should be reset', 0,
    mode['bottomWallOpacity_']);

  assertEquals('ball radius should be reset', mode.ballRadius_,
    mode.ball_.radius)

  assertEquals('ball position x should be reset', mode.ball_.pos.x,
    mode.startXBall_);

  assertEquals('ball position y should be reset', mode.ball_.pos.y,
    mode.ballRadius_);

  assertEquals('ball velocity x should be reset', mode.ball_.vel.x,
    -mode.ballSpeed_);

  assertEquals('ball velocity y should be reset', mode.ball_.vel.y,
    mode.ballSpeed_);
}

function testWwModePongModeOnResize() {
  mode.canvas_.width_ = 20;

  mode.onResize();

  assertNotEquals('screenCenterX_ should have changed on resize', 20,
    mode.canvas_.width);
}

function testWwModePongModeHitWall_() {
  var tweens = [];

  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  mode.hitWall_();

  assertEquals('tweens should now have a single tween added', 1, tweens.length);
}

function testWwModePongModeHitPaddle_() {
  var tweens = [];
  mode.score_ = 1;

  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  mode.hitPaddle_();

  assertEquals('tweens should now have one tween added', 1, tweens.length);
  assertEquals('score should now be 2', 2, mode.score_);

  tweens = [];
  mode['topWallOpacity_'] = 1;
  mode['rightWallOpacity_'] = 1;
  mode['bottomWallOpacity_'] = 1;

  mode.hitPaddle_();

  assertEquals('tweens should now have three tweens added', 3, tweens.length);
  assertEquals('score should now be 13', 13, mode.score_);
}

function testWwModePongModeGameOver_() {
  mode.gameOver_();

  assertNotEquals('the reload modal should have been created', undefined,
    $('.reload'));
}

function testWwModePongModeSetScore_() {
  mode.setScore_(10);

  assertEquals('the score should be set to 10', 10, mode.score_);
}

/*function testWwModePongModeReflectBall_() {
  mode.resetGame_();
  mode.startRound_();

  mode.ball_.pos.x = 0;
}*/