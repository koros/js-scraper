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

var eventsLinks = [];
var save_event_api_url = "http://localhost:3000/events";
var save_siteinfo_api_url = "http://localhost:3000/sitemap";
var BASE_URL = 'http://ihub.co.ke';
var EVENTS_URL = BASE_URL + '/events';

function getEventLinks() {
	var links = $('.event-box h3 a');
	return _.map(links, function(e){
		return e.getAttribute('href');
	});
};

casper.start(EVENTS_URL, function() {
    this.echo(this.getTitle());
});

casper.then(function() {
	eventsLinks = eventsLinks.concat(this.evaluate(getEventLinks));
});

// Follow all the blogs link and extract the contents for each page
casper.then(function() {
	//this.echo('-' + links.join('\n\n'));
	 for (var i = 0; i <eventsLinks.length; i++) {
	 	var url = eventsLinks[i];
	 	this.echo(url);
	 	casper.thenOpen(BASE_URL + url, function() {
	 		
            var text = this.evaluate(function() {
		        return document.querySelector(".full-event-details").innerHTML;
		    });

		    var title = this.evaluate(function() {
		        return document.querySelector(".full-event-view h1").innerHTML;
		    });

		    var organiser = this.evaluate(function() {
		        return document.querySelector(".host-organizer").textContent;
		    });

		    var date = this.evaluate(function() {
		        return document.querySelector(".attend-details div.attend-box:nth-child(1)").textContent;
		    });

		    var venue = this.evaluate(function() {
		        return document.querySelector(".attend-details div.attend-box:nth-child(2)").textContent;
		    });

		    var time = this.evaluate(function() {
		        return document.querySelector(".attend-details div.attend-box:nth-child(3)").textContent;
		    });

			var hostname = this.evaluate(function() {
		        return document.querySelector(".host-name").textContent;
		    });

		    var img = this.evaluate(function() {
		        return document.querySelector('.full-event-image img').src;
		    });

		    var currentUrl = this.getCurrentUrl();

		    this.echo('Title :: ' + title);

		    var postItem = {url:currentUrl, title:title, text:text, organiser:organiser, date:date, time:time, venue:venue, hostname:hostname, img:img};

		    if (title != null) {
		    	// this.echo('POST DATA ' + JSON.stringify(postItem));
		    
			    // Save the data by making post to the node server
			    casper.thenOpen(save_event_api_url, {
			      method: "POST",
			      data: JSON.stringify(postItem),
			      headers: {
			        "Content-Type":"application/json"
			      }
			    },function() {
			      console.log('finished');
			    });
		    }
		    
        });
	 }
});

casper.then(function() {
	var postItem = {url:EVENTS_URL, category:'events', urls:eventsLinks};
	
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
    this.echo( links.length + ' links found');
    this.exit(); 
});