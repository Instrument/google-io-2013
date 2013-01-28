function testWwModeSynthModeDidFocus() {
  mode.unfocus_();
  mode.focus_();

  var bindCount = 0;
  var elements = [];

  for (var i = 0; i < mode.params.length; i++) {
    var param = mode.params[i];
    elements.push($(param));
  }

  elements.push(mode.power);
  elements.push(mode.effect);

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

function testWwModeSynthModeDidUnFocus() {
  mode.focus_();
  mode.unfocus_();

  var bindCount = 0;
  var elements = [];

  for (var i = 0; i < mode.params.length; i++) {
    var param = mode.params[i];
    elements.push($(param));
  }

  elements.push(mode.power);
  elements.push(mode.effect);

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

// connect power if change effect and not playing
function testWwModeSynthModeChangeEffect_() {
  mode.isPlaying = false;

  mode.source = {
    'connect': function(analyser) {}
  };

  var connect = 0;
  
  var elem = {
    'value': 'dry'
  };

  mode.constructor.prototype.connectPower_ = function() {
    connect++;
  };

  assertTrue('Connect should be 0 initially', 0, connect);

  mode.changeEffect_(elem);

  assertTrue('Connected power', connect > 0);
}

// change effect to dry
function testWwModeSynthModeChangeEffect_() {
  var elem = {
    'value': 'dry'
  };
}

// change effect to not dry
function testWwModeSynthModeChangeEffect_() {
  var elem = {
    'value': 'wet'
  };
}