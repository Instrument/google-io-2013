var inIFrame = window.location.href.indexOf('modes') > -1;
var prefix = inIFrame ? '../' : '';

window['basket']['require'](
	{ 'url': prefix + 'js/vendor/jquery-1.6.4.js', 'key': 'jquery' },
	{ 'url': prefix + 'js/vendor/paper.js', 'key': 'paper' },
	{ 'url': prefix + 'js/vendor/physics.js', 'key': 'physics' },
	{ 'url': prefix + 'js/vendor/tuna.js', 'key': 'tuna' },
	{ 'url': prefix + 'js/vendor/hammer.js', 'key': 'hammer' }
)['then'](function() {
	var level2 = [
		{ 'url': prefix + 'js/vendor/jquery.hammer.js', 'key': 'jquery.hammer' },
		{ 'url': prefix + 'js/vendor/jquery.specialevent.hammer.js', 'key': 'jquery.specialevent.hammer' }
	];

	if (inIFrame) {
		level2.push({ 'url': prefix + 'js/mode.min.js', 'key': 'mode' });
	}
	
	window['basket']['require'].apply(window['basket'], level2)['then'](function() {
		if (inIFrame) {
			var parts = window.location.href.split('/');
			var page = parts[parts.length-1];
			var scriptName = page.replace('.html', '.js');
			window['basket']['require']({ 'url': prefix + 'js/modes/' + scriptName });
		} else {
			window['basket']['require']({ 'url': prefix + 'js/app.min.js', 'key': 'app' });
		}
	});
});