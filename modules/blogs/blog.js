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
var eventsLinks = [];
var jobsLinks = [];

function getBlogLinks() {
	var links = $('.blog-item h3 a');
	return _.map(links, function(e){
		return e.getAttribute('href');
	});
};

function getEventLinks() {
	var links = $('.event-box h3 a');
	return _.map(links, function(e){
		return e.getAttribute('href');
	});
};

function getJobsLinks() {
	var links = $('.jobsboard-row h3 a');
	return _.map(links, function(e){
		return e.getAttribute('href');
	});
};

casper.start('http://ihub.co.ke/blogs/', function() {
    this.echo(this.getTitle());

});

casper.then(function() {
	blogLinks = blogLinks.concat(this.evaluate(getBlogLinks));
	this.echo(this.getCurrentUrl());
});

// follow all the blogs link and extract the contents for each page
casper.then(function() {
	//this.echo('-' + links.join('\n\n'));
	 for (var i = blogLinks.length - 1; i >= 0; i--) {
	 	var url = blogLinks[i];
	 	this.echo(url);
	 	casper.thenOpen('http://ihub.co.ke' + url, function() {
	 		
            var text = this.evaluate(function() {
		        return document.querySelector(".article-content p").outerHTML;
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

		    this.echo(' >>> Title :: ' + title);
		    this.echo(' \t Text :: ' + text);
		    this.echo(' \t author :: ' + author);
		    this.echo(' \t initiative :: ' + initiative);
		    this.echo(' \t image :: ' + img);

        });
	 }
});



casper.run(function() {
    this.echo( jobsLinks.length + ' links found');
    this.exit(); 
});