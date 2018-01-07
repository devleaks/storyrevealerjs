/*!
 * storyrevealer.js
 * MIT licensed
 *
 * Copyright (C) 2017 Pierre M
 */
Reveal.addEventListener( 'fragmentshown', function( event ) {
	if ( event.fragment.dataset.countup != undefined ) {
		var values = event.fragment.dataset.countup.split(',')
		var myObject = {
			counter: values[0]
		}
		var cssProperties = anime({
			targets: myObject,
			counter: values[1],
			round: values[2],
			easing: 'easeInOutQuad',
			duration: values[3],
			update: function() {
				event.fragment.innerHTML = myObject.counter;
			}
		})
	}
} );


Reveal.addEventListener( 'fragmentshown', function( event ) {
	var ml = { timelines: {}};
	/*
	$('.ml1 .letters').each(function(){
	  $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
	});
	*/
	d3.selectAll('.ml1 .letters').each(function(d) {
	    d3.select(this).html( d3.select(this).html().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>") );
	})
	ml.timelines["ml1"] = anime.timeline({loop: true})
	  .add({
	    targets: '.ml1 .letter',
	    scale: [0.3,1],
	    opacity: [0,1],
	    translateZ: 0,
	    easing: "easeOutExpo",
	    duration: 600,
	    delay: function(el, i) {
	      return 70 * (i+1)
	    }
	  }).add({
	    targets: '.ml1 .line',
	    scaleX: [0,1],
	    opacity: [0.5,1],
	    easing: "easeOutExpo",
	    duration: 700,
	    offset: '-=875',
	    delay: function(el, i, l) {
	      return 80 * (l - i);
	    }
	  }).add({
	    targets: '.ml1',
	    opacity: 0,
	    duration: 1000,
	    easing: "easeOutExpo",
	    delay: 1000
	  });
	console.log('text anim added')
} );


Reveal.addEventListener( 'fragmentshown', function( event ) {
	var cssProperties = anime({
	  targets: '.skill-cursor',
	  width: '75%',
	  easing: 'easeInOutQuad',
	  duration: 3000
	});
	console.log('anim added')
} );

Reveal.addEventListener( 'fragmenthidden', function( event ) {
	var cssProperties = anime({
	  targets: '.skill-cursor',
	  width: '0%',
	  easing: 'easeInOutQuad'
	});
	console.log('anim hidden')
} );