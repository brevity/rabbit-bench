You might need to install some Stuff.

- install [rabbitMQ] (https://www.rabbitmq.com/install-standalone-mac.html)
- [nodejs](http://nodejs.org/)

And you will definitely need to do some stuff
- install node requirements
```bash
$ npm install
```

- open up the .env file and put in your production amqp uri

_source that_

```bash
$ source .env
```

_start the worker_
```bash
$ node work
```

_start the pinger_
```bash
$ node ping
```
