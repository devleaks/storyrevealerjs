/*!
 * storyrevealer.js
 * MIT licensed
 *
 * Copyright (C) 2017 Pierre M
 */

var StoryrevealerAnimation = window.StoryrevealerAnimation || (function(){
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
			console.log("StoryrevealerAnimation::register", name)			
			return anim
		},
		deregister: function(name) {
			delete _animations[name]
			//console.log("StoryrevealerAnimation::deregister", name)			
		},
		exists: function(name) {
			return typeof _animations[name] != "undefined"
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
		color: function() {
			return _colors[_id_counter % _colors.length]
		},
		play_animations: function(container) {
			if(! container) return;
			if(container.getAttribute('data-animation')) { // play animation on current element, if any
				var id = container.getAttribute("id")
				StoryrevealerAnimation.restart(id)
				console.log("StoryrevealerAnimation::play_animation::container", id)
			}
			/*	The following selector IS NOT CORRECT. we should only search for animation but without .fragment style
				correct algorithm need to bring in jquery (See: https://github.com/hakimel/reveal.js/issues/833)
				so we'll stick to this for now
			*/
			var animations = container.querySelectorAll("*[data-animation]")
			for (var i = 0; i < animations.length; i++ ) {
				var animation = animations[i]
				var id = animation.getAttribute("id")
				StoryrevealerAnimation.restart(id)
				console.log("StoryrevealerAnimation::play_animations", id)
			}
		},
		pause_animations: function(container) {
			if(! container) return;
			if(container.getAttribute('data-animation')) { // play animation on current element, if any
				var id = container.getAttribute("id")
				StoryrevealerAnimation.pause(id)
				console.log("StoryrevealerAnimation::pause_animation::container", id)
			}
			/*	The following selector IS NOT CORRECT. we should only search for animation but without .fragment style
				correct algorithm need to bring in jquery (See: https://github.com/hakimel/reveal.js/issues/833)
				so we'll stick to this for now
			*/
			var animations = container.querySelectorAll("*[data-animation]")
			for (var i = 0; i < animations.length; i++ ) {
				var animation = animations[i]
				var id = animation.getAttribute("id")
				StoryrevealerAnimation.pause(id)
				console.log("StoryrevealerAnimation::pause_animations", id)
			}
		},
		id: function() {
			return _id_counter
		},
		generateId: function() {
			return 'a'+(_id_counter++)
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
			id = StoryrevealerAnimation.generateId()
			animation.setAttribute("id", id)
			//console.log('ready::*[data-animation]: generated id', animation_type, id)
		}
		
		switch(animation_type) {

			case "countup": (function() { // start each anim in its own context
				var values = animation.dataset.countup.split(',')
				console.log('countup', values)
				var myObject = {
					target: animation,
					counter: values[0]
				}
				StoryrevealerAnimation.register(id, anime({
					targets: myObject,
					counter: values[1],
					round: values[2],	// used as value = Math.round(value * round) / round;
					easing: 'easeInOutQuad',
					duration: values[3],
//					autoplay: false,
					update: function() {
						 myObject.target.innerHTML = myObject.counter;
					}
				}))

				})()
				break

			case "progress-bar": (function() {
				var pbparams = animation.dataset['progress-bar'] || '0,100,100,3000' // default 0 to 100%
				var pbpararr = pbparams.split(',')
				if(pbpararr[2] == 0) pbpararr[2] = 1 // convert start->end into %-start,%end
				var start_val = Math.round(100 * pbpararr[0]/pbpararr[2])
				var end_val   = Math.round(100 * pbpararr[1]/pbpararr[2])
				var duration = pbpararr[3] || 3000

				console.log('params', pbpararr, start_val, end_val, duration, )
				var timeline = anime.timeline().add({ // animation of bar
				  targets: '#'+id+" span.progress-bar",
				  width: [start_val+'%',end_val+'%'],
				  backgroundColor: [StoryrevealerAnimation.color(),StoryrevealerAnimation.color()],
				  easing: 'easeInOutQuad',
				  autoplay: false,
				  duration: duration
				})

				var counter_display = document.querySelector('#'+id+" span.progress-bar-value")
				if(counter_display) { // add displayed value if templates has it
					var myObject = {
						target: counter_display,
						counter: pbpararr[0]
					}
					timeline.add({	// animation of value
						targets: myObject,
						counter: pbpararr[1],
						round: 1,
						easing: 'easeInOutQuad',
						offset: '-='+duration,
						duration: duration,
						update: function() {
							 myObject.target.innerHTML = myObject.counter;
						}
					})
				}

 				StoryrevealerAnimation.register(id, timeline)
				//console.log('anim added', 'progress-bar', id)

				})()
				break

			case "moving-letters":
				MovingLetters.install_animation(animation)
				break
				
			default:
				console.log('ready::install animations::animation type not found', animation)
				break
		}
	}
} );

// Play animations on new slide
Reveal.addEventListener( 'slidechanged' , function( event ) {
	StoryrevealerAnimation.play_animations(Reveal.getCurrentSlide())
	StoryrevealerAnimation.pause_animations(Reveal.getPreviousSlide())
	console.log('slidechanged::play_animations')	
} );

// Play animations on new fragment shown
Reveal.addEventListener( 'fragmentshown' , function( event ) {
	StoryrevealerAnimation.play_animations(event.fragment)
	console.log('fragmentshown::play_animations')	
} );

Reveal.addEventListener( 'animation' , function( event ) {
	console.log("Storyrevealer::animation", event)
} );