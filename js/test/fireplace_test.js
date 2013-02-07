function testWwModeFireplaceModeDidFocus() {
  mode.unfocus_();
  var playedSound = 0;

  mode.constructor.prototype.playSound = function(fileName) {
    playedSound++;
  };

  assertEquals('Number of times sound played should be 0 initially', 0, playedSound);

  mode.focus_();

  assertTrue('Number of times sound played shoulbe be greater than 0 after did focus', playedSound > 0);
}