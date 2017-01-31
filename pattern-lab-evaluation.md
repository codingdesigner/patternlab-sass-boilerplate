# Pattern Lab

## What is Pattern Lab
- static site generator for working with nested components
- based on the “atomic web design” concept, but flexible enough that you don’t need it

## General Features
- element components can be nested in larger components, and those components into other components
- works with many template engines (mustache, twig, ???)
- components can override placeholder data with sidecar json files
- inline documentation for components (sidecar markdown files)
- responsive viewport resize (Ish)
- supports component annotations
- components show which patterns make up any given component, as well as seeing where each component is employed

## Pattern Lab Benefits
- why have I been using it
  - came for the: interface, easy component creation and nesting, styling flexibility, didn’t have to create my own ssg, easy to present to colleagues an clients
  - stayed for the: flexibility and extensibility. My last team developed a modified PL to work well with Drupal, wrote a parser to convert sass variables or comments into json files to populate templates
- what do use I it for?
- Ish (The responsive UI) is great for viewing the responsive range of the design language
- simple component inheritance / overrides

## Pattern lab Issues / Obstacles
- static site gen
    - good for hosting on apache and presenting to clients. we’d do better with live content
    - the data isn’t as flexible as I’d like, and certainly not real
- Ish gets in the way
    - it’s good for demos and spot checks. doesn’t play perfectly with browser inspectors
- made for web styling. not suited for other platforms

## Pro / Con Summary
  - what gets us closest in the short term


| Feature                                   | Pro | Con | Note                                                                |  
| :---------------------------------------- | :-: | :-: | :------------------------------------------------------------------ |  
| Component Nesting                         |  X  |     | Great for prototyping and for seeing where parent / child comp live |  
| Can show design elements and full designs |  X  |     |                                                                     |  
| Inline component docs                     |  X  |     |                                                                     | 
| Shows component source markup             |  X  |     |                                                                     |
| Data as Json                              |  X  |     | I can parse Scss and write variables as Json. Useful for theme docs |  
| Components don't *need* data              |  X  |     |                                                                     |  
| Sass, JS, and Docs live with component    |  X  |     |                                                                     |  
| Any Sass or js I want                     |  X  |     |                                                                     |  
| Multiple template engines                 |  -  |  -  | We'll just settle on one                                            |  
| Annotations                               |  -  |  -  | I've never seen a team take to this feature                         |  
| Ish                                       |  x  |  X  | Tossup, but if pushed I'd replace it with something custom          |  
| Static Site Gen                           |     |  X  | Would be better to use live data.                                   |  



## Discussion

- How hard will it be to build the best parts of Pattern Lab into Experience Platform?

Autopilot + Ann, Charl, Andrew
