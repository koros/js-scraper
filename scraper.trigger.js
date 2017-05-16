
var sys = require('sys')

var exec = require('child_process').exec;

function puts(error, stdout, stderr) { sys.puts(stdout) }

var cron = require('node-cron');
 
cron.schedule('*/3 * * * *', function(){
  console.log('===========================================================================');
  console.log('Stating crawler task at :: ' + new Date());
  console.log('===========================================================================');
  exec("casperjs modules/blogs/blogs.crawler.js", puts);
  //exec("casperjs modules/events/events.crawler.js", puts);
  exec("casperjs modules/jobs/jobs.crawler.js", puts);
});

