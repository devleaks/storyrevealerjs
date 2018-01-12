/*!
 * storyrevealer.js
 * MIT licensed
 *
 * Copyright (C) 2017 Pierre M
 */

var RevealJSAnimation = window.RevealJSAnimation || (function(){
	var _animations = {}
	var _id_counter = 0
	var _colors = [
		"#1abc9c",
		"#2ecc71",
		"#3498db",
		"#9b59b6",
		"#34495e",
		"#16a085",
		"#27ae60",
		"#2980b9",
		"#8e44ad",
		"#2c3e50",
		"#f1c40f",
		"#e67e22",
		"#e74c3c",
		"#ecf0f1",
		"#95a5a6",
		"#f39c12",
		"#d35400",
		"#c0392b",
		"#bdc3c7",
		"#7f8c8d"
	]
	var _templates = {
		"countup": "",
		"countup-table": "<table class='counter-table'>{{#skills}}<tr><td>{{name}}</td><td><span data-animation='countup' data-countup='0,{{value}},1,2000'>{{value}}</span></td></tr>{{/skills}}</table>",
		"progress-bar": "<div data-animation='progress-bar' data-progress-bar-name='{{name}}' data-progress-bar-value='{{value}}'><div class='progress-bar-name'>{{name}}</div>{{#description}}<div class='progress-bar-desc'>{{description}}</div>{{/description}}<span class='progress-bar'></span></div>",
		"progress-bar-table": "<div class='progress-bar-table'>{{#skills}}<div class='right' data-animation='progress-bar' data-progress-bar-name='{{name}}' data-progress-bar-value='{{value}}'><div class='progress-bar-name'>{{name}}</div>{{#description}}<div class='progress-bar-desc'>{{description}}</div>{{/description}}<span class='progress-bar'></span></div>{{/skills}}</div>",	
	}
	
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
		},
		id: function() {
			return _id_counter
		},
		generateId: function() {
			return 'a'+(_id_counter++)
		},
		color: function() {
			return _colors[_id_counter % _colors.length]
		},
		play_animations: function(container) {
			if(container.getAttribute('data-animation')) { // play animation on current element, if any
				var id = container.getAttribute("id")
				RevealJSAnimation.restart(id)
				//console.log("RevealJSAnimation::play_animation::container", id)
			}
			/*	The following selector IS NOT CORRECT. we should only search for animation but without .fragment style
				correct algorithm need to bring in jquery (See: https://github.com/hakimel/reveal.js/issues/833)
				so we'll stick to this for now
			*/
			var animations = container.querySelectorAll("*[data-animation]")
			for (var i = 0; i < animations.length; i++ ) {
				var animation = animations[i]
				var id = animation.getAttribute("id")
				RevealJSAnimation.restart(id)
				//console.log("RevealJSAnimation::play_animations", id)
			}
		}
	}
})()	

// Install all animations without starting them
Reveal.addEventListener( 'ready' , function( event ) {
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
				//console.log('anim added', 'countup', id)

				})()
				break

			case "progress-bar": (function() {
				console.log(animation)
				var duration = animation.dataset['progress-bar-duration'] || 3000

				var timeline = anime.timeline().add({ // animation of bar
				  targets: '#'+id+" span.progress-bar",
				  width: animation.dataset['progress-bar-value']+'%',
				  'background-color': RevealJSAnimation.color(),
				  opacity: 1,
				  easing: 'easeInOutQuad',
				  autoplay: false,
				  duration: duration
				})

				var counter_display = document.querySelector('#'+id+" span.progress-bar-value")
				if(counter_display) {
					var myObject = {
						target: counter_display,
						counter: 0
					}
					timeline.add({	// animation of value
						targets: myObject,
						counter: animation.dataset['progress-bar-value'],
						round: 1,
						easing: 'easeInOutQuad',
						offset: '-='+duration,
						duration: duration,
						update: function() {
							 myObject.target.innerHTML = myObject.counter;
						}
					})
				}

 				RevealJSAnimation.register(id, timeline)
				//console.log('anim added', 'progress-bar', id)

				})()
				break

			case "moving-letters":
			default:
				console.log('ready::install animations::animation type not found', animation)
				break
		}
	}
} );

// Play animations on new slide
Reveal.addEventListener( 'slidechanged' , function( event ) {
	console.log('slidechanged::play_animations')	
	RevealJSAnimation.play_animations(Reveal.getCurrentSlide())
} );

// Play animations on new fragment shown
Reveal.addEventListener( 'fragmentshown' , function( event ) {
	console.log('fragmentshown::play_animations')	
	RevealJSAnimation.play_animations(event.fragment)
} );
