goog.provide('ww.HelloLogo');

/**
 * RequestAnimationFrame polyfill.
 */
 (function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] +
                                      'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x] + 'CancelAnimationFrame'] ||
          window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
              callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/**
 * Logo view
 * @constructor
 * @param {String} elemId ID of element to contain the logo.
 */
ww.HelloLogo = function (elemId) {
  this.container = $(elemId);
  this.dimensions = { w: 214, h: 163 };
  this.maxWidth = 321;
  this.iRadius = 112 / 2;
  this.oRadius = 118 / 2;
  this.iPosition = { x: -56 + 164 / 2, y: 164 / 2 };
  this.oPosition = { x: 72 + 164 / 2, y: 164 / 2 };

  this.wantsRetina = (window.devicePixelRatio >= 2);

  this.logoParts = $('#io-logo');
  this.iSpinnerCanvas = this.addCanvas(1, {x: 0, y: 0});
  this.oSpinnerCanvas = this.addCanvas(2, {x: 0, y: 0});

  this.iSpinner = new ww.RectangleSpinnerView(this.iSpinnerCanvas, this.iRadius, this.iPosition, -0.06, this.wantsRetina);
  this.iSpinner.update();

  this.oSpinner = new ww.SpinnerView(this.oSpinnerCanvas, this.oRadius, this.oPosition, -0.06, this.wantsRetina);
  this.oSpinner.update();

  this.setSize();

  this.iSpinner.play(true);
  this.oSpinner.update();
  $(this.oSpinner.dom).hide();

  this.logoParts.hide();

  var self = this;
  
  $(window).resize(function() { self.setSize(); });
  $(window).click(function(e) { self.setSpeed(e.pageX); });
  $(window).bind('touchstart', function(e) { self.setSpeed(e.originalEvent.touches[0].pageX); });

  setTimeout(function() {
    self.oSpinner.play(true);
    $(self.oSpinner.dom).show();
    $(self.logoParts).fadeIn('slow');
  }, 400);
};

/**
 * Set the speed of the animation based on the distance
 * of a click event from the center.
 * @param {Number} pageX X position of a click event.
 */
ww.HelloLogo.prototype.setSpeed = function(pageX) {
  if (!event || event === undefined) {
    return;
  }

  var windowWidth = $(window).width();
  var x = pageX;
  var d = x - (windowWidth / 2);
  var s = (d < 0) ? Math.max(-0.5, d / 1000) : Math.min(0.5, d / 1000);

  this.oSpinner.da = s;
  this.iSpinner.da = s;
};

/**
 * Set the size and scale of the logo.
 */
ww.HelloLogo.prototype.setSize = function() {
  var windowWidth = $(window).width();
  var windowHeight = $(window).height();

  // Scale
  var s = Math.min(this.maxWidth, windowWidth * 0.75) / this.dimensions.w;

  var newSize = { w: this.dimensions.w * s, h: this.dimensions.h * s };

  this.container.width(newSize.w);
  this.container.height(newSize.h);
  this.container.css('top', (windowHeight - newSize.h) / 2.1);

  var img = $('#io-logo');
  img.width(newSize.w);
  img.height(newSize.h);

  this.iSpinner.r = s * this.iRadius;
  var newIPosition = { x: this.iPosition.x * s, y: this.iPosition.y * s };
  this.iSpinner.setSize(newSize);
  this.iSpinner.setCenter(newIPosition);

  this.oSpinner.r = s * this.oRadius;
  var newOPosition = { x: this.oPosition.x * s, y: this.oPosition.y * s };
  this.oSpinner.setSize(newSize);
  this.oSpinner.setCenter(newOPosition);
};

/**
 * Add a Canvas to the DOM.
 * @param {String} id Unique ID for the canvas.
 * @param {Object} position Position of the canvas.
 */
ww.HelloLogo.prototype.addCanvas = function(id, position) {
  var canvas = document.createElement('canvas');
  canvas.id = 'canvas'+ id;

  canvas.style.zIndex = 8;
  canvas.style.position = 'absolute';
  canvas.style.top = position.y + 'px';
  canvas.style.left = position.x + 'px';

  $(this.container).append(canvas);

  return canvas;
};

/**
 * View controller for drawing the O
 * @constructor
 * @param {Element} canvasDomElement The canvas DOM element.
 * @param {Number} radius Circle radius.
 * @param {Object} center Coordinates for the center.
 * @param {Number} speed Animation speed.
 * @param {Boolean} wantsRetina Whether the view should draw at 2x.
 */
ww.SpinnerView = function(canvasDomElement, radius, center, speed, wantsRetina) {
  if (!canvasDomElement || canvasDomElement === undefined) {
    return;
  }

  this.dom = canvasDomElement;
  this.wantsRetina = wantsRetina;

  this.center = {x: 0, y: 0};

  this.r = Math.round(radius);
  this.c = { x: 0, y: 0 };

  this.isPlaying = false;
  this.changeRotation = false;

  this.a = 0;
  this.da = speed;

  this.arc = [
    { point: { x: 0, y: 1 }, handleIn: { x: 0, y: 0 }, handleOut: { x: 0.55, y: 0 } },
    { point: { x: 1, y: 0 }, handleIn: { x: 0, y: 0.55 }, handleOut: { x: 0, y: -0.55 } },
    { point: { x: 0, y: -1 }, handleIn: { x: 0.55, y: 0 }, handleOut: { x: 0, y: 0 } }
  ];

  this.colors = [
    [{ r: 223, g: 73, b: 62, a: 1 }], // red
    [{ r: 67, g: 134, b: 252, a: 1 }], // blue
    [{ r: 13, g: 169, b: 95, a: 1 }], // green
    [{ r: 246, g: 195, b: 56, a: 1 }] // yellow
  ];

  // grab gradient values and steps
  this.getGradients();

  this.color1 = [{ r: 249, g: 249, b: 249, a: 1 }];
  this.color2 = this.colors[0];
  this.colorCount = 1;
};

/**
 * Set the center position.
 * @param {Object} position Center position.
 */
ww.SpinnerView.prototype.setCenter = function(position) {
  this.center.x = position.x;
  this.center.y = position.y;
};

/**
 * Update the size of the view.
 * @param {Object} dimensions Size of the view.
 */
ww.SpinnerView.prototype.setSize = function(dimensions) {
  if (this.wantsRetina) {
    this.dom.width = dimensions.w * 2;
    this.dom.height = dimensions.h * 2;
    this.dom.style.width = dimensions.w + 'px';
    this.dom.style.height = dimensions.h + 'px';
  } else {
    this.dom.width = dimensions.w;
    this.dom.height = dimensions.h;
  }
};

/**
 * Setup gradients.
 */
ww.SpinnerView.prototype.getGradients = function() {
  // grab gradient values and steps
  this.newColors = [];
  for (var i = 0; i < this.colors.length; i++) {
    var c1 = this.colors[i][0];
    var n = (i + 1 >= this.colors.length) ? 0 : i + 1;
    var c2 = this.colors[n][0];

    this.newColors.push([
      { r: c1.r, g: c1.g, b: c1.b },
      {
        r: Math.round((c2.r - c1.r) / 2 + c1.r),
        g: Math.round((c2.g - c1.g) / 2 + c1.g),
        b: Math.round((c2.b - c1.b) / 2 + c1.b)
      }
    ]);
  }
  this.colors = this.newColors;
};

/**
 * Check the color, fix gradient based on scale.
 */
ww.SpinnerView.prototype.checkColors = function(color, scale) {
  if (color.length > 1) {
    var halfColor = {
      r: Math.round(color[1].r - color[0].r) / 2 + color[0].r,
      g: Math.round(color[1].g - color[0].g) / 2 + color[0].g,
      b: Math.round(color[1].b - color[0].b) / 2 + color[0].b
    };

    if (scale > 0) {
      return [color[0], halfColor];
    } else {
      return [halfColor, color[1]];
    }
  }

  return color;
};

/**
 * Update some state.
 */
ww.SpinnerView.prototype.checkState = function() {
  if (this.a > Math.PI) {
    this.a = this.a - Math.PI;
    this.color1 = this.color2;
    this.colorCount++;
    if (this.colorCount >= this.colors.length) {
      this.colorCount = 0;
    }
    this.color2 = this.colors[this.colorCount];
    // if (this.changeRotation)
    // {
    //   this.canvas.rotate(90 * Math.PI / 180);
    //   this.canvas.save();
    // }
  }

  if (this.a < 0) {
    this.a = Math.PI + this.a;
    this.color2 = this.color1;
    this.colorCount--;
    if (this.colorCount < 0) {
      this.colorCount = this.colors.length - 1;
    }
    this.color1 = this.colors[this.colorCount];
    // if (this.changeRotation)
    // {
    //   this.canvas.rotate(90 * Math.PI / 180);
    //   this.canvas.save();
    // }
  }
};

/**
 * onFrame event
 */
ww.SpinnerView.prototype.update = function() {
  if (!this.dom || this.dom.width < 1 || this.dom.height < 1) { return; }

  var ctx = this.dom.getContext('2d');
  ctx.clearRect(0, 0, this.dom.width + 1, this.dom.height + 1);

  ctx.save();

  if (this.wantsRetina) {
    ctx.scale(2, 2);
  }

  ctx.translate(Math.round(this.center.x), Math.round(this.center.y));

  this.a += this.da;
  this.checkState();

  var scale = Math.cos(this.a);

  var color_offset = 30 * (1 - Math.abs(scale));
  var foldColor;
  if (scale > 0) {
    if (this.color1.length > 1) {
      foldColor = [];
      foldColor.push({ r: this.color1[0].r - color_offset, g: this.color1[0].g - color_offset, b: this.color1[0].b - color_offset });
      foldColor.push({ r: this.color1[1].r - color_offset, g: this.color1[1].g - color_offset, b: this.color1[1].b - color_offset });
    } else {
      foldColor = [{ r: this.color1[0].r - color_offset, g: this.color1[0].g - color_offset, b: this.color1[0].b - color_offset }];
    }
  } else {
    if (this.color2.length > 1) {
      foldColor = [];
      foldColor.push({ r: this.color2[0].r - color_offset, g: this.color2[0].g - color_offset, b: this.color2[0].b - color_offset });
      foldColor.push({ r: this.color2[1].r - color_offset, g: this.color2[1].g - color_offset, b: this.color2[1].b - color_offset });
    } else {
      foldColor = [{ r: this.color2[0].r - color_offset, g: this.color2[0].g - color_offset, b: this.color2[0].b - color_offset }];
    }
  }

  var shadowScale = Math.min(1, Math.abs(scale) * 1.4) * Math.abs(scale) / scale;

  this.draw(-1, this.color1, 1); // draw old arc
  this.draw(1, this.color2, 1); // draw new base arc
  this.draw(shadowScale, [{r: 0, g: 0, b: 0}], 0.1); // draw shadow
  this.draw(scale, foldColor, 1); // draw flipping arc

  ctx.restore();
};

/**
 * Draw some arcs.
 * @param {Number} scale Scale to draw at.
 * @param {Object} color rgb values.
 * @param {Number} a Opacity.
 */
ww.SpinnerView.prototype.draw = function(scale, color, a) {
  var ctx = this.dom.getContext('2d');

  ctx.beginPath();
  ctx.moveTo(this.arc[0].point.x * this.r + this.c.x, this.arc[0].point.y * this.r + this.c.y);

  for (var i = 1; i < this.arc.length; i++) {
    var x = this.arc[i].point.x * this.r * scale + this.c.x;
    var y = this.arc[i].point.y * this.r + this.c.y;
    var h1_x = (this.arc[i - 1].point.x + this.arc[i - 1].handleOut.x) * this.r * scale + this.c.x;
    var h1_y = (this.arc[i - 1].point.y + this.arc[i - 1].handleOut.y) * this.r + this.c.y;
    var h2_x = (this.arc[i].point.x + this.arc[i].handleIn.x) * this.r * scale + this.c.x;
    var h2_y = (this.arc[i].point.y + this.arc[i].handleIn.y) * this.r + this.c.y;
    ctx.bezierCurveTo(h1_x, h1_y, h2_x, h2_y, x, y);
  }

  var aColor = this.checkColors(color, scale);

  var c;
  if (aColor.length == 1) {
    c = 'rgba(' + Math.round(color[0].r) + ',' + Math.round(aColor[0].g) + ', ' + Math.round(aColor[0].b) + ', ' + a + ')';
  } else {
    c = ctx.createLinearGradient(0, 0, this.r * scale, 0);

    if (scale > 0) {
      c.addColorStop(0.1, 'rgba(' + Math.round(aColor[1].r) + ',' + Math.round(aColor[1].g) + ', ' + Math.round(aColor[1].b) + ', ' + a + ')');
      c.addColorStop(0.9, 'rgba(' + Math.round(aColor[0].r) + ',' + Math.round(aColor[0].g) + ', ' + Math.round(aColor[0].b) + ', ' + a + ')');
    } else {
      c.addColorStop(0.1, 'rgba(' + Math.round(aColor[0].r) + ',' + Math.round(aColor[0].g) + ', ' + Math.round(aColor[0].b) + ', ' + a + ')');
      c.addColorStop(0.9, 'rgba(' + Math.round(aColor[1].r) + ',' + Math.round(aColor[1].g) + ', ' + Math.round(aColor[1].b) + ', ' + a + ')');
    }
  }

  ctx.fillStyle = c;
  ctx.fill();
};

/**
 * Start animating.
 * @param {Boolean} start Whether to keep playing.
 */
ww.SpinnerView.prototype.play = function(start) {
  if (start) { this.isPlaying = true; }

  this.update();

  if (this.isPlaying) {
    var thisLoader = this;
    requestAnimationFrame(function() { thisLoader.play(); });
  }
};

/**
 * Stop animating.
 */
ww.SpinnerView.prototype.stop = function() {
  this.isPlaying = false;
};

/**
 * View to draw the I.
 * @constructor
 * @param {Element} canvasDomElement The canvas DOM element.
 * @param {Number} radius Circle radius.
 * @param {Object} center Coordinates for the center.
 * @param {Number} speed Animation speed.
 * @param {Boolean} wantsRetina Whether the view should draw at 2x.
 */
ww.RectangleSpinnerView = function(canvasDomElement, radius, center, speed, wantsRetina) {
  ww.SpinnerView.call(this, canvasDomElement, radius, center, speed, wantsRetina);

  this.arc = [
    { point: { x: 0, y: 1 }, handleIn: { x: 0, y: 1 }, handleOut: { x: 0, y: 1 } },
    { point: { x: 0.46, y: 1 }, handleIn: { x: 0.46, y: 1 }, handleOut: { x: 0.46, y: 1 } },
    { point: { x: 0.46, y: -1 }, handleIn: { x: 0.46, y: -1 }, handleOut: { x: 0.46, y: -1 } },
    { point: { x: 0, y: -1 }, handleIn: { x: 0, y: -1 }, handleOut: { x: 0, y: -1 } }
  ];

  this.colors = [
    [{ r: 223, g: 73, b: 62, a: 1 }], // red
    [{ r: 67, g: 134, b: 252, a: 1 }], // blue
    [{ r: 13, g: 169, b: 95, a: 1 }], // green
    [{ r: 246, g: 195, b: 56, a: 1 }] // yellow
  ];

  this.getGradients();
};

ww.RectangleSpinnerView.prototype = new ww.SpinnerView();

/**
 * Update the gradients.
 */
ww.RectangleSpinnerView.prototype.getGradients = function() {
  // grab gradient values and steps
  this.newColors = [];
  for (var i = 0; i < this.colors.length; i++) {
    var c1 = this.colors[i][0];
    var n = (i + 1 >= this.colors.length) ? 0 : i + 1;
    var c2 = this.colors[n][0];

    this.newColors.push([
      {
        r: Math.round((c2.r - c1.r) / 2 + c1.r),
        g: Math.round((c2.g - c1.g) / 2 + c1.g),
        b: Math.round((c2.b - c1.b) / 2 + c1.b)
      },
      { r: c2.r, g: c2.g, b: c2.b }
    ]);
  }
  this.colors = this.newColors;
};

ww.RectangleSpinnerView.prototype.draw = function(scale, color, a) {
  var ctx = this.dom.getContext('2d');

  ctx.beginPath();
  ctx.moveTo(this.arc[0].point.x * this.r + this.c.x, this.arc[0].point.y * this.r + this.c.y);

  var skew = (Math.abs(scale) == 1) ? 1 : (Math.abs(Math.sin(this.a))) / 8 + 1;

  for (var i = 1; i < this.arc.length; i++)
  {
    var x = this.arc[i].point.x * this.r * scale + this.c.x;
    var y = this.arc[i].point.y * this.r + this.c.y;

    if (i == 1 || i == 2) y *= skew;

    ctx.lineTo(x, y);
  }

  var aColor = this.checkColors(color, scale);

  var c;
  if (aColor.length == 1) {
    c = 'rgba(' + Math.round(aColor[0].r) + ',' + Math.round(aColor[0].g) + ', ' + Math.round(aColor[0].b) + ', ' + a + ')';
  } else {
    c = ctx.createLinearGradient(0, 0, this.r * scale, 0);

    if (scale > 0) {
      c.addColorStop(0, 'rgba(' + Math.round(aColor[1].r) + ',' + Math.round(aColor[1].g) + ', ' + Math.round(aColor[1].b) + ', ' + a + ')');
      c.addColorStop(0.5, 'rgba(' + Math.round(aColor[0].r) + ',' + Math.round(aColor[0].g) + ', ' + Math.round(aColor[0].b) + ', ' + a + ')');
    } else {
      c.addColorStop(0, 'rgba(' + Math.round(aColor[0].r) + ',' + Math.round(aColor[0].g) + ', ' + Math.round(aColor[0].b) + ', ' + a + ')');
      c.addColorStop(0.5, 'rgba(' + Math.round(aColor[1].r) + ',' + Math.round(aColor[1].g) + ', ' + Math.round(aColor[1].b) + ', ' + a + ')');
    }
  }

  ctx.fillStyle = c;
  ctx.fill();
};

window['ww'] = window['ww'] || {};
window['ww']['HelloLogo'] = ww.HelloLogo;

goog.exportSymbol('ww.HelloLogo', ww.HelloLogo);