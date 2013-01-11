goog.require('ww.mode.Core');
goog.provide('ww.mode.SimoneMode');


/**
 * @constructor
 */
ww.mode.SimoneMode = function() {
  goog.base(this, 'simone', true, true);
};
goog.inherits(ww.mode.SimoneMode, ww.mode.Core);


/**
 * Initailize SimoneMode.
 */
ww.mode.SimoneMode.prototype.init = function() {
  goog.base(this, 'init');

  var self = this;

  TWEEN['removeAll']();

  if (Modernizr['touch']) {
    this.evtStart = 'touchstart.simon';
    this.evtEnd = 'touchend.simon';
  } else {
    this.evtStart = 'mousedown.simon';
    this.evtEnd = 'mouseup.simon';
  }

  this.topLeft = $('#red');        // 0 in sequence, e lower
  this.topRight = $('#green');     // 1 in sequence, a

  this.bottomLeft = $('#blue');    // 2 in sequence, c#
  this.bottomRight = $('#yellow'); // 3 in sequence, e

  this.segments = [this.topLeft, this.topRight,
                   this.bottomLeft, this.bottomRight];

  this.segmentEls = $('#red, #green, #blue, #yellow').css('opacity', 1);

  // keeps track of levels reached in a game
  this.levelCount = $('#max-level').removeClass().text('');

  this.uiContainer = $('#levels').css('opacity', 0);
  this.container = $('#simone');

  this.message = $('#message').css('opacity', 1);
  this.playAgainEl = $('#play-again');

  // display 'how to start playing' message
  // unbind and hide once first game has started
  this.container.bind(this.evtEnd, function() {
    self.message.css('opacity', 0);
    self.beginGame_();
    self.container.unbind(self.evtEnd);
  });

  // number of games played
  this.plays = 0;

  // whether currently playing a game
  this.isPlaying = false;

  // whether currently animating a sequence
  // helps to prevent guesses during sequence animation
  this.isAnimating = false;

  // current step in the sequence user has to match
  this.stepIndex = 0;

  // last step in the active sequence
  // also, the current game's max levels achieved
  this.lastStep = 0;

  // highest level reached out of all games
  this.highestLevel = 0;

  this.generateSequence_();

  // total levels available to play
  this.total = this.sequence.length;
};

/**
 * On focus, make the Simon Says interactive.
 */
ww.mode.SimoneMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  var self = this;

  self.playAgainEl.bind(this.evtEnd, function() {
    self.beginGame_();
  });

  self.segmentEls.bind(self.evtStart, function() {
    var guessSeg = $(this);
    var fadeInQuick = new TWEEN['Tween']({ 'opacity': 0.5 });
        fadeInQuick['to']({ 'opacity': 1 }, 100);
        fadeInQuick['onUpdate'](function() {
          guessSeg.css('opacity', this['opacity']);
        });

    self.addTween(fadeInQuick);
  });

  self.topLeft.bind(this.evtEnd, function() {
    self.checkSequence_(0);
  });

  self.topRight.bind(this.evtEnd, function() {
    self.checkSequence_(1);
  });

  self.bottomLeft.bind(this.evtEnd, function() {
    self.checkSequence_(2);
  });

  self.bottomRight.bind(this.evtEnd, function() {
    self.checkSequence_(3);
  });
};


/**
 * On unfocus, deactivate the Simon Says.
 */
ww.mode.SimoneMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  this.playAgainEl.unbind(this.evtEnd);
  this.segmentEls.unbind(this.evtStart);

  this.topLeft.unbind(this.evtEnd);
  this.topRight.unbind(this.evtEnd);
  this.bottomLeft.unbind(this.evtEnd);
  this.bottomRight.unbind(this.evtEnd);
};


/**
 * Generates an initial, random sequence.
 * @private
 */
ww.mode.SimoneMode.prototype.generateSequence_ = function() {
  this.sequence = this.sequence || [];

  for (var i = 0; i < 4; i++) {
    this.sequence.push(~~(Math.random() * 4));
  }

  this.log('generated sequence: ' + this.sequence);
};


/**
 * Shuffle the sequence.
 * @private
 */
ww.mode.SimoneMode.prototype.shuffleSequence_ = function() {
  var i = this.sequence.length, j, swap;

  while (--i) {
    j = Math.random() * (i + 1) | 0;
    swap = this.sequence[i];
    this.sequence[i] = this.sequence[j];
    this.sequence[j] = swap;
  }

  this.log('shuffled sequence: ' + this.sequence);
};


/**
 * Check if the guess is the correct segment in the sequence, if not game over!
 * If the guess is in the middle of the sequence and is correct, continue.
 * If the guess is also the last step of the active sequence and is correct,
 *   then the level count increases and the next segment is shown.
 * @param {number} guess Enumerated number sequence representing chosen segment.
 * @private
 */
ww.mode.SimoneMode.prototype.checkSequence_ = function(guess) {
  this.log('Guessed (' + guess + ')');

  if (this.isPlaying && !this.isAnimating) {
    var self = this,
        guessSeg = self.segments[guess];

    // clear any state on the level counter
    self.levelCount.removeClass();

    var fadeOut = new TWEEN['Tween']({ 'opacity': 1 });
        fadeOut['to']({ 'opacity': 0.5 }, 200);
        fadeOut['onUpdate'](function() {
          guessSeg.css('opacity', this['opacity']);
        });

    self.addTween(fadeOut);

    self.isAnimating = false;

    // check if selected segment is the expected step in the sequence
    if (self.sequence[self.stepIndex] === guess) {
      self.log('Correct step guess.');

      // check if a guess is just a step or the last in the sequence
      if (self.stepIndex !== self.lastStep) {
        // increase step index since user hasn't reached the last step yet
        // step is just a step
        self.stepIndex++;
      } else {
        self.log('Reached last step. Show next step.');

        // advance level by one
        // display success state on level count
        self.lastStep++;
        self.levelCount.addClass('success');

        if (self.lastStep === self.total) {
          // reached the end of the sequence
          // add more random levels for future play
          for (var i = 0; i < 4; i++) {
            self.sequence.push(~~(Math.random() * 4));
          }

          self.total += 4;
        }

        // reset the step index to start at the beginning again
        if (self.lastStep < self.total) {
          self.stepIndex = 0;
        }

        self.displayNext_();
      }
    } else {
      // wrong step guess
      self.log('Wrong. Expected (' + self.sequence[self.stepIndex] + ')');

      self.isPlaying = false;
      self.levelCount.addClass('game-over');

      var fadeIn = new TWEEN['Tween']({ 'opacity': 0.5 });
          fadeIn['to']({ 'opacity': 1 }, 200);
          fadeIn['delay'](500);
          fadeIn['onUpdate'](function() {
            self.segmentEls.css('opacity', this['opacity']);
          });

      self.addTween(fadeIn);
    }
  }
};


/**
 * Begin a new, fresh state game.
 * @private
 */
ww.mode.SimoneMode.prototype.beginGame_ = function() {
  if (!this.isPlaying) {
    var self = this;

    self.plays++;
    self.isPlaying = true;
    self.isAnimating = false;
    self.stepIndex = 0;
    self.highestLevel = Math.max(self.highestLevel, self.lastStep);
    self.lastStep = 0;

    self.shuffleSequence_();
    self.levelCount.removeClass().text('');

    this.log('Playing sequence: ' + this.sequence);

    self.uiContainer.animate({ opacity: 1 }, 200);

    if (self.segmentEls.css('opacity') !== '0.5') {
      var fadeOut = new TWEEN['Tween']({ 'opacity': 1 });
          fadeOut['to']({ 'opacity': 0.5 }, 200);
          fadeOut['delay'](200);
          fadeOut['onUpdate'](function() {
            self.segmentEls.css('opacity', this['opacity']);
          });

      self.addTween(fadeOut);
    }

    self.displayNext_();
  }
};


/**
 * Animates the active sequence, plus the next segment to be matched.
 * @private
 */
ww.mode.SimoneMode.prototype.displayNext_ = function() {
  if (this.isPlaying) {
    this.isAnimating = true;

    var self = this,
        idx,
        segment,
        stopIndex = this.lastStep + 1,
        delay = 500;

    for (var i = 0; i < stopIndex; i++) {
      idx = self.sequence[i];
      segment = self.segments[idx];
      delay += 500;

      (function(segment, delay, i) {
        var fadeIn = new TWEEN['Tween']({ 'opacity': 0.5 });
            fadeIn['to']({ 'opacity': 1}, 200);
            fadeIn['delay'](delay);
            fadeIn['onUpdate'](function() {
              segment[0].style.opacity = this['opacity'];
            });

        if (i === 0) {
          fadeIn['onStart'](function() {
            self.levelCount.removeClass('success');
          });
        }

        var fadeOut = new TWEEN['Tween']({ 'opacity': 1 });
            fadeOut['to']({ 'opacity': 0.5 }, 200);
            fadeOut['delay'](delay + 200);
            fadeOut['onUpdate'](function() {
              segment[0].style.opacity = this['opacity'];
            });

        if (i === stopIndex - 1) {
          fadeOut['onComplete'](function() {
            self.isAnimating = false;
            self.levelCount.addClass('start').text(stopIndex);
          });
        }

        self.addTween(fadeIn);
        self.addTween(fadeOut);
      })(segment, delay, i);
    }
  }
};
