/*
metalsmith-meta
adds further meta information to metalsmith files:
	root						- the absolute or relative website root folder
	layout					- sets from default from collection
	isPage					- is an index page
	mainCollection	- the primary collection name
	navmain					- array of main navigation pages
	navsub					- array of secondary navigation pages
*/
module.exports = function() {

	'use strict';

	return function(files, metalsmith, done) {

		var
			meta = metalsmith.metadata(),
			file, f, page, p, c, thisCol, layout, blogCol, navSubCount=0;

		var featureLength = 4;

		for (f in files) {

			file = files[f];

			// calculate root

			file.root = file.root || meta.rootpath || (file.path ? '../'.repeat(file.path.split('/').length) : '');			

			// get first non-page collection
			file.mainCollection = null;
			file.isPage = false;
			c = 0;
			while (c < file.collection.length) {
				if (file.collection[c] == 'page') {
					file.isPage = true;
				}
				else {
					file.mainCollection = file.mainCollection || file.collection[c];
				}
				c++;
			}

			// main navigation
			file.navmain = [];			
			for (p = 0; p < meta.collections.page.length; p++) {
				page = meta.collections.page[p];				
				
				if (!p || page.path != meta.collections.page[p-1].path) {
					file.navmain.push({
						title:			page.title || 'Home',
						author: 		page.author || 'Muhammed Anwar',
						description:	page.description || '',
						path:			file.root + page.path + (page.path ? '/' : ''),
						dateFormat:		page.dateFormat,
						active:			page.path == file.path || page.collection.indexOf(file.mainCollection) >= 0
					});
				}
			}						

			//Secondary Blog Navigation
			if (file.mainCollection) {

				// get collection metadata
				thisCol = meta.collections[file.mainCollection];

				// layout from page, collection, default
				layout = file.layout || (thisCol.metadata && thisCol.metadata.layout) || null;
				if (layout) file.layout = layout;

				// secondary navigation
				file.navsub = [];
				navSubCount=0;
				for (p = 0; p < thisCol.length; p++) {
					
					page = thisCol[p];
					if (page.collection.indexOf('page') < 0 && (!p || page.path != thisCol[p-1].path)) {
						file.navsub.push({
							title:			page.title || 'Home',
							author: 		page.author || 'Muhammed Anwar',
							description:	page.description || '',
							shortDescription: page.shortDescription || '',
							headerImage:    page.headerImage || '', 
							isProject: 		page.isProject || '',
							path:			file.root + page.path + (page.path ? '/' : ''),
							root: 			file.root,
							dateFormat:		page.dateFormat,
							active:			page.path == file.path,
							featured: 		(navSubCount < featureLength ? true : false) && page.isProject,
							clearFix: 		navSubCount%3==0 ? true : false  //Clearfix the grid every 3 for the layout of the webpage
						});
						navSubCount++;
					}

				}
			
			}

			//Have the homepage display the latest blog posts
			if(file.homepage && file.homepage == 'home'){
				blogCol = meta.collections.blog;
				thisCol = 'page.html';

				layout = file.layout || (thisCol.metadata && thisCol.metadata.layout) || null;
				if (layout) file.layout = layout;

				file.navsub = [];
				navSubCount =0;
				for (p = 0; p < blogCol.length; p++) {
					

					page = blogCol[p];
					if (page.collection.indexOf('page') < 0 && (!p || page.path != blogCol[p-1].path)) {
						
						file.navsub.push({
							title:			page.title || 'Home',
							author: 		page.author || 'Muhammed Anwar',
							description:	page.description || '',
							shortDescription: page.shortDescription || '',
							headerImage:    page.headerImage || '', 
							isProject: 		page.isProject || '',
							path:			file.root + page.path + (page.path ? '/' : ''),
							root: 			file.root,
							dateFormat:		page.dateFormat,
							active:			page.path == file.path,
							featured: 		navSubCount < featureLength ? true : false,
							clearFix: 		navSubCount%3==0 ? true : false  //Clearfix the grid every 3 for the layout of the webpage
						});
						navSubCount++;
					}
				}	
			}			
			
		}

		

		done();

	};

};
