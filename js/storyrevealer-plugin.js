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
	var colors = [ '#e00', '#0e0', '#00e' , '#ee0', '#e0e', '#0ee' ]
	var skillbars = Reveal.getCurrentSlide().querySelectorAll("div[data-skillname]")
	for (var i = 0; i < skillbars.length; i++ ){
		var skillName = skillbars[i].dataset.skillname
		var selector = '.skill[data-skillname="'+skillName+'"] span'
		var cssProperties = anime({
		  targets: selector,
		  width: skillbars[i].dataset.skillvalue+'%',
		  'background-color': colors[i % colors.length],
		  easing: 'easeInOutQuad',
		  duration: 3000
		});
		console.log('anim added', 'skill-cursor', selector, skillbars[i].dataset.skillvalue)
	}
} );

Reveal.addEventListener( 'fragmenthidden', function( event ) {
	var skillbars = Reveal.getCurrentSlide().querySelectorAll("div[data-skillname]")
	for (var i = 0; i < skillbars.length; i++ ){
		var skillName = skillbars[i].dataset.skillname
		var selector = '.skill-cursor[data-skillname="'+skillName+'"] span'
		var cssProperties = anime({
		  targets: selector,
		  width: '0%',
		  'background-color': '#000',
		  easing: 'easeInOutQuad',
		  duration: 100
		});
		console.log('anim reset', 'skill-cursor', selector, skillbars[i].dataset.skillvalue)
	}
} );