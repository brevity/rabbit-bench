// work.js - sets up a sample node application and connects to a rabbitMQ queue as a worker
// invoke with `node work --queue=listening-queue`
// by default it listens on 'worker' queue.
// add the ` -p` flag to pull in an amqp server address from the AMQP_SRVR environment variable

var argv    = require('minimist')(process.argv.slice(2)),
    util    = require('util'),
    colors  = require('colors'),
    amqp    = require('amqp');

var rabbitDev     = 'localhost',
    rabbitPro     = process.env.AMQP_SRVR,
    queueName      = argv.queue || 'worker',
    rabbitServer  = argv.p ? rabbitPro : rabbitDev,
    connection    = amqp.createConnection({ host: rabbitServer});

console.log("------- Time To Start Working! --------".green);
console.log("connect to a different queue like so...".blue);
console.log("$".yellow +" node work --queue=random-queue-name".white);
console.log("connect to production amqp server like so...".blue);
console.log("$".yellow +" node work -p".white);
console.log("----------------------------------------");
console.log("    [server] ".green + rabbitServer.blue);
console.log("     [queue] ".green + queueName.blue);


function createNewQueue(name){
  connection.exchange(name, {type: 'topic', autoDelete: false}, function(ex){
    connection.queue(name, { durable: false, autoDelete: false}, function(q){
      q.bind(ex, "#");
      q.subscribe({ ack: true }, function(msg){
        console.log(msg);
        q.shift();
      });
    });
  });
}
connection.addListener('error', function (e){
  throw e;
});
connection.addListener('close', function (e){
  console.log("connection closed".red);
});
// Wait for connection to become established.
connection.addListener('ready', function () {
  createNewQueue(queueName);
});
