var context = require('rabbit.js').createContext('amqp://localhost');
context.on('ready', function() {
  var pub = context.socket('PUB'), sub = context.socket('SUB');
  sub.pipe(process.stdout);
  sub.connect('messages', function() {
    pub.connect('messages', function() {
      pub.write(JSON.stringify({welcome: 'rabbit.js'}), 'utf8');
    });
  });
});
