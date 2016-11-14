# Javascript web scraper 
Sample web scraping project that uses phantomjs and casperjs to scrap contents of a website

# Installation instructions
- install Phantomjs - http://phantomjs.org
- install Casperjs - http://casperjs.org 
``` yaml 
  NB binary installation recommended for Windows users
```
 - execute the following commands from the project root folder
```yaml
  $ npm install
```
Thats it, for more info please feel free checkout more resources online and also refer to the official <a href="http://docs.casperjs.org/en/latest/quickstart.html"> casperjs </a> and <a href="http://phantomjs.org/quick-start.html"> phantomjs </a> websites

#Running the server and crawler service
- Start the server which provides the endpoint needed to save the scraped data:

```yaml
  $ node server.js
```

The web scraping service is scheduled with <a href='https://www.npmjs.com/package/node-cron'> node-cron</a> to run after every three minutes, The service is triggered by executing the following command:

```yaml
  $ node scraper.trigger.js 
```
 
<img src='https://github.com/koros/js-scraper/blob/master/public/images/spider_at_work1.png' ></img>
