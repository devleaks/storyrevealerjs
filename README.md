Storyrevealer.js
================

 

Simple, YAML-fed story teller engine based on [Reveal.js](http://revealjs.com).

Inspired by the elegance and simplicity of [deltatre' SportTeller](http://www.deltatre.com/online-solutions/sportteller/)
(with examples
[here](http://www.europeantour.com/sportteller/us-open-day-4-in-numbers.html),
[here](http://www.gaa.ie/sportteller-content/stories/1/1/55b33bda-d289-41a6-ba6e-a3e094201f36/index.html#Slide_2),
and
[here](http://www.europeantour.com/sportteller/bmw-pga-championship-day-1-in-numbers.html)),
Storyrevealer is a simpler, free, alternative.

Storyrevealer creates a single web page, called a newspaper, which contains
stories. Stories in a newspaper are scrolled horizontally. A story is a list of
pages scrolled vertically.

A page is a background image, animation, or video, with content laid over it.
The content of the page is a collection of information displayed as bold title texts,
tables, lists, or graphics.

Storyrevealer uses Reveal.js plugins, like the Anything plugin, to display and
animate your content. (Anything plugin is so generic that you can really stick
anything in a slide' section.)

It also uses some javascript libraries like yamljs, animate.js, {{mustache}} (js version),
and d3-request.

Pierre M. - December 2017


A Storyrevealer Newspaper
-------------------------

In its simple form, a Storyrevealer newspaper consists of a single HTML page,
which loads necessary javascript libraries and style sheets, a Storyrevealer YAML 
file which contains your newspaper, and of course, all images, animations, and
videos you wish to include in your stories.

The static HTML page does not need editing, and can be used as a template for
all your newspapers.

The only supplied file you might want to edit is the storyrevealer-specific
style sheet (provided as a SCSS file), where you can all your custom styles, or load fonts.

The format of your story YAML file is described below.

YAML Data File Format
---------------------
 

The YAML datafile handled by Storyrevealer may contain either

-   a single story, or

-   a collection of stories, called a newspaper.

In YAML, **identation is important**, as it reflects the "structure" of the
document.

You cannot use `TAB`s for indentation. You must use `SPACE`s.

### Newspaper

A newspaper is made of an optional cover page and Stories.

```
cover: {{page}},
stories: [ {{story-element}}+ ]
```

The newspaper’s cover page is a regular, additional page. Here is an example of
a 2 story newspaper.

```yaml
cover:
  background: image.png
  name: Cover page of newspaper
stories:
  -
    cover:
      background: cover1.jpg
      title: Title of first story
    pages:
      -
        background: first.png
        title: Title of first page of first story
      -
        title.red: Title of second page of first story
      -
        title.inverse: Video with Overlay
        video: mp4.mp4
  -
    cover:
      title: Cover page of second story
    pages:
      -
        title: Title of first page of second story
      -
## This is a comment. Made-with-love is a special "key word" to display
## the following string with an animation
        made-with-love: Animated Title
        under-title: of second page of second story
```

Plese note the careful and very important indentation and `-` characters used to
separate content of the same type (arrays or lists of things).

### Story

A story is made of an optional cover page and Pages

```
cover: {{page}},
pages: [ {{page}}+ ]
```

The story’s cover page is a regular, additional page.


### Page

A page is made of one or more columns. In the latter case, it is an *array of columns*.  

```
page: {{column}} \|\| [ {{column}}{1,} ]
```

Note: When a page is made of more than one column, decorating elements of the
**first** column are taken into account for decorating the entire page
(background image, video, or additional classes.)

A column is a list of content properties.

```
column: { {{content}}* }
```

  If a column does not contain any content property, it is a blank page or
column. Blank columns can be useful to control the horizontal layout of content.
 
Content properties are displayed in the order they appear in the column.


### Content Properties

A content property is a ( content-type , content-value ) pair.

```
content-type: {{content-value}}
```

Content-value is a valid YAML object and its form varies depending on the
content-type.

Storyrevealer provides a set of content-type properties together with their
representation. We make an artificial distinction between 3 types of
content-type properties (although they all are treated the same way):

1.  Decoration properties affect the page or column appearance,

2.  Data attribute properties, and

3.  Content properties add content to the page.

 

#### Decoration Properties

Decoration properties mainly affect the appearance of the page.

| **Content Type**    | **Value**      | **Note**                                                                                                              |
|---------------------|----------------|-----------------------------------------------------------------------------------------------------------------------|
| background or image | URL of image   | Displayed as background image                                                                                         |
| video               | URL of video   | Displayed as background video. Plays automatically when page is shown                                                 |
| class               | CSS class name | Single class name is added to the page’s parent element. A page-element may contain more than one class content type. |

```
background: url-path/to-image/image.jpg
```

#### Data Attribute Properties

Data attribute properties are relayed to Reveal.js element entities.

| **Content Type**       | **Value**        | **Note**                               |
|------------------------|------------------|----------------------------------------|
| data-background-color  | RGB(A) Color     | Background color                       |
| data-background-iframe | URL to HTML page | Background HTML page (non-interactive) |
| data-transition        | Transition name  | See Reveal.js possibilities            |

Data elements are added to the parent element as data attributes.

```
data-background-color: #FF6347
```

will produce

```html
<section data-background-color="#FF6347">
```

It is possible to add Reveal.js specific data attributes to control transitions,
background transitions, or any other data attribute.  

 

#### Text Content Properties

Text content is the simplest form of content laid over the background.

Text content properties accept either a single string, or a list of strings.

```
text-content-type: {{string}} || [ {{string}}{1,} ]
```

The following text content elements are provided by Storyrevealer:

| **Text Content** | **Purpose**                  | **Display**                          |
|------------------|------------------------------|--------------------------------------|
| title            | Main title of page           | Bold, larg text in middle of screen. |
| editor           | Display editor information   | Meant to be used on cover pages      |
| date             | Date of story                | Meant to be used on cover pages      |
| above-title      | Text displayed above a title | Displayed in small caps.             |
| under-title      | Text displayed under a title | Displayed in bolder font             |
| credits          |                              |                                      |
| copyright        |                              |                                      |
| text             | Regular text                 |                                      |
| quote            | Quoted text                  |                                      |

##### Text Content Type to Element HTML Mapping 

Each text content element is directly mapped to an HTML element.

The mapped element may contain additional classes separated by dots.

If Storyrevealer content-type `title` is mapped to HTML element `h1.left`:

```
title: Hello
```

produces

```html
<h1 class="left">Hello</h1>
```

Additional mappings of Storyrevealer content types to HTML elements can be
provided as a Storyrevealer option.

 

##### Text Content Type Styling 

The content-type name can contain additional CSS class names that will be added
to its HTML parent element.

For exemple, if the `title` content-type is mapped to the HTML element `h1`:

```
title.huge.reverse: Hello
```

produces

```html
<h1 class="huge reverse">Hello</h1>
```
 

The following class names are intercepted by Storyrevealer and have special meaning:

| **Class Name** | **Description**                                                                             |
|----------------|---------------------------------------------------------------------------------------------|
| fragment       | Reveal.js Frament element, added as a regular class name and handled by Reveal.js           |
| html           | The provided text is HTML formatted. It will be sanitized and sent directly to the browser. It is a Storyrevealer.js feature. |

 

The following class names are provided by Storyrevealer and can be customized in
the SCSS file.

| **Class Name** | **Description**                                             |
|----------------|-------------------------------------------------------------|
| darker         | Places a transparent darker background under the text       |
| darkest        | Places a less transparent darker background under the text  |
| lighter        | Places a transparent lighter background under the text      |
| lightest       | Places a less transparent lighter background under the text |
| left           | Align text to the left of the page/column                   |
| right          | Align text to the right of the page/column                  |
| bottom-left    | Places text in bottom, left corner of page                  |
| bottom-right   | Places text in bottom, left corner of page                  |
| top-left       | Places text in bottom, left corner of page                  |
| top-right      | Places text in bottom, left corner of page                  |
| allcaps        | Transform text to uppercase                                 |
| inverse        | Uses background color for text                              |
| huge           | Increases font size to 150%                                 |
| number         | Increases font size to 400%                                 |

Additional class names can be declared in the CSS file and used in Storyrevealer.
Any CSS class name available in the CSS can be passed to any Storyrevealer text content type.


#### Mustache Templating

The content-element `mustache` formats text and data from the Mustache templating
engine:

```yaml
mustache:
  template: |
        <caption>Skills of {{name}}</caption>
        <table class="counter-table">
        {{#skills}}
          <tr>
          <td>{{name}}</td>
          <td><span data-animation="countup" data-countup="0,{{value}},1,2000">{{value}}</span></td>
          </tr>
        {{/skills}}
        </table>
  data:
    name: John Smith
    skills:
      -
        name: JavaScript
        value: 80
      -
        name: PHP
        value: 90
      -
        name: Python
        value: 60
```


#### Animations

Storyrevealers adds simple animations.

Animations are added because of their simplicity and beauty.

The following animations are currently available:

##### Countup

Count-Up changes the value of a counter from a starting value to an ending
value, by increment (round), in a giving time. The counter starts when the page
is displayed.

```yaml
counter:
    name: Counter Title
    start: 20
    end: 60
    round: 1
    time: 5000
```

or

```yaml
counter: 20,60,1,5000
```

Note that rounding is used as in `Math.round(value * round) / round`.

##### Progress Bar

A progress bar is a title, a subtitle and a cursor-like bar that runs from a
starting value to an ending value, in a given time. The value representing the
maximum length of the progress bar can also be provided. The progress bar
animation starts when the page is displayed.

```yaml
progress-bar:
    name: Progress Bar Title
    description: Text under above progress bar
    show-value: true
    start: 20
    end: 60
    max: 200
    time: 5000
}
```

It is possible to display several progress bars using for instance a {{mustache}} template like so:

```yaml
mustache:
  template: |
    <div class="progress-bar-table">
      {{#stats}}
        <div class="right" data-animation="progress-bar" data-progress-bar="0,{{value}},{{max}},2000">
          <div class="progress-bar-name">{{name}}</div>
          {{#detail}}
            <div class="progress-bar-desc">
              {{detail}}<span class="progress-bar-value" style="font-size:30px;"></span>
            </div>
          {{/detail}}
          <div class="progress-bar-bg">
            <span class="progress-bar"></span>
          </div>
        </div>
      {{/stats}}
    </div>
  data:
    skills:
      -
        name: JavaScript
        description: The very best language indeed
        value: 100
      -
        name: PHP
        value: 80
      -
        name: Python
        value: 70
```

##### Moving Letters

Storyrevealer adds a few animations for short text (typically title texts). To
add a text animation, add a element like this one:

```yaml
moving-letters:
  animation: made-with-love
  loop: true
  text: Great Thursday
  separator: ','
```

or event in a shorter form:

```yaml
signal-and-noise: Peace,Love
```

In this latter case, it is not possible to control options like loop (which defaults to true)
or separator (which defaults to `,`).

When animation requires more than one string (like Signal and Noise in the
example, which requires 2 distinct strings), strings are separated using the
`separator` inside the `text` attribute. Loop indicates whether the animation
should only play once, or loop forever.

Please note that most animation terminates their loop by fading away (disappearing).

[Valid animations](http://tobiasahlin.com/moving-letters/) are: thursday,
slow-mornings, great-thinker, ready, signal-and-noise, beautiful-question,
reality-is-broken, hey, coffee-morning, domino-dreams, hello-goodbye,
a-new-production, rising-strong, finding-your-element, out-now, and
made-with-love.

#### Table

The table structure contains two parts.

The first part contains table options.

The following options are accepted: rowheader, rowfooter, columnheader, columnfooter.
They are all boolean and tells whether data contains such row or column header or footer.

The second part contains the data. Table data is an array; each element of the
array represents a table row.

Each row is represented by an Array; each element of the array is the table cell
content.

```yaml
table:
  options:
    columnheader: true
    rowheader: true
    rowfooter: true
  data:
    - ["", R1, R2, R3, R4, TOT]
    - [Tiger, 70, 71, 68, 66, 275]
    - [Henrick, 72, 72, 66, 65, 275]
    - [Phil, 71, 69, 72, 64, 276]
    - [Sergio, 72, 71, 70, 68, 281]
    - [Justin, 72, 70, 68, 72, 282]
    - [Thomas, 66, 68, 76, 72, 282]
```

Alternatively, you could design a {{mustache}} template to generate a table from the array.
 

#### Graphs

Storyrevealer aims at, and purposely limits itself to, very simple, clear,
straightforward, bold, graphs.

Most graphs are animated but not interactive.

Storyrevealer uses 2 graphic packages

1.  [Chart.js](http://tobiasahlin.com/blog/chartjs-charts-to-get-you-started/),
    which uses the HTML Canvas,

2.  [Chartist](https://gionkunz.github.io/chartist-js/), which uses SVG, very
    much like [C3](http://c3js.org) and D3 which also are viable alternatives.

 

There are two methods to create graphs.  

The first method uses the content-type `barchart` (respectively `barchartist`),
`linechart` (resp. `linechartist`), and `piechart` (resp. `piechartist`) to
create standard bar, line and pie chart respectively. Data need to presented in
a simple Storyrevealer way. No option can be changed. These types of graphs are
suitable for most simple graphs.

```yaml
pages:
  -
    title: Simplified Pie Chart
    piechart:
      data:
        - [Tiger, 50]
        - [Henrick, 30]
        - [Phil, 20]
  -
    title: Simplified Line Chart
    linechart:
      data:
        - [Tiger, 70, 71, 68, 66]
        - [Henrick, 72, 72, 66, 65]
        - [Phil, 71, 69, 72, 64]
  -
    title: Simplified Bar Chart
    barchart:
      labels:
        - R1
        - R2
        - R3
        - R4
      data:
        - [Tiger, 70, 71, 68, 66]
        - [Henrick, 72, 72, 66, 65]
        - [Phil, 71, 69, 72, 64]
        - [Sergio, 72, 71, 70, 68]
        - [Justin, 72, 70, 68, 72]
        - [Thomas, 66, 68, 76, 72]
```

It is not possible to control options, displays of axes, sizes, etc. with this
method. It produces simple, functional graphs at low cost.

The second method uses the content-type `chart` (respectively `chartist`). Data
need to be presented in the the way the graphing package expects it. This method
allow to display any type of graph that the graphing package can display.

```yaml
title: Mixed Chart
chart:
  type: bar
  data:
    labels:
      - 1900
      - 1950
      - 1999
      - 2050
    datasets:
      - {label: Europe, type: line, borderColor: '#8e5ea2', data: [408, 547, 675, 734], fill: false}
      - {label: Africa, type: line, borderColor: '#3e95cd', data: [133, 221, 783, 2478], fill: false}
      - {label: Europe, type: bar, backgroundColor: 'rgba(0,0,0,0.2)', data: [408, 547, 675, 734]}
      - {label: Africa, type: bar, backgroundColor: 'rgba(0,0,0,0.2)', backgroundColorHover: '#3e95cd', data: [133, 221, 783, 2478]}
  options:
    title:
      display: true
      text: 'Population growth (millions): Europe & Africa'
    legend:
      display: false
```

##### Chart.js YAML Enhancement

I made the following little enhancement for Chart.js.
For backgroundColor and fillColor, Chart.js allows for pattern and gradient.
Unfortunately, those patterns and gradients need to be created and defined before they can be referenced in Chart.js.
So I created two objects to create gradiants and partterns:

Example of linear gradient:
```yaml
backgroundColor:
  type: gradient
  data:
    type: linear
    x0: [0,0]
    x1: [0,300]
    stops:
      -
        stop: 0
        color: 'rgba(20, 233, 252, 0.2)'
      -
        stop: 1
        color: 'rgba(0, 0, 32, 0.6)'                  
```

Example of radial gradient:
```yaml
backgroundColor:
  type: gradient
  data:
    type: radial
    x0: [300,300]
    r0: 100
    x1: [300,300]
    r1: 400
    stops:
      -
        stop: 0
        color: 'rgba(20, 233, 252, 0.2)'
      -
        stop: 1
        color: 'rgba(0, 0, 32, 0.6)'                  
```

Example of picture-based pattern:
```yaml
backgroundColor:
  type: pattern
  data:
    image: pattern.png
    repetition: repeat-x
```
Repetition is `CanvasRenderingContext2D.createPattern` second argument. Valid values are
 - "repeat" (both directions)
 - "repeat-x" (horizontal only)
 - "repeat-y" (vertical only)
 - "no-repeat" (neither)

Example of [patternomaly](https://github.com/ashiguruma/patternomaly) pattern:
```yaml
backgroundColor:
  type: pattern
  data:
    shape: zigzag
    color: 'rgba(20, 233, 252, 0.2)'
```
Shape is a valid patternomaly pattern name.



Storyrevealer Options
---------------------

When created, the Storyrevealer object accepts the following options:

```javascript
Storyrevealer.initialize({

    // Storyrevealer data URL
    url: 'dev.yaml',

    // Content-type to HMTL element mappings
    mappings: {
        "paragraph": "p.left"
    },

    // Additional options for HTML Sanitazing library
    html: {
        allowedTags: [ 'h4', 'h5', 'h6' ]
    }

})
```

Storyrevealer Installation
--------------------------

```sh
git clone https://github.com/devleaks/storyrevealerjs
cd storyrevealerjs
yarn
gulp
```

Explore files in the `tests` directory.

Run the index.html file for brief explanations of this project.

# Reveal.js Required Plugins

The following Reveal.js plugins need to be installed to use Stpryrevealer
features:

| **Plugin** | **Purpose**                                                       | **Note** |
|------------|-------------------------------------------------------------------|----------|
| Anything   | Used by most Storyrevealer features, like Mustache, animations... |          |

```javascript
// More info https://github.com/hakimel/reveal.js#configuration

Reveal.initialize({
    ...

    // More info https://github.com/hakimel/reveal.js#dependencies
    dependencies: [
        ...

        { src: 'node_modules/reveal.js-plugins/anything/anything.js' },
        { src: 'js/moving-letters.js' },
        { src: 'js/storyrevealer-animation-plugin.js' },

        ...
    ],
    
    ...
})
```

In addition, the following JS scripts need to be added to your page:

| **Plugin**    | **Purpose**                                 | **Note** |
|---------------|---------------------------------------------|----------|
| Mustache      | Easy templating                             |          |
| Chartist      | SVG charting library                        |          |
| Chart.js      | Canvas-based charting library               |          |
| sanitize-html | Flexible HTML sanitazing library            |          |
| yamljs        | Standalone JavaScript YAML Parser & Encoder |          |
| js-yaml       | Alternate JavaScript YAML Parser & Encoder  |          |
| moment        | JavaScript Date and Time Parser & Encoder (used by Chart.js) |          |
| patternomaly  | Canvas Pattern Generator (used by Chart.js) |          |

Please feel free to replace packages I use by equivalent libraries.
For instance [json5](https://github.com/json5/json5) is a *human readble*
more permissive alternative to standard JSON.

```html
...
<!-- BEGIN STORYREVEALERJS -->
<script src="node_modules/d3-collection/build/d3-collection.min.js"></script>
<script src="node_modules/d3-dispatch/build/d3-dispatch.min.js"></script>
<script src="node_modules/d3-dsv/build/d3-dsv.min.js"></script>
<script src="node_modules/d3-request/build/d3-request.min.js"></script>

<script src="../../node_modules/yamljs/dist/yaml.js"></script>	
<script src="../../node_modules/esprima/dist/esprima.js"></script>	
<script src="../../node_modules/js-yaml/dist/js-yaml.min.js"></script>	

<script src="../../node_modules/sanitize-html/dist/sanitize-html.js"></script>
<script src="../../node_modules/mustache/mustache.js"></script>

<script src="../../node_modules/patternomaly/dist/patternomaly.js"></script>
<script src="../../node_modules/moment/moment.js"></script>
<script src="node_modules/chart.js/dist/Chart.js"></script>

<script src="node_modules/chartist/dist/chartist.js"></script>
<script src="node_modules/chartist-plugin-legend/chartist-plugin-legend.js"></script>

<script src="node_modules/animejs/anime.js"></script>   

<script src="js/storyrevealer.js"></script>
<!-- END STORYREVEALERJS -->
...
```

Finally, the follow CSS files need loading.

```html
...
<!-- BEGIN STORYREVEALERJS -->
< link rel="stylesheet" href="node_modules/Reveal.js-Title-Footer/plugin/title-footer/title-footer.css">
< link rel="stylesheet" href="css/moving-letters.css">
< link rel="stylesheet" href="css/storyrevealer.css">
< link rel="stylesheet" href="css/storyrevealer-dev.css">
<!-- END STORYREVEALERJS -->
...
```

Storyrevealer.css is generated from storyrevealer.sccs throught a gulp task.

# Example Files

Please have a look at all JSON files in the tests directory.

# Limits

With the exception of pure text content, you can only have one content of a
given type in a column. For example, there can only be one `mustache` element in
a colum.

```yaml
mustache:
    template: ...
    data: ...
    
## This is incorrect YAML
## There cannot be 2 mustache elements at the same level.
mustache:
    template: ...
    data: ...
```

If you need such element more than once, simply add them a non-existant class
name like so:

```yaml
mustache:
    template: ...
    data: ...
    
mustache.beard1:
    template: ...
    data: ...
```

Class `.beard1` does not exist and will not affect the behavior or rendering of
Storyrevealer.

# Notes

The origin of the project was to allow users of a couple of sport-related social
networks (I once made) to create a simple story with just a few pictures (or
videos) and some text attached to each picture or video, very much like
[deltatre' SportTeller](http://www.deltatre.com/online-solutions/sportteller/).

Text would be both
provided by the user, and automagically generated from data (sports results)
from the social network. It had to be simple to generate by computer
(from statistics, result highlights, etc.) and presentation had to be great.
Hence the intermediate JSON structured document fed to Storyrevealer at the start of the project.

I discovered later that YAML somehow *includes* JSON format and is soooo much easier
to read and write than JSON that I switched to YAML for "human" production.

With this tool, every user of the network is a potential story teller.

Storyrevealer engine only takes care of the presentation. A full screen image (or video)
with the story displayed on it, in short, bold title fonts and sometimes small paragraphs of text.
And a few, very simple animations or graphs to break monotony of storytelling.

Enjoy.

Now, go, tell stories.
