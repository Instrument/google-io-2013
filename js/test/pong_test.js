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