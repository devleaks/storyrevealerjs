/*!
 * storyrevealer.js
 * MIT licensed
 *
 * Copyright (C) 2017 Pierre M
 */
function isolateLetters(selector) {
	var done = d3.select(selector)
	if(! done.attr('data-spaced') ) {
		d3.selectAll(selector).each(function(d) {
		    d3.select(this).html( d3.select(this).html().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>") );
		})
		done.attr('data-spaced', true)
		console.log('isolateLetters', selector)
	}
}

var ml = { timelines: {}};

Reveal.addEventListener( 'fragmentshown', function( event ) {
	if ( event.fragment.dataset.animation != undefined ) {
		var animation = event.fragment.dataset.animation
		if(! ml.timelines[animation]) {
			switch(animation) {
				case 'thursday':
				/* template:
			    <h1 class="ml1">
					<span class="text-wrapper">
					<span class="line line1"></span>
					<span class="letters">THURSDAY</span>
					<span class="line line2"></span>
					</span>
				</h1>
				*/
					isolateLetters('.ml1 .letters')
					ml.timelines[animation] = anime.timeline({loop: true})
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
					break;
				case "slow-mornings":
				/*
				<h1 class="ml2">Sunny mornings</h1>
				*/
					isolateLetters('.ml2')
					ml.timelines["ml2"] = anime.timeline({loop: true})
					  .add({
					    targets: '.ml2 .letter',
					    scale: [4,1],
					    opacity: [0,1],
					    translateZ: 0,
					    easing: "easeOutExpo",
					    duration: 950,
					    delay: function(el, i) {
					      return 70*i;
					    }
					  }).add({
					    targets: '.ml2',
					    opacity: 0,
					    duration: 1000,
					    easing: "easeOutExpo",
					    delay: 1000
					  })
					break
				case "great-thinker":
				/*
				<h1 class="ml3">Great Thinkers</h1>
				*/
					isolateLetters('.ml3')
					ml.timelines["ml3"] = anime.timeline({loop: true})
					  .add({
					    targets: '.ml3 .letter',
					    opacity: [0,1],
					    easing: "easeInOutQuad",
					    duration: 2250,
					    delay: function(el, i) {
					      return 150 * (i+1)
					    }
					  }).add({
					    targets: '.ml3',
					    opacity: 0,
					    duration: 1000,
					    easing: "easeOutExpo",
					    delay: 1000
					  })
				
				default:
					console.log('text anim not found', animation)
					break;
			}
			console.log('text anim added', animation)
		} else {
			ml.timelines[animation].play()
			console.log('text anim started', animation)
		}
	}
} );

Reveal.addEventListener( 'fragmenthidden', function( event ) {
	if ( event.fragment.dataset.animation != undefined ) {
		var animation = event.fragment.dataset.animation
		if(ml.timelines[animation]) {
			ml.timelines[animation].pause()
			console.log('text anim stopped', animation)
		}
	}
} );