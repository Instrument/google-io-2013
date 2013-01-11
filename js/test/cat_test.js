var prefixed;

function setUp() {
  prefixed = Modernizr.prefixed('transform');
}

function tearDown() {
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
  var scaleValue = letterO[0].style[prefixed];

  assertEquals('Transform should be empty', scaleValue, '');

  letterO.click();

  setTimeout(function() {
    scaleValue = letterO[0].style[prefixed];
    assertTrue('Transform should have a value', (scaleValue !== ''));
  }, 500);
}