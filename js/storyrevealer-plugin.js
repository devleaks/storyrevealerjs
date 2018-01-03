/*!
 * storyrevealer.js
 * MIT licensed
 *
 * Copyright (C) 2017 Pierre M
 */
var Storyrevealer2 = window.Storyrevealer2 || (function() {
	var config = Reveal.getConfig().storyrevealer || {};
	if (!config.url) { // should default to story.json?
		console.log("storyrevealer: no url");
		return;
	}
	console.log("storyrevealer: doing "+config.url);
})();

Reveal.addEventListener('ready', function() {
	console.log("storyrevealer ready");
});

Reveal.addEventListener( 'slidechanged', function( event ) {
	console.log("storyrevealer new slide");
});

Reveal.addEventListener( 'fragmentshown', function( event ) {
	if ( event.fragment.dataset.countup != undefined ) {
		var opts = event.fragment.dataset.countup.split(",")
		console.log("fragmentshown",opts)
		
		var numAnim = new CountUp(event.fragment, opts[0], opts[1],opts[2],opts[3]);
		if (!numAnim.error) {
		    numAnim.start();
		} else {
		    console.error(numAnim.error);
		}
		console.log('countup up', opts)
	}
} );

Reveal.addEventListener( 'fragmenthidden', function( event ) {
	if ( event.fragment.dataset.countup != undefined ) {
		console.log('countup down')
	}
} );
