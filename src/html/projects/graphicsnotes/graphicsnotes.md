---
date: 2017-01-14
publish: draft
title: Computer Graphics Introductory Notes
description: Introductory course notes for CSC418, covering some tutorial topics including basic linear algebra, curve parametrization, OpenGL, lighting and basic ray tracing, among others.  
shortDescription: A few introductory notes on computer graphics for the course CSC418
headerImage: img/projects/graphicsnotes/titleimage.jpg
isProject: true
---

<script type="text/x-mathjax-config">
  MathJax.Hub.Config({
    tex2jax: {
      inlineMath: [ ['$','$'], ["\\(","\\)"] ],
      processEscapes: true
    }
  });
</script>

<script type="text/javascript" async
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_CHTML">
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/styles/atom-one-dark.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>

<script src="{{ root }}js/processing.min.js"></script>

The following are a few tutorial notes for computer graphics, covering some of the basics taught in an introductory graphics course. We begin with a quick review of linear algebra which is fundamental to the clear understanding of future material.

#### Linear Algebra Review

##### Points and Vectors
Both points and vectors are specified as a tuple of numbers with respect to some basis. We can express them as:
$$ P = \left[\begin{array}{c}
    x \\\
    y \\\
    z
  \end{array}\right], \quad
  \vec{v} = \left[\begin{array}{c}
    x \\\
    y \\\
    z
  \end{array}\right]
$$

A visual representation :

<figure>
  <img  height="300" width="330" src="{{root}}img/projects/graphicsnotes/pointFig.jpg">
  <img  height="300" width="330" src="{{root}}img/projects/graphicsnotes/vectorFig.jpg">  
  <figcaption> Figures showing the visual representation of a point and vector respectively </figcaption>
</figure>

Both points and vectors are represented mathematically in the same form but conceptually
 - **points** represent positions 
 - **vectors** respresent a direction and length
 
When  $ a \ne 0$ , there are two solutions to \\(ax^2 + bx + c = 0 \\)  and they are
$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$

Furthermore a matrix is in $\mathbb{R}^{n\times n}$
$$
(A|B)=
  \left[\begin{array}{ccc|c}
    1 & 3 & 2 & 4 \\\
    2 & 0 & 1 & 3 \\\
    5 & 2 & 2 & 1
  \end{array}\right].
$$



###### CODE

<div class="row">
<figure class="col" style="float:right;"> 
<canvas data-processing-sources="{{root}}img/projects/graphicsnotes/anything.pde"></canvas>
<figcaption>Determinant Visualization</figcaption>
</figure>

<pre class="col"><code class="cpp">
#include < iostream >

int main(int argc, char *argv[]) {

  /* An annoying "Hello World" example */
  for (auto i = 0; i < 0xFFFF; i++)
    cout << "Hello, World!" << endl;

  char c = '\n';
  unordered_map < string, vector< string > > m;
  m["key"] = "\\\\"; // this is an error

  return -2e3 + 12l;
}
</code></pre>
</div>



This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.This is a different model.



