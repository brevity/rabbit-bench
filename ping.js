var argv        = require('minimist')(process.argv.slice(2)),
    util        = require('util'),
    colors      = require('colors'),
    rabbitDev   = 'amqp://localhost',
    rabbitPro   = process.env.AMQP_SRVR,
    cliMessage  = process.argv.splice(2).join(" ") || "n/a",
    encoding    = 'utf8';

var rabbitServer = argv.p ? rabbitPro : rabbitDev;
var socketType   = argv.type || 'PUSH';
var queue      = argv.q || 'test';

// HEY! Prep some test objects to pass down to pipe.
var article = {};
article.doi = '10.4161/biom.22905';
article = JSON.stringify(article);

// Show the user a friendly suggestion.
console.log("----- Time To Start Pinging! -------".green);

//Connect to RabbitMQ server and prompt user for input
var context = require('rabbit.js').createContext(rabbitServer);

context.on('error', function(e){
  console.log("[ rabbitMQ is down :-( ]".red);
  console.log(e.grey);
});

context.on('ready', function(){
  //connect to server
  console.log("[connecting to server] ".green + rabbitServer.blue);
  var pub = context.socket(socketType);
  // socket created
  pub.setsockopt('persistent', true);
  pub.connect(queue, function(){
  console.log("[socketType] ".green + socketType.blue);
  console.log("[queue] ".green + queue.blue);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function(chunk){
      chunk = chunk.trim();
      switch (chunk) {
        case 'exit':
          pub.close();
          process.exit();
          break;
        case '':
        case 'article':
          pub.write(article, 'utf8');
          break;
        case 'hose':
          console.log("[sending 30 messages to rabbit]".yellow);
          for (var i = 0; i < 30 ; i++){
            msg = 'message number ' + (i + 1);
            pub.write(JSON.stringify({task: msg}), encoding);
          }
          break;
        default:
         pub.write(JSON.stringify({message: chunk}), 'utf8');
      }
    });
  });
});


