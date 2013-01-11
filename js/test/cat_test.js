var testObj, prefixed;

ww = window.ww || {};
ww.mode = ww.mode || {};
ww.mode.CatMode = ww.mode.CatMode || {};

function setUp() {
  testObj = new ww.mode.CatMode();
  prefixed = Modernizr.prefixed('transform');
}

function tearDown() {
  testObj = null;
  prefixed = null;
}

function testWwModeCatModeActivateI() {
  var letterI = $('#letter-i');
  var scaleValue = letterI[0].style[prefixed];

  assertEquals('Transform should be empty', scaleValue, '');

  letterI.click();

  setTimeout(function() {
    scaleValue = letterI[0].style[prefixed];
    assertTrue('Transform should have a value', (scaleValue !== ''));
  }, 500);
}

function testWwModeCatModeActivateO() {
  var letterO = $('#letter-o');
  var scaleValue = letterI[0].style[prefixed];

  assertEquals('Transform should be empty', scaleValue, '');

  letterO.click();

  setTimeout(function() {
    scaleValue = letterI[0].style[prefixed];
    assertTrue('Transform should have a value', (scaleValue !== ''));
  }, 500);
}