# Muhammed Anwar Personal Website

The website is hosted on http://www.cs.toronto.edu/~manwar

>Disclaimer
This publication material is presented to ensure timely dissemination of scholarly and technical work. Copyright and all rights therein are retained by authors or by other copyright holders. All persons copying this information are expected to adhere to the terms and constraints invoked by each author's copyright. In most cases, these works may not be reposted without the explicit permission of the copyright holder.

## About this code

This code builds a basic HTML-only site using [Metalsmith](http://www.metalsmith.io/), a Node.js simple, pluggable static site generator. 

If you wish to run any of the demos present on the website on your own, you can refer to the specific source, or you can download and compile the entire website following the instructions below.

## Installation

Please ensure [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) are installed on your system.

Download the code and switch to directory:

```bash
git clone https://github.com/M-Anwar/PersonalWebsite.git
cd PersonalWebsite
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

To build the site for production

```bash
npm run production
```

The site is built in the `/build` folder.

Everything should be working now

