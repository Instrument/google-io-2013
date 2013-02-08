function testWwModePongModeInit() {
  mode['topWallOpacity_'] = 1;

  mode.init();

  assertEquals('game values should be reset', 0, mode['topWallOpacity_']);
}