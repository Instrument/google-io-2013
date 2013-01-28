function testWwModeSongModeDidFocus() {
  mode.unfocus_();
  mode.focus_();

  var beginCount = 0;
  var swapModeCount = 0;
  var startDrumCount = 0;
  var endDrumCount = 0;

  mode.constructor.prototype.beginSound_ = function(id, bool) {
    beginCount++;
  };

  mode.constructor.prototype.swapSongMode_ = function(id) {
    swapModeCount++;
  };

  mode.constructor.prototype.startDrumChange_ = function() {
    startDrumCount++;
  };

  mode.constructor.prototype.changeDrums_ = function() {
    endDrumCount++;
  };

  assertEquals('beginCount should be 0', 0, beginCount);
  assertEquals('swapModeCount should be 0', 0, swapModeCount);
  assertEquals('startDrumCount should be 0', 0, startDrumCount);
  assertEquals('endDrumCount should be 0', 0, endDrumCount);

  $(mode.instruments[0]).trigger('mousedown');
  assertEquals('triggered beginSound_: beginCount should now be 1', 1, beginCount);
  assertEquals('triggered beginSound_: swapModeCount should be 0', 0, swapModeCount);
  assertEquals('triggered beginSound_: startDrumCount should be 0', 0, startDrumCount);
  assertEquals('triggered beginSound_: endDrumCount should be 0', 0, endDrumCount);

  $(mode.songs[0]).trigger('mouseup');
  assertEquals('triggered swapSongMode_: beginCount should be 1', 1, beginCount);
  assertEquals('triggered swapSongMode_: swapModeCount should now be 1', 1, swapModeCount);
  assertEquals('triggered swapSongMode_: startDrumCount should be 0', 0, startDrumCount);
  assertEquals('triggered swapSongMode_: endDrumCount should be 0', 0, endDrumCount);

  mode.drumEl.trigger('mousedown');
  assertEquals('triggered startDrumChange_: beginCount should be 1', 1, beginCount);
  assertEquals('triggered startDrumChange_: swapModeCount should be 1', 1, swapModeCount);
  assertEquals('triggered startDrumChange_: startDrumCount should now be 1', 1, startDrumCount);
  assertEquals('triggered startDrumChange_: endDrumCount should be 0', 0, endDrumCount);

  mode.drumEl.trigger('mouseup');
  assertEquals('triggered changeDrums_: beginCount should be 1', 1, beginCount);
  assertEquals('triggered changeDrums_: swapModeCount should be 1', 1, swapModeCount);
  assertEquals('triggered changeDrums_: startDrumCount should be 1', 1, startDrumCount);
  assertEquals('triggered changeDrums_: endDrumCount should now be 1', 1, endDrumCount);
}

function testWwModeSongModeDidFocus() {
  mode.unfocus_();
  mode.focus_();

  var bindCount = 0;
  var elements = [];

  for (var i = 0; i < mode.instruments.length; i++) {
    var instrument = mode.instruments[i];
    elements.push($(instrument));
  }

  for (var i = 0; i < mode.songs.length; i++) {
    var songStyle = mode.songs[i];
    elements.push($(songStyle));
  }

  elements.push(mode.drumEl);

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

function testWwModeSongModeDidUnFocus() {
  mode.focus_();
  mode.unfocus_();

  var bindCount = 0;
  var elements = [];

  for (var i = 0; i < mode.instruments.length; i++) {
    var instrument = mode.instruments[i];
    elements.push($(instrument));
  }

  for (var i = 0; i < mode.songs.length; i++) {
    var songStyle = mode.songs[i];
    elements.push($(songStyle));
  }

  elements.push(mode.drumEl);

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

// check drum element gets active when it hasn't been activated yet.
function testWwModeSongModeStartDrumChange_() {
  assertTrue('Drum starting index should be negative', mode.drumIndex < 0);

  // trigger first drum start
  mode.startDrumChange_();

  assertEquals('Drum index should be 0', 0, mode.drumIndex);
  assertTrue('Drum element should be active', mode.drumEl.hasClass('active'));
}

// check drum element increases and tabbing happens when appropriate.
function testWwModeSongModeStartDrumChange_() {
  assertTrue('Drum starting index should be negative', mode.drumIndex < 0);

  // trigger first drum start
  mode.startDrumChange_();

  assertEquals('Drum index should be 0', 0, mode.drumIndex);
  assertTrue('Drum element should be active', mode.drumEl.hasClass('active'));

  mode.numDrums = 10;
  assertTrue('Drum element should have tabbing since index < number of drums',
                mode.drumEl.hasClass('tabbing'));
}


// check drum element index wraps around when going past last drum.
function testWwModeSongModeStartDrumChange_() {
  mode.numDrums = 1;

  mode.activeDrum = {
    'disconnect': function() {}
  };

  assertTrue('Drum starting index should be negative', mode.drumIndex < 0);

  // trigger first drum start
  mode.startDrumChange_();

  assertEquals('Drum index should be 0', 0, mode.drumIndex);
  assertTrue('Drum element should be active', mode.drumEl.hasClass('active'));

  // trigger second drum start
  mode.startDrumChange_();

  assertFalse('Drum element should not be active', mode.drumEl.hasClass('active'));
  assertEquals('Drum index should be wrapped around to initial state', -1, mode.drumIndex);
}

// check drum element index wraps around when going past last drum.
function testWwModeSongModeChangeDrums_() {
  mode.drumIndex = 0;
  mode.drums = [0, 0, 0]; // dummy drum array
  
  var playSoundCount = 0;

  mode.constructor.prototype.playSound = function(drum, callback, bool) {
    playSoundCount++;
  };

  mode.activeDrum = {
    'disconnect': function() {}
  };

  assertEquals('playSoundCount should be 0 before drum change', 0, playSoundCount);

  mode.changeDrums_();

  assertEquals('playSoundCount should be 1 after drum change', 1, playSoundCount);
}

function testWwModeSongModeSwapSongMode_() {
  var active = $('#' + mode.active);
  var next = active.next();

  mode.swapSongMode_(next.attr('id'));

  assertEquals('New active id should be different, not the previous active id.',
                  next.attr('id'), mode.active);
}

function testWwModeSongModeBeginSound_() {
  var noteId = 'note-1';
  var rippleCount = mode.ripples[noteId].length;
  var playSoundCount = 0;

  mode.constructor.prototype.playSound = function(drum, callback, bool) {
    playSoundCount++;
  };

  mode.source = {
    'buffer': {
      'duration': 0.01
    }
  };

  var tweens = [];

  mode.constructor.prototype.addTween = function(tween) {
    tweens.push(tween);
  };

  assertTrue('Tweens should be empty before trigger.', tweens.length === 0);
  assertEquals('playSoundCount should be 0 before', 0, playSoundCount);

  mode.beginSound_(noteId);

  assertEquals('There should be two tweens added per ripple', rippleCount * 2, tweens.length);
  assertEquals('playSoundCount should be 1 after', 1, playSoundCount);
}