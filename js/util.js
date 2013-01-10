goog.provide('ww.util');

/**
 * Used to generate random X and Y coordinates.
 * @return array containing two random uniformly distributed floats.
 */
ww.util.floatComplexGaussianRandom = function() {
  var x1;
  var x2;
  var w;
  var out = [];

  /*
   * x1 + I * x2 is uniformly distributed inside unit circle in the complex
   * plane. W is its magnitude squared.
   */
  do {
      x1 = 2.0 * Math.random() - 1.0;
      x2 = 2.0 * Math.random() - 1.0;
      w = x1 * x1 + x2 * x2;
  } while (w >= 1.0);

  w = Math.sqrt((-1.0 * Math.log(w)) / w);
  out[0] = x1 * w;
  out[1] = x2 * w;

  return out;
};
