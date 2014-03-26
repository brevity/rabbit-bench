var argv        = require('minimist')(process.argv.slice(2)),
    util        = require('util'),
    colors      = require('colors'),
    fs          = require('fs'),
    rabbitDev   = 'amqp://localhost',
    rabbitPro   = process.env.AMQP_SRVR,
    testQueue   = 'messages',
    encoding    = 'utf8';

var rabbitServer = argv.p ? rabbitPro : rabbitDev;
var name = argv.name || 'unnamed';
function work(msg){
    // console.log(msg.blue);
}
var context = require('rabbit.js').createContext(rabbitServer);
context.on('ready', function() {
  console.log("[connecting] ".green + rabbitServer.blue);
  var  sub = context.socket('WORKER');
  sub.connect('messages', function() {
    sub.setEncoding(encoding);
    sub.on('data', function(msg){
    setTimeout(function(){
      fs.appendFile('taskOutput.txt', name + ": " + msg+"\n", function(err){
        if(err){throw err;
        }
        console.log("[work done]".green + msg.blue);
        sub.ack();
      });
    }, 3000);
    });
    // not sure if we need something here.
  });
});
