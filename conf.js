// conf.js -- example amqp exchange setup 
// invoke with `node config`
// This is the thing that'll hold our inter-app amqp configs.. perhaps some monitoring code as well.
//

var argv    = require('minimist')(process.argv.slice(2)),
    util    = require('util'),
    colors  = require('colors'),
    amqp    = require('amqp');

var rabbitDev     = 'localhost',
    rabbitPro     = process.env.AMQP_SRVR,
    queue         = 'pub-exchange',
    action        = argv.act || 'setup',
    rabbitServer  = argv.p ? rabbitPro : rabbitDev,
    connection    = amqp.createConnection({ host: rabbitServer});



console.log("----------------Configuring the server--------------".green);
console.log("[server] ".green + rabbitServer.blue);
console.log("[action] ".green + action.blue);

// HEY! Prep some test objects to pass down to pipe.
var article = {};
article.doi = '10.4161/biom.22905';
article = JSON.stringify(article);

var exchanges = {};
exchanges.pub = {
  name : 'pub-exchange'
};
exchanges.apps = {
  names : ['scraper', 'search']
};

exchanges.pub.options ={
  type : 'topic',
  autoDelete : false
};
exchanges.apps.options ={
  type : 'topic',
  autoDelete : false
};

function bindAppToPush(dstName){
  var ex = exchanges.pub;
  connection.exchange(dstName, exchanges.apps.options, function(dstExchange){
    connection.exchange(ex.name, ex.options, function(pubExchange){
      dstExchange.bind(pubExchange, "#", function(){
      console.log(String(dstExchange.name + " exchange bound to " + pubExchange.name).yellow);
      createNewQueue(dstName, dstExchange);
      });
    });
  });
}
function createNewQueue(name, exchange){
  connection.queue(name, { durable: false, autoDelete: false}, function(q){
    q.bind(exchange, '#', function(){
      console.log(String(q.name + " queue bound to exchange:" + exchange.name).yellow);
    });
  });
}

function setup(){
  connection.addListener('ready', function(){
    var names = exchanges.apps.names;
    for (var i = 0 ; i < names.length ; i++) {
      bindAppToPush(names[i]);
    }
  });
}

function reset(){
  console.log("resetting".red);

}

switch (action){
  case 'reset':
    reset();
    break;
  default:
    setup();
}
