/*!
 * storyrevealer.js
 * MIT licensed
 *
 * Copyright (C) 2017 Pierre M
 */

var RevealJSAnimation = window.RevealJSAnimation || (function(){
	var _animations = {}
	var _id_counter = 0
	
	return {
		register: function(name, anim) {
			_animations[name] = anim
			console.log("RevealJSAnimation::register", name)
			return anim
		},
		play: function(name) {
			if(_animations[name]) {
				_animations[name].play()
				console.log("RevealJSAnimation::play", name)
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
		},
		generateId: function() {
			return 'a'+(_id_counter++)
		},
		play_animations: function(container) {
			if(container.getAttribute('data-animation')) {
				var id = container.getAttribute("id")
				RevealJSAnimation.restart(id)
				console.log("RevealJSAnimation::play_animation::container", id)
			}
			var animations = container.querySelectorAll("*[data-animation]")
			for (var i = 0; i < animations.length; i++ ) {
				var animation = animations[i]
				var id = animation.getAttribute("id")
				RevealJSAnimation.restart(id)
				console.log("RevealJSAnimation::play_animations", id)
			}
		}
	}
})()	

// Install all animations without starting them
Reveal.addEventListener( 'ready', function( event ) {
	var animations = document.querySelectorAll("*[data-animation]")
	for (var i = 0; i < animations.length; i++ ) {
		var animation = animations[i]
		var animation_type = animation.getAttribute("data-animation")
		var id = animation.getAttribute("id")
		if(! id) {
			id = RevealJSAnimation.generateId()
			animation.setAttribute("id", id)
			console.log('generated id', animation_type, id)
		}
		switch(animation_type) {
			case "countup": (function() { // start each anim in its own context
				var values = animation.dataset.countup.split(',')
				var myObject = {
					target: animation,
					counter: values[0]
				}
				RevealJSAnimation.register(id, anime({
					targets: myObject,
					counter: values[1],
					round: values[2],
					easing: 'easeInOutQuad',
					duration: values[3],
					autoplay: false,
					update: function() {
						 myObject.target.innerHTML = myObject.counter;
					}
				}))
				console.log('anim added', 'countup', id)

				})()
				break
			case "skill-cursor":
			case "moving-letters":
			default:
				console.log('ready::install animations::animation type not found', animation)
				break
		}
	}
} );

Reveal.addEventListener( 'slidechanged', function( event ) {
	RevealJSAnimation.play_animations(Reveal.getCurrentSlide())
} );

Reveal.addEventListener( 'fragmentshown', function( event ) {
	RevealJSAnimation.play_animations(event.fragment)
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