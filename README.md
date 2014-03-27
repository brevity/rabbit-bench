## You might need to install some things.

- [rabbitMQ](https://www.rabbitmq.com/install-standalone-mac.html)
- [nodejs](http://nodejs.org/)

## But you will definitely need to run some commands.

__Install required node packages__

```bash
$ npm install
```

__To start the pinger__

```bash
$ node ping
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
