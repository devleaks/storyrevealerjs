/*!
 * storyrevealer.js
 * MIT licensed
 *
 * Copyright (C) 2017 Pierre M
 */
var Storyrevealer = window.Storyrevealer || (function() {
	var config = Reveal.getConfig().storyrevealer || {};
	if (!config.url) { // should default to story.json?
		console.log("storyrevealer: no url");
		return;
	}
	console.log("storyrevealer: doing "+config.url);
	Storyrevealer.generate(config)
})();

Reveal.addEventListener('ready', function() {
	console.log("storyrevealer ready");
});
