---
date: 2016-12-05
title: Raytracer
description: The implementation of an advanced raytracer for CSC418/2504 (Computer Graphics). The raytracer implemented features including depth of field, soft shadows, multiple reflections etc. Winner of the Wooden Monkey Competition.
shortDescription: An implementation of an advanced raytracer
headerImage: img/projects/raytracer/dragon.jpg
isProject: true
---

This project implements a multi-featured distributed raytracer. The following document provides some basic descriptions for what was implemented. Some relevant portions of the source code are put here 

##### 1.1 NON-TRIVIAL COMPOUND SHAPES AND ARBITRARY SURFACE MESHES
More shapes were implemented in SceneObject.h/cpp, these included cylinders and cones. This was done by checking whether the ray intersected with the quadratic surface (curved face) of the object and then separately checking if it intersected with the flat circle planes that are used for caps. Meshes are implemented by checking intersections between multiple triangles. The meshes are imported from .obj files using an external library called tiny_obj_loader.

##### 1.2 GLOSSY REFLECTIONS
Glossy reflections are implemented in the shadeRay() function in the raytracer.cpp. This is accomplished by uniformly sampling from a conic whose size is proportional to the surface’s glossiness. A single ray is then sent in this random direction and its colour accumulated. With multiple samples, this method creates a glossy surface.

##### 1.3 SOFT SHADOWS WITH EXTENDED LIGHT SOURCES
Soft shadows were implemented by treating the point light source as a sphere with a radius. When checking if a position is in shadow, the light direction was randomly sampled from this sphere. Again with multiple samples, this created soft shadows with umbra and penumbra portions of the shadow. This was implemented in the computeShading() part of the rayTracer.cpp.

##### 1.4 TEXTURE MAPPING
Texture mapping is done for every compound and mesh surface, except for the cone. For compound shapes, the UV-coordinates are found by simply converting the (x, y, z) intersection point to (𝜃,𝜙,𝛾) cylindrical or spherical coordinates, then sampling from the texture accordingly. For meshes, the imported triangle vertex UV-coordinates are used and bi-linearly interpolated using the barycentric coordinates of the triangle intersection. This was done per object in sceneObject.cpp.

##### 1.5 ENVIRONMENT MAPPING
Environment mapping was implemented using a cube map surrounding our scene. We would determine whether the ray at each pixel intersected with any object in our scene and if the ray didn’t, we said it would intersect with our cube map. We first determine which face of the cube may was intersected by looking at which of the x, y, z dimensions were the largest and using this information along with the sign of the value to determine which of the six faces were intersected. Then, using the remaining 2 coordinates, we determined the corresponding UV-coordinates to find the pixel value on the specific face of the cube map. Cube maps were loaded in util.h/cpp and utilized in the shadeRay() function.

##### 1.6 ANTI-ALIASING
Anti-aliasing was done in this assignment through the use of multiple rays being shot out of every pixel (sub-pixel division) and the colour for each of the rays being averaged to get the overall value for the pixel. This is specifically done by casting multiple rays through a pixel, where the pixel was split up into multiple sections and a ray passing through the center of the section plus some random offset on the x and y directions.

##### 1.7 DEPTH OF FIELD
We implemented depth of field in our assignment by mimicking a thin lens model. The thin lens model was mimicked by casting the ray so it hits the “location” of our thin lens and then the ray is shifted along a circle so that rays from objects a certain distance away will focus onto a single pixel (in focus) and rays form objects not at this distance will land over multiple pixels (out of focus). This concept is illustrated in figure to the right, for a square pinhole.

##### 1.8 REFRACTION
We implemented refraction for transparent objects using Snell’s law. When a ray intersected with an object that we labelled as transparent, a ray would be cast through the object with an angle determined using Snell’s law of refraction along with the index of refraction of the materials. This process would occur in the shadeRay() of the ray-tracer.

##### 1.9 NORMAL MAPPING WITH TEXTURES AND PERLIN NOISE
Normal mapping was used to add complex surface level detail without increasing the required geometry. Textures with normal maps were downloaded off open source websites. For models, Blender was used to bake high resolution geometry to normal maps after UV-unwrapping the models. The generated normal maps were created in tangent space, and had to be transformed into world space. This was done by defining what is known as a TBN-matrix, and is calculated from the tangent, normal and bit-tangent of the model. This was implemented per object in sceneObject.cpp. This information was used to set the normal at every point on the intersected object. We also supported Perlin noise which generates noise through the standard algorithm provided by Ken Perlin, and the object normal is offset by this noise.
