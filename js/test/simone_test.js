function testWwModeSimoneModeStartCheck_() {
  mode.isPlaying = false;
  mode.isAnimating = false;

  var segment = $('#red');
  var tweens = [];

  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('Tweens should be empty before trigger.', tweens.length === 0);

  segment.trigger('mousedown');
  assertTrue('No tweens should have been added if not playing and not animating', tweens.length === 0);
}

function testWwModeSimoneModeStartCheck_() {
  mode.isPlaying = true;
  mode.isAnimating = false;

  var segment = $('#red');
  var tweens = [];

  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('Tweens should be empty before trigger.', tweens.length === 0);

  segment.trigger('mousedown');
  assertTrue('One tween should have been added if playing and not animating', tweens.length === 1);
}

function testWwModeSimoneModeDidFocus() {
  mode['unfocus']();
  mode['focus']();

  var beginCount = 0;
  var startSequenceCount = 0;
  var checkSequenceCount = 0;

  var playAgain = $('#play-again');

  var topLeft = $('#red');        // 0 in sequence
  var topRight = $('#green');     // 1 in sequence

  var bottomLeft = $('#blue');    // 2 in sequence
  var bottomRight = $('#yellow'); // 3 in sequence

  mode.constructor.prototype.beginGame_ = function() {
    beginCount++;
  };

  mode.constructor.prototype.startCheck_ = function(noteNum) {
    startSequenceCount++;
  };

  mode.constructor.prototype.checkSequence_ = function(guess) {
    checkSequenceCount++;
  };

  assertEquals('beginCount should be 0', beginCount, 0);
  assertEquals('startSequenceCount should be 0', startSequenceCount, 0);
  assertEquals('checkSequenceCount should be 0', checkSequenceCount, 0);

  playAgain.trigger('mouseup');
  assertEquals('beginCount should now be 1', beginCount, 1);
  assertEquals('startSequenceCount should be 0', startSequenceCount, 0);
  assertEquals('checkSequenceCount should be 0', checkSequenceCount, 0);

  topLeft.trigger('mousedown');
  assertEquals('startSequenceCount should now be 1', startSequenceCount, 1);
  assertEquals('checkSequenceCount should be 0', checkSequenceCount, 0);

  topLeft.trigger('mouseup');
  assertEquals('startSequenceCount should still be 1', startSequenceCount, 1);
  assertEquals('checkSequenceCount should now be 1', checkSequenceCount, 1);
}

function testWwModeSimoneModeDidFocus() {
  mode['unfocus']();
  mode['focus']();

  var bindCount = 0;
  var elements = [$('#play-again'), $('#red'), $('#green'), $('#blue'), $('#yellow')];

  var elem, bindData;
  for (var i = 0, l = elements.length; i < l; i++) {
    var bindDataCount = 0;
    elem = elements[i];
    bindData = elem.data();

    for (bind in bindData) {
      bindDataCount++;
    }

    assertTrue('Bind count for element should be greater than 0.', bindDataCount > 0);
  }
}

function testWwModeSimoneModeDidUnfocus() {
  mode['focus']();
  mode['unfocus']();

  var bindCount = 0;
  var elements = [$('#play-again'), $('#red'), $('#green'), $('#blue'), $('#yellow')];
  
  var elem, bindData;
  for (var i = 0, l = elements.length; i < l; i++) {
    var bindDataCount = 0;
    elem = elements[i];
    bindData = elem.data();

    for (bind in bindData) {
      bindDataCount++;
    }

    assertTrue('There should be no bind data left.', bindDataCount === 0);
  }
}

function testWwModeSimoneModeGenerateSequence_() {
  var startSize = mode.sequence.length,
      endSize = startSize;

  mode.generateSequence_();
  endSize = mode.sequence.length;

  assertTrue('Sequence size be larger than starting size.', endSize > startSize);
}

function testWwModeSimoneModeShuffleSequence_() {
  var before = mode.sequence.toString(),
      after = before;

  mode.shuffleSequence_();

  after = mode.sequence.toString();

  assertFalse('Sequence should be equal to the original after shuffle.', before === after);
}

function testWwModeSimoneModeCheckSequence_() {

}

function testWwModeSimoneModeBeginGame_() {

}

function testWwModeSimoneModeDisplayNext_() {

}
