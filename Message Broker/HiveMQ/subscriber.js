var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://broker.hivemq.com')

client.on('connect', function () {
  client.subscribe('myTopic', function (err) {
    if (!err) {
      console.log('Subscribed successfully')
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
})
