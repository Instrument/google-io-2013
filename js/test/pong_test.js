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
  mode.gamesPlayed_ = 1;
  mode.setScore_(10);

  mode.startRound_();

  assertEquals('gamesPlayed_ should increment by 1', 2,
    mode.gamesPlayed_);

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
    mode.ballSpeed_);

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

// Test hitting walls.
function testWwModePongModeReflectBall_() {
  var gameEnded = false;
  var tweens = [];

  mode.constructor.prototype.gameOver_ = function() {
    gameEnded = true;
  };

  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  mode.resetGame_();
  mode.startRound_();

  mode.ball_.pos.x = 0;

  mode.reflectBall_();

  assertTrue('game should have ended', gameEnded);

  mode.resetGame_();
  mode.startRound_();

  mode.ball_.vel.x = 1;
  mode.ball_.pos.x = mode.width_ * 2;

  mode.reflectBall_();

  assertEquals('ball x velocity should be reversed', -1, mode.ball_.vel.x);
  assertEquals('tweens should have incrememted by 1', 1, tweens.length);

  tweens = [];
  mode.resetGame_();
  mode.startRound_();

  mode.ball_.vel.y = 1;
  mode.ball_.pos.y = mode.height_ * 2;

  mode.reflectBall_();

  assertEquals('ball y velocity should be reversed', -1, mode.ball_.vel.y);
  assertEquals('tweens should have incrememted by 1', 1, tweens.length);

  tweens = [];
  mode.resetGame_();
  mode.startRound_();

  mode.ball_.vel.y = -1;
  mode.ball_.pos.y = -mode.height_;

  mode.reflectBall_();

  assertEquals('ball y velocity should be reversed', 1, mode.ball_.vel.y);
  assertEquals('tweens should have incrememted by 1', 1, tweens.length);
}

// Test hitting the paddle.
function testWwModePongModeReflectBall_() {
  var paddleHit = false;

  mode.constructor.prototype.hitPaddle_ = function(tween) {
    paddleHit = true;
  };

  mode.resetGame_();
  mode.startRound_();

  mode.paddleX_ = 10;
  mode.paddleY_ = 30;
  mode.paddleWidth = 10;
  mode.paddleHeight = 20;

  mode.ball_.radius = 10;

  mode.ball_.vel.x = -1;
  mode.ball_.pos.x = 30;
  mode.ball_.pos.y = 30;

  mode.reflectBall_();

  assertTrue('paddle should have been hit', paddleHit);
}