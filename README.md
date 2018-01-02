Storyrevealer.js
================

 

Simple, json-fed story teller engine based on [Reveal.js](http://revealjs.com).

Inspired by the elegance and simplicity of [deltatre'
SportTeller](http://www.deltatre.com/online-solutions/sportteller/) (with
examples
[here](http://www.europeantour.com/sportteller/us-open-day-4-in-numbers.html),
[here](http://www.gaa.ie/sportteller-content/stories/1/1/55b33bda-d289-41a6-ba6e-a3e094201f36/index.html#Slide_2),
and
[here](http://www.europeantour.com/sportteller/bmw-pga-championship-day-1-in-numbers.html)
), I deciced to make a simpler, free, alternative.

Storyrevealer creates a single web page, called a newspaper, which contains
stories. A story is a list of pages.

A page is a background image, animation, or video, with content laid over it.
Content is a collection of information displayed as text, table, or graphics.

Storyrevealer uses Reveal.js plugins, like the Anything plugin, to display and
animate your content. (Anything plugin is so generic that you can really stick
anything in a slide' section)

Storyrevealer just started, so expect documentation, tests, and more examples in
the following weeks.

 

Pierre M. - December 2017

 

JSON Data File Format
---------------------

### Newspaper

A newspaper is made of an optional cover page and Stories.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
{
    "cover": {{page-element}},
    "stories": [ {{story-element}}+ ]
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

### Story

A story is made of an optional cover page and Pages

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
{
    "cover": {{page-element}},
    "pages": [ {{page-element}}+ ]
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

### Page

A page is made of one or more page-element.

When a page is made of more than one element (i.e. an array of page-elements),
each element in that page is considered column content.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
page = {{page-element}}  ||  [ {{page-element}}{2,} ]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
page-element: [ {{content-element}}* ]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

A page-element is an object with content-element properties.

If a page-element does not contain any property, it is a blank page.

 

### Page Content Element

A content-element is a ( content-type, content-value ) pair.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
content-element: "content-type": {{content-value}}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Content-value is a valid JSON object and its form varies depending on the
content-type.

Storyrevealer provides a set of content-type element together with their
reprensetation. (We will later allow new content types to be added dynamically.)

The content-type name can contain additional CSS class names that must be added
to its HTML parent element.

The following class names have spacial meaning:

| Class Name | Description                                                                                 |
|------------|---------------------------------------------------------------------------------------------|
| fragment   | Reveal.js Frament element                                                                   |
| html       | The provided text is HTML formatted. It will be sanitized and sent directly to the browser. |

The following class names are also provided and can be customized.

darker, darkest, lighter, lightest, left, right.

 

If a page contains more than one content element, they are displayed in
appearing order.

 

### Decoration Content

| Content Type | Value          | Note                                                                                                                  |
|--------------|----------------|-----------------------------------------------------------------------------------------------------------------------|
| background   | URL of image   | Displayed as background image                                                                                         |
| class        | CSS class name | Single class name is added to the page’s parent element. A page-element may contain more than one class content type. |

 

#### Text Content

Text content is the simplest form of content laid over the background.

The following content keywords are accepted:

| Text Content | Purpose                      | Display                              |
|--------------|------------------------------|--------------------------------------|
| title        | Main title of page           | Bold, larg text in middle of screen. |
| editor       | Display editor information   | Meant to be used on cover pages      |
| date         | Date of story                | Meant to be used on cover pages      |
| above-title  | Text displayed above a title | Displayed in small caps.             |
| under-title  | Text displayed under a title | Displayed in bolder font             |
| credits      |                              |                                      |
| copyright    |                              |                                      |
| text         | Regular text                 |                                      |

 

Story revealer provides a few themes to display those text content but you can
of course design your own theme.

#### Table

 

#### Graphs

Storyrevealer aims at, and purposely limits itself to, very simple, clear,
straightforward, bold, graphs.

Most graphs are animated but not interactive.

Please refer to [Chart.js documentation](http://www.chartjs.org) for detailed
information on chart object format.

##### Bar charts

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
[
["A","B","C"],
[1,2,3]
]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

###### Variants

-   Multiple bars per category

-   Stacked bars

##### Horizontal Bar Charts

##### Line Charts

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
[
["A", 1, 2, 3],
["B", 4, 5, 6]
]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

###### Variants

-   step charts

-   area charts

-   spline charts

##### Pie Charts

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
[
["A",25],["B",50],["C",33]
]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

###### Variants

-   donut charts

-   gauge charts

 
