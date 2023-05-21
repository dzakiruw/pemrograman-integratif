// subscriber.js
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost:1883')

client.on('connect', function () {
  client.subscribe('myTopic', function (err) {
    if (err) {
      console.log('Error subscribing to topic:', err);
      client.end();
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log('Received message on', topic, ':', message.toString())
})

client.on('error', function(err) {
  console.log('Connection error:', err);
  client.end();
})

client.on('close', function() {
  console.log('Connection closed.');
});
