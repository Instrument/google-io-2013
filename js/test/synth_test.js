function testWwModeSynthModeDidFocus() {
  mode.unfocus_();
  mode.focus_();

  var bindCount = 0;
  var elements = [mode.letterI, mode.letterO];
  var elem, bindData;
  for (var i = 0, l = elements.length; i < l; i++) {
    var bindDataCount = 0;
    elem = elements[i];
    bindData = elem.data();

    for (var bind in bindData) {
      bindDataCount++;
    }

    assertTrue('Bind count for element should be greater than 0.', bindDataCount > 0);
  }

}

function testWwModeSynthModeDidUnFocus() {
  mode.focus_();
  mode.unfocus_();

  var bindCount = 0;
  var elements = [mode.letterI, mode.letterO];
  var elem, bindData;
  for (var i = 0, l = elements.length; i < l; i++) {
    var bindDataCount = 0;
    elem = elements[i];
    bindData = elem.data();

    for (var bind in bindData) {
      bindDataCount++;
    }

    assertTrue('There should be no bind data left.', bindDataCount === 0);
  }
}


// Change waveform.
function testWwModeSynthModeChangeWaveType() {

  var waveType = mode.waveType;
  var createdSound = 0;
  mode.constructor.prototype.createSound_ = function() {
    createdSound++;
  };
  
  mode.changeWaveType();
  var newWaveType = mode.waveType;
  assertTrue('waveType should be changed.', waveType !== newWaveType);
  assertTrue('Sound was created.', createdSound !== 0);
  

}



function testWwModeSynthModeCalculateFrequency() {

  mode.oOffset.left = 10;
  mode.oOffset.top = 10;
  mode.oSize = 400;

  var originalLastFreq = mode.lastFreq;
  var originalLastDetune = mode.lastDetune;
  var originalLastHue = mode.lastHue;
  var originalLastYPercent = mode.lastYPercent;
  var originalLastXPercent = mode.lastXPercent;
  
  mode.calculateFrequency(200, 200);
    
  assertTrue('Changed lastFreq.', originalLastFreq !== mode.lastFreq);
  assertTrue('Changed lastDetune.', originalLastFreq !== mode.lastDetune);
  assertTrue('Changed lastHue.', originalLastFreq !== mode.lastHue);
  assertTrue('Changed lastYPercent.', originalLastFreq !== mode.lastYPercent);
  assertTrue('Changed lastXPercent.', originalLastFreq !== mode.lastXPercent);

}

function testWwModeSynthModeChangeFrequency() {

  var frequencyCalculated = 0;
  var createdSound = 0;
  var mockEvent = {
    pageX: 0,
    pageY: 0
  };
  mode.constructor.prototype.calculateFrequency = function() {
    frequencyCalculated++;
  };
  mode.constructor.prototype.createSound_ = function() {
    createdSound++;
  };
  mode.changeFrequency(mockEvent);
  
  assertTrue('Frequency was calculated.', frequencyCalculated !== 0);
  assertTrue('Sound was created.', createdSound !== 0);

}


function testWwModeSynthModeMoveTracker() {
  mode.tracker = new paper['Path']['Circle'](
                  new paper['Point'](10,10), 10 * .08
                  );
  var mockEvent = {
    'pageX': 100,
    'pageY': 100
  }
  mode.moveTracker(mockEvent);
  assertTrue('Moved tracker X position.', mode.tracker['position']['x'] === 100);
  assertTrue('Moved tracker Y position.', mode.tracker['position']['y'] === 100);

}


function testWwModeSynthModeOnResize() {

  var pathsExist = 0;
  mode.path = new paper['Path']();

  for (var i = 0; i <= 10; i++) {
    var point = new paper['Point'](i, 0);
    mode.path.add(point);
  }

  mode.paths = [];
  mode.paths.push(mode.path);

  for (var i = 0; i < 3; i++) {
    var path = mode.path['clone']();
    mode.paths.push(path);
  }

  mode.onResize(true);

  if(mode.paths) {
    pathsExist++;
  }

  assertTrue('Paths condition met.', pathsExist > 0);

}
