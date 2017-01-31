---
title: Colors
---

Colors are defined in a [SCSS Map](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#maps) called `$palettes`. Each item in $palettes is a color family, with the 
default value assigned to `base`. You can add variations to that color family and name them however you like. Any named css color, hex, hsl, or rga will work. 

This helps to better organize colors in a design language.

Like so: 
 
```scss
$palettes: {
  red: (
    light: hsl(355, 100%, 87%),
    base: red,
    dark: #b80000
  )
}
```

You can name the color families anything you like, eg:

```scss
$palettes: {
  primary: (
    light: hsl(355, 100%, 87%),
    base: red,
    dark: #b80000
  )
}
```

Use colors by calling the `get-color()` function like so:

```scss
.class {
  color: get-color(blue);
  // sets the color to the 'base' value of blue. (base is assumed) 
}
.another-class {
  color: get-color(blue, light);
  // sets the color to the 'light' value of blue.
}
```

The display of the color palette on this page is automatically pulled from `_color-vars.scss`. On a new line below each 
color add a comment at shown below. Transparent colors are shown in front of a grayscale image to show their alpha value. 

```scss
$palettes: (
  blue: (
    base: blue,
    //get-color(blue): blue;
    light: lightblue,
    //get-color(blue, light): lightblue;
    faded: #8093AB
    //get-color(blue, faded): #8093AB;
  ),
  white: (
    base: white,
    //get-color(white): white;
    warm: hsl(48, 20%, 95%),
    //get-color(white, warm): hsl(48, 20%, 95%);
    transparent: hsla(0, 0%, 100%, 0),
    //get-color(white, transparent): hsla(0, 0%, 100%, 0);
    halftrans: hsla(0, 0%, 100%, 0.5),
    //get-color(white, halftrans): hsla(0, 0%, 100%, 0.5);
    semitrans: hsla(0, 0%, 100%, 0.15)
    //get-color(white, semitrans): hsla(0, 0%, 100%, 0.15);
  )
);
```
@todo document try() mixins for colors
