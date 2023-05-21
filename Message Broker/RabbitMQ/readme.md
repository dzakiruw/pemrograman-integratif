### Install AMQP
```sh
npm install amqplib
```

### Run Docker
```sh
docker run -d --hostname my-rabbit --name some-rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

### Run Server
##### Producer
```sh
node producer.js
```

##### Consumer
```sh
node producer.js
```