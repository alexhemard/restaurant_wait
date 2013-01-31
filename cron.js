var CronJob = require('cron').CronJob
  , mysqlImport = require('./config/import/mysql')
;

//set up cron job for MySQL import every day at 3am CST (9am GMT/UTC)
new CronJob('00 00 * * * *', function() {
  try { mysqlImport(); }
  catch(e) { console.log(e); }
}, null, true, 'UTC');

