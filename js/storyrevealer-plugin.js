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

/*<p class="fragment" data-animate="animation" data-fragment-index="0">... like Beckham</p>


	var bar = $(this).find(".st-statsbar");
	var n = el.data("value");
	
	var i = 0;
	var timer = 1000/Math.abs(n);
	//n = parseInt(n);

	if (n >= 0) {
		var inv = setInterval(function(){  if (i<=n) {el.html(i++);} else {el.html(n); clearInterval(inv);} }, timer);
	}
	if (n < 0) {
		var inv = setInterval(function(){  if (i>=n) {el.html(i--);} else {el.html(n); clearInterval(inv);} }, timer);
	}
	
	var maxval = el.data("max");
	var percval = Math.abs(n)/Math.abs(maxval) * 100;
	bar.find("div").css("width", "0");
	bar.find("div").animate({"width": percval+"%"}, 2000, "swing");
	
});



*/

Reveal.addEventListener( 'fragmentshown', function( event ) {
	if ( event.fragment.dataset.countup != undefined ) {
		var opts = JSON.parse(event.fragment.dataset.countup)
		
		var numAnim = new CountUp(event.fragment, opts.start, opts.stop);
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
