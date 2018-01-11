/*!
 * storyrevealer.js
 * MIT licensed
 *
 * Copyright (C) 2017 Pierre M
 */

var RevealJSAnimation = window.RevealJSAnimation || (function(){
	var _animations = {}
	
	return {
		register: function(name, anim) {
			_animations[name] = anim
			return anim
		},
		play: function(name) {
			if(_animations[name]) {
				_animations[name].play()
			}
		},
		pause: function(name) {
			if(_animations[name]) {
				_animations[name].pause()
			}
		},
		restart: function(name) {
			if(_animations[name]) {
				_animations[name].restart()
			}
		},
		reverse: function(name) {
			if(_animations[name]) {
				_animations[name].reverse()
			}
		}
	}
})()	

function do_countup(container) {
	var counters = container.querySelectorAll("*[data-countup]")
	for (var i = 0; i < counters.length; i++ ) {
		console.log(counters[i])
		var values = counters[i].dataset.countup.split(',')
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
				 counters[i].innerHTML = myObject.counter;
			}
		})
		console.log('anim added', 'countup')
	}
}

Reveal.addEventListener( 'fragmentshown', function( event ) {
	do_countup(event.fragment)
} );

Reveal.addEventListener( 'slidechanged', function( event ) {
	do_countup(Reveal.getCurrentSlide())
} );



function do_skill_table(container, enable) {
	var colors = [ '#e00', '#0e0', '#00e' , '#ee0', '#e0e', '#0ee' ]
	var skillbars = container.querySelectorAll("div[data-skillname]")
	for (var i = 0; i < skillbars.length; i++ ){
		var skillName = skillbars[i].dataset.skillname
		var selector = '.skill[data-skillname="'+skillName+'"] span'
		if(enable) {
			var cssProperties = anime({
			  targets: selector,
			  width: skillbars[i].dataset.skillvalue+'%',
			  'background-color': colors[i % colors.length],
			  opacity: 1,
			  easing: 'easeInOutQuad',
			  duration: 3000
			});
			console.log('anim added', 'skill-cursor', selector, skillbars[i].dataset.skillvalue)
		} else {
			var cssProperties = anime({
			  targets: selector,
			  width: skillbars[i].dataset.skillvalue+'%',
			  'background-color': colors[i % colors.length],
			  opacity: 0,
			  easing: 'easeInOutQuad',
			  duration: 3000
			});
			console.log('anim added', 'skill-cursor', selector, skillbars[i].dataset.skillvalue)
		}
	}
}

Reveal.addEventListener( 'slidechanged', function( event ) {
	do_skill_table(Reveal.getCurrentSlide(), true)
} );

Reveal.addEventListener( 'fragmentshown', function( event ) {
	do_skill_table(event.fragment, true)
} );

Reveal.addEventListener( 'fragmenthidden', function( event ) {
	do_skill_table(event.fragment, false)
} );