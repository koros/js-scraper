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

function getEventLinks() {
	var links = $('.event-box h3 a');
	return _.map(links, function(e){
		return e.getAttribute('href');
	});
};

casper.start('http://ihub.co.ke/events', function() {
    this.echo(this.getTitle());
});

casper.then(function() {
	links = [];
	links = links.concat(this.evaluate(getEventLinks));
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
		        return document.querySelector(".full-event-details p").outerHTML;
		    });

		    var title = this.evaluate(function() {
		        return document.querySelector(".full-event-view h1").innerHTML;
		    });

		    var organiser = this.evaluate(function() {
		        return document.querySelector(".host-organizer").textContent;
		    });

		    var date = this.evaluate(function() {
		        return document.querySelector(".attend-details").textContent;
		    });

			var hostName = this.evaluate(function() {
		        return document.querySelector(".host-name").textContent;
		    });

		    var img = this.evaluate(function() {
		        return document.querySelector('.full-event-image img').src;
		    });

		    this.echo(' >>> Title :: ' + title);
		    this.echo(' \t Text :: ' + text);
		    this.echo(' \t organiser :: ' + organiser);
		    this.echo(' \t date :: ' + date);
		    this.echo(' \t hostName :: ' + hostName);
		    this.echo(' \t image :: ' + img);

        });
	 }
});

casper.run(function() {
    this.echo( links.length + ' links found');
    this.exit(); 
});