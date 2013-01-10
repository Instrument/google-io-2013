// 1. Create sound sources
// 2. Connect sources chain: source -> effect -> analyser -> context.destination (output)


var audioContext, // web audio context
    source, // sound source: oscillator
    tuna, // effects library
    analyser, // analyser node
    gfx, // canvas
    effects = {}, // place to keep effects
    isPlaying = false, // flag
    synth = $('#synth'), // wrapper
    power = $('#power'), // play/pause button
    params = $('.param'), // synth controls
    previousEffect = 'dry'; // state


// Create audio instance and initialize everything
function init() {
  if ('webkitAudioContext' in window) {
    audioContext = new webkitAudioContext();
    tuna = new Tuna(audioContext);
    source = audioContext.createOscillator();

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 512; // The size of the FFT used for frequency-domain analysis. This must be a power of two
    analyser.smoothingTimeConstant = 0.85; // A value from 0 -> 1 where 0 represents no time averaging with the last analysis frame

    buildEffects();
    createSound();
    connectPower();
    connectControls();
    setupCanvas();
  }
}

function buildEffects() {
  // tuna effects
  // passing params was failing so only using defaults. Didn't get a chance to review why.
  effects.chorus = new tuna.Chorus();
  effects.tremolo = new tuna.Tremolo();
  effects.delay = new tuna.Delay();
  effects.phaser = new tuna.Phaser();
  effects.wahwah = new tuna.WahWah();
  effects.filter = new tuna.Filter();
  effects.overdrive = new tuna.Overdrive();
}

function playSound() {

  // When play sound, get current effect to connect
  var effect = document.getElementById('effect').value;

  // if no effect, connect straight to analyser
  // else connect effect first
  if (effect === 'dry') {
    source.connect(analyser);
  } else {
    source.connect(effects[effect].input);
    effects[effect].connect(analyser);
  }

  // connect analyser to destination and start sound
  analyser.connect(audioContext.destination);
  source.noteOn(0);

}

function pauseSound() {
  // once noteOff is used, can't replay
  // use disconnect instead
  source.disconnect();
}

function connectControls() {
  // Recreate sound when params are changed.
  synth.delegate('.param', 'change', function() {
    createSound();
  });
  // Connect effects when effect is changed.
  synth.delegate('#effect', 'change', function() {

    // if was dry, disconnect direct,
    // else disconnect effect
    if (previousEffect === 'dry') {
      source.disconnect(audioContext.destination);
    } else {
      effects[previousEffect].disconnect(audioContext.destination);
    }
    analyser.disconnect(audioContext.destination);

    // connect dry or through effect
    if (this.value === 'dry') {
      source.connect(analyser);
    } else {
      source.connect(effects[this.value].input);
      effects[this.value].connect(analyser);
    }
    analyser.connect(audioContext.destination);

    // remember the previous effect to disconnect later
    previousEffect = this.value;
  });
}

// Toggle on off. Maybe not needed in final version, instead always on?
function connectPower() {
  synth.delegate('#power', 'click', function() {
    if (!isPlaying) {
      playSound();
      power[0].value = 'Pause';
      isPlaying = true;
    }
    else {
      pauseSound();
      power[0].value = 'Play';
      isPlaying = false;
    }
  });
}

// Set source oscillator parameters
function createSound() {
  source.type = document.getElementById('control-1').value;
  source.frequency.value = document.getElementById('control-2').value;
  source.detune.value = document.getElementById('control-3').value;
}

function setupCanvas() {
    var canvas = document.getElementById('canvas');
    gfx = canvas.getContext('2d');
    webkitRequestAnimationFrame(logSpectrum);
}

function logSpectrum() {
  // var freqByteData = new Uint8Array(analyser.frequencyBinCount);
  // analyser.getByteFrequencyData(freqByteData);
  // console.log(freqByteData);


  // Viz code pulled from
  // http://joshondesign.com/p/books/canvasdeepdive/chapter12.html#drawing
  webkitRequestAnimationFrame(logSpectrum);
  if (!isPlaying) {
    return;
  }
  gfx.clearRect(0, 0, 800, 600);
  gfx.fillStyle = 'white';
  gfx.fillRect(0, 0, 800, 600);

  var data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  gfx.fillStyle = 'red';
  for (var i = 0; i < data.length; i++) {
      gfx.fillRect(i * 4, 256 - data[i] * 2, 3, 100);
  }

}

init();
