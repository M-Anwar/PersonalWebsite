#!/usr/bin/env node

/*
Metalsmith build file
Build site with `node ./build.js` or `npm start`
Build production site with `npm run production`
*/

'use strict';


var args = require('minimist')(process.argv.slice(2));
var onserver = false;
if (args['v']){
    console.log("Building on Server");
    onserver = true;
}

var
// defaults
  consoleLog = false, // set true for metalsmith file and meta content logging
  devBuild = ((process.env.NODE_ENV || '').trim().toLowerCase() !== 'production'), 
  pkg = require('./package.json'),

  // main directories
  dir = {
    base: __dirname + '/',
    lib: __dirname + '/lib/',
    source: './src/',
    dest: './build/'
  },

  // modules
  metalsmith = require('metalsmith'),
  markdown = require('metalsmith-markdown'),
  publish = require('metalsmith-publish'),
  wordcount = require("metalsmith-word-count"),
  collections = require('metalsmith-collections'),
  permalinks = require('metalsmith-permalinks'),
  inplace = require('metalsmith-in-place'),
  layouts = require('metalsmith-layouts'),
  sitemap = require('metalsmith-mapsite'),
  rssfeed = require('metalsmith-feed'),
  assets = require('metalsmith-assets'), 
  htmlmin = null,//devBuild ? null : require('metalsmith-html-minifier'),
  browsersync = devBuild ? require('metalsmith-browser-sync') : null,
  fs = require('fs-extra'),

  // custom plugins
  setdate = require(dir.lib + 'metalsmith-setdate'),
  moremeta = require(dir.lib + 'metalsmith-moremeta'),
  ftpupload = require(dir.lib + 'metalsmith-ftpupload'),
  debug = consoleLog ? require(dir.lib + 'metalsmith-debug') : null,

  siteMeta = {
    devBuild: devBuild,
    version: pkg.version,
    name: 'Muhammed Anwar',
    desc: 'Personal page and portfolio',
    author: 'Muhammed Anwar',
    contact: 'https://www.cs.toronto.edu/~manwar',
    domain: devBuild ? 'http://127.0.0.1' : 'http://www.cs.toronto.edu/~manwar', // set domain
    rootpath: devBuild ? '/' : '/~manwar/' //'/craigbuckler/metalsmith-demo/master/build/' // set absolute path (null for relative)
  },

  templateConfig = {
    engine: 'handlebars',
    directory: dir.source + 'template/',
    partials: dir.source + 'partials/',
    default: 'page.html'
  };

console.log((devBuild ? 'Development' : 'Production'), 'build, version', pkg.version);



var ms = metalsmith(dir.base)
  .clean(true) // clean folder before a production build
  .source(dir.source + 'html/') // source folder (src/html/)
  .destination(dir.dest) // build folder (build/)  
  .metadata(siteMeta) // add meta data to every page  
  .use(publish()) // draft, private, future-dated
  .use(setdate()) // set date on every page if not set in front-matter
  .use((files, metalsmith, done) => { //Dirty workaround for metalsmith/browser-sync bug   
    var metadata = metalsmith.metadata(); 
     if (metadata.collections){
       Object.keys(metadata.collections).forEach(function(collection){
         delete metadata[collection];
       });
       delete metadata.collections;
     }
    done();
  })
  .use(collections({ // determine page collection/taxonomy
    page: {
      pattern: '**/index.*',
      sortBy: 'priority',
      reverse: true,
      refer: false
    }
    ,
    project: {
      pattern: 'projects/**/*.md',
      sortBy: 'date',
      reverse: true,
      refer: true,
      metadata: {
        layout: 'project_entry.html'
      }
    }
    ,
    blog: {
      pattern: 'blog/**/*',
      sortBy: 'date',
      reverse: true,
      refer: true,
      limit: 50,
      metadata: {
        layout: 'blog_entry.html', 

      }
    }
  }))
  .use(markdown()) // convert markdown
  .use(permalinks({ // generate permalinks
    pattern: ':mainCollection/:title'
  }))
  .use(wordcount({
    raw: true
  })) // word count
  .use(moremeta()) // determine root paths and navigation
  .use(inplace(templateConfig)) // in-page templating
  .use(layouts(templateConfig)); // layout templating

if (htmlmin) ms.use(htmlmin()); // minify production HTML

if (debug) ms.use(debug()); // output page debugging information

if (browsersync) ms.use(browsersync({ // start test server
  server: dir.dest,
  files: [dir.source + '**/*']
}));

ms
  .use(sitemap({ // generate sitemap.xml
    hostname: siteMeta.domain + (siteMeta.rootpath || ''),
    omitIndex: true
  }))
  .use(rssfeed({ // generate RSS feed for articles
    collection: 'blog',
    site_url: siteMeta.domain + (siteMeta.rootpath || ''),
    title: siteMeta.name,
    description: siteMeta.desc
  }))
  .use(assets({ // copy assets: CSS, images etc.
    source: dir.source + 'assets/',
    destination: './'
  }))
  .build(function(err) { // build
    if (err) throw err; 

    //Upload to Server via FTP on production build
    if(!devBuild && !onserver){
      ftpupload({
        buildPath: dir.dest,
        host: "cs.toronto.edu",
        remoteDir: '/public_html'
      });
    }  
    if(onserver){
      var remoteDir = '../tempDir'

      //Clear the folder of items
      fs.readdir(remoteDir, function(err, files){
        if(err){console.log(err); return;};

        for(var i =0; i < files.length; i++){
          console.log('removing: ' + files[i]);
          try {
            fs.removeSync(remoteDir +'/' + files[i]);
          } catch (error) {
            console.log(error);
          }
          
        }

        console.log("\nCopying Files");
        fs.copy('build', remoteDir, function(err){
          if(err) console.log(err);
        });        
      });

      
      

    }
  });


