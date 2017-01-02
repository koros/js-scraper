var casper = require('casper').create({
	verbose: true,
	logLevel: 'info',
	clientScripts: ['../../node_modules/jquery/dist/jquery.min.js', '../../node_modules/lodash/lodash.min.js'],
	pageSettings: {
		loadImages: true,
		loadPlugins: false,
		userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:49.0) Gecko/20100101 Firefox/49.0'
	}
});

var blogLinks = []; 
var save_blog_api_url = "http://localhost:3000/blogs";
var save_siteinfo_api_url = "http://localhost:3000/sitemap";
var BASE_URL = 'http://ihub.co.ke';
var BLOGS_URL = BASE_URL + '/blogs';

function getBlogLinks() {
	var links = $('.blog-item h3 a');
	return _.map(links, function(e){
		return e.getAttribute('href');
	});
};

casper.start(BLOGS_URL, function() {
    this.echo(this.getTitle());
});

casper.then(function() {
	blogLinks = blogLinks.concat(this.evaluate(getBlogLinks));
});

// follow all the blogs link and extract the contents for each page
casper.then(function() {
	//this.echo('-' + links.join('\n\n'));
	 for (var i = 0; i < blogLinks.length; i++) {
	 	var url = BASE_URL + blogLinks[i];
	 	casper.thenOpen(url, function() {
	 		
            var text = this.evaluate(function() {
		        return document.querySelector(".article-content-desc").innerHTML;
		    });

		    var title = this.evaluate(function() {
		        return document.querySelector(".blog-head-box h1").outerHTML;
		    });

		    var author = this.evaluate(function() {
		        return document.querySelector(".item-author").textContent;
		    });

		    var initiative = this.evaluate(function() {
		        return document.querySelector(".initiative").textContent;
		    });

		    var img = this.evaluate(function() {
		        return document.querySelector('.blog-main-pic img').src;
		    });

		    var currentUrl = this.getCurrentUrl();

		    this.echo('\n >>> Title :: ' + title + '\n');

		    var postItem = {url:currentUrl, title:title, text:text, author:author, initiative:initiative, img:img};

		    // this.echo('POST DATA ' + JSON.stringify(postItem));
		    
		    // Save the data by making post to the node server
		    casper.thenOpen(save_blog_api_url, {
		      method: "POST",
		      data: JSON.stringify(postItem),
		      headers: {
		        "Content-Type":"application/json"
		      }
		    },function() {
		      console.log('finished');
		    });

        });
	 }
});

casper.then(function() {
	var postItem = {url:BLOGS_URL, category:'blogs', urls:blogLinks};

    this.echo('POST DATA ' + JSON.stringify(postItem));
    
    // Save the data by making post to the node server
    casper.thenOpen(save_siteinfo_api_url, {
      method: "POST",
      data: JSON.stringify(postItem),
      headers: {
        "Content-Type":"application/json"
      }
    },function() {
      console.log('finished');
    });
});

casper.run(function() {
    this.echo(jobsLinks.length + ' links found');
    this.exit(); 
});