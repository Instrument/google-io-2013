// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit tests for Google I/O 2012 site.
 * @author jerjou@google.com (Jerjou Cheng)
 */


// Make sure the namespace is declared
var devsite = devsite || {};
devsite.devsite = devsite.devsite || {};
devsite.test = devsite.test || {};
var google = google || {};


// Some mocks
devsite.devsite.showRequiresLoginPrompt = function() {
  devsite.test.requiresLoginCalled = true;
};

devsite.devsite.login = function(e) {
  devsite.test.loginCalled = true;
};

devsite.devsite.logout = function() {
  devsite.test.logoutCalled = true;
};


function setUp() {
  devsite.test = {
    requiresLoginCalled: false,
    logoutCalled: false,
    loginCalled: false
  };
  google.maps = {event: {}};
  // make animations instant
  $.fx.off = true;
}

function tearDown() {
}

function testSigninLink() {
  assertFalse('Login should start uncalled', devsite.test.loginCalled);
  $('#signin').click();
  assertTrue('Login should have been called', devsite.test.loginCalled);
  assertFalse('Logout should start uncalled', devsite.test.logoutCalled);
  $('#signout').click();
  assertTrue('Logout should have been called', devsite.test.logoutCalled);
}

function testAboutExpandItem() {
  var zoom = $('#grid-zoom').hide();
  // Make sure things start as expected
  assertEquals('Zoom should start empty', '', zoom.html());
  assertEquals('There should be two expand buttons', 2, $('.expand').size());

  $('.expand').eq(0).click();

  // Check the content is as expected
  assertTrue('Zoom should be visible after click', zoom.is(':visible'));
  assertEquals('Title of the thing', zoom.find('h2').text());
  assertEquals('Content of the thing', zoom.find('p').text());
  // We add a test message mainly because the unit testing framework doesn't
  // print out the line number of a failed assertion.
  assertEquals('No button', 0, zoom.find('button').size());
  assertEquals('http://placekitten.com/285/181',
               zoom.find('img').attr('src'));
  // Check the positioning is as expected
  var item = $('#grid-item1');
  assertTrue('The zoom should overlay on the left',
             zoom.position().left <= item.position().left);
  assertTrue('The zoom should overlay on the top',
             zoom.position().top <= item.position().top);
  assertTrue('The zoom should overlay on the right',
             zoom.position().left + zoom.outerWidth() >=
             item.position().left + item.outerWidth());
  var p = item.find('p');

  // click the second one
  $('.expand').eq(1).click();

  // check content
  assertEquals('Title of the second thing', zoom.find('h2').text());
  assertEquals('Content of the second thing', zoom.find('p').text());
  assertEquals('Shouldn\'t copy button', 0, zoom.find('button').size());
  assertEquals('Check second image', 'http://placekitten.com/285/182',
               zoom.find('img').attr('src'));

  // check position
  item = $('#grid-item2');
  assertTrue('Second check: left',
             zoom.position().left <= item.position().left);
  assertTrue('Second check: top', zoom.position().top <= item.position().top);
  assertTrue('Second check: right', zoom.position().left + zoom.outerWidth() >=
             item.position().left + item.outerWidth());
}
