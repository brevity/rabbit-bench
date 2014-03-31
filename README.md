# rabbit-bench

## This is just an example of one way to set up a rabbitMQ server

_There are three processes here._

__config.js__ -- which is responsible for
setting up the rabbitMQ server with appropriate topic exchanges and some initial
queues.

__work.js__ -- which shows how a worker application can subscribe to it's
default queue.

__Publisher.js__ which is a super-simple cli for storing and publishing amqp
messages.

## You might need to install some things.

- [rabbitMQ](https://www.rabbitmq.com/install-standalone-mac.html)
- [nodejs](http://nodejs.org/)

## But you will definitely need to run some commands.

__Install required node packages__

```bash
$ npm install
```

__start the config setup__

```bash
$ node config
```

__To start the test publisher__

```bash
$ node publish
```

__To play with an example worker.__

```bash
$ node work
```


__To connect to a production server.__

Open up the .env file and put in your production amqp uri, then source it.

```bash
$ source .env
```

__Set some handy shell aliases__
```bash
   alias rabbit_reset='rabbitmqctl stop_app; rabbitmqctl reset; rabbitmqctl start_app;'
   alias rabbit_stat='rabbitmqctl list_exchanges | grep -v amq | grep -v direct; rabbitmqctl list_queues'
   alias rabbit_queues='rabbitmqctl list_queues;'
   alias rabbit_exchanges='rabbitmqctl list_exchanges;'
```
