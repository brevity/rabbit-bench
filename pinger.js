var argv = require('minimist')(process.argv.slice(2));
var util          =require('util');
var colors = require('colors');
var rabbitServer  = 'amqp://localhost';
var testQueue     = 'messages';
var cliMessage    =  process.argv.splice(2).join(" ") || "n/a";
var encoding     = 'utf8';

var context       = require('rabbit.js').createContext(rabbitServer);


context.on('ready', function(){
  //connected to server
  console.log("context is ready");
  var pub = context.socket('PUB'), sub = context.socket('SUB');
  // socket created
  pub.connect(testQueue, function(){
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function(chunk){
      chunk = chunk.trim();
      if(chunk == 'eff this'){
        pub.close();
        process.exit();
      }
      pub.write(JSON.stringify({message: chunk}), 'utf8');
    });
  });
});


