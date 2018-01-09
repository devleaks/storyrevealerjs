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
		console.log('anim added', 'countup')
	}
} );


Reveal.addEventListener( 'fragmentshown', function( event ) {
	if ( event.fragment.dataset.skill != undefined ) {
		var cssProperties = anime({
		  targets: '.skill-cursor',
		  width: '75%',
		  easing: 'easeInOutQuad',
		  duration: 3000
		});
		console.log('anim added', 'skill-cursor')
	}
} );

Reveal.addEventListener( 'fragmenthidden', function( event ) {
	if ( event.fragment.dataset.skill != undefined ) {
		var cssProperties = anime({
		  targets: '.skill-cursor',
		  width: '0%',
		  easing: 'easeInOutQuad'
		});
		console.log('anim hidden', 'skill-cursor')
	}
} );