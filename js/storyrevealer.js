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

	// The reveal.js version
	var VERSION = '1.0.0'
	
	var CONTENT_TYPE_ELEM = {
		"above-title": "h2",
		"below-title": "h4",
		"byline": "h6",
		"bytitle": "h3",
		"date": "p",
		"editor": "h6",
		"headline": "h1",
		"name": "h1",
		"quote": "q",
		"teaser": "h3",
		"text": "p.red",
		"title": "h1",
		"under-title": "h4",
		"copyright": "small"
	}
	var _inited = false
	var colors = []
	var transparency = ".8"
	
	/*
	 *
	 */
	function init() {
		if(_inited) return
		function hexToRgb(hex) {
		    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
		    return result ? {
		        r: parseInt(result[1], 16),
		        g: parseInt(result[2], 16),
		        b: parseInt(result[3], 16)
		    } : null
		}
		var scheme = new ColorScheme
		scheme.from_hue(360 * Math.random())   
			  .scheme('analogic')
			  .variation('hard')
		colors = scheme.colors()
		colors = colors.map(function(hex){
			var c = hexToRgb(hex)
			return "rgba("+c.r+","+c.g+","+c.b+","+transparency+")"
		})
		console.log(colors)
		_inited = true
	}
	
	/*
	 *
	 */
	function cleanHTML(str) {
		return sanitizeHtml(str, {
		  allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
		  allowedAttributes: {
		    'a': [ 'href' ]
		  }
		})
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
	function generateChart(container, chart_data) {
		init()
		var counter = 0
		var data = chart_data.data

		var chart = {}
		chart.type = chart_data.type
		chart.options = chart_data.options
		chart.data = {}

		var columns = []
		var categories = []
		data.forEach(function(line) {
			categories.push(line[0])
			for(var i = 1; i < data[0].length; i++) {
				columns[i-1] = columns[i-1] || []
				columns[i-1].push(line[i])
			}
		})
		//console.log(categories, columns)

		chart.data.labels = categories
		chart.data.datasets = []
		columns.forEach(function(column) {
			var dataset = {
				data: column,
				label: 'R'+(counter+1)
			}
			switch(chart.type) {
				case "bar":
					dataset.backgroundColor = colors[(counter++) % colors.length]
					break
				case "pie":
					dataset.backgroundColor = colors
					break
				case "line":
					dataset.borderColor = colors[(counter++) % colors.length]
					break
			}
			chart.data.datasets.push(dataset)
		})
		//console.log(chart_data, chart)

		container
			.append('canvas')
			.attr('class', 'chart')
			.html('<!-- '+JSON.stringify(chart)+' -->')
	}
	
	/*	Append HTML formatted data content to supplied element
	 *
	 */
	function addContent(elem, data) {
		for (var content in data) {
		    if (data.hasOwnProperty(content)) { // content type is in format title.bold.reverse
			
				var content_arr = content.split(".")
				var content_type = content_arr.shift()
				var addClasses = function (container) {
					if(content_arr.length > 0) {
						content_arr.forEach(function(c) { container.classed(c, true) })
					}
				}

				if(CONTENT_TYPE_ELEM[content_type]) { // direct mapping first, eg: "title.class": "text"  ->  <h1 class="class">text</h1>
				
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

						case "chart":								
							generateChart(elem, data[content])
							break

						case "mustache":
							elem.attr("class", "mustache").html('<!-- '+JSON.stringify(data[content])+' -->')	
							break

						/* @todo
						case "progressbar": (text, min, max, value, animated, show_value)
						case "counter": (text, start, stop, time)
						*/

						default: // we add a generic div with class "content-type" for interception by anything plugin
							var generic = elem.append("div")
							    .classed(content_type, true)
								.html('<!-- '+JSON.stringify(data[content])+' -->')
							// we add extra classes if provided
							addClasses(generic)	
							
							console.log("Storyrevealer.addContent", "no element for content-type " + content_type, data)
							break
					}
				}
		    }
		}
	}
	
	/*	Get first content-type of a page. Page can be single column or multi columns.
	 *	In the latter case, the first occurence of content-type is returned.
	 */
	function getContent(content_type, data) {
		var ret = null
		if(Array.isArray(data)) {
			data.forEach(function(c) {
				if(!ret && c[content_type]) {
					ret = c[content_type]
				}
			})
		} else {
			ret = data[content_type] ? data[content_type] : null
		}
		return ret
	}
	/*	Add <section> to <div class="reveal">.
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
	

	Storyrevealer = {
		VERSION: VERSION,

		generate: function(options) {
			var filename = options.url

			//console.log("Storyrevealer.show",filename)			
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
				
				// Add newspaper cover page
				var newspapercover_elem = addSection(newspaper_elem, newspaper.cover ? newspaper.cover :  null, true)				
				// @todo: Add copyright and publication info
				
				newspaper.stories.forEach(function(story) {	// For each news, news are navigated left to right

					// Add news container section
					var story_elem = addSection(newspaper_elem, story.cover ? story.cover :  null, false)
					
					// Add story cover page
					var storycover_elem = addSection(story_elem, story.cover, true)

					// Add story pages
					story.pages.forEach(function(page) {	// For each page in the story
						
						if(Array.isArray(page)) { // more than one column
							var page_elem = addSection(story_elem, page, false)
							var column_elem = page_elem.append("div")
								.attr("class", "container")
								
							page.forEach(function(column) {
								var container = column_elem.append("div")
												.attr("class", "col")
								addContent(container, column, false)
							})
						} else {
							addSection(story_elem, page, true)
						}	
					
					})
				})
				
			})			
		}
		
	}


	return Storyrevealer

}));