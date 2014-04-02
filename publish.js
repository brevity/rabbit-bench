// publish.js -- example amqp exchange setup which also provides a way to publish test json to an amqp server.
// invoke with `node publish --queue='queue-to-publish-to'`
//
// by default it publishes on 'pub-exchange' exchange.

var argv    = require('minimist')(process.argv.slice(2)),
    util  = require('util'),
    colors  = require('colors'),
    amqp    = require('amqp');

var queue         = argv.queue || 'admin',
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

console.log("------- Time To Start publishing! --------".green);
console.log("connect to a different queue like so...".blue);
console.log("$".yellow +" node publish --queue=random-queue-name".white);
console.log("connect to production amqp server like so...".blue);
console.log("$".yellow +" node publish -p".white);
console.log("----------------------------------------");
console.log("[server] ".green + rabbitCreds.host.blue);
console.log("[ queue] ".green + queue.blue);

var exchanges = {};
exchanges.admin = {
  name : 'admin'
};
exchanges.admin.options ={
  durable : true,
  type : 'topic',
  autoDelete : false
};
// HEY! Prep some test objects to pass down to pipe.
var article = {};
article.doi = '10.4161/biom.22905';
article = JSON.stringify(article);

connection.addListener('ready', function(){

  // Wait for connection to become established.
    var admin = exchanges.admin;
    connection.exchange(admin.name, admin.options, function(ex){
      var opts = {contentType: 'application/json', contentEncoding: 'utf8', deliveryMode:2};
      var route = '';

      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', function(chunk){
      route = String(argv.route) || 'broadcast.article.create';
        chunk = chunk.trim();
        switch (chunk) {
          case 'exit':
            ex.close();
            process.exit();
            break;
          case '':
          case 'article.create':
            route = 'broadcast.article.create';
            console.log("[sending article creation message]".yellow);
            ex.publish(route, article, opts );
            break;
          case 'article.update':
            route = 'broadcast.article.update';
            ex.publish(route, article, opts );
            break;
          case 'hose':
            console.log("[sending 30 messages to rabbit]".yellow);
            for (var i = 0; i < 30 ; i++){
              msg = 'message number ' + (i + 1);
              ex.publish(route, JSON.stringify({task: msg}), opts);
            }
            break;
          default:
            ex.publish(route, JSON.stringify({message: chunk}), opts);
        }
      });
    });

});
