var argv        = require('minimist')(process.argv.slice(2)),
    util        = require('util'),
    colors      = require('colors'),
    rabbitDev   = 'amqp://localhost',
    rabbitPro   = process.env.AMQP_SRVR,
    testQueue   = 'messages',
    encoding    = 'utf8';

var rabbitServer = argv.p ? rabbitPro : rabbitDev;


var context = require('rabbit.js').createContext(rabbitServer);
context.on('ready', function() {
  console.log("[connecting] ".green + rabbitServer.blue);
  var  sub = context.socket('SUB');
  sub.pipe(process.stdout);
  sub.connect('messages', function() {
    // not sure if we need something here.
  });
});
