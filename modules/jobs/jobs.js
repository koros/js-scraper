var casper = require('casper').create({
	verbose: true,
	logLevel: 'debug',
	clientScripts: ['../../node_modules/jquery/dist/jquery.min.js', '../../node_modules/lodash/lodash.min.js'],
	pageSettings: {
		loadImages: true,
		loadPlugins: false,
		userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:49.0) Gecko/20100101 Firefox/49.0'
	}
});

var links = []; 

function getJobsLinks() {
	var links = $('.jobsboard-row h3 a');
	return _.map(links, function(e) {
		return e.getAttribute('href');
	});
};

casper.start('http://ihub.co.ke/jobs', function() {
    this.echo(this.getTitle());
});

casper.then(function() {
	links = links.concat(this.evaluate(getJobsLinks));
	this.echo(this.getCurrentUrl());
});

// follow all the blogs link and extract the contents for each page
casper.then(function() {
	//this.echo('-' + links.join('\n\n'));
	 for (var i = links.length - 1; i >= 0; i--) {
	 	var url = links[i];
	 	this.echo(url);
	 	casper.thenOpen('http://ihub.co.ke' + url, function() {
	 		
            var text = this.evaluate(function() {
		        return document.querySelector(".job-content").innerHTML;
		    });

		    var title = this.evaluate(function() {
		        return document.querySelector(".job-article-header h1").innerHTML;
		    });

		    var added = this.evaluate(function() {
		        return document.querySelector(".job-article-header li:nth-child(1)").textContent;
		    });

		    var applyBy = this.evaluate(function() {
		        return document.querySelector(".job-article-header li:nth-child(2)").textContent;
		    });

		    var category = this.evaluate(function() {
		        return document.querySelector(".job-article-header li:nth-child(4)").textContent;
		    });

		    var postedBy = this.evaluate(function() {
		        return document.querySelector(".uploader-company").textContent;
		    });

			
		    this.echo(' >>> Title :: ' + title);
		    this.echo(' \t Text :: ' + text);
		    this.echo(' \t added :: ' + added);
		    this.echo(' \t applyBy :: ' + applyBy);
		    this.echo(' \t category :: ' + category);

        });
	 }
});

casper.run(function() {
    this.echo( links.length + ' links found');
    this.exit(); 
});