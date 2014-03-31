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
```bash
   alias it_rabbit_reset='rabbitmqctl stop_app; rabbitmqctl reset; rabbitmqctl start_app;'
   alias it_rabbit_queues='rabbitmqctl list_queues;'
   alias it_rabbit_exchanges='rabbitmqctl list_exchanges;'
   alias it_rabbit_stat='rabbitmqctl list_exchanges | grep -v amq | grep -v direct; rabbitmqctl list_queues
```
