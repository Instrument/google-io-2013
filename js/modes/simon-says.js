goog.require('ww.mode.Core');
goog.provide('ww.mode.SimonSaysMode');


/**
 * @constructor
 */
ww.mode.SimonSaysMode = function() {
  goog.base(this, 'simon-says', true, true);
};
goog.inherits(ww.mode.SimonSaysMode, ww.mode.Core);


/**
 * Initailize SimonSaysMode.
 * @private
 */
ww.mode.SimonSaysMode.prototype.init = function() {
  goog.base(this, 'init');

  this.topLeft = $('#top-left');    // 0 in sequence
  this.topRight = $('#top-right');  // 1 in sequence 

  this.bottomLeft = $('#bottom-left');   // 2 in sequence
  this.bottomRight = $('#bottom-right'); // 3 in sequence

  this.segments = [this.topLeft, this.topRight,
                    this.bottomLeft, this.bottomRight];

  this.allButtons = $('.simon-button');

  this.timerEl = $('#timer');
  this.playEl = $('#play');
  this.playAgainEl = $('#play-again');

  this.plays = 0;
  this.isPlaying = false;
  this.isAnimating = false;
  this.stepIndex = 0;
  this.lastStep = 0;

  this.generateSequence();
  this.total = this.sequence.length;
  this.speed = 1000;

  this.timerEl.text(this.lastStep);
};


/**
 * On focus, make the Simon Says interactive.
 * @private
 */
ww.mode.SimonSaysMode.prototype.didFocus = function() {
  goog.base(this, 'didFocus');

  var self = this;

  self.playEl.bind('tap.simon', function(){
    self.beginGame();
  });
  
  self.topLeft.bind('tap.simon', function(){
    self.checkSequence(0);
  });

  self.topRight.bind('tap.simon', function(){
    self.checkSequence(1);
  });

  self.bottomLeft.bind('tap.simon', function(){
    self.checkSequence(2);
  });
  
  self.bottomRight.bind('tap.simon', function(){
    self.checkSequence(3);
  });
};


/**
 * On unfocus, deactivate the Simon Says.
 * @private
 */
ww.mode.SimonSaysMode.prototype.didUnfocus = function() {
  goog.base(this, 'didUnfocus');

  this.playEl.unbind('tap.simon');
  this.topLeft.unbind('tap.simon');
  this.topRight.unbind('tap.simon');
  this.bottomLeft.unbind('tap.simon');
  this.bottomRight.unbind('tap.simon');
};


/**
 * @private
 */
ww.mode.SimonSaysMode.prototype.generateSequence = function() {
  this.sequence = this.sequence || [];

  // add 4 more random segments to the sequence
  for (var i = 0; i < 4; i++) {
    this.sequence.push(~~(Math.random() * 4));
  }
  
  this.log('sequence before shuffle: ' + this.sequence);

  // shuffle the sequence
  var i = this.sequence.length, j, swap;
  while (--i) {
    j = Math.random() * (i + 1) | 0;
    swap = this.sequence[i];
    this.sequence[i] = this.sequence[j];
    this.sequence[j] = swap;
  }

  this.log('generated sequence: ' + this.sequence);
};


/**
 * @private
 */
ww.mode.SimonSaysMode.prototype.checkSequence = function(check) {
  this.log('Guessed: ' + check + '. Playing? ' + this.isPlaying + '. Animating? ' + this.isAnimating);

  if (this.isPlaying && !this.isAnimating) {
    var self = this;

    self.isAnimating = true;
    self.segments[check].animate({ opacity: 1 }, 200)
                        .animate({ opacity: 0.5 }, 200, function(){
                          self.isAnimating = false;
                        });

    if (self.sequence[self.stepIndex] === check) {
      self.log('Correct step guess.');

      if (self.stepIndex === self.lastStep) {
        self.log('Reached last step. Show next step.');
        
        self.lastStep++;

        if (self.lastStep === self.total) {
          // continue. add four more levels to play.
          for (var i = 0; i < 4; i++) {
            self.sequence.push(~~(Math.random() * 4));
          }

          self.total += 4;
        }

        if (self.lastStep < self.total) {
          self.stepIndex = 0;
        }

        self.displayNext();
      } else {
        self.stepIndex++;
      }
    } else {
      self.log('Wrong. Expected (' + self.sequence[self.stepIndex] + '). Got (' + check + ').' );
      self.isPlaying = false;
    }
  }
};

/**
 * @private
 */
ww.mode.SimonSaysMode.prototype.beginGame = function() {
  this.log('demoing sequence: ' + this.sequence);
  
  if (!this.isPlaying) {
    this.isPlaying = true;

    var self = this;

    if (self.allButtons.css('opacity') !== "0.5") {
      var fadeInactive = new TWEEN['Tween']({ 'opacity': 1 });
      fadeInactive['to']({ 'opacity': 0.5 }, 200);
      fadeInactive['onUpdate'](function() {
        self.allButtons.css('opacity', this['opacity']);
      });

      self.addTween(fadeInactive);
    }

    self.displayNext();
  }
};


ww.mode.SimonSaysMode.prototype.displayNext = function() {
  if (this.isPlaying) {
    this.isAnimating = true;

    var self = this,
        index = 0,
        idx = self.sequence[0],
        stopIndex = this.lastStep + 1,
        delay = 500,
        segment = self.segments[idx];

    var animateSegment = function() {
      segment.animate({ opacity: 1 }, 200)
             .animate({ opacity: 0.5 }, 200);
      
      index++;
      if (index < stopIndex && index < self.total) {
        idx = self.sequence[index];
        segment = self.segments[idx];
        setTimeout(animateSegment, delay);
      }
    }
    
    setTimeout(animateSegment, delay);

    self.isAnimating = false;
    self.timerEl.text(stopIndex);
  }
};