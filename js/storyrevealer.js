/*!
 * storyrevealer.js
 * MIT licensed
 *
 * Copyright (C) 2017 Pierre M
 */
(function( root, factory ) {
	if( typeof define === 'function' && define.amd ) {
		// AMD. Register as an anonymous module.
		define( function() {
			root.Storyrevealer = factory()
			return root.Storyrevealer
		} )
	} else if( typeof exports === 'object' ) {
		// Node. Does not work with strict CommonJS.
		module.exports = factory()
	} else {
		// Browser globals.
		root.Storyrevealer = factory()
	}
}( this, function() {

	'use strict'

	var Storyrevealer

	// The Storyrevealer.js version
	var VERSION = '1.0.0'
	
	var CONTENT_TYPE_ELEM = {
		"above-title": "h3.allcaps",
		"below-title": "h4",
		"byline": "h6",
		"bytitle": "h3",
		"date": "p",
		"editor": "h6",
		"headline": "h1",
		"name": "h1",
		"quote": "q",
		"teaser": "h3.red",
		"text": "p",
		"text1": "p",
		"text2": "p",
		"text3": "p",
		"title": "h1",
		"under-title": "h4",
		"copyright": "small"
	}

	var CONTENT_TYPE_DATA = [
		"data-background-color",
		"data-background-iframe"
	]

	var PATTERNS = [
		"plus",
		"cross",
		"dash",
		"cross-dash",
		"dot",
		"dot-dash",
		"disc",
		"ring",
		"line",
		"line-vertical",
		"weave",
		"zigzag",
		"zigzag-vertical",
		"diagonal",
		"diagonal-right-left",
		"square",
		"box",
		"triangle",
		"triangle-inverted",
		"diamond",
		"diamond-box"
	]

	var MOVING_LETTERS = [
		"thursday",
		"slow-mornings",
		"great-thinker",
		"ready",
		"signal-and-noise",
		"beautiful-question",
		"reality-is-broken",
		"hey",
		"coffee-morning",
		"domino-dreams",
		"hello-goodbye",
		"a-new-production",
		"rising-strong",
		"finding-your-element",
		"out-now",
		"made-with-love"
	]

	var CLEAN_HTML = {
	  allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'div', 'p', 'br', 'span', 'h1', 'h2', 'h3', 'h4', 'h5' ], // 'h6' added as Storyrevealer option for testing purpose
	  allowedAttributes: {
	    'a': [ 'href' ],
//		'div': [ 'class', 'data-background-src' ],
//		'p': [ 'class', 'data-countup', 'data-fragment-index' ],
		'*': [ 'class', 'data-*' ]
	  }
	}
	
	var _COLORS = [
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

	var _TRANSPARENCY = 0.6

	var _colors = []
	
	var _inited = false
	var _config = {}
	var _navigation = null
	var _slide_h = 0
	var _slide_v = 0
	var _slideTitles = []
	var _currentStory = -1
	var _title_found = false
	var _horizontalNav = false
	
	/*	Used before. Will probably come back...
	 *
	 */
	function init(moreconfig) {
		if (_inited && (moreconfig && !moreconfig.force)) {
            return;
        }
		// Transparent colors
		function hexToRgb(hex) {
		    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
		    return result ? {
		        r: parseInt(result[1], 16),
		        g: parseInt(result[2], 16),
		        b: parseInt(result[3], 16)
		    } : null
		}
		_colors = _COLORS.map(function(hex){ var c = hexToRgb(hex); return "rgba("+c.r+","+c.g+","+c.b+","+_TRANSPARENCY+")" })
		
		/*
		* Recursively merge properties of two objects **without overwriting the first**.
		* Concatenate arrays if it is present in both object
		*/
		function mergeRecursive(obj1, obj2) {
		  for (var p in obj2) {
		    try { // Property in destination object set; update its value.
		      if ( obj2[p].constructor==Object ) {
		        obj1[p] = mergeRecursive(obj1[p], obj2[p])
		      } else if ( Array.isArray(obj2[p]) ) {
				if(Array.isArray(obj1[p])) { // both are arrays: concatenating...
			      obj1[p] = obj1[p].concat(obj2[p])
				} else if(!obj1[p]) { // source does not exist, creating it...
			      obj1[p] = obj2[p]
				} else { // source is not array and target is array: problem: do nothing
				  console.log('Storyrevealer::init::mergeRecursive: warning non matching objects types', p)
				}
			  } else{
		        if (!obj1[p]) {
                    obj1[p] = obj2[p];
                }
		      }
		    } catch(e) { // Property in destination object not set; create it and set its value.
		      if (!obj1[p]) {
                  obj1[p] = obj2[p];
              }
		    }
		  }
		  return obj1;
		}
		
		var config = Reveal.getConfig().storyrevealer;
		if(moreconfig) {	// moreconfig takes precendence over config
			config = mergeRecursive(moreconfig, config)
		}											// (new) config takes precedence over (existing) _config
		_config = mergeRecursive(config, _config)	// does not overwrite what is in first obj1 = config
		
		//console.log('Storyrevealer::init: _config', _config)

		// Merging config
		if(config.mappings) {
			CONTENT_TYPE_ELEM = mergeRecursive(CONTENT_TYPE_ELEM, config.mappings)
			//console.log('CONTENT_TYPE_ELEM', CONTENT_TYPE_ELEM)
		}
		
		if(config.html) {
			CLEAN_HTML = mergeRecursive(CLEAN_HTML, config.html)
			//console.log('CLEAN_HTML', CLEAN_HTML)
		}
				
		// Add anything plugin setup
		Reveal.configure({
			anything: [ 
				{
					className: "mustache", 
					initialize: (function(container, options){
						//console.log("anything mustache", options, container)
						if(options) {
							container.innerHTML = Mustache.render(options.template, options.data)
						}
					})
				},
				{
					className: "chart",  
					initialize: (function(container, options) {
						var ctx = container.getContext("2d")
						
						function isValidColor(color) {
						    if (color.charAt(0) === "#") {
						        color = color.substring(1)
						        return [3, 4, 6, 8].indexOf(color.length) > -1 && !isNaN(parseInt(color, 16))
						    } else { // ^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))$
						        return /^(rgb|hsl)a?\((\d+%?(deg|rad|grad|turn)?[,\s]+){2,3}[\s\/]*[\d\.]+%?\)$/i.test(color)
						    }
						}
						
						function makeGradient(data) {
							var gradient = (data.type == "radial") ?
								ctx.createRadialGradient(data.x0[0], data.x0[1], data.r0, data.x1[0], data.x1[1], data.r1)
								:
								ctx.createLinearGradient(data.x0[0], data.x0[1], data.x1[0], data.x1[1])
							data.stops.forEach(function(stop) {
								gradient.addColorStop(stop.stop, stop.color)  
							})
							//console.log(data, typeof gradient)
							return gradient ? gradient : data
						}
						
						function makePattern(data) {
							var patrn
							if(data.image) {
								var img = new Image();
								img.src = data.image
								patrn = ctx.createPattern(img, data.repetition)
							} else { // patternomaly
								patrn = pattern.draw(data.shape, data.color);
							}
							//console.log(data, typeof patrn)
							return patrn ? patrn : data
						}
						
						// little function to loop through all options and replace some color with pattern or gradient
						function iterate(obj) {
							var ValidColors = ["color","backgroundColor","fillColor"], color;
 					        for (var property in obj) {
					            if (obj.hasOwnProperty(property)) {
					                if (typeof obj[property] == "object") {
										if(ValidColors.indexOf(property) > -1) { // object name appends to be "color"-like
											if(Array.isArray(obj[property])) {
												for(var i = 0; i < obj[property].length; i += 1) {
													color = obj[property][i]
									                if (typeof color == "object") {
														if(color.type) {
															switch(color.type) {
																case "gradient":
																	obj[property][i] = makeGradient(color.data)
																	break
																case "pattern":
																	obj[property][i] = makePattern(color.data)
																	break
															}
														}
									                }
												}
											} else {
												color = obj[property]
												if(color.type) {
													switch(color.type) {
														case "gradient":
															obj[property] = makeGradient(color.data)
															break
														case "pattern":
															obj[property] = makePattern(color.data)
															break
													}
												}
											}
										} else {// not a color, loop through it
						                    iterate(obj[property]);
										}
									}
					            }
					        }
					    }
						
						if(options) {
							iterate(options)
							container.chart = new Chart(ctx, options)
						}
					})
				},
				{
					className: "chartist",
					initialize: (function(container, options) {
						//console.log("anything chartist", options, container)
						if(options) {
							var f = null;
							switch(options.type) {
								case "bar": f = Chartist.Bar; break;
								case "pie": f = Chartist.Pie; break;
								case "line": f = Chartist.Line; break;
							}
							if(f) {
								var o = options.options || {}
								if(o.sr_legend_options) {
									o.plugins = o.plugins || []
									if(o.sr_legend_options === true) {
										o.plugins.push(Chartist.plugins.legend())
										console.log("chartist-plugin-legend installed")
									} else {
										o.plugins.push(Chartist.plugins.legend(o.sr_legend_options))
										console.log("chartist-plugin-legend installed", o.sr_legend_options)
									}
								}
								new f(
									container,
									options.data,
									options.options,
									options.responsiveOptions
								)
							} else {
								console.log("anything: chartists: no graph type "+options.type, options)
							}
						}
					})
				} // chartist

			] // anything
		}) // Reveal.configure
				
		
		_navigation = document.querySelector(".side-dot-navigation")
		if(_navigation) {	// first make sure side or bottom style is present
			if (! _navigation.classList.contains('bottom') && ! _navigation.classList.contains('side')) {
                _navigation.classList.add('side');
            }
			_navigation.appendChild(document.createElement("ul"))
			_navigation = document.querySelector(".side-dot-navigation ul")
		}
		

		_inited = true
		console.log("Storyrevealer "+VERSION)
		
		if(_config.url) {
			initialize(_config.url)
		} else {
			console.log("Storyrevealer::init: no url")
		}
	}

	
	/*	Sanitize HTML string according to CLEAN_HTML config
	 *
	 */
	function cleanHTML(str) {
		return sanitizeHtml(str, CLEAN_HTML)
	}
	
	
	/*	Tries to retrieve a title for the slide from content
	 *
	 */
	function getTitle(data) {
		var whereToLook = ["title", "headline", "name", "h1", "h2", "h3", "text"]
		var prec = whereToLook.length
		var title = null;
		for (var content in data) {
		    if (data.hasOwnProperty(content)) {
				var xtra_classes_arr = content.split(".")
				var content_type = xtra_classes_arr.shift()
				var pos = whereToLook.indexOf(content_type)
				if(pos > -1 && pos < prec && data[content]) {
					title = Array.isArray(data[content]) ? data[content].join('.') : data[content]
					if(xtra_classes_arr.indexOf('html') > -1) { // extra clean html
						title = sanitizeHtml(title, {allowedTags: [], allowedAttributes: {} })
					}
					prec = pos
				}
			}
		}
		//console.log("Storyrevealer::getTitle", data, title)
		return title ? title : 'No title '+_slide_h+'/'+_slide_v+'.'
	}
	
	/*	When changing stories, reset dot navigation for current story (idx)
	 *
	 */
	function resetDotNav(idx) {
		var li;
		if (!_navigation || isNaN(idx) || idx > _slideTitles.length || idx == _currentStory) {
            return;
        }

		_navigation.innerHTML = ''
		if(_horizontalNav) {
			for(var i = 0; i < _slideTitles.length; i += 1) {			
				li = document.createElement("li")
				li.setAttribute("title", _slideTitles[i][0])
				li.setAttribute("data-slide-h", i)
				li.setAttribute("data-slide-v", 0)
				li.addEventListener("click", navigate)			
				_navigation.appendChild(li)
			}
		} else {
			for(var i = 0; i < _slideTitles[idx].length; i += 1) {			
				li = document.createElement("li")
				li.setAttribute("title", _slideTitles[idx][i])
				li.setAttribute("data-slide-h", idx)
				li.setAttribute("data-slide-v", i)
				li.addEventListener("click", navigate)			
				_navigation.appendChild(li)
			}
		}
		_currentStory = idx
		//console.log('Storyrevealer::resetDotNav:done', idx, _slideTitles[idx].length)
	}


	/*	Click event handler for dot navigation
	 *
	 */
	function navigate(e) {
		var o = document.querySelector('.side-dot-navigation ul li.active')
		if (o) {
            o.classList.remove('active');
        }
		e.currentTarget.classList.add('active')
		var h = e.currentTarget.getAttribute("data-slide-h")
		var v = e.currentTarget.getAttribute("data-slide-v")
		//console.log("clicked", h, v)
		Reveal.slide(h, v)
	}


	/*	Generate <table> element and fill it 
	 *
	 */
	function generateTable(table_data) {
		var table = document.createElement("table")
		var options = table_data.options || {}
		var data = table_data.data
		
		for(var row = 0; row < data.length; row += 1) {
			var tr;
			if(row == 0 && options.columnheader) { //@todo: make columnheader is the count of column headers?
				tr = document.createElement("thead")
			} else if ((row == (data.length - 1)) && options.columnfooter) {
				tr = document.createElement("tfoot")
			} else {
				tr = document.createElement("tr")
			}
			
			for(var col = 0; col < data[row].length; col += 1) {
				var td = (row == 0 && options.columnheader) ? document.createElement("th") : document.createElement("td")				
				if (col == 0 && options.rowheader) {
					td.classList.add("rowheader")				
				} else if ((col == (data[row].length - 1)) && options.rowfooter) {
					td.classList.add("rowfooter")
				}
				td.innerHTML = cleanHTML(data[row][col])
				tr.appendChild(td)	
			}
			
			table.appendChild(tr)
		}
		return table
	}


	/* 	Generate chart object for each chart type
	 *
	 */
	function generateChart(container, chart_data) {
		var data = chart_data.data
		var columns = []
		var categories = []
		var colors = []

		var chart = {
			type: chart_data.type,
			options: chart_data.options,
			data: {}
		}

		var counter = 0
		
		switch(chart.type) {
			case "line":
				chart.data.labels = chart.data.labels || []
				data.forEach(function(line) {
					categories.push(line.shift())
					columns[counter] = line
					colors.push(_colors[((counter += 1)) % _colors.length])
				})

				chart.data.datasets = []
				counter = 0
				columns.forEach(function(column) {
					chart.data.datasets.push({
						data: column,
						label: categories[counter],
						backgroundColor: _colors[(counter) % _colors.length]
					})
					counter += 1
				})
				
				if(chart_data.labels) {
					chart.data.labels = chart_data.labels
				} else {
					chart.data.labels = []
					for(var i = 1; i <= chart.data.datasets[0].data.length; i += 1) {
						chart.data.labels.push('Set '+i)
					}
				}
				
				break
			case "pie":
			case "bar":
				data.forEach(function(line) { // need to "transpose" data array
					categories.push(line[0])
					for(var i = 1; i < data[0].length; i += 1) {
						columns[i-1] = columns[i-1] || []
						columns[i-1].push(line[i])
						colors.push(_colors[((counter += 1)) % _colors.length])
					}
				})

				chart.data.labels = categories
				chart.data.datasets = []
				counter = 1
				columns.forEach(function(column) {
					chart.data.datasets.push({
						data: column,
						label: chart_data.labels ? chart_data.labels[counter-1] : 'Set '+counter,
						backgroundColor: (chart.type == "pie") ? colors : _colors[(counter) % _colors.length]
					})
					counter += 1
				})
				break
		}

		return chart
	}
	
	
	/* 	Generate chartist object for each chart type
	 *
	 */
	function generateChartist(chart_data, chart_type) {
		//console.log("generateChartist::begin", chart_type, chart_data)
		var chart = {}
		chart.type = chart_type
		chart.options = {}
		var data = chart.data = {}
		switch(chart_type) {
			case "line":
				data.labels = [];
				data.legend = [];
				data.series = [];
				var i = 1
				chart_data.data.forEach(function(d) {
					data.legend.push(d.shift())
					data.labels.push(i += 1)
					data.series.push(d)
				})
				chart.options.sr_legend_options = {
					legendNames: data.legend
				}
				break
			case "pie":
				data.labels = [];
				data.series = [];
				chart_data.data.forEach(function(d) {
					data.labels.push(d.shift())
					data.series.push(d.shift())
				})
				break
			case "bar":
				data.labels = [];
				data.series = [];
				var columns = []
				chart_data.data.forEach(function(line) {
					data.labels.push(line.shift())
					var i = 0
					line.forEach(function(c) {
						data.series[i] = data.series[i] || []
						data.series[i].push(c)
						i += 1
					})
				})
				break
		}
		chart.options.chartPadding = 30
		
		//console.log("generateChartist::end", chart_type, chart)
		return chart;
	}


	/*
	 *
	 */
	function addClasses(container, classes) {
		var list = Array.isArray(classes) ? classes : classes.split(" ")
		list.forEach(function(c) {
			container.classList.add(c)
		})
	}


	/**
	 * Get the closest matching element up the DOM tree.
	 * @private
	 * @param  {Element} elem     Starting element
	 * @param  {String}  selector Selector to match against
	 * @return {Boolean|Element}  Returns null if not match found
	 */
	var getClosest = function ( elem, selector ) {

		// Element.matches() polyfill
		if (!Element.prototype.matches) {
			Element.prototype.matches =
				Element.prototype.matchesSelector ||
				Element.prototype.mozMatchesSelector ||
				Element.prototype.msMatchesSelector ||
				Element.prototype.oMatchesSelector ||
				Element.prototype.webkitMatchesSelector ||
				function(s) {
					var matches = (this.document || this.ownerDocument).querySelectorAll(s),
						i = matches.length;
					while ((i -= 1) >= 0 && matches.item(i) !== this) {}
					return i > -1;
				};
		}

		// Get closest match
		for ( ; elem && elem !== document; elem = elem.parentNode ) {
			if (elem.matches( selector )) {
				console.log("Storyrevealer::getClosest: found", elem)
                return elem;
            }
		}

		return null;

	};

	/*	Append HTML formatted data content to supplied element
	 *
	 */
	function addContent(elem, data) {
		for (var content in data) {
		    if (data.hasOwnProperty(content)) {
			
				if( CONTENT_TYPE_DATA.indexOf(content) > -1 ) { // content type is in format data-attr and whitelisted in CONTENT_TYPE_DATA

					elem.setAttribute(content, data[content])

				} else if ( MOVING_LETTERS.indexOf(content) > -1 ) {

					var anim = document.createElement("div")
					anim.classList.add("moving-letters")
					anim.setAttribute
					anim.setAttribute("data-animation", "moving-letters")
					anim.setAttribute("data-moving-letters", content)
					anim.setAttribute("data-animation-loop", true)
					anim.innerHTML = data[content]
					elem.appendChild(anim)

				} else { // content type is in format title.bold.reverse
			
					var xtra_classes_arr = content.split(".")
					var content_type = xtra_classes_arr.shift()

					if( CONTENT_TYPE_ELEM.hasOwnProperty(content_type) ) { // direct mapping first, eg: title: h1.someclass ==> "title.otherclass": "text"  ==>  <h1 class="someclass otherclass">text</h1>
				
						var html_raw = CONTENT_TYPE_ELEM[content_type];
						var html_arr = html_raw.split(".")
						var html_elem = html_arr.shift()
						
						// content is either a single string or an array of strings displayed one after the other
						var str_arr = Array.isArray(data[content]) ? data[content] : [ data[content] ]
					
						str_arr.forEach(function(str) {
							var container = document.createElement(html_elem)
							elem.appendChild(container)
							addClasses(container, html_arr)		
							addClasses(container, xtra_classes_arr)		

							if(xtra_classes_arr.indexOf("html") > -1) {
								container.innerHTML = cleanHTML(str)
							} else {
								container.innerHTML = str
							}
						})
							
					} else { // complex content

						switch(content_type) {

							case "content": // older structure for json, still works!
								var page = data[content]
								if(Array.isArray(page)) { // more than one column
									var column_elem = document.createElement("div")
									column_elem.classList.add("multicols")
									page.forEach(function(column) {
										var container = document.createElement("div")
										container.classList.add("col")
										column_elem.appendChild(container)
										addContent(container, column, false)
									})
									elem.appendChild(column_elem)
								} else {
									addContent(elem, data[content])
								}	
								break

							case "class":
								data[content].split(" ").forEach(function (c) {
									elem.classList.add(c)
								})
								break

							case "transition":
								var closest = getClosest(elem, 'section')
								if(closest) {
									closest.setAttribute('data-transition', data[content])
								}
								break

							case "image":
							case "background":
								var closest = getClosest(elem, 'section')
								if(closest) {
									closest.setAttribute('data-background', data[content])
								}
								break

							case "video":
								var closest = getClosest(elem, 'section')
								if(closest) {
									closest.setAttribute('data-background-video', data[content])
								}
								break

							case "notes":
								var aside = document.createElement("aside")
								aside.innerHTML = cleanHTML(data[content])
								elem.appendChild(aside) // elem should be section?
								break

							case "list":
							case "ulist":
								var list = document.createElement("ul")
								data[content].forEach(function(item) {
									var li = document.createElement("li")
									if(typeof item == "object") {
										addContent(li, item)
									} else {
										li.innerHTML = cleanHTML(item)
									}
									list.appendChild(li)
								});
								elem.appendChild(list)
								break

							case "olist":
								var list = document.createElement("ol")
								data[content].forEach(function(item) {
									var li = document.createElement
									if(typeof item == "object") {
										addContent(li, item)
									} else {
										li.innerHTML = cleanHTML(item)
									}
									list.appendChild(li)
								});
								elem.appendChild(list)
								break

							case "icon":
								var icon = data[content]
								var itag = document.createElement("i")
								itag.classList.add("fa")
								itag.classList.add("fa-"+icon.glyph)
								var sty = '';
								["color","background-color"].forEach(function(s) {
									if (icon[s]) {
                                        sty += (s+':'+icon[s]+';');
                                    }
								});
								if (sty != '') {
                                    itag.setAttribute('style', sty);
                                }
								elem.appendChild(itag)
								break

							case "table":
								var div = document.createElement("div")
								div.classList.add('table')
								elem.appendChild(div)
								var table = generateTable(data[content])
								div.appendChild(table)
								break
								
							case "counter": // text, start, stop, time
								var cntparams = (typeof data[content] == "object")
								 					? ""+data[content].start+','+data[content].end+','+(data[content].round ? data[content].round : 1)+','+data[content].time
													: data[content]

								var counter = document.createElement("p")
								counter.setAttribute('data-animation', 'countup')
								counter.setAttribute("data-countup", cntparams)

								if (xtra_classes_arr.indexOf("fragment") > -1) {
                                    counter.classList.add("fragment");
                                }

								elem.appendChild(counter)
								break
								
							case "progress-bar":
							    var bar = document.createElement("div")
								bar.setAttribute('data-animation', 'progress-bar')
								bar.setAttribute('data-progress-bar', data[content].start+','+data[content].end+','+data[content].max+','+data[content].time)
								
								if(data[content].name) {
									var barname = document.createElement("div")
									barname.classList.add("progress-bar-name")
									barname.innerHTML = data[content].name
									bar.appendChild(barname)
								}

								var cursor = document.createElement("span")
								cursor.classList.add("progress-bar")								
								bar.appendChild(cursor)

								var ValidClasses = ["fragment","right"]
								ValidClasses.forEach(function(c) {  // only add if in list of valid classes
									if (xtra_classes_arr.indexOf(c) > -1) {
                                        bar.classList.add(c);
                                    }
								})

								if(data[content]["show-value"]) {
									var barvalue = document.createElement("span")
									barvalue.classList.add("progress-bar-value")
									cursor.appendChild(barvalue)
								}

								elem.appendChild(bar)
								break
								
							case "moving-letters":
								var html = Mustache.render(
									"<div class='moving-letters' data-moving-letters='{{animation}}' data-animation='moving-letters' data-animation-loop='{{loop}}'>{{text}}</div>",
									data[content])
								elem.innerHTML = html
								break
								
							case "raw":
								addClasses(elem, xtra_classes_arr)
								elem.innerHTML = cleanHTML(data[content])
								break

							case "barchart": // Using Chart.js
							case "piechart":
							case "linechart": // copies the first few chars of content_type PIEchart, BARchart... into head of data if not present
							    data[content].type = data[content].type || content_type.substr(0, content_type.length - 5)
								var chart = generateChart(elem, data[content])
								var canvas = document.createElement("canvas")
								canvas.classList.add("chart")
								canvas.innerHTML = '<!-- '+JSON.stringify(chart)+' -->';
								elem.appendChild(canvas)
								break

							case "chart":
								var canvas = document.createElement("canvas")
								canvas.classList.add("chart")
								canvas.innerHTML = '<!-- '+JSON.stringify(data[content])+' -->'
								elem.appendChild(canvas)
								break

							case "barchartist": // Using Chartist
							case "piechartist":
							case "linechartist":
								var json = generateChartist(data[content], content_type.substr(0, content_type.indexOf("chart")))
								var div = document.createElement("div")
								div.classList.add("chartist")
								div.innerHTML = '<!-- '+JSON.stringify(json)+' -->'
								elem.appendChild(div)
								break

							//case "chartist":
							//case "mustache":
							default: // we add a generic div with class "content-type" for interception by anything plugin
								var generic = document.createElement("div")
								generic.classList.add(content_type)
								generic.innerHTML = '<!-- '+JSON.stringify(data[content])+' -->'
								addClasses(generic, xtra_classes_arr)	
								elem.append(generic)
								
								if (["chartist","mustache"].indexOf(content_type) == -1) {
                                    console.log("Storyrevealer.addContent", "no element for content-type " + content_type + "; using default", data);
                                }
								break
						} // switch
						
					} // CONTENT_TYPE_ELEM.indexOf
				} // CONTENT_TYPE_DATA.indexOf
		    } // data.hasOwnProperty
		} // for
	} // function addContent
	
	/*	Add <section> to elem. Add background image and classes if present in first supplied page
	 *
	 */
	function addSection(elem, data, add_content) {
		var s = document.createElement("section")
		elem.appendChild(s)
		_slideTitles[_slide_h] = _slideTitles[_slide_h] || []
		var slideTitles = _slideTitles[_slide_h]
		if(data) { // always adds background and class if present
			var first = Array.isArray(data) ? data[0] : data;
			if(first.background) {
				s.setAttribute("data-background", first.background)
			}
			if(first.class) {
				first.class.split(" ").forEach(function (c) {
					s.classList.add(c)
				})
			}
			var title = getTitle(data)
			slideTitles[_slide_v] = title
			if(add_content) {
				addContent(s, data)
				if(_navigation) { // if slide has no content, it has no nav (it probably is a container for other slides)
					var li = document.createElement("li")
					li.setAttribute("title", title)
					li.setAttribute("data-slide-h", _slide_h)
					li.setAttribute("data-slide-v", _slide_v)

					li.addEventListener("click", navigate)

					_navigation.appendChild(li)
					//console.log("Storyrevealer::addSection:title", _slide_v, title, data)
				}
			}
		}
		return s
	}
	
	
	/*	Add page content to elem. If page has multiple columns, add them in div.multicols/div.col flexbox
	 *
	 */
	function addPage(page, elem) {
		if(Array.isArray(page)) { // more than one column
			var page_elem = addSection(elem, page, false)
			var column_elem = document.createElement("div")
            column_elem.classList.add("multicols")
			page_elem.appendChild(column_elem)
			page.forEach(function(column) {
				var container = document.createElement("div")
	            container.classList.add("col")
				column_elem.appendChild(container)
				addContent(container, column, false)
			})
		} else {
			addSection(elem, page, true)
		}	
	}


	function loadJSON(path, success, error) {
	    var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function()
	    {
	        if (xhr.readyState === XMLHttpRequest.DONE) {
	            if (xhr.status === 200) {
	                if (success) {
                        success(xhr.responseText);
                    }
	            } else {
	                if (error) {
                        error(xhr);
                    }
	            }
	        }
	    };
	    xhr.open("GET", path, true);
	    xhr.send();
	}	
	/*	Loads stories and pages
	 *
	 */
	function initialize(filename) {	// There should only be one newspaper element at the root/top
		//		d3.json(filename, function(error, newspaper) {
		//		YAML.load(filename, function(newspaper) { var error = null;
		d3.text(filename, function(error, filecontent) {	
		//		loadJSON(filename, function(filecontent) {	

			console.log("Storyrevealer::initialize", filename)
			// JSON is either an object or an array
			var newspaper = (filecontent[0] === '{' ||  filecontent[0] === '[') ? JSON.parse(filecontent) : YAML.parse(filecontent) /*[YAML.parse,jsyaml.load](filecontent)*/

			var newspaper_elem = document.querySelector("div.slides")
			
			if(! newspaper_elem) {
				console.log("storyrevealer::load", "div.slides element not found")
				return
			}

			if(error || ! newspaper) {	// Add error page
				var error_elem = newspaper_elem.append("section")
				error_elem.append("h3")
					.text("There was a problem loading "+filename)
				error_elem.append("h1")
					.text("Error")
					.attr("class", "red")
				if(error) {
					error_elem.append("p")
						.append("small")
						.html(cleanHTML(error))
				}
				return
			}
			
			// clean previous newspaper or stories
			newspaper_elem.innerHTML = ''

			_slide_h = 0
			_slide_v = 0				
			
			if(newspaper.pages) {	// Just one story, add wrapping section for vertical navigation, does not count for nav
				var config = Reveal.getConfig()
				_horizontalNav = (typeof config.parallaxBackgroundImage != "undefined" && config.parallaxBackgroundImage != "")
				// console.log("_horizontalNav",_horizontalNav)
				if (! _horizontalNav) {
                    newspaper_elem = addSection(newspaper_elem, newspaper.cover, false);
                }
			}
			
			if(newspaper.cover) {	// Add newspaper cover page
				addSection(newspaper_elem, newspaper.cover, true)
				if(newspaper.pages && !_horizontalNav) { // if only one story, we only have vertical nav
					_slide_v += 1
				} else {
					_slide_h += 1
				}
				if(!_title_found && newspaper.cover.title) {
					document.title = newspaper.cover.title
					_title_found = true
				}
			}
			
			if(newspaper.stories) {	// multiple stories
				
				newspaper.stories.forEach(function(story) {	// For each news, news are navigated left to right

					_slide_v = 0

					// Add empty story container section
					var story_elem = addSection(newspaper_elem, story.cover, false)

					if(story.cover) {	// Add story cover page
						addSection(story_elem, story.cover, true)
						_slide_v += 1
					}

					story.pages.forEach(function(page) {	// Add story pages

						addPage(page, story_elem)
						_slide_v += 1

					})
					
					_slide_h += 1
				})

			} else {	// just one story

				var story_elem = newspaper_elem
				
				newspaper.pages.forEach(function(page) {	// For each page in the story

					addPage(page, story_elem)

					if (_horizontalNav) {
                        _slide_h += 1;
                    } else {
                        _slide_v += 1;
                    }

				})

			}	// newspaper.stories
			
		})	// d3.json		
	}


	/*	Storyrevealer Object
	 *
	 */
	return {
		init: init,
		initialize: init,
		resetDotNav: resetDotNav
	}

}));

// Install all animations without starting them
Reveal.addEventListener( 'ready' , function( event ) {
	var s = Reveal.getIndices()
	//console.log("Storyrevealer::-ready-:dot-nav", s)
	
	Storyrevealer.resetDotNav(s.h)

	var active = document.querySelector(".side-dot-navigation li.active")
	if(active) {
		active.classList.remove('active')
	}

	var curr = document.querySelector("li[data-slide-h='"+s.h+"'][data-slide-v='"+s.v+"']")
	if(curr) {
		curr.classList.add('active')
	}
	
} );

Reveal.addEventListener( 'slidechanged' , function( event ) {
	var s = Reveal.getIndices()
	//console.log("Storyrevealer::-slidechanged-:dot-nav", s)
	
	Storyrevealer.resetDotNav(s.h)

	var active = document.querySelector(".side-dot-navigation li.active")
	if(active) {
		active.classList.remove('active')
	}
	var curr = document.querySelector("li[data-slide-h='"+s.h+"'][data-slide-v='"+s.v+"']")
	if(curr) {
		curr.classList.add('active')
	}
} );
