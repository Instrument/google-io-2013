/** @define {boolean} */
var DEBUG_MODE = false;

(function(window, basket, require) {
  if (DEBUG_MODE) {
    localStorage.clear();
  }

	var inIFrame = window.location.href.indexOf('modes') > -1;
	var prefix = inIFrame ? '../' : '';

	var injectStyle = function(text) {
		var styletag = document.createElement('style');
		styletag.innerHTML = text[0];
	
		var head = document.head || document.getElementsByTagName('head')[0];
		head.appendChild(styletag);
	};

	require(
		{ 'url': prefix + 'js/vendor/jquery-1.6.4.js', 'key': 'jquery' },
		{ 'url': prefix + 'js/vendor/paper.js', 'key': 'paper' },
		{ 'url': prefix + 'js/vendor/physics.js', 'key': 'physics' },
		{ 'url': prefix + 'js/vendor/tuna.js', 'key': 'tuna' },
		{ 'url': prefix + 'js/vendor/hammer.js', 'key': 'hammer' },
		{ 'url': prefix + 'js/vendor/stats.min.js', 'key': 'stats' }
	)['then'](function() {
		var level2 = [
			{ 'url': prefix + 'js/vendor/jquery.hammer.js', 'key': 'jquery.hammer' },
			{ 'url': prefix + 'js/vendor/jquery.specialevent.hammer.js', 'key': 'jquery.specialevent.hammer' }
		];

		if (inIFrame) {
			level2.push({ 'url': prefix + 'js/mode.min.js', 'key': 'mode' });
		}
	
		require.apply(basket, level2)['then'](function() {
			if (inIFrame) {
				// var parts = window.location.href.split('/');
				// var page = parts[parts.length-1];
				// var scriptName = page.replace('.html', '.js');
				// require({ 'url': prefix + 'js/modes/' + scriptName });
				require({ 'url': prefix + 'css/mode.css', 'key': 'modecss', 'execute': false })['then'](injectStyle);
			} else {
				require({ 'url': prefix + 'js/app.min.js', 'key': 'appjs' });
				require({ 'url': prefix + 'css/app.css', 'key': 'appcss', 'execute': false })['then'](injectStyle);
			}
		});
	});
})(window, window['basket'], window['basket']['require']);