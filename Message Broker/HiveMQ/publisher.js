var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://broker.hivemq.com')

client.on('connect', function () {
  client.publish('myTopic', 'Hello mqtt')
  console.log('Message Sent')
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})
