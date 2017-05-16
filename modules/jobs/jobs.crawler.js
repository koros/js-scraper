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
var save_job_api_url = "http://localhost:3000/jobs";
var save_siteinfo_api_url = "http://localhost:3000/sitemap";
var BASE_URL = 'http://ihub.co.ke';
var JOBS_URL = BASE_URL + '/jobs';

function getLinks() {
    var links = document.querySelectorAll('h3 a');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');
    });
}

casper.start(JOBS_URL, function() {
    this.echo(this.getTitle());
});

casper.then(function() {
	links = links.concat(this.evaluate(getLinks));
});

casper.then(function() {
	this.echo(' - ' + links.join('\n - '));
});

// Follow all links and extract the contents for each page
casper.then(function() {
	//this.echo('-' + links.join('\n\n'));
	 for (var i = 0; i < links.length; i++) {
	 	var url = links[i];
	 	this.echo(url);
	 	casper.thenOpen(BASE_URL + url, function() {
	 		
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

		    var location = this.evaluate(function() {
		        return document.querySelector(".city-location").textContent;
		    });

		    var companyWebsite = this.evaluate(function() {
		        return document.querySelector(".uploader-info a").href;
		    });

		    var currentUrl = this.getCurrentUrl();

		    this.echo(' >>> Title :: ' + title);

		    var postItem = {url:currentUrl, title:title, text:text, added:added, applyBy:applyBy, category:category, postedBy:postedBy, location:location, companyWebsite:companyWebsite};

		    this.echo('POST DATA ' + JSON.stringify(postItem));
		    
		    // Save the data by making post to the node server
		    casper.thenOpen(save_job_api_url, {
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
	var postItem = {url:JOBS_URL, category:'jobs', urls:links};
	
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
    this.echo(links.length + ' links found');
    this.exit(); 
});