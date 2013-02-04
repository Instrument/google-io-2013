var pm;

function setUp() {
  pm = new ww.PatternMatcher({
    'one': {
      klass:   function() {},
      pattern: 1,
      len:     2
    },

    'two': {
      klass:   function() {},
      pattern: 2,
      len:     2
    }
  });
}

function testPatternMatcherSetup() {
  // Should be len chars for each pattern. len=2 * 2 = 4
  assertEquals('Should have complete and partial matchers for each pattern.', 4, pm.matchers_.length);

  var i, partials = 0, completes = 0;

  for (i = 0; i < pm.matchers_.length; i++) {
    var matcher = pm.matchers_[i];

    assertEquals('Should have a regex', RegExp, matcher.matcher.constructor);

    if (matcher.isPartial) {
      partials++;
      assertEquals('Should be a partial regex', 4, matcher.matcher.toString().length);
    } else {
      completes++;
      assertEquals('Should be a complete regex', 5, matcher.matcher.toString().length);
    }
  }

  assertEquals('Should have a partial for each pattern', 2, partials);
  assertEquals('Should have a complete for each pattern', 2, completes);
}

function testPatternReset() {
  pm.currentPattern_ = 'test';
  pm.reset();
  assertEquals('Should reset pattern', '', pm.currentPattern_);
}

function testPatternMatcherInput() {
  // Zero-out patten
  pm.reset();

  pm.addCharacter('0', function(currentPattern, matched) {
    assertEquals('Should correctly add character', '0', currentPattern);

    assertEquals('Should partial match', true, matched.isPartial);
    assertEquals('Should partial match one', 'one', matched.key);
  });

  // Zero-out patten
  pm.reset();

  pm.addCharacter('1', function(currentPattern, matched) {
    assertEquals('Should correctly add character', '1', currentPattern);

    assertEquals('Should partial match', true, matched.isPartial);
    assertEquals('Should partial match two', 'two', matched.key);
  });

  pm.addCharacter('0', function(currentPattern, matched) {
    assertEquals('Should correctly add second character', '10', currentPattern);

    assertEquals('Should complete match', false, matched.isPartial);
    assertEquals('Should complete match two', 'two', matched.key);
  });
}