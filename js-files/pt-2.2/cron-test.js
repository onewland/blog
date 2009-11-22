// Sample for http://oliveriskindoffunny.tumblr.com/post/247975858/implementing-a-user-friendly-cron-module-with-node-js
var cron = require('./cron'), sys = require('sys');
cron.Every('2 seconds', function() { sys.puts('Working!'); });
