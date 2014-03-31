// conf.js -- example amqp exchange setup 
// invoke with `node config`
// This is the thing that'll hold our inter-app amqp configs.. perhaps some monitoring code as well.
//

var argv    = require('minimist')(process.argv.slice(2)),
    util    = require('util'),
    colors  = require('colors'),
    amqp    = require('amqp');

var queue         = 'pub-exchange',
    action        = argv.act || 'setup',
    env           = process.env,
    cloudAMQP     = {
                      host     : env.AMQP_SRVR,
                      vhost    : env.AMQP_VHOST,
                      login    : env.AMQP_LOGIN,
                      password : env.AMQP_PSWD,
                      noDelay  : true,
                      ssl      : { enabled : false },
                      connectionTimeout: 0
                    },
    rabbitCreds   = argv.p ? cloudAMQP : {host : 'localhost'},
    connection    = amqp.createConnection(rabbitCreds);



console.log("----------------Configuring the amqp server--------------".green);
console.log("---------------------------------------------------------");
console.log("[server] ".green + rabbitCreds.host.blue);
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

exchanges.options ={
  type       : 'topic',
  durable    : true,
  autoDelete : false
};

function bindAppToPush(dstName){
  var ex = exchanges.pub;
  connection.exchange(dstName, exchanges.options, function(dstExchange){
    connection.exchange(ex.name, exchanges.options, function(pubExchange){
      dstExchange.bind(pubExchange, "#", function(){
      console.log(String(dstExchange.name + " exchange bound to " + pubExchange.name).yellow);
      createNewQueue(dstName, dstExchange);
      });
    });
  });
}
function createNewQueue(name, exchange){
  connection.queue(name, { durable: true, autoDelete: false}, function(q){
    q.bind(exchange, '#', function(){
      console.log(String(q.name + " queue bound to exchange:" + exchange.name).yellow);
    });
  });
}

function setup(){
    var names = exchanges.apps.names;
    for (var i = 0 ; i < names.length ; i++) {
      bindAppToPush(names[i]);
    }
}

function destroyQueue(name){
  console.log("Destroying queue ----> " + name.blue);
  connection.queue(name,  { durable: true, autoDelete: false}, function(q){
      q.destroy();
  });
}

function destroyExchange(name){
  console.log("Destroying exchange--> " + name.blue);
  connection.exchange(name,  exchanges.options, function(x){
      x.destroy();
  });
}

function reset(){
    var names = exchanges.apps.names;
    for (var i = 0; i < names.length; i++){
      //destroyExchange(names[i]);
      console.log("resetting".red);
      destroyQueue(names[i]);
      destroyExchange(names[i]);
    }
    destroyExchange('pub-exchange');
}

connection.addListener('error', function (e){
  throw e;
});
connection.addListener('close', function (e){
  console.log("connection closed".red);
});
connection.once('ready', function(){
  switch (action){
    case 'reset':
      reset();
      break;
    default:
      setup();
  }
});
