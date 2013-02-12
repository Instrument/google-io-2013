goog.require('ww.util');
goog.provide('ww.PatternMatcher');

/**
 * @constructor
 * @param {Object} knownPatterns Pattern names and sequences.
 */
ww.PatternMatcher = function(knownPatterns) {
  this.currentPattern_ = '';
  this.maxPatternLength_ = 15;
  this.setupPatternMatchers_(knownPatterns);
};

/**
 * Build matchers from patterns.
 * @private
 * @param {Object} knownPatterns Pattern names and sequences.
 */
ww.PatternMatcher.prototype.setupPatternMatchers_ = function(knownPatterns) {
  var patterns = {}, key, mode;

  // Privately decode patterns into binary.
  for (key in knownPatterns) {
    if (knownPatterns.hasOwnProperty(key) && knownPatterns[key].pattern) {
      mode = knownPatterns[key];
      patterns[key] = {
        klass: mode.klass,
        binaryPattern: ww.util.pad(mode.pattern.toString(2), mode.len)
      };
    }
  }

  // Build per-character matchers
  this.matchers_ = [];

  for (key in patterns) {
    if (patterns.hasOwnProperty(key)) {
      mode = patterns[key];
      // this.log('Building matchers for: ' + mode.binaryPattern);
      for (var i = 0; i < mode.binaryPattern.length; i++) {
        this.matchers_.push({
          key: key,
          matcher: new RegExp('^' + mode.binaryPattern.slice(0, i + 1)),
          isPartial: ((i + 1) != mode.binaryPattern.length)
        });
      }
    }
  }
};

/**
 * Add a character to the pattern we're tracking.
 * @param {String} str The new character.
 * @param {Function} onMatch Callback on match.
 */
ww.PatternMatcher.prototype.addCharacter = function(str, onMatch) {
  this.currentPattern_ += str;

  if (this.currentPattern_.length > this.maxPatternLength_) {
    this.currentPattern_ = this.currentPattern_.slice(-this.maxPatternLength_,
      this.currentPattern_.length);
  }

  onMatch(this.currentPattern_, this.runMatchers_());
};

/**
 * Reset the pattern matcher.
 */
ww.PatternMatcher.prototype.reset = function() {
  this.currentPattern_ = '';
};

/**
 * Run the matchers and return the best match.
 * @private
 * @return {Object} The best match.
 */
ww.PatternMatcher.prototype.runMatchers_ = function() {
  var matches = [];

  for (var i = 0; i < this.matchers_.length; i++) {
    var matcher = this.matchers_[i];
    var len = matcher.matcher.toString().length - 3;
    if ((len === this.currentPattern_.length) &&
      matcher.matcher.test(this.currentPattern_)) {

      matches.push({
        matcher: matcher,
        len: len,
        isPartial: matcher.isPartial
      });

      if (!matcher.isPartial) {
        return matcher;
      }
    }
  }

  var found;
  // Find longest
  var longestLen = 0;
  for (var j = 0; j < matches.length; j++) {
    if (matches[j].len > longestLen) {
      found = matches[j].matcher;
      longestLen = matches[j].len;
    }
  }

  return found;
};
