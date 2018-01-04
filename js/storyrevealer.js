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
		"title": "h1",
		"under-title": "h4",
		"copyright": "small"
	}

	var CONTENT_TYPE_DATA = [
		"data-background-color",
		"data-background-iframe"
	]

	var CLEAN_HTML = {
	  allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'div' ],
	  allowedAttributes: {
	    'a': [ 'href' ],
		'div': [ 'class', 'data-background-src' ]
	  }
	}

	var _inited = false
	
	/*	Used before. Will probably come back...
	 *
	 */
	function init() {
		if(_inited) return
		_inited = true
	}
	
	/*
	 *
	 */
	function cleanHTML(str) {
		return sanitizeHtml(str, CLEAN_HTML)
	}
	
	/*	Generate <table> element and fill it 
	 *
	 */
	function generateTable(table, table_data) {
		var options = table_data.options || {}
		var data = table_data.data
		
		for(var row = 0; row < data.length; row++) {
			var rowcontainer = table
			if(row == 0 && options.columnheader) { //@todo: make columnheader is the count of column headers?
				rowcontainer = rowcontainer.append("thead")				
			} else if ((row == (data.length - 1)) && options.columnfooter) {
				rowcontainer = rowcontainer.append("tfoot")				
			}
			rowcontainer = rowcontainer.append("tr")
			
			for(var col = 0; col < data[row].length; col++) {
				var colcontainer = rowcontainer.append('td')
				if(col == 0 && options.rowheader) {
					colcontainer.classed("rowheader", true)				
				} else if ((col == (data[row].length - 1)) && options.rowfooter) {
					colcontainer.classed("rowfooter", true)				
				}
				colcontainer.text(data[row][col])
			}			
		}
	}
	
	/* 	Generate chart object for each chart type
	 *
	 */
	function generateChartist(chart_data, chart_type) {
		//console.log("generateChartist::begin", chart_type, chart_data)
		var ret = {}
		ret.type = chart_type
		ret.options = {}
		var data = ret.data = {}
		switch(chart_type) {
			case "line":
				data.labels = [];
				data.legend = [];
				data.series = [];
				var i = 1
				chart_data.data.forEach(function(d) {
					data.legend.push(d.shift())
					data.labels.push(i++)
					data.series.push(d)
				})
				ret.options["sr_legend_options"] = {
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
						i++
					})
				})
				break
		}
		ret.options["chartPadding"] = 30
		
		//console.log("generateChartist::end", chart_type, ret)
		return ret;
	}


	/*	Append HTML formatted data content to supplied element
	 *
	 */
	function addContent(elem, data) {
		for (var content in data) {
		    if (data.hasOwnProperty(content)) {
			
				if( CONTENT_TYPE_DATA.indexOf(content) > -1 ) { // content type is in format data-attr and whitelisted in CONTENT_TYPE_DATA

					elem.attr(content, data[content])					

				} else { // content type is in format title.bold.reverse
			
					var content_arr = content.split(".")
					var content_type = content_arr.shift()
					var addClasses = function (container) {
						if(content_arr.length > 0) {
							content_arr.forEach(function(c) { container.classed(c, true) })
						}
					}

					if( CONTENT_TYPE_ELEM.hasOwnProperty(content_type) ) { // direct mapping first, eg: "title.class": "text"  ->  <h1 class="class">text</h1>
				
						var html_raw = CONTENT_TYPE_ELEM[content_type];
						var html_arr = html_raw.split(".")
						var html_elem = html_arr.shift()
					

						var container = elem.append(html_elem)
						if(html_arr.length > 0) {
							html_arr.forEach(function(c) { container.classed(c, true) })
						}

						addClasses(container)		

						if(content_arr.indexOf("html") > -1) {
							container.html(cleanHTML(data[content]))
						} else {
							container.text(data[content])
						}

					} else { // complex content

						switch(content_type) {

							case "class":
								elem.classed(data[content], true)
								break

							case "transition":
								elem.attr('data-transition', data[content])
								break

							case "image":
							case "background":
								elem.attr('data-background', data[content])
								break

							case "video":
								elem.attr('data-background-video', data[content])
								break

							case "notes":
								elem.append("aside")
									.html(cleanHTML(data[content]))
								break

							case "table":
								var container = elem.append("div")
									.attr("class", "table")
									.append("table")
								generateTable(container, data[content])
								break

							case "barchart":
							case "piechart":
							case "linechart":
								var json = generateChartist(data[content], content_type.substr(0, content_type.indexOf("chart")))
								var container = elem.append("div")
								    .classed("chartist", true)
									.html('<!-- '+JSON.stringify(json)+' -->')

								break

							/* @todo
							case "progressbar": (text, min, max, value, animated, show_value)
							*/
							case "counter": // text, start, stop, time
								elem.append("p")
									.attr('class', 'fragment')
									.attr("data-countup", data[content])

								break

							case "chartist":
							case "mustache":
							default: // we add a generic div with class "content-type" for interception by anything plugin
								var generic = elem.append("div")
								    .classed(content_type, true)
									.html('<!-- '+JSON.stringify(data[content])+' -->')
								// we add extra classes if provided
								addClasses(generic)	
							
								console.log("Storyrevealer.addContent", "no element for content-type " + content_type + "; using default", data)
								break
						}
						
					} // CONTENT_TYPE_ELEM.indexOf
				} // CONTENT_TYPE_DATA.indexOf
		    } // data.hasOwnProperty
		} // for
	}
	
	/*	Add <section> to elem. Add background image and classes if present in first supplied page
	 *
	 */
	function addSection(elem, data, add_content) {
		var s = elem.append("section")
		if(data) { // always adds background and class if present
			var first = Array.isArray(data) ? data[0] : data;
			if(first.background) {
				s.attr("data-background", first.background)
			}
			if(first.class) {
				s.classed(first.class, true)
			}
			if(add_content) {
				addContent(s, data)
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
			var column_elem = page_elem.append("div")
				                       .attr("class", "multicols")
			page.forEach(function(column) {
				var container = column_elem.append("div")
								           .attr("class", "col")
				addContent(container, column, false)
			})
		} else {
			addSection(elem, page, true)
		}	
	}

	Storyrevealer = {
		VERSION: VERSION,

		generate: function(options) {
			var filename = options.url

			d3.json(filename, function(error, newspaper) {	// There should only be one newspaper element at the root/top
				var newspaper_elem = d3.select("div.slides")
				
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
				
				if(newspaper.cover) {	// Add newspaper cover page
					addSection(newspaper_elem, newspaper.cover, true)				
				}
				
				if(newspaper.stories) {	// multiple stories
					
					newspaper.stories.forEach(function(story) {	// For each news, news are navigated left to right

						// Add empty story container section
						var story_elem = addSection(newspaper_elem, story.cover, false)

						if(story.cover) {	// Add story cover page
							addSection(story_elem, story.cover, true)
						}

						story.pages.forEach(function(page) {	// Add story pages

							addPage(page, story_elem)

						})
					})

				} else {	// just one story

					var story_elem = newspaper_elem // or shoud we create an empty containing section?
					
					newspaper.pages.forEach(function(page) {	// For each page in the story

						addPage(page, newspaper_elem)

					})

				}
				
				
			})			
		}
		
	}


	return Storyrevealer

}));