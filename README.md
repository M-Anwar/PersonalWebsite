# Metalsmith Demo 

A demonstration site created using the Node.js Metalsmith static site generator.

[Preview the built site...](https://rawgit.com/sitepoint-editors/metalsmith-demo/master/build/)

[Read the tutorial on SitePoint](http://www.sitepoint.com/create-static-site-metalsmith).

## About this code

This code builds a basic HTML-only site using [Metalsmith](http://www.metalsmith.io/), a Node.js simple, pluggable static site generator. It is a demonstration rather than build recommendations which will be different for every site. Please use any part of the code as you wish.

## Installation

Please ensure [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) are installed on your system.

Download the demonstration code and switch to directory:

```bash
git clone git@github.com:craigbuckler/metalsmith-demo.git
cd metalsmith-demo
```

Install dependencies:

```bash
npm install
```

## Build the static site

To build and launch the site using [Browsersync](https://www.browsersync.io/):

```bash
npm start
```

(Stop the server with `Ctrl+C`.)

To build the site for production and compress HTML files:

```bash
npm run production
```

The site is built in the `/build` folder.

## Further information

The [built site](https://rawgit.com/sitepoint-editors/metalsmith-demo/master/build/) provides further information about site files and settings.
