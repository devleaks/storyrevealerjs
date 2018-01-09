/*!
 * storyrevealer.js
 * MIT licensed
 *
 * Copyright (C) 2017 Pierre M
 */
var MovingLetters = window.MovingLetters || (function(){
	var _ml = { timelines: { } };
	
	var TEMPLATES = {
		"thursday": "<h1 class='ml1'><span class='text-wrapper'><span class='line line1'></span><span class='letters'>{{0}}</span><span class='line line2'></span></span></h1>",
		"slow-mornings": "<h1 class='ml2'>{{0}}</h1>",
		"great-thinker": "<h1 class='ml3'>{{0}}</h1>",
		"ready": "<h1 class='ml4'><span class='letters letters-1'>{{0}}</span><span class='letters letters-2'>{{1}}</span><span class='letters letters-3'>{{2}}</span></h1>",
		"signal-and-noise": "<h1 class='ml5'><span class='text-wrapper'><span class='line line1'></span><span class='letters letters-left'>{{0}}</span><span class='letters ampersand'>&amp;</span><span class='letters letters-right'>{{1}}</span><span class='line line2'></span></span></h1>",
		"beautiful-question": "<h1 class='ml6'><span class='text-wrapper'><span class='letters'>{{0}}</span></span></h1>",
		"reality-is-broken": "",
		"hey": "",
		"coffee-morning": "",
		"domino-dreams": "",
		"hello-goodbye": "",
		"a-new-production": "",
		"rising-strong": "",
		"finding-your-element": "",
		"out-now": "",
		"made-with-love": ""
	}

	function install_template(container, animation) {
		var template = TEMPLATES[animation]
		var text = container.html()
		var newtext = Mustache.render(template, text.split(','))
		container.html(newtext)
	}

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
	
	return {
		install_animation: function(container) {
			var div = d3.select(container)
			var animation = div.attr('data-animation')
			var loop = true; // div.attr('data-animation-loop') === true

			if(! _ml.timelines[animation]) {
				var animation_code = null
				install_template(div, animation)

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
						animation_code = anime.timeline({loop: true})
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
						  })
						break


					case "slow-mornings":
					/*
					<h1 class="ml2">Sunny mornings</h1>
					*/
						isolateLetters('.ml2')
						animation_code = anime.timeline({loop: loop})
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
						animation_code = anime.timeline({loop: loop})
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
						break


					case "ready":
					/*
					<h1 class="ml4">
						<span class="letters letters-1">Ready</span>
						<span class="letters letters-2">Set</span>
						<span class="letters letters-3">Go!</span>
					</h1>
					*/
						var ml4 = {};
						ml4.opacityIn = [0,1];
						ml4.scaleIn = [0.2, 1];
						ml4.scaleOut = 3;
						ml4.durationIn = 800;
						ml4.durationOut = 600;
						ml4.delay = 500;

						animation_code = anime.timeline({loop: true})
						  .add({
						    targets: '.ml4 .letters-1',
						    opacity: ml4.opacityIn,
						    scale: ml4.scaleIn,
						    duration: ml4.durationIn
						  }).add({
						    targets: '.ml4 .letters-1',
						    opacity: 0,
						    scale: ml4.scaleOut,
						    duration: ml4.durationOut,
						    easing: "easeInExpo",
						    delay: ml4.delay
						  }).add({
						    targets: '.ml4 .letters-2',
						    opacity: ml4.opacityIn,
						    scale: ml4.scaleIn,
						    duration: ml4.durationIn
						  }).add({
						    targets: '.ml4 .letters-2',
						    opacity: 0,
						    scale: ml4.scaleOut,
						    duration: ml4.durationOut,
						    easing: "easeInExpo",
						    delay: ml4.delay
						  }).add({
						    targets: '.ml4 .letters-3',
						    opacity: ml4.opacityIn,
						    scale: ml4.scaleIn,
						    duration: ml4.durationIn
						  }).add({
						    targets: '.ml4 .letters-3',
						    opacity: 0,
						    scale: ml4.scaleOut,
						    duration: ml4.durationOut,
						    easing: "easeInExpo",
						    delay: ml4.delay
						  }).add({
						    targets: '.ml4',
						    opacity: 0,
						    duration: 500,
						    delay: 500
						  })
						break
						
						
					case "signal-and-noise":
					/*
				    <h1 class="ml5">
					  <span class="text-wrapper">
					    <span class="line line1"></span>
					    <span class="letters letters-left">Signal</span>
					    <span class="letters ampersand">&amp;</span>
					    <span class="letters letters-right">Noise</span>
					    <span class="line line2"></span>
					  </span>
					</h1>
					*/
						animation_code = anime.timeline({loop: true})
						  .add({
						    targets: '.ml5 .line',
						    opacity: [0.5,1],
						    scaleX: [0, 1],
						    easing: "easeInOutExpo",
						    duration: 700
						  }).add({
						    targets: '.ml5 .line',
						    duration: 600,
						    easing: "easeOutExpo",
						    translateY: function(e, i, l) {
						      var offset = -0.625 + 0.625*2*i;
						      return offset + "em";
						    }
						  }).add({
						    targets: '.ml5 .ampersand',
						    opacity: [0,1],
						    scaleY: [0.5, 1],
						    easing: "easeOutExpo",
						    duration: 600,
						    offset: '-=600'
						  }).add({
						    targets: '.ml5 .letters-left',
						    opacity: [0,1],
						    translateX: ["0.5em", 0],
						    easing: "easeOutExpo",
						    duration: 600,
						    offset: '-=300'
						  }).add({
						    targets: '.ml5 .letters-right',
						    opacity: [0,1],
						    translateX: ["-0.5em", 0],
						    easing: "easeOutExpo",
						    duration: 600,
						    offset: '-=600'
						  }).add({
						    targets: '.ml5',
						    opacity: 0,
						    duration: 1000,
						    easing: "easeOutExpo",
						    delay: 1000
						  })
						break

					
					case "beautiful-question":
					/*
					<h1 class="ml6">
					  <span class="text-wrapper">
					    <span class="letters">Beautiful Questions</span>
					  </span>
					</h1>
					*/
						isolateLetters('.ml6 .letters')
						animation_code = anime.timeline({loop: loop})
						  .add({
						    targets: '.ml6 .letter',
						    translateY: ["1.2em", 0],
						    translateZ: 0,
						    duration: 750,
						    delay: function(el, i) {
						      return 50 * i;
						    }
						  }).add({
						    targets: '.ml6',
						    opacity: 0,
						    duration: 1000,
						    easing: "easeOutExpo",
						    delay: 1000
						  })
						break
					
					
					case "reality-is-broken":
					/*
					<h1 class="ml7">
					  <span class="text-wrapper">
					    <span class="letters">Reality is broken</span>
					  </span>
					</h1>
					*/
						animation_code = anime.timeline({loop: true})
						  .add({
						    targets: '.ml7 .letter',
						    translateY: ["1.1em", 0],
						    translateX: ["0.55em", 0],
						    translateZ: 0,
						    rotateZ: [180, 0],
						    duration: 750,
						    easing: "easeOutExpo",
						    delay: function(el, i) {
						      return 50 * i;
						    }
						  }).add({
						    targets: '.ml7',
						    opacity: 0,
						    duration: 1000,
						    easing: "easeOutExpo",
						    delay: 1000
						  });
						break
					
					
					
					case "hey":
					/*
					*/
					
					
					
					case "coffee-morning":
					/*
					*/
					
					
					
					case "domino-dreams":
					/*
					*/
					
					
					
					case "hello-goodbye":
					/*
					*/
					
					
					
					case "a-new-production":
					/*
					*/
					
					
					
					case "rising-strong":
					/*
					*/
					
					
					
					case "finding-your-element":
					/*
					*/
					
					
					
					case "out-now":
					/*
					*/
					
					
					
					case "made-with-love":
					/*
					*/
					
					
					
					
					default:
						console.log('text anim not found', animation)
						break;
				}
				if(animation_code) {
					_ml.timelines[animation] = animation_code
					console.log('moving letters installed', animation)
				}
			} else {
				_ml.timelines[animation].play()
				console.log('text anim started', animation)
			}
		}
		,
	
		play: function(animation) {
			if(_ml.timelines[animation]) {
				_ml.timelines[animation].play()
				console.log('text anim started', animation)
			}
		},
	
		pause: function(animation) {
			if(_ml.timelines[animation]) {
				_ml.timelines[animation].pause()
				console.log('text anim stopped', animation)
			}
		}

	}

})();